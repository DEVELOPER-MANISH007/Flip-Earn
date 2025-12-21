import {clerkClient} from '@clerk/express'

export const protect = async(req,res,next)=>{
    try {
        const {userId,has} = await req.auth()
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }
        const hasPremiumPlan = await has({plan:"premium"})
        req.plan = hasPremiumPlan?'premium':'free'
        return next()
    } catch (error) {
        console.log(error)
        res.status(401).json({message:error.code||error.message})
    }
}


export const protectAdmin = async(req,res,next)=>{
    try {
        const auth = await req.auth()
        if(!auth || !auth.userId){
            return res.status(401).json({message:"Unauthorized - No userId"})
        }
        
        const user = await clerkClient.users.getUser(auth.userId)
        if(!user || !user.emailAddresses || user.emailAddresses.length === 0){
            return res.status(401).json({message:"Unauthorized - No email found"})
        }
        
        const userEmail = user.emailAddresses[0].emailAddress
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim()) || []
        
        // Debug logging (remove in production)
        console.log("User Email:", userEmail)
        console.log("Admin Emails:", adminEmails)
        console.log("Is Admin:", adminEmails.includes(userEmail))
        
        const isAdmin = adminEmails.includes(userEmail)
        if(!isAdmin){
            return res.status(401).json({message:"Unauthorized - Not an admin"})
        }
        return next()
    } catch (error) {
        console.log("Admin Auth Error:", error)
        res.status(401).json({message:error.code||error.message})
    }
}