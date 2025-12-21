//  controller for checking is user is admin

import prisma from "../config/prisma.js"

export const isAdmin = async (req,res) => {
    try {

        return res.json({isAdmin:true})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}


// controller for getting dashboard data

export const getDashboard = async (req,res)=> {
    try {
        const totalListings = await prisma.listing.count({})
        const transactions = await prisma.transaction.findMany({
            where:{isPaid:true},
            select:{amount:true}

        })
        const totalRevenue = transactions.reduce((total,transaction)=>total+transaction.amount,0)
        const activeListing  = await prisma.listing.count({
            where:{status:'active'}
        })
        const totalUser = await prisma.user.count({})

        const recentListings = await prisma.listing.findMany({
            orderBy:{createdAt:'desc'},
            take:5,
            include:{owner:true}
        })
        return res.json({dashboardData:{totalListings,totalRevenue,activeListing,totalUser,recentListings}})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}


// controller for getting all listings
export const getAllListings = async (req,res) => {
    try {
        const listings = await prisma.listing.findMany({
            include:{owner:true},
            orderBy:{createdAt:"desc"}
        })
        if(!listings||listings.length===0){
            return res.json({listings:[]})
        }
        return res.json({listings})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}



//change listing status

export const changesStatus = async (req,res) => {
    try {
       const {listingId} = req.params;
        const{status} = req.body;
        const listing = await prisma.listing.findUnique({
            where:{id:listingId}
        })
        if(!listing){
            return res.status(400).json({message:"Listing Not found"})
        }
        await prisma.listing.update({
            where:{id:listingId},
            data:{status}
        })
        return res.json({message:"Status updated successfully"})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}


//controller for getting all unverified listings with credentials submitted

export const getAllUnverifiedListings = async (req,res) => {
    try {
        const listings = await prisma.listing.findMany({
            where:{isCredentialSubmitted:true,isCredentialVerified:false,status:{not:"deleted"}},
            orderBy:{createdAt:"desc"},
            include:{owner:true}
        })
        if(!listings||listings.length===0){
            return res.json({listings:[]})
        }
        return res.json({listings})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}

// controller for getting credentials


export const getCredentials = async (req,res) => {
    try {
        const {listingId} = req.params;
        const credential = await prisma.credential.findFirst({
            where:{listingId}
        })
        if(!credential){
         return res.status(400).json({message:"credentials not found"})
        }
        return res.json({credential})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}
// mark credentials as verfied

export  const markCredentialsVerified = async (req,res) => {
    try {
        const {listingId} = req.params
        await prisma.listing.update({
            where:{id:listingId},
            data:{isCredentialVerified:true}
        })
        return res.json({message:"credential marked as verfied"})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}

//get all un-changed listings
export const getAllUnchangedListings = async (req,res) => {
    try {
        const listings = await prisma.listing.findMany({
            where:{isCredentialVerified:true,
                isCredentialChanged:false,
                status:{not:"deleted"}
            },
            orderBy:{createdAt:"desc"}
        })
        if(!listings||listings===0){
            return res.json({listings:[]})
        }
        return res.json({listings})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}


// change credential verifeid listing
export const changeCredential = async (req,res) => {
    try {
        const {listingId} = req.params
        const{newCredentials,credentialId} = req.body
        await prisma.credential.update({
            where:{id:credentialId,listingId},
            data:{updatedCredential:newCredentials}
        }) 
        await prisma.listing.update({
            where:{id:listingId},
            data:{isCredentialChanged:true}
        })
        res.json({message:"Credentials changed successfully"})
    } catch (error) {
        
    }
}

// get all transcation

export const getAllTransactions = async (req,res)=>{
    try {
        const transactions = await prisma.transaction.findMany({
            where:{isPaid:true},
            orderBy:{createdAt:"desc"},
            include:{listing:{include:{owner:true}}}
        }) 
        //get customer details for each transactions and it to the transcactions object

        const customer = await prisma.user.findMany({
            where:{id:{in:transactions.map((t)=>t.userId)}},
            select:{id:true,email:true,name:true,image:true}
        })
        transactions.forEach((t)=>{
            const customer = customer.find((c)=>c.id===t.userId)
            t.listing.customer= {...customer}
        })
        return res.json({transactions})
    } catch (error) {
        res.status(400).json({message:error.code||error.message})
        console.log(error)
    }
}

//cntrller for getting all withdraw requests

export const  getWithdrawRequests = async (req,res) => {
try {
    const requests = await prisma.withdrawal.findMany({
        orderBy:{createdAt:"asc"},
        include:{user:true}
    })
    if(!requests||requests.length===0){
        res.json({requests:[]})
    }
    return res.json({requests})
} catch (error) {
    res.status(400).json({message:error.code||error.message})
    console.log(error)
}
    
}

// controler for marking withdrawl as paid

export const markWithdrawalAsPaid = async (req,res) => {
  try {
    const {id} = req.params;
    const withdrawal = await prisma.withdrawal.findUnique({
        where:{id}
    
    })
    if(!withdrawal){
        return res.status(400).json({message:"Withdrawal not found"})
    }
    
    if(withdrawal.isWithdrawn){
        return res.json({message:"Withdrawal already marked as paid "})
    }
    await prisma.withdrawal.update({
        where:{id},
        data:{isWithdrawn:true}
    })
    return res.json({message:"Marked as paid"})
  } catch (error) {
    res.status(400).json({message:error.code||error.message})
    console.log(error)
  }
}