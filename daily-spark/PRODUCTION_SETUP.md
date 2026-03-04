# Daily Spark — Production Setup Checklist

This guide takes you from the current repo to a live iOS + Android app.

---

## Prerequisites

Install the required CLI tools:

```bash
npm install -g firebase-tools eas-cli
firebase login
eas login
```

---

## Step 1 — Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project: **daily-spark** (or use existing `daily-spark-9e230`)
3. Enable **Google Analytics** (optional but recommended)

### 1.2 Enable Firebase Services
In the Firebase Console, enable:
- **Authentication** → Sign-in methods → Google, Facebook, Apple
- **Firestore Database** → Start in production mode
- **Cloud Messaging** (FCM) — enabled by default
- **Cloud Functions** — requires Blaze (pay-as-you-go) plan

### 1.3 Download Service Files

**iOS** (`GoogleService-Info.plist`):
1. Firebase Console → Project Settings → iOS app
2. Add iOS app with Bundle ID: `com.dailyspark.app`
3. Download `GoogleService-Info.plist`
4. Place in project root: `daily-spark/GoogleService-Info.plist`

**Android** (`google-services.json`):
1. Firebase Console → Project Settings → Android app
2. Add Android app with Package: `com.dailyspark.app`
3. Download `google-services.json`
4. Place in project root: `daily-spark/google-services.json`

> ⚠️ Both files are in `.gitignore` — never commit them.

### 1.4 Deploy Firestore Rules & Indexes
```bash
firebase deploy --only firestore
```

---

## Step 2 — Firebase Cloud Functions

### 2.1 Set OpenAI API Key (via Secrets Manager)
```bash
# Recommended: use Firebase Secrets (encrypted, never in code)
firebase functions:secrets:set OPENAI_API_KEY
# Enter your key from platform.openai.com/api-keys when prompted

# Optional: set other vars
firebase functions:secrets:set OPENAI_MODEL
firebase functions:secrets:set SPARKS_PER_TOPIC_PER_DAY
```

Alternatively, for local testing copy `functions/.env.example` → `functions/.env` and fill in values.

### 2.2 Update generateDailySparks.ts to Use Secret
After setting the secret, the function reads it automatically via environment variables at runtime. No code change needed.

### 2.3 Install Functions Dependencies
```bash
cd functions && npm install && cd ..
```

### 2.4 Deploy Functions
```bash
firebase deploy --only functions
```

This deploys all 4 Cloud Functions:
- `generateDailySparks` — runs daily at 2 AM UTC (OpenAI → Firestore)
- `getUserSparks` — HTTPS callable (returns 3 personalised sparks)
- `sendSparkNotification` — runs every hour (FCM push notifications)
- `recordFeedback` — HTTPS callable (records like/dislike)

---

## Step 3 — EAS Build Setup

### 3.1 Initialise EAS Project
```bash
cd daily-spark
eas init
```
This creates an EAS project and fills in the `projectId` in `app.config.ts`.

### 3.2 Configure Environment Variables in EAS
```bash
# Set Firebase config as EAS secrets (for CI builds)
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_APP_ID --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "YOUR_VALUE"

# Google Service file paths (EAS will inject them during build)
eas secret:create --scope project --name GOOGLE_SERVICES_PLIST --value "./GoogleService-Info.plist"
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --value "./google-services.json"
```

