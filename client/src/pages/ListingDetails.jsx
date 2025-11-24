import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { assets, getProfileLink, platformIcons } from "../assets/assets";
import { useSelector } from "react-redux";
import {
  ArrowLeftIcon,
  ArrowUpRightFromSquare,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSignIcon,
  Eye,
  LineChart,
  Loader2Icon,
  Users,
} from "lucide-react";

const ListingDetails = () => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [listing, setListing] = useState(null);

  const profieLink =
    listing && getProfileLink(listing.platform, listing.username);
  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listings);
  const [current, setCurrent] = useState(0);
  const images = listing?.images || [];
  const prevSlide=()=>{
    setCurrent((prev)=>(prev===0?images.length-1: prev-1))
  }
  const nextSlide=()=>{
    setCurrent((prev)=>(prev===images.length-1?0: prev+1))
  }


  useEffect(() => {
    const listing = listings.find((listing) => listing.id === listingId);
    if (listing) {
      setListing(listing);
      setCurrent(0);
    }
  }, [listingId, listings]);

  return listing ? (
    <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 py-5"
      >
        <ArrowLeftIcon className="size-4" />
        Go to Previous Page
      </button>

      <div className="flex items-start max-md:flex-col gap-10">
        <div className="flex-1 max-md:w-full">
          {/* --------top section----------- */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl">
                  {platformIcons[listing.platform]}
                </div>
                <div>
                  <h2 className="flex items-center  text-xl font-semibold text-gray-800">
                    {listing.title}
                    <Link target="_blank" to={profieLink}>
                      <ArrowUpRightFromSquare className="size-4 hover:text-indigo-600" />
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm">
                    @{listing.username} •{" "}
                    {listing.platform?.charAt(0).toUpperCase() +
                      listing.platform?.slice(1)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {listing.verified && (
                      <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 rounded-md py-1 ">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {listing.monetized && (
                      <span className="flex items-center text-xs bg-green-50 text-green-600 px-2 rounded-md py-1 ">
                        <DollarSignIcon className="w-3 h-3 mr-1" />
                        Monetized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Pricing */}
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-800">
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">USD</p>
              </div>
            </div>
          </div>

          {/* Screen shot section */}
       
            {images?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 mb-5 overflow-hidden">
                <div className="p-4">
                  <h4>Screenshots & Proof</h4>
                </div>
                {/* ---Sidebar container */}
                <div className="relative w-full aspect-video overflow-hidden">
                <div
                  className="flex transition-transform  duration-300 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <img
                      src={img}
                      key={index}
                      alt="Listing Proof"
                      className="w-full shrink-0"
                    />
                  ))}
                </div>
                {/* navigation buttons */}
                <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow">
                  <ChevronRightIcon className="w-5 h-5 text-gray-700 "/>
                </button>

                <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow">
                  <ChevronLeftIcon className="w-5 h-5 text-gray-700 "/>
                </button>

                {/* dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index)=>(
                    <button onClick={()=>setCurrent(index)}  key={index} className={`w-2.5 h-2.5 rounded-full ${current===index?"bg-indigo-500":"bg-gray-300"}`}/>
                  ))}
                </div>

              </div>
              </div>
            )}
  {/* account metrics */}
          <div className="bg-white rounded-xl border border-gray-200 mb-5">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-gray-800">Account Metrcs</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center">
              <div>
                <Users className="mx-auto text-gray-400 w-5 h-5 mb-1"/>
                <p className="font-semibold text-gray-800">{listing.followers_count?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 ">Followers</p>
              </div>
              <div>
                <LineChart className="mx-auto text-gray-400 w-5 h-5 mb-1"/>
                <p className="font-semibold text-gray-800">{listing.engagement_rate}%</p>
                <p className="text-sm text-gray-500 ">Engagement</p>
              </div>
              <div>
                <Eye className="mx-auto text-gray-400 w-5 h-5 mb-1"/>
                <p className="font-semibold text-gray-800">{listing.monthy_views?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 "> Monthly Views</p>
              </div>
              <div>
                <Calendar className="mx-auto text-gray-400 w-5 h-5 mb-1"/>
                <p className="font-semibold text-gray-800">{listing.createdAt ? new Date(listing.createdAt).toDateString() : 'N/A'}</p>
                <p className="text-sm text-gray-500 ">Listed</p>
              </div>

            </div>

          </div>
          {/* Descriptionn */}

          </div>
        </div>
        {/* Seller inof & purachse options */}
        <div></div>
      </div>
    
  ) : (
    <div className="h-screen flex justify-center items-center">
      <Loader2Icon className="size-7 animate-spin text-indigo-600" />
    </div>
  );
};

export default ListingDetails;
