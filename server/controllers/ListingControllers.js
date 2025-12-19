import imageKit from '../config/Imagekit.js'
import prisma from '../config/prisma.js'
import fs from 'fs'

//? Controlers For Adding Llisting to Databse
export const addListing = async (req,res) => {
   try {
    const {userId}  = await req.auth()
    if(req.plan!=="premium"){

        const listingCount = await prisma.listing.count({where:{ownerId:userId}})
        if(listingCount>=5){
            return res.status(400).json({message:"you have reached the free listing limit"})
        }

    }
    
    if(!req.body.accountDetails){
        return res.status(400).json({message:"Missing account details"})
    }
    
    const accountDetails = JSON.parse(req.body.accountDetails)
    
    // Validate required fields
    if(!accountDetails.title || !accountDetails.platform || !accountDetails.niche || !accountDetails.price){
        return res.status(400).json({message:"Missing required fields: title, platform, niche, or price"})
    }
    
    accountDetails.followers_count = parseFloat(accountDetails.followers_count) || 0
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate) || 0
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views) || 0
    accountDetails.price = parseFloat(accountDetails.price)
    accountDetails.platform = accountDetails.platform.toLowerCase()
    accountDetails.niche = accountDetails.niche.toLowerCase()
    
    // Safely handle username
    if(accountDetails.username && typeof accountDetails.username === 'string' && accountDetails.username.startsWith("@")){
        accountDetails.username = accountDetails.username.slice(1)
    }
    
    // Set default age_range if not provided
    if(!accountDetails.age_range){
        accountDetails.age_range = "mixed age range"
    }

    let images = []
    if(req.files && req.files.length > 0){
        try {
            const uploadedImages = req.files.map(async(file)=>{
                try {
                    if(!file.path){
                        throw new Error('File path is missing')
                    }
                    const response = await imageKit.upload({
                        file: fs.createReadStream(file.path),
                        fileName: `${Date.now()}-${file.originalname}`,
                        folder:"flip-earn",
                        transformation:{pre:"w-1280,h-auto"}
                      });
                      return response.url
                } catch (error) {
                    console.error('ImageKit upload error for file:', file.originalname, error)
                    // Return null for failed uploads, we'll filter them out
                    return null
                }
            })
            //Wait for all uploads to complete
            const uploadResults = await Promise.all(uploadedImages)
            images = uploadResults.filter(url => url !== null)
        } catch (error) {
            console.error('Error uploading images:', error)
            // Continue without images if upload fails
            images = []
        }
    }
    try {
        const listing = await prisma.listing.create({
            data:{
                ownerId:userId,
                images,
                ...accountDetails
            }
        })
        return res.status(201).json({message:"Account Listed successfully",listing})
    } catch (dbError) {
        console.error('Database error:', dbError)
        // Handle Prisma validation errors
        if(dbError.code === 'P2002'){
            return res.status(400).json({message:"A listing with this information already exists"})
        }
        if(dbError.code === 'P2003'){
            return res.status(400).json({message:"Invalid reference: owner not found"})
        }
        throw dbError
    }


  } catch (error) {
    console.error('Error in addListing:', error)
    res.status(500).json({message:error.code||error.message||"Internal server error"})
   } 
    
}


//controller for getting all public listing
export const getAllPublicListing = async(req,res)=>{
    try {
        const listings = await prisma.listing.findMany({
            where:{status:"active"},
            include:{owner:true},
            orderBy:{createdAt:"desc"}
        })
        if(!listings||listings.length===0){
            return res.json({listings:[]})
        }
        return res.json({listings})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
    }
}


// todo controller for getting all user listing

export  const getAllUserListings = async(req,res)=>{
    try {
        const {userId} = await req.auth()
        // get al listings except deleted
        const listing = await prisma.listing.findMany({
            where:{ownerId:userId,status:{not:'deleted'}},
            orderBy:{createdAt:"desc"},
        })
        const user = await prisma.user.findUnique({
            where:{id:userId}
        })
        const balance = {
            earned:user.earned,
            withdrawn:user.withdrawn,
            available:user.earned-user.withdrawn,
        }
        if(!listing||listing.length===0){
            return res.json({listing:[],balance})
        }
        return res.json({listing,balance})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
    }

    
   

}


//* controler for updating listing in Database
export const updateListing = async(req,res)=>{
   try {
    const {userId} = await req.auth()
    const accountDetails = JSON.parse(req.body.accountDetails)
    if((req.files?.length || 0) + (accountDetails.images?.length || 0) > 5){
        return res.status(400).json({message:"you can only upload up to 5 images only"})
    }
    accountDetails.followers_count = parseFloat(accountDetails.followers_count)
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate)
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views)
    accountDetails.price = parseFloat(accountDetails.price)
    accountDetails.platform = accountDetails.platform.toLowerCase()
    accountDetails.niche = accountDetails.niche.toLowerCase()
    accountDetails.username.startsWith("@")?accountDetails.username = accountDetails.username.slice(1):null

    const listing = await prisma.listing.update({
        where:{id:accountDetails.id,ownerId:userId},
        data:accountDetails
    })
    if(!listing){
        return res.status(404).json({message:"listing Not Found"})

    }
    if(listing.status=='sold'){
        return res.status(400).json({message:"You can't update sold listing"})
    }
    if(req.files && req.files.length>0){
        const uploadedImages = req.files.map(async(file)=>{
            const response =await imageKit.upload({
                file:fs.createReadStream(file.path  ),
                fileName:`${Date.now()}.png`,
                folder:"flip-earn",
                transformation:{pre:'w-180,h-auto'},
            })
            return response.url
        })
        // wait for all uploads to complete

        const images = await Promise.all(uploadedImages)
        const updatedListing = await prisma.listing.update({
            where:{id:accountDetails.id,ownerId:userId},
            data:{
                ownerId:userId,
                ...accountDetails,
                images:[...(accountDetails.images || []),...images]
            }
        })
        return res.json({message:'Account Update successfully',listing:updatedListing})
    }
    return res.json({message:'Accoutn Update successfully',listing})
    
   } catch (error) {
    console.log(error)
    res.status(500).json({message:error.code||error.message})
   }
}

