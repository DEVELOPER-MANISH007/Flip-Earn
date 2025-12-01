import React, { useState } from "react";
import { ArrowLeftIcon, FilterIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import FilterSideBar from "../components/FilterSideBar";

const MarketPlace = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const navigate = useNavigate();
  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filter, setFilter] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  });
  const { listings } = useSelector((state) => state.listings);
  const filterListings = listings.filter((listing) => {
    const activePlatforms = filter.platform || [];
    if (
      activePlatforms.length > 0 &&
      !activePlatforms.includes(listing.platform)
    ) {
      return false;
    }

    const maxPriceLimit = Number.isFinite(Number(filter.maxPrice))
      ? Number(filter.maxPrice)
      : 100000;
    if (listing.price > maxPriceLimit) {
      return false;
    }

    const minFollowersRequired = Number(filter.minFollowers) || 0;
    if (listing.followers_count < minFollowersRequired) {
      return false;
    }

    if (filter.niche) {
      if (Array.isArray(filter.niche)) {
        if (!filter.niche.includes(listing.niche)) return false;
      } else if (listing.niche !== filter.niche) {
        return false;
      }
    }

    if (filter.verified && listing.verified !== filter.verified) return false;
    if (filter.monetized && listing.monetized !== filter.monetized)
      return false;
    if (search) {
      const trimed = search.trim();
      if (
        !listing.title.toLowerCase().includes(trimed.toLocaleLowerCase()) &&
        !listing.username.toLowerCase().includes(trimed.toLocaleLowerCase()) &&
        !listing.platform.toLowerCase().includes(trimed.toLocaleLowerCase()) &&
        !listing.description
          .toLowerCase()
          .includes(trimed.toLocaleLowerCase()) &&
        !listing.niche.toLowerCase().includes(trimed.toLocaleLowerCase())
      )
        return false;
    }

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
        <footer className="bg-white border-t border-gray-200 p-4 text-center mt-28">
          <p className="text-sm text-gray-500">
            © 2025 <span className="text-blue-600">Manish.Dev</span>. All rights reserved.
          </p>
        </footer>
      </div>
      
    </div>
  );
};

export default MarketPlace;
