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
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Your Purchase Credentials</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f5f7;padding:24px 0;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.12);">
                      <tr>
                        <td style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#f9fafb;">
                          <h1 style="margin:0;font-size:20px;font-weight:600;">Purchase Successful 🎉</h1>
                          <p style="margin:6px 0 0;font-size:13px;opacity:0.85;">
                            Thanks for purchasing <strong>@${listing.username}</strong> on <strong>${listing.platform}</strong>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px 8px 24px;">
                          <p style="margin:0 0 14px 0;font-size:13px;color:#4b5563;">
                            Hi ${customer.name || "there"},
                          </p>
                          <p style="margin:0 0 16px 0;font-size:13px;color:#4b5563;line-height:1.6;">
                            Below are the login details for the account you purchased. Please keep this email safe and do not share these credentials with anyone.
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:8px 0 18px 0;font-size:13px;border-collapse:collapse;">
                            <tr>
                              <td style="padding:6px 0;color:#6b7280;width:32%;">Listing</td>
                              <td style="padding:6px 0;color:#111827;"><strong>@${listing.username}</strong></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0;color:#6b7280;">Platform</td>
                              <td style="padding:6px 0;color:#111827;"><strong>${listing.platform}</strong></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0;color:#6b7280;">Order ID</td>
                              <td style="padding:6px 0;color:#111827;">${transaction.id}</td>
                            </tr>
                          </table>
                          <div style="margin:14px 0 6px 0;">
                            <h2 style="margin:0 0 6px 0;font-size:15px;color:#111827;">Account Credentials</h2>
                            <div style="padding:12px 14px;border-radius:10px;background-color:#f3f4ff;border:1px solid #e0e7ff;font-size:13px;color:#111827;">
                              ${credentialsHtml}
                            </div>
                          </div>
                          <div style="margin:16px 0 0 0;">
                            <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;line-height:1.5;">
                              <strong>Security tip:</strong> We recommend logging in immediately and changing the password and recovery information to your own details.
                            </p>
                            <p style="margin:0 0 0 0;font-size:12px;color:#6b7280;">
                              If anything looks incorrect, reply to this email or contact us at
                              <a href="mailto:manish875506341@gmail.com" style="color:#1d4ed8;text-decoration:none;">devManish@dev.com</a>.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 24px 18px 24px;border-top:1px solid #e5e7eb;background-color:#f9fafb;">
                          <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                            You are receiving this email because you completed a purchase on our marketplace.
                            If you did not make this purchase, please contact support immediately.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
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
        subject: "Updated Credentials for Your Listing",
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Updated Listing Credentials</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f5f7;padding:24px 0;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.12);">
                      <tr>
                        <td style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#06b6d4);color:#f9fafb;">
                          <h1 style="margin:0;font-size:20px;font-weight:600;">Listing Credentials Updated</h1>
                          <p style="margin:6px 0 0;font-size:13px;opacity:0.85;">
                            We've generated and stored new credentials for one of your listings.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px 8px 24px;">
                          <p style="margin:0 0 12px 0;font-size:13px;color:#4b5563;">
                            Hi ${listing.owner?.name || "there"},
                          </p>
                          <p style="margin:0 0 14px 0;font-size:13px;color:#4b5563;line-height:1.6;">
                            Here are the updated credentials for your listing. Keep this information safe and do not share it publicly.
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:8px 0 18px 0;font-size:13px;border-collapse:collapse;">
                            <tr>
                              <td style="padding:6px 0;color:#6b7280;width:32%;">Title</td>
                              <td style="padding:6px 0;color:#111827;"><strong>${listing.title}</strong></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0;color:#6b7280;">Platform</td>
                              <td style="padding:6px 0;color:#111827;"><strong>${listing.platform}</strong></td>
                            </tr>
                          </table>
                          <div style="margin:10px 0 4px 0;">
                            <h2 style="margin:0 0 6px 0;font-size:15px;color:#111827;">New Credentials</h2>
                            <div style="padding:12px 14px;border-radius:10px;background-color:#ecfdf5;border:1px solid #bbf7d0;font-size:13px;color:#14532d;">
                              ${(newCredentials.updatedCredential || [])
                                .map(
                                  (cred) =>
                                    `<p style="margin:0 0 4px 0;"><strong>${cred.name}:</strong> ${cred.value}</p>`
                                )
                                .join("")}
                            </div>
                          </div>
                          <div style="margin:16px 0 0 0;">
                            <h2 style="margin:0 0 6px 0;font-size:15px;color:#111827;">Previous Credentials</h2>
                            <div style="padding:12px 14px;border-radius:10px;background-color:#fef3c7;border:1px solid #fed7aa;font-size:13px;color:#92400e;">
                              ${(newCredentials.originalCredential || [])
                                .map(
                                  (cred) =>
                                    `<p style="margin:0 0 4px 0;"><strong>${cred.name}:</strong> ${cred.value}</p>`
                                )
                                .join("")}
                            </div>
                          </div>
                          <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;line-height:1.5;">
                            If you have any questions, please contact us at
                            <a href="mailto:manish875506341@gmail.com" style="color:#0ea5e9;text-decoration:none;">devManish@dev.com</a>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 24px 18px 24px;border-top:1px solid #e5e7eb;background-color:#f9fafb;">
                          <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                            This message was sent because credentials were updated for one of your listings.
                            Keep this information confidential and secure.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
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
