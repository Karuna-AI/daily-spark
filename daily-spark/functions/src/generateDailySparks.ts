import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import OpenAI from 'openai';
import { ALL_SUBTOPICS, getSubtopicById } from './topics';

const SPARKS_PER_TOPIC = parseInt(process.env.SPARKS_PER_TOPIC_PER_DAY ?? '10', 10);
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

interface GeneratedSpark {
  text: string;
  emoji: string;
  wow_factor: number;
}

function buildPrompt(topicId: string, topicLabel: string, parentLabel: string, count: number): string {
  return `You are an expert curator of delightful, uplifting knowledge for the app "Daily Spark".

Generate ${count} short, genuinely surprising, positive "sparks" about "${topicLabel}" (category: ${parentLabel}).

STRICT RULES:
- Each spark must be 1-2 sentences maximum (under 250 characters total)
- Must be GENUINELY surprising and wow-worthy — not generic or obvious
- Must be factual and verifiable
- ZERO negativity, tragedies, deaths, injuries, or bad news
- Vary style: mix "fun facts", "did you know", "amazing discoveries", "record-breaking moments"
- Use active, energetic language
- NO clichés or boring stats

Return ONLY valid JSON with no extra text:
{
  "sparks": [
    { "text": "Full spark text here.", "emoji": "🚀", "wow_factor": 9 }
  ]
}

wow_factor is 1-10 (10 = most mind-blowing). Only include sparks with wow_factor >= 7.`;
}

export const generateDailySparks = onSchedule(
  {
    schedule: '0 2 * * *',  // Every day at 2 AM UTC
    timeZone: 'UTC',
    timeoutSeconds: 540,    // 9 minutes (OpenAI calls can be slow)
    memory: '512MiB',
  },
  async () => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const db = admin.firestore();
    const today = new Date().toISOString().split('T')[0];

    console.log(`[generateDailySparks] Starting for ${today}, ${ALL_SUBTOPICS.length} topics`);

    let totalWritten = 0;

    for (const subtopic of ALL_SUBTOPICS) {
      const meta = getSubtopicById(subtopic.id);
      if (!meta) continue;

      try {
        const prompt = buildPrompt(subtopic.id, subtopic.label, meta.parentLabel, SPARKS_PER_TOPIC);

        const response = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.85,
          max_tokens: 1200,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) continue;

        const parsed = JSON.parse(content) as { sparks: GeneratedSpark[] };
        const sparks = parsed.sparks.filter((s) => s.wow_factor >= 7);

        if (sparks.length === 0) {
          console.warn(`[generateDailySparks] No qualifying sparks for ${subtopic.id}`);
          continue;
        }

        // Batch write to Firestore
        const batch = db.batch();
        for (const spark of sparks) {
          const ref = db.collection('sparks').doc();
          batch.set(ref, {
            text: spark.text,
            emoji: spark.emoji,
            topic: subtopic.id,
            topicLabel: subtopic.label,
            parentTopic: meta.parentLabel,
            topicColor: '#1A237E',     // Stored for display; client uses constants
            topicColorEnd: '#283593',
            wowFactor: spark.wow_factor,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            generatedDate: today,
            totalSeen: 0,
            totalLikes: 0,
            totalDislikes: 0,
          });
        }
        await batch.commit();

        totalWritten += sparks.length;
        console.log(`[generateDailySparks] ${subtopic.id}: wrote ${sparks.length} sparks`);

        // Small delay to avoid OpenAI rate limits
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`[generateDailySparks] Error for ${subtopic.id}:`, err);
      }
    }

    console.log(`[generateDailySparks] Done. Total sparks written: ${totalWritten}`);
  }
);
