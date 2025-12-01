import {configureStore} from "@reduxjs/toolkit"
import listingReducer from './Features/ListingSlice'
import chatReducer from './Features/chatSlice'

export const store = configureStore({
    reducer:{
        listings: listingReducer,
        chat:chatReducer
    }
})