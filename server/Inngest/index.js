import { Inngest } from "inngest";
import prisma from "../config/prisma.js";
import { sendEmail } from "../config/Nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Profile -marketplace" });

//* INGEST FUNCTIONS TO SAVE USER DATA TO A DATABASE
const SyncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            const { data } = event;

            if (!data || !data.id) {
                console.error("Invalid event data:", event);
                return { success: false, error: "Invalid event data" };
            }

            // Extract email safely
            const email =
                data?.email_addresses?.[0]?.email_address ||
                data?.email_addresses?.[0]?.email_addrress ||
                "";

            // Extract name safely
            const firstName = data?.first_name || "";
            const lastName = data?.last_name || "";
            const name = `${firstName} ${lastName}`.trim() || "User";

            // Extract image
            const image = data?.image_url || "";

            if (!email) {
                console.error("No email found for user:", data.id);
                return { success: false, error: "No email found" };
            }

            //todo check if user already exists in the database
            const user = await prisma.user.findFirst({
                where: { id: data.id },
            });

            if (user) {
                //* Update user data if it exists
                await prisma.user.update({
                    where: { id: data.id },
                    data: {
                        email: email,
                        name: name,
                        image: image,
                    },
                });
                console.log("User updated successfully:", data.id);
                return { success: true, action: "updated" };
            }

            await prisma.user.create({
                data: {
                    id: data.id,
                    email: email,
                    name: name,
                    image: image,
                },
            });
            console.log("User created successfully:", data.id);
            return { success: true, action: "created" };
        } catch (error) {
            console.error("Error in SyncUserCreation:", error);
            throw error;
        }
    }
);

//! Inngest function to delete user from database
const SyncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            const { data } = event;

            if (!data || !data.id) {
                console.error("Invalid event data:", event);
                return { success: false, error: "Invalid event data" };
            }

            const listings = await prisma.listing.findMany({
                where: { ownerId: data.id },
            });

            const chats = await prisma.chat.findMany({
                where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] },
            });

            const transactions = await prisma.transaction.findMany({
                where: { userId: data.id },
            });

            if (
                listings.length === 0 &&
                chats.length === 0 &&
                transactions.length === 0
            ) {
                await prisma.user.delete({ where: { id: data.id } });
                console.log("User deleted successfully:", data.id);
                return { success: true, action: "deleted" };
            } else {
                await prisma.listing.updateMany({
                    where: { ownerId: data.id },
                    data: { status: "inactive" },
                });
                console.log("User listings marked as inactive:", data.id);
                return { success: true, action: "marked_inactive" };
            }
        } catch (error) {
            console.error("Error in SyncUserDeletion:", error);
            throw error;
        }
    }
);

//? Inngest function to update user from database
const SyncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        try {
            const { data } = event;

            if (!data || !data.id) {
                console.error("Invalid event data:", event);
                return { success: false, error: "Invalid event data" };
            }

            // Extract email safely
            const email =
                data?.email_addresses?.[0]?.email_address ||
                data?.email_addresses?.[0]?.email_addrress ||
                "";

            // Extract name safely
            const firstName = data?.first_name || "";
            const lastName = data?.last_name || "";
            const name = `${firstName} ${lastName}`.trim() || "User";

            // Extract image
            const image = data?.image_url || "";

            if (!email) {
                console.error("No email found for user:", data.id);
                return { success: false, error: "No email found" };
            }

            await prisma.user.update({
                where: { id: data.id },
                data: {
                    email: email,
                    name: name,
                    image: image,
                },
            });
            console.log("User updated successfully:", data.id);
            return { success: true, action: "updated" };
        } catch (error) {
            console.error("Error in SyncUserUpdation:", error);
            throw error;
        }
    }
);