Or add them via the Expo dashboard at [expo.dev](https://expo.dev).

### 3.3 iOS Notification Sound (Optional)
The notification uses the system default sound. To add the custom `spark` sound:
```bash
# Install ffmpeg if not already installed
brew install ffmpeg

# Convert mp3 → caf (iOS notification format)
ffmpeg -i assets/sounds/spark.mp3 assets/sounds/spark.caf
```
Then uncomment the `sounds` line in `app.config.ts`:
```ts
sounds: ['./assets/sounds/spark.caf'],
```

---

## Step 4 — iOS App Store Setup

### 4.1 Apple Developer Account
- Enrol at [developer.apple.com](https://developer.apple.com) ($99/year)
- Note your **Team ID** (shown in Membership section)

### 4.2 App Store Connect
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new App:
   - Platform: iOS
   - Name: **Daily Spark**
   - Bundle ID: `com.dailyspark.app`
   - SKU: `dailyspark-ios`
3. Note the **App ID** (numeric, shown in App Information)

### 4.3 Update eas.json Submit Config
Edit `eas.json` and fill in:
```json
"ios": {
  "appleId": "your@apple.id",
  "ascAppId": "YOUR_NUMERIC_APP_ID",
  "appleTeamId": "YOUR_TEAM_ID"
}
```

### 4.4 App Store Listing Requirements
- [ ] App icon: 1024×1024 PNG (already in `assets/images/icon.png` — verify dimensions)
- [ ] Screenshots: 6.7" iPhone (required), 6.5" iPhone, 12.9" iPad (optional)
  - Screenshot sizes: 1290×2796 (6.7"), 1242×2688 (6.5")
  - Minimum: 3 screenshots per device
- [ ] Privacy Policy URL: `https://dailyspark.app/privacy` (host your privacy policy here)
- [ ] App description (max 4000 chars)
- [ ] Keywords (max 100 chars)
- [ ] Support URL

### 4.5 Apple Sign-In
Apple Sign-In is already configured in `app.config.ts` entitlements. EAS will handle provisioning.

---

## Step 5 — Android Play Store Setup

### 5.1 Google Play Console
1. Go to [play.google.com/console](https://play.google.com/console) (one-time $25 fee)
2. Create new app:
   - App name: **Daily Spark**
   - Default language: English
   - App or Game: App
   - Free or Paid: Free

### 5.2 Service Account for EAS Submit
1. Google Play Console → Setup → API access → Create service account
2. Grant **Release manager** role
3. Download the JSON key
4. Place at project root: `daily-spark/google-play-service-account.json`
5. Add to `.gitignore` (already included)

### 5.3 Play Store Listing Requirements
- [ ] App icon: 512×512 PNG
- [ ] Feature graphic: 1024×500 PNG
- [ ] Screenshots: phone (min 2), 7" tablet (optional), 10" tablet (optional)
  - Screenshot size: 1080×1920 (portrait)
- [ ] Short description (max 80 chars)
- [ ] Full description (max 4000 chars)
- [ ] Privacy Policy URL

---

## Step 6 — Production Build

### 6.1 Verify Icon & Splash Screen Dimensions
```bash
# Check icon.png is 1024×1024
sips -g pixelWidth -g pixelHeight assets/images/icon.png

# Check adaptive-icon.png is 1024×1024
sips -g pixelWidth -g pixelHeight assets/images/adaptive-icon.png
```

### 6.2 Build Both Platforms
```bash
# Build for production (creates iOS .ipa + Android .aab)
eas build --platform all --profile production

# Or build individually
eas build --platform ios --profile production
eas build --platform android --profile production
```

EAS Build handles:
- iOS certificates & provisioning profiles (automatically managed)
- Android keystore (auto-generated and stored securely by EAS)

### 6.3 Test the Build
```bash
# Create a preview build for internal testing
eas build --platform all --profile preview

# Install on device and test
```

---

## Step 7 — Submit to Stores

### 7.1 Submit to App Store
```bash
eas submit --platform ios --profile production
```
- App will be in "Waiting for Review" status
- Apple review typically takes 1-3 days

### 7.2 Submit to Play Store
```bash
eas submit --platform android --profile production
```
- Submits to **internal** track (per `eas.json` config)
- Promote to production in Play Console after testing

---

## Step 8 — Post-Launch Checklist

- [ ] Verify Cloud Functions are running (Firebase Console → Functions → Logs)
- [ ] Check `generateDailySparks` runs at 2 AM UTC (day after deploy)
- [ ] Send a test FCM notification via Firebase Console
- [ ] Verify Google Sign-In works on real device
- [ ] Verify Apple Sign-In works on iOS device
- [ ] Test deep link: `dailyspark://home`
- [ ] Test referral link: `https://dailyspark.app/join?ref=TEST_UID`
- [ ] Monitor Firebase Crashlytics (add `@react-native-firebase/crashlytics` when ready)

---

## Environment Variable Summary

### Client (`.env`)
| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase web API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | `YOUR_PROJECT.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | FCM sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | ✅ | Google OAuth web client ID |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | iOS | Google OAuth iOS client ID |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | Android | Google OAuth Android client ID |

### Server (`functions/.env` or Firebase Secrets)
| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `OPENAI_MODEL` | optional | Default: `gpt-4o-mini` |
| `SPARKS_PER_TOPIC_PER_DAY` | optional | Default: `10` |

---

## Estimated Costs (Monthly, 1000 DAU)

| Service | Cost |
|---|---|
| Firebase Firestore | ~$5-20 |
| Firebase Functions | ~$1-5 |
| Firebase FCM | Free |
| OpenAI gpt-4o-mini | ~$5-15 |
| EAS Build (free tier: 30 builds/month) | $0-29 |
| **Total** | **~$10-50/month** |
