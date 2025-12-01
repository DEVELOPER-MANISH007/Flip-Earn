import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

const ManageListing = () => {
  const {id} = useParams()
  const { userListings } = useSelector((state) => state.listings);
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate()

  const [loadingListing,setLoadingListing] = useState(false)
  const [isEditing,setIsEditing] = useState(false)

  const [fromData,setFormData] = useState({
    title:'',
    platform:'',
    username:'',
    followers_count:'',
    engagement_rate:'',
    monthly_views:'',
    niche:'',
    price:'',
    description:'',
    verified:false,
    monetized:false,
    country:'',
    age_range:'',
    images:[],
  })

  const platforms =[ 'youtube','instagram','tiktok','facebook','twitter','linkedin','twitch','discord','pinterest','snapchat']
  const niches =[ 'lifestyle','fitness','food','travel','tech','gaming','fashion','beauty','business','education','entertainment','music','art','sports','health','finance','other']

  const ageRanges = ['13-17 years','18-24 years','25-34 years','35-44 years','45-54 years','55-64 years','65+ years','mixed age range']
  
  const handleInputChange = (field,value)=>{
    setFormData((prev)=>({...prev,[field]:value}))
  }

  const handleImageUpload  = async(e)=>{
    const files = Array.from(e.target.files)
    if(!files.length) return;
    if(files.length+fromData.images.length>5) return toast.error('You can add up to 5 images')
      setFormData((prev) => ({ ...prev,images: [...prev.images, ...files]}));
      
  }

  const removeImage = (indexToRemove)=>{
    setFormData((prev)=>({
      ...prev,images:prev.images.filter((_,i)=>i!== indexToRemove)
    }))
  }

  //todo get listing data for edit if `id` is provided (edit-Mode) 
  useEffect(()=>{
    if(!id) return
    setIsEditing(true)
    setLoadingListing(true)
    const listing  = userListings.find((listing)=>listing.id===id)
    if(listing){
      setFormData(listing)
      setLoadingListing(false)
    }else{
      toast.error('Listing not found')
      navigate('/my-listings')
    }

  },[id])


  const handlesubmit = async(e)=>{
    e.preventDefault()
  }
  if(loadingListing){
    return (
      <div className='h-screen items-center justify-center'>
        <Loader2Icon className='size-7 animate-spin text-indigo-600'/>

      </div>
    )
  }


  return (
    <div>

    </div>
  )
}

export default ManageListing