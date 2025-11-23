import { Filter, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSideBar = ({showFilterPhone,setShowFilterPhone,filter,setFilter,}) => {

  const [search,setSearch] = useState(searchParams.get('search')|| "")
  const [searchParams,setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const onChangeSearch = (e)=>{
    if(e.target.value){
      setSearchParams({search:e.target.value})
    setSearch(e.target.value)
  }else{
   navigate('/marketplace')
   setSearch('')
  }
  }
  return (
    <>
      {/* Mobile Backdrop */}
      {showFilterPhone && (
        <div
          className="fixed inset-0 bg-black/50 z-90 sm:hidden"
          onClick={() => setShowFilterPhone(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div
        className={`${
          showFilterPhone
            ? "max-sm:fixed max-sm:inset-y-0 max-sm:left-0 max-sm:w-full max-sm:z-100"
            : "max-sm:hidden"
        } max-sm:overflow-y-auto bg-white sm:rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 w-full sm:w-auto md:min-w-[300px] sm:max-w-sm`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-700">
              <Filter className="size-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <X
                onClick={() => setShowFilterPhone(false)}
                className="size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              />
              <button
                onClick={() => setShowFilterPhone(false)}
                className="sm:hidden text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar  ">
        {/* Search Bar */}
        <div className="flex items-center justify-between">
          <input type="text" placeholder="Search by username,platform,niche,etc.." className="w-full text-sm px-3 border border-gray-300 rounded-md outline-indigo-500" onChange={onChangeSearch} value={search} />

        </div>
        {/* Platfrom filter */}
        
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSideBar;
