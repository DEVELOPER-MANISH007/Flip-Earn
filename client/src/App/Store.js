import {configureStore} from "@reduxjs/toolkit"
import listingReducer from './Features/ListingSlice'

export const store = configureStore({
    reducer:{
        listings: listingReducer
    }
})