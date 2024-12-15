// import Stripe from "stripe";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

//import { order_status } from "../../common/constant";
import * as utils from "../../lib/utils";
// import { orderAccounting, createNewOrderData } from "../order/orderCreated";
// import { sendMessageToCustomer } from "../notify";
// import { costCal } from "../../common/commonUtils";
import { Context } from "../../models/TestType";
import {  getStripeAccount, getStripeOrderRecord, /* getPaymentMethodData, getHash */ } from "./intent";

import { orderChangeData } from "../../lib/types";
//import { validateOrderChange } from "../../lib/validator";

// const multiple = utils.stripeRegion.multiple; // 100 for USD, 1 for JPY


export const orderPay = async (db: admin.firestore.Firestore, data: orderChangeData, context: functions.https.CallableContext | Context) => {
  const customerUid = utils.validate_customer_auth(context);
  const { restaurantId, orderId } = data;
  utils.required_params({ restaurantId, orderId });


  // const restaurantRef = db.doc(`restaurants/${restaurantId}`);
  const restaurantData = await utils.get_restaurant(db, restaurantId);
  /*
  if (restaurantData.uid !== ownerUid) {
    throw new functions.https.HttpsError("permission-denied", "The user does not have an authority to perform this operation.");
  }
  */
  
  // const menuRestaurantRef = restaurantRef;

  try {
    const orderRef = db.doc(`restaurants/${restaurantId}/orders/${orderId}`);
    const order = (await orderRef.get()).data();
    if (!order) {
      throw new functions.https.HttpsError("invalid-argument", "This order does not exist.");
    }

    /*
    if (!utils.isEmpty(order.orderUpdatedAt) || order.status !== order_status.order_placed) {
      throw new functions.https.HttpsError("failed-precondition", "It is not possible to change the order.");
      }
    */

    // generate new order
    order.id = orderId;


    // update stripe
    await db.runTransaction(async (transaction) => {
      console.log(customerUid);
      // const customerUid = order.uid;
      const restaurantOwnerUid = restaurantData["uid"];
      const stripeAccount = await getStripeAccount(db, restaurantOwnerUid);

      const stripeRef = db.doc(`restaurants/${restaurantId}/orders/${orderId}/system/stripe`);
      const stripeData = await getStripeOrderRecord(transaction, stripeRef);
      const id = stripeData.paymentIntent.id;
      // const client_secret = stripeData.paymentIntent.client_secret;
      // console.log(stripeData.paymentIntent);
      // console.log(client_secret);
      (await transaction.get(orderRef)).data();
      
      const stripe = utils.get_stripe();
      const paymentIntent = await stripe.paymentIntents.retrieve(id, { stripeAccount });
      console.log(paymentIntent);

      if (paymentIntent.status !== "requires_capture") {
        // some error;
      }
      await transaction.update(orderRef, {status: 300});
      //
      /*
      await transaction.set(
        stripeRef,
        {
          paymentIntent,
        },
        { merge: true },
      );
      return {};
      */
    });

    return { result: true };
  } catch (error) {
    throw utils.process_error(error);
  }
};
