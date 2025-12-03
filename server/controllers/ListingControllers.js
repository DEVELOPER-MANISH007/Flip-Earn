import prisma from '../config/prisma.js'

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
    const accountDetails = JSON.parse(req.body.accountDetails)
    accountDetails.followers_count = parseFloat(accountDetails.followers_count)
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate)
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views)
    accountDetails.price = parseFloat(accountDetails.price)
    accountDetails.platform = accountDetails.platform.toLowerCase()
    accountDetails.niche = accountDetails.niche.toLowerCase()
    accountDetails.username.startsWith("@")?accountDetails.username = accountDetails.username.slice(1):null

    const uploadedImages = req.files.map(file=>file.path)
    const listing = await prisma.listing.create({
        data:{
            ownerId:userId,
            title:accountDetails.title,
            platform:accountDetails.platform,
            username:accountDetails.username,
            followers_count:accountDetails.followers_count,
        }
    })
    return res.status(201).json({message:"Listing created successfully",listing})
   } catch (error) {
    console.log(error)
   } 
    
}