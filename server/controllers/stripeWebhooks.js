import Stripe from "stripe"
import prisma from "../config/prisma.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (req, res) => {
    try {
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
        } else {
          // For testing without signature verification
          event = req.body;
          console.log('⚠️ Running without webhook signature verification (testing mode)');
        }
        
        console.log(`Received webhook event: ${event.type}`);
        
        switch (event.type) {
            case 'checkout.session.completed':
              const session = event.data.object;
              const {transactionId, appId} = session.metadata || {};
              
              console.log(`\n=== Processing checkout.session.completed ===`);
              console.log(`Session ID: ${session.id}`);
              console.log(`Payment Status: ${session.payment_status}`);
              console.log(`Payment Intent: ${session.payment_intent}`);
              console.log(`Amount Total: ${session.amount_total}`);
              console.log(`Metadata:`, JSON.stringify(session.metadata, null, 2));
              
              // Only process if payment was successful
              if(session.payment_status !== 'paid') {
                console.log(`❌ Payment not completed. Status: ${session.payment_status}`);
                console.log(`Session details:`, {
                  id: session.id,
                  payment_status: session.payment_status,
                  amount_total: session.amount_total,
                  customer_email: session.customer_email
                });
                break;
              }
              
              if(appId === 'FlipEarn' && transactionId){
                console.log(`✅ Processing transaction: ${transactionId}`);
                
                const transaction = await prisma.transaction.update({
                    where:{id:transactionId},
                    data:{isPaid:true}
                })
                
                console.log(`✅ Transaction ${transactionId} marked as paid`);
                
                // send new credentials to the buyer using the email address
                await inngest.send({
                    name:"app/purchase",
                    data:{transaction}
                })
                
                console.log(`📧 Email event sent for transaction: ${transactionId}`);
                

                // Mark the listing as sold
                await prisma.listing.update({
                    where:{id:transaction.listingId},
                    data:{status:'sold'}
                })
                
                console.log(`✅ Listing ${transaction.listingId} marked as sold`);

                // add the amount to the user's earned balance
                await prisma.user.update({
                    where:{id:transaction.ownerId},
                    data:{earned:{increment:transaction.amount}}
                })
                
                console.log(`✅ Updated balance for user ${transaction.ownerId}`);
                console.log(`=== Transaction processing complete ===\n`);
              } else {
                console.log(`⚠️ Skipping: appId=${appId}, transactionId=${transactionId}`);
              }
              break;
              
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object;
              console.log(`\n=== Processing payment_intent.succeeded ===`);
              console.log(`Payment Intent ID: ${paymentIntent.id}`);
              console.log(`Amount: ${paymentIntent.amount}`);
              console.log(`Metadata:`, JSON.stringify(paymentIntent.metadata, null, 2));
              
              const {transactionId: piTransactionId, appId: piAppId} = paymentIntent.metadata || {};
              
              if(piAppId === 'FlipEarn' && piTransactionId){
                console.log(`✅ Processing transaction via payment_intent: ${piTransactionId}`);
                
                // Check if already processed
                const existingTransaction = await prisma.transaction.findUnique({
                  where: { id: piTransactionId }
                });
                
                if(existingTransaction && !existingTransaction.isPaid) {
                  const transaction = await prisma.transaction.update({
                      where:{id:piTransactionId},
                      data:{isPaid:true}
                  })
                  
                  console.log(`✅ Transaction ${piTransactionId} marked as paid`);
                  
                  await inngest.send({
                      name:"app/purchase",
                      data:{transaction}
                  })
                  
                  console.log(`📧 Email event sent for transaction: ${piTransactionId}`);

                  await prisma.listing.update({
                      where:{id:transaction.listingId},
                      data:{status:'sold'}
                  })
                  
                  console.log(`✅ Listing ${transaction.listingId} marked as sold`);

                  await prisma.user.update({
                      where:{id:transaction.ownerId},
                      data:{earned:{increment:transaction.amount}}
                  })
                  
                  console.log(`✅ Updated balance for user ${transaction.ownerId}`);
                  console.log(`=== Payment intent processing complete ===\n`);
                } else {
                  console.log(`ℹ️ Transaction ${piTransactionId} already processed or not found`);
                }
              }
              break;
           
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
        
          // Return a response to acknowledge receipt of the event
          res.json({received: true});
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: "Internal server Error", message: error.message });
    }
}