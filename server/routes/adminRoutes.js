import express from 'express'
import { protectAdmin } from '../middlewares/authMiddleware.js'
import { isAdmin, getDashboard, getAllListings, getAllUnverifiedListings, getAllTransactions, getWithdrawRequests, markWithdrawalAsPaid, getAllUnchangedListings,  changesStatus, getCredentials, markCredentialsVerified, changeCredential } from '../controllers/Admincontroler.js'



const adminRouter = express.Router()

adminRouter.get('/isAdmin',protectAdmin,isAdmin)
adminRouter.get('/dashboard',protectAdmin,getDashboard)
adminRouter.get('/all-listings',protectAdmin,getAllListings)
adminRouter.put('/change-status/:listingId',protectAdmin,changesStatus)
adminRouter.get('/unverified-listings',protectAdmin,getAllUnverifiedListings)
adminRouter.get('/credential/:listingId',protectAdmin,getCredentials)
adminRouter.put('/verify-credential/:listingId',protectAdmin,markCredentialsVerified)
adminRouter.get('/unchanged-listings',protectAdmin,getAllUnchangedListings)

adminRouter.put('/change-credential/:listingId',protectAdmin,changeCredential)
adminRouter.get('/transactions',protectAdmin,getAllTransactions)
adminRouter.get('/withdrawal-requests',protectAdmin,getWithdrawRequests)
adminRouter.put('/withdrawal-mark/:id',protectAdmin,markWithdrawalAsPaid)








export default adminRouter
