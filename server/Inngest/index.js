import { Inngest } from "inngest";
import prisma from '../config/prisma.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Profile -marketplace" });



//* INGEST FUNCTIONS TO SAVE USER DATA TO A DATABASE
const SyncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
    const {data} = event

    //todo check if user already exists in the database
    const user = await prisma.user.findFirst({
        where:{id:data.id}
    })
    if(user){
        //* Update user data if it exits
        await prisma.user.update({
            where:{id:data.id},
            data:{
                email:data?.email_addresses[0]?.email_addrress,
                name:data?.first_name+ " " + data?.last_name,
                image:data?.image_url
            }
        })
        return
    }
    await prisma.user.create({
        data:{
            id:data.id,
            email:data?.email_addresses[0]?.email_addrress,
            name:data?.first_name+ " " + data?.last_name,
            image:data?.image_url
        }
    })



    },
  );


//! Inngest function to delete user from database
const SyncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
    const {data} = event
    
    const listings = await prisma.listing.findMany({
        where:{ownerId:data.id}
    })

    const chats = await prisma.chat.findMany({
        where:{OR:[{ownerUserId:data.id},{chatUserId:data.id}]}
    })
    
    const transactions = await prisma.transaction.findMany({
        where:{userId:data.id}
    })
    if(listings.length===0&&chats.length===0 && transactions.length===0){
        await prisma.user.delete({where:{id:data.id}})
    }else{
        await prisma.listing.updateMany({where:{ownerId:data.id},data:{status:"inactive"}})
    }

    

  
   
   


    },
  );

//? Inngest function to update user from databse
  const SyncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
    const {data} = event
    
    await prisma.user.update({
        where:{id:data.id},
        data:{
            email:data?.email_addresses[0]?.email_addrress,
            name:data?.first_name+ " " + data?.last_name,
            image:data?.image_url
        }
    })

   

    

  
   
   


    },
  );





//? Create an empty array where we'll export future Inngest functions
export const functions = [
    SyncUserCreation,SyncUserDeletion,SyncUserUpdation
];