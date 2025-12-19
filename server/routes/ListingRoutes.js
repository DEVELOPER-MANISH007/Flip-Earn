import  express from 'express'
import { addCredential, addListing, deleteListing, getAllPublicListing, getAllUserListings, getAllUserOrders, markFeatured, purchaseAccount, toggleStatus, updateListing } from '../controllers/ListingControllers.js'
import {protect} from '../middlewares/authMiddleware.js'
import upload from '../config/Multer.js'
const listingRouter = express.Router()

listingRouter.post('/',upload.array("images",5),protect,addListing)
listingRouter.put('/',upload.array("images",5),protect,updateListing)
listingRouter.get('/public',getAllPublicListing)
listingRouter.get('/user',protect,getAllUserListings)
listingRouter.get('/:id/status',protect,toggleStatus)
listingRouter.delete('/:listingId',protect,deleteListing)
listingRouter.post('/add-credentials',protect,addCredential)
listingRouter.put('/featured/:id',protect,markFeatured)
listingRouter.get('/user-orders',protect,getAllUserListings)
listingRouter.get('/withdraw',protect,getAllUserOrders)
listingRouter.post('/purchase-account/:listingId',protect,purchaseAccount)

export default  listingRouter