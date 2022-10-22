import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as smaregi from "../../functions/smaregi";
import { enforceAppCheck } from "../firebase";

const db = admin.firestore();

export default functions
  .region("asia-northeast1")
  .runWith({
    maxInstances: 10,
    memory: "1GB" as "1GB",
    enforceAppCheck,
  })
  .https.onCall(async (data, context) => {
    if (context.app == undefined) {
      throw new functions.https.HttpsError("failed-precondition", "The function must be called from an App Check verified app.");
    }
    return await smaregi.productList(db, data, context);
  });
