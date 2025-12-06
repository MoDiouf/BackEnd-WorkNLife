import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(require("../firebase-key.json")),
});

export const sendPush = async (token: string, title: string, body: string, data?: any) => {
  await admin.messaging().send({
    token,
    notification: { title, body },
    data, // pour redirection
  });
};
