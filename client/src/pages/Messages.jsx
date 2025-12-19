import React, { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import {format,isToday,isYesterday,parseISO} from 'date-fns'
import { useDispatch } from 'react-redux'
import { setChat } from '../App/Features/chatSlice'
import { useAuth, useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import api from '../configs/axios'


const Messages = () => {
  const dispatch =  useDispatch()
  const {getToken} = useAuth()
  const { user, isLoaded } = useUser()
  
  const [chats,setChats]= useState([])
  const [searchQuery,setSearchQuery] = useState('')
  const [loading,setLoading] = useState(true)

  const formatTime = (dateString)=>{
    if(!dateString) return;

    const date = parseISO(dateString)
    if(isToday(date)){
      return 'Today ' + format(date,'HH:mm')
    }
    if(isYesterday(date)){
      return 'Yesterday ' + format(date,"HH:mm")
    }
      return format(date,"MMM d")
  }

  const handleOpenChats = (chat)=>{
          dispatch(setChat({listing:chat.listing,chatId:chat.id}))
  }


 
  const fetchUserChats = async () => {
    try {
      const token  = await getToken()
      const {data} = await api.post('/api/chat/user',{},{headers:{Authorization:`Bearer ${token}`}})
      setChats(data?.chats)
      setLoading(false)
    } catch (error) {
      toast.error(error?.response?.data?.message||error.message)
      console.log(error)
      
    }
  }




  const filteredChats = useMemo(()=>{
    if(!Array.isArray(chats)) return []
    const query = searchQuery.toLocaleLowerCase()
    return chats.filter((chat)=>{
      const chatUser= chat.chatUserId===user?.id? chat?.ownerUser:chat?.chatUser
      return chat.listing?.title.toLowerCase().includes(query)|| chatUser?.name?.toLocaleLowerCase().includes(query)
    })

  },[chats,searchQuery,user])




  useEffect(()=>{
    if(user && isLoaded){
      fetchUserChats()
    const interval  = setInterval(()=>{
      fetchUserChats()
    },10*1000)
    return ()=>clearInterval(interval)
    }
  },[user,isLoaded])




  return (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='py-10'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Messages</h1>
          <p className='text-gray-600'>chat with buyers and Sellers</p>
        </div>
      
      {/* Search bar */}

    <div className='relative max-w-xl mb-8'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'/>
      <input type="text" placeholder='Search conversation...' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-indigo-500' />
    </div>

{/* Chat List */}

      {loading?(
        <div className='text-center text-gray-500 py-20'>Loading message...</div>
      ):filteredChats.length === 0?(
        <div className='bg-white rounded-lg shadow-xs border border-gray-200 p-16 text-center'>
            <div>
              <MessageCircle className='w-8 h-8 text-gray-400'/>
            </div>
            <h3 className='text-xl font-medium text-gray-800 mb-2'>{searchQuery?"NO chats found":"No Messages Yet"}</h3>
            <p className='text-gray-600'>
              {searchQuery? "Try a different Search term":'Start a conversation by viewing a listing and clicking "chat with Seller" '}
            </p>
        </div>
      ):(
        <div className='bg-white rounded-lg shadow-xs border border-gray-200 divide-y divide-gray-200'>
          {
            filteredChats.map((chat)=>{
              const chatUser = chat.chatUserId === user?.id?chat.ownerUser:chat.chatUser;
              return (
                <button 
                onClick={()=>handleOpenChats(chat)}
                key={chat.id} className='w-full p-4 hover:bg-gray-50 transition-colors text-left'>
                  <div className='flex items-center space-x-4'>
                    <div className='shrink-0'>
                      <img className='w-12 h-12 rounded-lg object-cover' src={chatUser?.image}alt={chat?.chatUser?.name} />
                    </div>
                    <div className='flex-1 min-w-0 space-y-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <h3 className='font-semibold text-gray-800 truncate'>{chat.listing?.title}</h3>
                        <span className='text-xs text-gray-500 shrink-0'>{formatTime(chat.updatedAt)}</span>
                      </div>
                      <p className='text-sm text-gray-600 truncate'>{chatUser?.name}</p>
                      <p className={`text-sm truncate ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>

                  </div>

                </button>
              )
            })
          }

        </div>
      )
      }



      </div>

    </div>
  )
}

export default Messages