//!  controller for change toggle status
export const toggleStatus = async (req, res) => {
    try {
        const { userId } = await req.auth()
        const { id } = req.params

        // Find listing for this user and id
        const listing = await prisma.listing.findFirst({
            where: { id, ownerId: userId }
        })

        if (!listing) {
            return res.status(404).json({ message: "listing Not Found" })
        }

        if (listing.status === 'active' || listing.status === 'inactive') {
            const updatedListing = await prisma.listing.update({
                where: { id },
                data: { status: listing.status === "active" ? "inactive" : "active" }
            })
            return res.json({ message: "listing status updated successfully", listing: updatedListing })
        } else if (listing.status === "ban") {
            return res.status(400).json({ message: "Your listing is banned" })
        } else if (listing.status === "sold") {
            return res.status(400).json({ message: "Your listing is sold" })
        }

        return res.json({ message: "listing status unchanged", listing })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.code || error.message })
    }
}

// controler for deleting listing from databse
export const deleteListing = async (req,res)=> {
    try {
        const  {userId} = await req.auth()
        const { listingId } = req.params
        const listing = await prisma.listing.findFirst({
            where:{id:listingId,ownerId:userId},
            include:{owner:true}
        })
        if(!listing){
            return res.status(400).json({message:"Listing Not Found"})
        }
        if(listing.status==='sold'){
            return res.status(400).json({message:"Sold Lising can't be deleted"})
        }

    
        //? If password has been changed, send the new password to the owner
        if(listing.isCredentialChanged){
            //send emai to owner
        }
        await prisma.listing.update({
            where:{id:listingId},
            data:{status:'deleted'}
        })
        return res.json({message:"Listing Deleted successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
    }
}

//todo controler for adding credential
export const addCredential  = async(req,res)=>{
    try {
    const {userId} = await req.auth()    
        const {listingId, credential} = req.body
        if(credential.length===0||!listingId){
            return res.status(400).json({message:"Missing Fileds"})
        }
        const listing = await prisma.listing.findFirst({
            where:{id:listingId,ownerId:userId}
        })
        if(!listing){
            return res.status(400).json({message:"Listing not found or your are not the owner"})
        }
        await prisma.credential.create({
            data:{
                listingId,
                originalCredential:credential,

            }
        })
        await prisma.listing.update({
            where:{id:listingId},
            data:{isCredentialSubmitted:true}
        })
        return res.json({message:"credential added successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
     
    }
    
}


//controller for markfeatured

export const markFeatured = async (req,res) => {
    try {
        const {id} = req.params;
        const {userId} = await req.auth()
        if (req.plan!=="premium"){
            return res.status(400).json({message:"premium Plan required"})
        }

        //Uset all other featured listing

        await prisma.listing.updateMany({
            where:{ownerId:userId},
            data:{featured:false}
        })
        // mark the listing as featured
        await prisma.listing.update({
            where:{id},
            data:{featured:true}
        })
        return res.json({message:"Listing marked as featured"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
    
    }
}

//! controoler for getAllUserOrders 

export const getAllUserOrders = async(req,res)=>{
   try {
    const {userId} = await req.auth()
    let orders = await prisma.transaction.findMany({
        where:{userId,isPaid:true},
        include:{listing:true}

    })
    if(!orders||orders.length===0){
        return req.json({orders:[]})
    }
    //attach the credential to each order
    const credentials =  await prisma.credential.findMany({
        where:{listingId:{in:orders.map((order)=>order.listingId)}}

    })
    const ordersWithCredentials = order.map((order)=>{
        const credential = credentials.find((cred)=>cred.listingId===order.listingId)
        return {...order,credential}
    })
    return res.json({orders:ordersWithCredentials})
   } catch (error) {
    console.log(error)
    res.status(500).json({message:error.code||error.message})

   } 
}

//controllers for withdraw ammoount
export const withdrawAmount = async (req,res) => {
    try {
        const {userId} = await req.auth()
        const  {amount,account} = req.body
        const user = await prisma.user.findUnique({where:{iid:userId}})
        const balance = user.earned  -  user.withdrawn
        if(amount > balance){
            return res.status(400).json({message:"InSufficent balance"})
        }
        const withdrawal = await prisma.withdrawal.create({
            data:{
                userId,amount,account
            }
            
        })
        await prisma.update({
            where:{id:userId},
            data:{withdrawn:{increment:amount}}
        })
        return res.json({message:"Appied for withdrawal",withdrawal})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.code||error.message})
    }
    
}


//* controller for purchase account

export const purchaseAccount = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}