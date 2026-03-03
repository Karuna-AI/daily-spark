import * as admin from 'firebase-admin';

// Initialize Firebase Admin only once
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export { generateDailySparks } from './generateDailySparks';
export { sendSparkNotification } from './sendSparkNotification';
export { getUserSparks } from './getUserSparks';
export { recordFeedback } from './recordFeedback';
