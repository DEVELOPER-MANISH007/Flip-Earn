import React, { useState } from "react";
import { ArrowLeftIcon, FilterIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import FilterSideBar from "../components/FilterSideBar";

const MarketPlace = () => {
  const navigate = useNavigate();
  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filter, setFilter] = useState({
    plateform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  });
  const { listings } = useSelector((state) => state.listings);
  const filterListings = listings.filter((listing) => {
    return true;
  });

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex items-center justify-between text-slate-500">
        <button
          className="flex items-center gap-2 py-5"
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
        >
          <ArrowLeftIcon className="size-4" />
          Back to Home
        </button>
        <button
          onClick={() => setShowFilterPhone(true)}
          className="flex sm:hidden items-center gap-2 py-5"
        >
          <FilterIcon className="size-4" />
          Filter
        </button>
      </div>
      <div>
        <div className="flex relative items-start justify-between gap-8 pb-8">
          <FilterSideBar
            showFilterPhone={showFilterPhone}
            setShowFilterPhone={setShowFilterPhone}
            filter={filter}
            setFilter={setFilter}
          />
          <div className="flex-1 grid xl:grid-cols-2 gap-4">
            {filterListings
              .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
              .map((listing, index) => (
                <ListingCard listing={listing} key={listing.id || index} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
