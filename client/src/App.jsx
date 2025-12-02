import React from 'react'
import {Route,Routes, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import ListingDetails from './pages/ListingDetails'
import Loading from './pages/Loading'
import ManageListing from './pages/ManageListing'
import MarketPlace from './pages/MarketPlace'
import Messages from './pages/Messages'
import MyOrders from './pages/MyOrders' 
import Navbar from './components/Navbar'
import MyListings from './pages/MyListings'
import ChatBox from './components/ChatBox'
import {Toaster} from 'react-hot-toast'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import CredentialVerify from './pages/admin/CredentialVerify'
import CredentialChange from './pages/admin/CredentialChange'
import Transactions from './pages/admin/Transactions'
import AllListings from './pages/admin/AllListings'
import Withdrawal from './pages/admin/Withdrawal'




const App = () => {
  const {pathname} = useLocation()

  return (
   <div>
    <Toaster/>
    {!pathname.includes('/admin') && <Navbar/>}
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/marketplace' element={<MarketPlace />} />
      <Route path='/my-listings' element={<MyListings />} />
      <Route path='/listing/:listingId' element={<ListingDetails />} />
      <Route path='/create-listing' element={<ManageListing/>} />
      <Route path='/edit-listing/:id' element={<ManageListing/>} />
      
      <Route path='/messages' element={<Messages />} />
      <Route path='/my-orders' element={<MyOrders />} />
      <Route path='/loading' element={<Loading />} />
      <Route path='/admin' element={<Layout />} >
      <Route index element={<Dashboard/>}/>
      <Route path='verify-credentials' element={<CredentialVerify/>}/>
      <Route path='change-credentials' element={<CredentialChange/>}/>
      <Route path='list-listings' element={<AllListings/>}/>
      <Route path='transactions' element={<Transactions/>}/>
      <Route path='withdrawal' element={<Withdrawal/>}/>
      </Route>



    </Routes>
    <ChatBox/>
   </div>
  )
}

export default App