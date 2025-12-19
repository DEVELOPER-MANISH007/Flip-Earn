import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, FilterIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ListingCard from "../components/ListingCard";
import FilterSideBar from "../components/FilterSideBar";
import { getAllPublicLising } from "../App/Features/ListingSlice";

const MarketPlace = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(getAllPublicLising());
  }, [dispatch]);

  const filterListings = (listings || []).filter((listing) => {
    if (filter.platform?.length && !filter.platform.includes(listing.platform))
      return false;
    if (listing.price > Number(filter.maxPrice || 100000)) return false;
    if (listing.followers_count < Number(filter.minFollowers || 0)) return false;
    if (filter.niche && listing.niche !== filter.niche) return false;
    if (filter.verified && !listing.verified) return false;
    if (filter.monetized && !listing.monetized) return false;

    if (search) {
      const term = search.toLowerCase();
      if (
        !listing.title?.toLowerCase().includes(term) &&
        !listing.username?.toLowerCase().includes(term) &&
        !listing.platform?.toLowerCase().includes(term) &&
        !listing.description?.toLowerCase().includes(term) &&
        !listing.niche?.toLowerCase().includes(term)
      )
        return false;
    }
    return true;
  });

  return (
    // 🔥 KEY FIX: full height layout
    <div className="min-h-screen flex flex-col px-6 md:px-16 lg:px-24 xl:px-32">
      
      {/* ---------------- HEADER ---------------- */}
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

        {listings && listings.length > 1 && (
          <button
            onClick={() => setShowFilterPhone(true)}
            className="flex sm:hidden items-center gap-2 py-5"
          >
            <FilterIcon className="size-4" />
            Filter
          </button>
        )}
      </div>

      {/* ---------------- MAIN CONTENT (flex-1) ---------------- */}
      <div className="flex-1 flex relative items-start gap-8 pb-8">
        {listings && listings.length > 1 && (
          <FilterSideBar
            showFilterPhone={showFilterPhone}
            setShowFilterPhone={setShowFilterPhone}
            filter={filter}
            setFilter={setFilter}
          />
        )}

        <div className="flex-1 grid xl:grid-cols-2 gap-4">
          {filterListings
            .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
            .map((listing, index) => (
              <ListingCard listing={listing} key={listing.id || index} />
            ))}
        </div>
      </div>

      {/* ---------------- FOOTER (ALWAYS BOTTOM) ---------------- */}
      <footer className="border-t border-gray-200 py-4 text-center">
        <p className="text-sm text-gray-500">
          © 2025 <span className="text-blue-600">Manish.Dev</span>. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default MarketPlace;