//? Innngest Function to send puchase email to the customer
const sendPurchaseEmail = inngest.createFunction(
    { id: "send-purchase-email" },
    { event: "app/purchase" },
    async ({ event }) => {
        try {
            const { transaction } = event.data;
            
            console.log(`📧 Processing email for transaction: ${transaction.id}`);

            const customer = await prisma.user.findFirst({
                where: { id: transaction.userId },
            });

            const listing = await prisma.listing.findFirst({
                where: { id: transaction.listingId },
            });

            const credential = await prisma.credential.findFirst({
                where: { listingId: transaction.listingId },
            });

            if (!customer) {
                console.error(`❌ Customer not found for userId: ${transaction.userId}`);
                throw new Error("Customer not found");
            }

            if (!listing) {
                console.error(`❌ Listing not found for listingId: ${transaction.listingId}`);
                throw new Error("Listing not found");
            }

            if (!credential) {
                console.error(`❌ Credential not found for listingId: ${transaction.listingId}`);
                throw new Error("Credential not found");
            }

            if (!customer.email) {
                console.error(`❌ Customer email not found for userId: ${transaction.userId}`);
                throw new Error("Customer email not found");
            }

            // Check if updatedCredential exists and has data
            const credentialsHtml = credential.updatedCredential && credential.updatedCredential.length > 0
                ? credential.updatedCredential
                    .map((cred) => `<p><b>${cred.name}</b>: ${cred.value}</p>`)
                    .join("")
                : '<p>Credentials are being processed. Please check your account.</p>';

            console.log(`📧 Sending email to: ${customer.email}`);

            await sendEmail({
                to: customer.email,
                subject: "Your Credentials for the Account You Purchased",
                html: `
          <h2>
            Thank you for purchasing the account 
            <b>@${listing.username}</b> on <b>${listing.platform}</b>
          </h2>
  
          <p>Here are your credentials for the listing you purchased:</p>
  
          <h3>New Credentials</h3>
          <div>
            ${credentialsHtml}
          </div>
  
          <p>
            If you have any questions, please contact us at 
            <a href="mailto:manish875506341@gmail.com">devManish@dev.com</a>
          </p>
        `,
            });
            
            console.log(`✅ Email sent successfully to: ${customer.email}`);
            return { success: true, email: customer.email };
        } catch (error) {
            console.error("❌ Error sending purchase email:", error);
            throw error;
        }
    }
);

// inggest function  to send new credentials for delted listings

const sendNewCredentials = inngest.createFunction(
    { id: "send-new-credentials" },
    { event: "app/listing-deleted" },
    async ({ event }) => {
      const { listing, listingId } = event.data;
  
      if (!listing?.owner?.email) return;
  
      const newCredentials = await prisma.credential.findFirst({
        where: { listingId },
      });
  
      if (!newCredentials) return;
  
      await sendEmail({
        to: listing.owner.email,
        subject: "New Credentials for Your Deleted Listing",
        html: `
          <h2>Your new credentials for the deleted listing</h2>
  
          <p><b>Title:</b> ${listing.title}</p>
          <p><b>Platform:</b> ${listing.platform}</p>
  
          <h3>New Credentials</h3>
          <div>
            ${(newCredentials.updatedCredential || [])
              .map(
                (cred) =>
                  `<p><b>${cred.name}</b>: ${cred.value}</p>`
              )
              .join("")}
          </div>
  
          <h3>Old Credentials</h3>
          <div>
            ${(newCredentials.originalCredential || [])
              .map(
                (cred) =>
                  `<p><b>${cred.name}</b>: ${cred.value}</p>`
              )
              .join("")}
          </div>
  
          <p style="margin-top:20px">
            If you have any questions, please contact us at 
            <a href="mailto:manish875506341@gmail.com">devManish@dev.com</a>
          </p>
        `,
      });
    }
  );
  

//? Create an empty array where we'll export future Inngest functions
export const functions = [
    SyncUserCreation,
    SyncUserDeletion,
    SyncUserUpdation,
    sendPurchaseEmail,
    sendNewCredentials
];
