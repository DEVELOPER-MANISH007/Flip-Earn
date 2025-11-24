import { ChevronDown, Filter, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSideBar = ({
  showFilterPhone,
  setShowFilterPhone,
  filter,
  setFilter,
}) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [expandedSection, setExpandedSections] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true,
  });

  const navigate = useNavigate();

  // Search text update
  const onChangeSearch = (e) => {
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
      setSearch(e.target.value);
    } else {
      navigate("/marketplace");
      setSearch("");
    }
  };

  // Toggle expand/collapse
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Global filter update
  const onFilterChange = (newFilters) => {
    setFilter({ ...filter, ...newFilters });
  };

  const onClearFilters = ()=>{
    if(search){
      navigate("/marketplace")
    }
    setFilter({
      platform:null,
      maxPrice:100000,
      minFollowers:0,
      niche:null,
      verified:false,
      monetized:false,
    })
  }

  const platforms = [
    { value: "youtube", label: "Youtube" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "Tiktok" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "Linkedin" },
    { value: "twitch", label: "Twitch" },
    { value: "discord", label: "Discord" },
  ];

  const niches = [
    { value: "lifeStyle", label: "LifeStyle" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "tech", label: "Tech" },
    { value: "gaming", label: "Gaming" },
    { value: "fashion", label: "Fashion" },
    { value: "beauty", label: "Beauty" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "sports", label: "Sports" },
    { value: "health", label: "Health" },
    { value: "finance", label: "Finance" },
  ];

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
                onClick={onClearFilters}
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

        {/* Content */}
        <div className="p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar">
          {/* Search */}
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search by username, platform, niche, etc.."
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500"
              onChange={onChangeSearch}
              value={search}
            />
          </div>

          {/* Platform Filter */}
          <div>
            <button
              onClick={() => toggleSection("platform")}
              className="flex items-center justify-between w-full mb-3"
            >
              <label className="text-sm font-medium to-gray-800">
                Platform
              </label>
              <ChevronDown
                className={`transition-transform size-4 ${
                  expandedSection.platform ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection.platform && (
              <div className="space-y-2">
                {platforms.map((p) => (
                  <label
                    key={p.value}
                    className="flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={filter.platform?.includes(p.value) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const current = filter.platform || [];

                        const updated = checked
                          ? [...current, p.value]
                          : current.filter((i) => i !== p.value);

                        onFilterChange({
                          platform: updated.length > 0 ? updated : null,
                        });
                      }}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Price range */}
          <div>
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full mb-3"
            >
              <label className="text-sm font-medium text-gray-800">
                Price Range
              </label>
              <ChevronDown
                className={`transition-transform size-4 ${
                  expandedSection.price ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection.price && (
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={filter.maxPrice ?? 100000}
                  onChange={(e) =>
                    onFilterChange({
                      maxPrice: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{currency}0</span>
                  <span>
                    {currency}
                    {(filter.maxPrice ?? 100000).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Followers range */}
          <div>
            <button
              onClick={() => toggleSection("followers")}
              className="flex items-center justify-between w-full mb-3"
            >
              <label className="text-sm font-medium text-gray-800">
                Followers
              </label>
              <ChevronDown
                className={`transition-transform size-4 ${
                  expandedSection.followers ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection.followers && (
              <select
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg outline-indigo-500"
                value={filter.minFollowers || 0}
                onChange={(e) =>
                  onFilterChange({
                    ...filter,
                    minFollowers: parseInt(e.target.value) || 0,
                  })
                }
              >
                <option value="0">Any amount</option>
                <option value="1000">1k</option>
                <option value="10000">10k</option>
                <option value="50000">50k</option>
                <option value="100000">100k</option>
                <option value="500000">500k</option>
                <option value="1000000">1M+</option>
              </select>
            )}
          </div>

          {/* Niche Filter */}
          <div>
            <button
              onClick={() => toggleSection("niche")}
              className="flex items-center justify-between w-full mb-3"
            >
              <label className="text-sm font-medium text-gray-800">Niche</label>
              <ChevronDown
                className={`transition-transform size-4 ${
                  expandedSection.niche ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection.niche && (
              <select
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg outline-indigo-500"
                value={filter.niche || 0}
                onChange={(e) =>
                  onFilterChange({ ...filter, niche: e.target.value || null })
                }
              >
                <option value="All niches">All niches</option>
                {niches.map((niche) => (
                  <option key={niche.value} value={niche.value}>
                    {niche.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* verification */}
          <div>
            <button
              onClick={() => toggleSection("status")}
              className="flex items-center justify-between w-full mb-3"
            >
              <label className="text-sm font-medium text-gray-800">
                Account Status
              </label>
              <ChevronDown
                className={`transition-transform size-4 ${
                  expandedSection.status ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSection.status && (
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filter.verified || false}
                    onChange={(e) =>
                      onFilterChange({ ...filter, verified: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Verified accounts only
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filter.monetized || false}
                    onChange={(e) =>
                      onFilterChange({ ...filter, monetized: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Monetized accounts only
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSideBar;
