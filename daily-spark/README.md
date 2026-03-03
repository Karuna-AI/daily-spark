# ⚡ Daily Spark

> **3 amazing, positive sparks. Every day. Personalized to you.**

Daily Spark is a React Native + Expo mobile app for iOS & Android that delivers 3 AI-generated, genuinely surprising, positive facts or news stories per day — tailored to topics you love.

---

## Features

- **Swipe cards** — Tinder-like card deck with spring animations and haptic feedback
- **AI-powered content** — GPT-4o-mini generates fresh, positive sparks daily per topic
- **9 topic categories** — Sports, Science, Tech, Health, History, Finance, Entertainment, Fun, News
- **3 push notifications/day** — Personalized to your schedule
- **Social sharing** — Share to WhatsApp, iMessage, Instagram via native share sheet
- **Google + Apple sign-in** — Firebase Auth
- **Location customization** — City-level for local sports & news
- **90-day deduplication** — Never see the same spark twice within 90 days

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo SDK 51 |
| Routing | Expo Router (file-based) |
| Auth | Firebase Auth (Google, Apple) |
| Database | Cloud Firestore |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Cloud Functions | Firebase Functions v2 |
| AI Content | OpenAI GPT-4o-mini |
| State | Zustand + AsyncStorage |
| Animations | React Native Reanimated 3 + Lottie |
| Gestures | React Native Gesture Handler |

---

## Project Structure

```
daily-spark/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (auth gate, notifications)
│   ├── (auth)/             # Login + onboarding
│   └── (app)/              # Main tabs (Home, Explore, Settings)
├── src/
│   ├── components/         # SparkCard, SwipeDeck, TopicSelector, etc.
│   ├── hooks/              # useAuth, useSparks, useSound, useHaptics
│   ├── stores/             # Zustand stores
│   ├── services/firebase/  # Firebase config, auth, sparks, user
│   ├── constants/          # Topics, colors, config
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Share, location, date helpers
├── functions/              # Firebase Cloud Functions
│   └── src/
│       ├── generateDailySparks.ts  # OpenAI → Firestore (daily cron)
│       ├── getUserSparks.ts        # HTTPS callable
│       ├── sendSparkNotification.ts # FCM push (hourly cron)
│       └── recordFeedback.ts       # Like/dislike tracking
├── assets/
│   ├── animations/         # Lottie JSON files
│   └── sounds/             # spark.mp3
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

---

## Quick Start

### Prerequisites

- **Node.js** v20+ and **npm** v10+
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Firebase CLI**: `npm install -g firebase-tools`
- **Xcode** (for iOS) / **Android Studio** (for Android)

### 1. Install dependencies

```bash
cd daily-spark
npm install
cd functions && npm install && cd ..
```

### 2. Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project called `daily-spark`
3. Enable these services:
   - **Authentication** → Sign-in methods: Google, Apple
   - **Firestore Database** → Start in production mode
   - **Cloud Functions**
   - **Cloud Messaging**
4. Download `google-services.json` (Android) → place in project root
5. Download `GoogleService-Info.plist` (iOS) → place in project root

### 3. Configure environment variables

```bash
# Client env
cp .env.example .env
# Fill in all EXPO_PUBLIC_* values from Firebase Console > Project Settings > Your apps

# Functions env
cp functions/.env.example functions/.env
# Fill in OPENAI_API_KEY from platform.openai.com
```

### 4. Deploy Firestore rules and indexes

```bash
firebase login
firebase use --add   # Select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Deploy Cloud Functions

```bash
# Set OpenAI secret
firebase functions:secrets:set OPENAI_API_KEY

cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 6. Run the app

```bash
# Start Expo dev server
npm run start:tunnel

# Scan QR code with Expo Go (limited — no push notifications)
# OR build a development client:
eas build --profile development --platform ios
```

---

## Running Cloud Functions Locally

```bash
# Start Firebase emulators
firebase emulators:start --only auth,firestore,functions

# Open emulator UI at http://localhost:4000

# Trigger daily spark generation manually
firebase functions:shell
> generateDailySparks()
```

---

## Building for Production

```bash
# Configure EAS project
eas build:configure

# Build for both platforms
eas build --profile production --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

---

## Adding Lottie Animations

Download free Lottie JSON files from [lottiefiles.com](https://lottiefiles.com) and place them in `assets/animations/`:

- `spark-burst.json` — Onboarding intro animation (lightning bolt burst)
- `thumbs-up.json` — Plays on like action
- `confetti.json` — Plays when all 3 sparks are completed

The `BrandAnimation` component uses `lottie-react-native` to render these.

---

## Content Strategy (The Moat)

Daily Spark's differentiation is **strictly positive, genuinely surprising content**. The OpenAI prompt enforces:

- Maximum 2 sentences per spark
- `wow_factor >= 7` out of 10 (lower quality filtered out)
- Zero negativity rule — no tragedies, deaths, failures
- Varied styles — fun facts, did-you-know, record-breaking moments, amazing discoveries
- Verifiable and factual

This means every spark should make the user think "I can't believe that's real!"

---

## Cost Estimates (Monthly, 10k DAU)

| Service | Usage | Cost |
|---|---|---|
| OpenAI GPT-4o-mini | ~30 sparks/day × 30 days | ~$0.50/month |
| Firebase Firestore | 10k users, reads/writes | Free tier covers this |
| Firebase Functions | ~900k invocations/month | Free tier covers this |
| FCM Push | 90k notifications/day | Free |
| **Total** | | **~$0.50/month** |

---

## Roadmap

- [x] MVP: Swipe deck, AI content, 3 notifications/day, social login
- [ ] Phase 2: Apple Health / Google Fit integration, advanced personalization
- [ ] Phase 3: Social features (share streaks, friends), premium sparks, monetization
- [ ] Phase 4: Web app (Progressive Web App)
