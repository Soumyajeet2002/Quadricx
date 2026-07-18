// firebase/firebase.provider.ts

import { initializeApp, cert } from 'firebase-admin/app';
import serviceAccount from './sms-ptpl-firebase-service-account.json';

initializeApp({
  credential: cert(serviceAccount as any),
});

console.log('Firebase Initialized');