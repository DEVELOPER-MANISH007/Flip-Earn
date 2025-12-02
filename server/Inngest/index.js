import { Inngest } from "inngest";
import prisma from '../config/prisma.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Profile -marketplace" });



//* INGEST FUNCTIONS TO SAVE USER DATA TO A DATABASE
const SyncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
    try {
        const {data} = event

        if (!data || !data.id) {
            console.error('Invalid event data:', event);
            return { success: false, error: 'Invalid event data' };
        }

        // Extract email safely
        const email = data?.email_addresses?.[0]?.email_address || data?.email_addresses?.[0]?.email_addrress || '';
        
        // Extract name safely
        const firstName = data?.first_name || '';
        const lastName = data?.last_name || '';
        const name = `${firstName} ${lastName}`.trim() || 'User';
        
        // Extract image
        const image = data?.image_url || '';

        if (!email) {
            console.error('No email found for user:', data.id);
            return { success: false, error: 'No email found' };
        }

        //todo check if user already exists in the database
        const user = await prisma.user.findFirst({
            where:{id:data.id}
        })
        
        if(user){
            //* Update user data if it exists
            await prisma.user.update({
                where:{id:data.id},
                data:{
                    email: email,
                    name: name,
                    image: image
                }
            })
            console.log('User updated successfully:', data.id);
            return { success: true, action: 'updated' };
        }
        
        await prisma.user.create({
            data:{
                id:data.id,
                email: email,
                name: name,
                image: image
            }
        })
        console.log('User created successfully:', data.id);
        return { success: true, action: 'created' };
    } catch (error) {
        console.error('Error in SyncUserCreation:', error);
        throw error;
    }
    },
  );


//! Inngest function to delete user from database
const SyncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
    try {
        const {data} = event

        if (!data || !data.id) {
            console.error('Invalid event data:', event);
            return { success: false, error: 'Invalid event data' };
        }
        
        const listings = await prisma.listing.findMany({
            where:{ownerId:data.id}
        })

        const chats = await prisma.chat.findMany({
            where:{OR:[{ownerUserId:data.id},{chatUserId:data.id}]}
        })
        
        const transactions = await prisma.transaction.findMany({
            where:{userId:data.id}
        })
        
        if(listings.length===0 && chats.length===0 && transactions.length===0){
            await prisma.user.delete({where:{id:data.id}})
            console.log('User deleted successfully:', data.id);
            return { success: true, action: 'deleted' };
        }else{
            await prisma.listing.updateMany({where:{ownerId:data.id},data:{status:"inactive"}})
            console.log('User listings marked as inactive:', data.id);
            return { success: true, action: 'marked_inactive' };
        }
    } catch (error) {
        console.error('Error in SyncUserDeletion:', error);
        throw error;
    }

    

  
   
   


    },
  );

//? Inngest function to update user from database
  const SyncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
    try {
        const {data} = event

        if (!data || !data.id) {
            console.error('Invalid event data:', event);
            return { success: false, error: 'Invalid event data' };
        }

        // Extract email safely
        const email = data?.email_addresses?.[0]?.email_address || data?.email_addresses?.[0]?.email_addrress || '';
        
        // Extract name safely
        const firstName = data?.first_name || '';
        const lastName = data?.last_name || '';
        const name = `${firstName} ${lastName}`.trim() || 'User';
        
        // Extract image
        const image = data?.image_url || '';

        if (!email) {
            console.error('No email found for user:', data.id);
            return { success: false, error: 'No email found' };
        }
    
        await prisma.user.update({
            where:{id:data.id},
            data:{
                email: email,
                name: name,
                image: image
            }
        })
        console.log('User updated successfully:', data.id);
        return { success: true, action: 'updated' };
    } catch (error) {
        console.error('Error in SyncUserUpdation:', error);
        throw error;
    }
    },
  );





//? Create an empty array where we'll export future Inngest functions
export const functions = [
    SyncUserCreation,SyncUserDeletion,SyncUserUpdation
];