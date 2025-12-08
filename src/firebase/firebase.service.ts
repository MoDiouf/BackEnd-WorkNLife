import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  constructor() {
    // Initialisation Firebase seulement une fois
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          path.resolve(__dirname, './../../firebase.json')
        ),
      });
    }
  }

  async sendPush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        data,
      });
      console.log('Notification envoyée avec succès');
    } catch (error) {
      console.error('Erreur en envoyant la notification:', error);
    }
  }
}
