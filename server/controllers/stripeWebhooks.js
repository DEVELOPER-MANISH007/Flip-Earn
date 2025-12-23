import Stripe from "stripe"
import prisma from "../config/prisma.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    let event;
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];
      try {
        event = stripeInstance.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
      try {
        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object;
              const sessionList = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntent.id
              })
              const session = sessionList.data[0]
              const {transactionId,appId} = session.metadata 
              if(appId==='FlipEarn'&& transactionId){
                const transaction = await prisma.transaction.update({
                    where:{id:transactionId},
                    data:{isPaid:true}
                })
                // send new credentials to the buyer using the email address
                await inngest.send({
                    name:"app/puchase",
                    data:{transaction}
                })
                

                // Mark the listing as sold
                await prisma.listing.update({
                    where:{id:transaction.listingId},
                    data:{status:'sold'}
                })

                // add the amount to the user's earned balance
                await prisma.user.update({
                    where:{id:transaction.ownerId},
                    data:{earned:{increment:transaction.amount}}
                })
              }
              break;
           
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
        
          // Return a response to acknowledge receipt of the event
          res.json({received: true});
      } catch (error) {
        console.log("webhook processing error:",error)
        res.status(500).send("Internal server Error")
      }
    }
}