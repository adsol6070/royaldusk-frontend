"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SkeletonLoader from "@/components/SkeletonLoader";
import { packageApi } from "@/common/api";
import ReveloLayout from "@/layout/ReveloLayout";
import { activityIcons } from "@/utility/activityIcons";
import styled, { keyframes } from "styled-components";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useCurrency } from "@/common/context/CurrencyContext";
import { CardWishlistButton } from "@/components/wishlistButton";

const bookNowAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: white;
  border-bottom: 1px solid #fed7aa;
  padding: 20px 0;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
`;

const QuickStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    text-align: center;

    .number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8853d;
      display: block;
    }

    .label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FilterSidebar = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  height: fit-content;
  position: sticky;
  top: 120px;

  @media (max-width: 1024px) {
    position: static;
    margin-bottom: 20px;
  }
`;

const FilterHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #fed7aa;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .clear-btn {
    background: none;
    border: none;
    color: #f8853d;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: #fef7f0;
    }
  }
`;

const FilterSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #fef7f0;

  &:last-child {
    border-bottom: none;
  }

  .filter-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 20px;
      height: 2px;
      background: #f8853d;
      border-radius: 1px;
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #fed7aa;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #f8853d;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  color: #64748b;

  .range {
    font-weight: 500;
    color: #f8853d;
  }
`;

const CurrencySelector = styled.div`
  margin-bottom: 12px;

  .currency-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 8px;
    display: block;
  }

  select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #fed7aa;
    border-radius: 4px;
    font-size: 13px;
    background: white;
    color: #374151;

    &:focus {
      outline: none;
      border-color: #f8853d;
      box-shadow: 0 0 0 2px rgba(248, 133, 61, 0.1);
    }
  }
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: color 0.2s ease;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #f8853d;
  }

  &:hover {
    color: #f8853d;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #fed7aa;
`;

const ResultsInfo = styled.div`
  .count {
    font-weight: 600;
    color: #1e293b;
  }

  .description {
    font-size: 14px;
    color: #64748b;
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .sort-label {
    font-size: 14px;
    color: #64748b;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #fed7aa;
    border-radius: 6px;
    font-size: 14px;
    background: white;

    &:focus {
      outline: none;
      border-color: #f8853d;
    }
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #fef7f0;
  border-radius: 6px;
  padding: 2px;

  button {
    padding: 8px 12px;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    color: #64748b;
    transition: all 0.2s ease;

    &.active {
      background: #f8853d;
      color: white;
      box-shadow: 0 1px 3px rgba(248, 133, 61, 0.3);
    }

    &:hover:not(.active) {
      color: #f8853d;
    }
  }
`;

const PackagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  &.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
`;

const PackageCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  .list-view & {
    display: grid;
    grid-template-columns: 300px 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-view & {
    display: flex;
    flex-direction: column;
  }

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 4px 20px rgba(248, 133, 61, 0.15);
  }
`;

const PackageImage = styled.div`
  position: relative;
  height: 250px;

  .grid-view & {
    height: 200px;
  }

  @media (max-width: 768px) {
    height: 200px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #059669;
  }

  .rating {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    gap: 2px;

    i {
      font-size: 12px;
      color: #f8853d;
    }
  }

  .wishlist-area {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
`;

const PackageContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;

  .grid-view & {
    padding: 20px;
  }
`;

const PackageHeader = styled.div`
  margin-bottom: 12px;

  .location {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 8px;

    i {
      color: #f8853d;
    }
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.4;

    .grid-view & {
      font-size: 1.1rem;
    }

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: #f8853d;
      }
    }
  }
`;

const PackageDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PackageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;

    i {
      color: #f8853d;
      width: 14px;
    }
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  .feature-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fef7f0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #475569;
    border: 1px solid #fed7aa;

    i {
      color: #f8853d;
      font-size: 11px;
    }
  }
`;

const PackageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #fef7f0;
`;

const PriceSection = styled.div`
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;

    .grid-view & {
      font-size: 1.3rem;
    }
  }

  .per-person {
    font-size: 12px;
    color: #64748b;
  }
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  font-weight: 500;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 14px;

  .grid-view & {
    padding: 10px 16px;
    font-size: 13px;
  }

  &.book-now {
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
    }

    &.animate {
      animation: ${bookNowAnimation} 0.5s ease;
    }
  }

  &.view-details {
    background: #fef7f0;
    color: #f8853d;
    border: 1px solid #fed7aa;

    &:hover {
      background: #f8853d;
      color: white;
      border-color: #f8853d;
      transform: translateY(-1px);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;

  .empty-icon {
    font-size: 4rem;
    color: #fed7aa;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.3rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    margin-bottom: 24px;
  }

  .reset-btn {
    background: #f8853d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e67428;
      transform: translateY(-1px);
    }
  }
`;

const CustomSlider = styled.div`
  .rc-slider {
    .rc-slider-track {
      background-color: #f8853d;
    }

    .rc-slider-handle {
      border-color: #f8853d;
      background-color: #f8853d;

      &:hover {
        border-color: #e67428;
      }

      &:focus {
        border-color: #e67428;
        box-shadow: 0 0 0 5px rgba(248, 133, 61, 0.2);
      }
    }

    .rc-slider-rail {
      background-color: #fef7f0;
    }
  }
`;

const FilterSidebarComponent = ({
  data = [],
  onFilterChange,
  onClearFilters,
}) => {
  const {
    selectedCurrency,
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencyInfo,
    baseCurrency,
  } = useCurrency();

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNights, setSelectedNights] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Convert all prices to selected currency for range calculation
  const convertedPrices = data.map((item) =>
    convertPrice(item.price, baseCurrency, selectedCurrency)
  );

  const maxPrice =
    convertedPrices.length > 0 ? Math.ceil(Math.max(...convertedPrices)) : 1000;

  const categories = Array.from(
    new Set(data.map((item) => item.category?.name))
  ).filter(Boolean);
  const locations = Array.from(
    new Set(data.map((item) => item.location?.name))
  ).filter(Boolean);
  const nightsOptions = Array.from(
    new Set(data.map((item) => Math.max(1, item.duration - 1)))
  ).sort((a, b) => a - b);

  // Available currencies
  const availableCurrencies = [
    { code: "AED", name: "UAE Dirham" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "SAR", name: "Saudi Riyal" },
  ];

  // Reset price range when currency changes
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice, selectedCurrency]);

  useEffect(() => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      nights: selectedNights,
      locations: selectedLocations,
      searchTerm,
      currency: selectedCurrency,
    });
  }, [
    priceRange,
    selectedCategories,
    selectedNights,
    selectedLocations,
    searchTerm,
    selectedCurrency,
    onFilterChange,
  ]);

  const handleClearFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setSelectedNights([]);
    setSelectedLocations([]);
    setSearchTerm("");
    onClearFilters();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const handleNightsChange = (night) => {
    setSelectedNights((prev) =>
      prev.includes(night)
        ? prev.filter((item) => item !== night)
        : [...prev, night]
    );
  };

  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
  };

  return (
    <FilterSidebar>
      <FilterHeader>
        <h3>Filters</h3>
        <button className="clear-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </FilterHeader>

      <FilterSection>
        <div className="filter-title">Currency</div>
        <CurrencySelector>
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          >
            {availableCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {getCurrencyInfo(currency.code).symbol} {currency.name}
              </option>
            ))}
          </select>
        </CurrencySelector>
      </FilterSection>

      <FilterSection>
        <div className="filter-title">Search</div>
        <SearchInput
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterSection>

      <FilterSection>
        <div className="filter-title">Price Range</div>
        <CustomSlider>
          <Slider
            range
            min={0}
            max={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
          />
        </CustomSlider>
        <PriceDisplay>
          <span className="range">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </PriceDisplay>
      </FilterSection>

      <FilterSection>
        <div className="filter-title">Destinations</div>
        <CheckboxList>
          {locations.slice(0, 6).map((location) => (
            <CheckboxItem key={location}>
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => handleLocationChange(location)}
              />
              {capitalizeFirstLetter(location)}
            </CheckboxItem>
          ))}
        </CheckboxList>
      </FilterSection>

      <FilterSection>
        <div className="filter-title">Category</div>
        <CheckboxList>
          {categories.map((category) => (
            <CheckboxItem key={category}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {capitalizeFirstLetter(category)}
            </CheckboxItem>
          ))}
        </CheckboxList>
      </FilterSection>

      <FilterSection>
        <div className="filter-title">Duration</div>
        <CheckboxList>
          {nightsOptions.map((night) => (
            <CheckboxItem key={night}>
              <input
                type="checkbox"
                checked={selectedNights.includes(night)}
                onChange={() => handleNightsChange(night)}
              />
              {night} Nights
            </CheckboxItem>
          ))}
        </CheckboxList>
      </FilterSection>
    </FilterSidebar>
  );
};

const HolidayListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("list");
  const router = useRouter();

  const { selectedCurrency, convertPrice, formatPrice, baseCurrency } =
    useCurrency();

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await packageApi.getAllPackages();
        const packagesData = response.data;
        const availablePackages = packagesData.filter(
          (packageItem) => packageItem.availability !== "ComingSoon"
        );
        setPackages(availablePackages);
        setFilteredPackages(availablePackages);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const handleBookNow = (packageItem) => {
    setAnimatingId(packageItem.id);

    // Navigate to booking page with package details
    const bookingUrl = `/booking?id=${packageItem.id}&type=package`;
    router.push(bookingUrl);

    // Show success message
    toast.success("Redirecting to booking page...");

    // Clear animation after delay
    setTimeout(() => setAnimatingId(null), 500);
  };

  const handleFilterChange = useCallback(
    ({ priceRange, categories, nights, locations, searchTerm, currency }) => {
      let filtered = [...packages];

      // Convert price range to base currency for filtering
      const minPriceInBase = convertPrice(
        priceRange[0],
        currency,
        baseCurrency
      );
      const maxPriceInBase = convertPrice(
        priceRange[1],
        currency,
        baseCurrency
      );

      filtered = filtered.filter(
        (pkg) => pkg.price >= minPriceInBase && pkg.price <= maxPriceInBase
      );

      if (categories.length) {
        filtered = filtered.filter((pkg) =>
          categories.includes(pkg.category?.name)
        );
      }

      if (locations.length) {
        filtered = filtered.filter((pkg) =>
          locations.includes(pkg.location?.name)
        );
      }

      if (nights.length) {
        filtered = filtered.filter((pkg) => {
          const nightsCount = Math.max(1, pkg.duration - 1);
          return nights.includes(nightsCount);
        });
      }

      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (pkg) =>
            pkg.name.toLowerCase().includes(searchLower) ||
            pkg.location.name.toLowerCase().includes(searchLower)
        );
      }

      setFilteredPackages(filtered);
    },
    [packages, convertPrice, baseCurrency]
  );

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...filteredPackages].sort((a, b) => {
      switch (value) {
        case "price-low":
          return (
            convertPrice(a.price, baseCurrency, selectedCurrency) -
            convertPrice(b.price, baseCurrency, selectedCurrency)
          );
        case "price-high":
          return (
            convertPrice(b.price, baseCurrency, selectedCurrency) -
            convertPrice(a.price, baseCurrency, selectedCurrency)
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "duration":
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
    setFilteredPackages(sorted);
  };

  const handleClearFilters = () => {
    setFilteredPackages(packages);
  };

  const totalDestinations = Array.from(
    new Set(packages.map((pkg) => pkg.location?.name))
  ).length;

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContainer>
            <HeaderTitle>
              <h1>Holiday Packages</h1>
              <p>Discover amazing destinations and experiences</p>
            </HeaderTitle>
            <QuickStats>
              <div className="stat-item">
                <span className="number">{packages.length}</span>
                <span className="label">Packages</span>
              </div>
              <div className="stat-item">
                <span className="number">{totalDestinations}</span>
                <span className="label">Destinations</span>
              </div>
            </QuickStats>
          </HeaderContainer>
        </HeaderSection>

        <MainContent>
          <FilterSidebarComponent
            data={packages}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <ContentSection>
            <ContentHeader>
              <ResultsInfo>
                <div className="count">
                  {filteredPackages.length} packages found
                </div>
                <div className="description">
                  {filteredPackages.length !== packages.length &&
                    `from ${packages.length} total packages`}
                </div>
              </ResultsInfo>

              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <ViewToggle>
                  <button
                    className={viewMode === "list" ? "active" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <i className="fal fa-list" /> List
                  </button>
                  <button
                    className={viewMode === "grid" ? "active" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    <i className="fal fa-th" /> Grid
                  </button>
                </ViewToggle>

                <SortControls>
                  <span className="sort-label">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </SortControls>
              </div>
            </ContentHeader>

            {loading ? (
              <PackagesList className={`${viewMode}-view`}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader
                    key={i}
                    height="250px"
                    width="100%"
                    style={{ borderRadius: "12px" }}
                  />
                ))}
              </PackagesList>
            ) : filteredPackages.length === 0 ? (
              <EmptyState>
                <div className="empty-icon">
                  <i className="fal fa-search" />
                </div>
                <h3>No packages found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="reset-btn" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </EmptyState>
            ) : (
              <PackagesList className={`${viewMode}-view`}>
                {filteredPackages.map((packageItem) => {
                  const convertedPrice = convertPrice(
                    packageItem.price,
                    baseCurrency,
                    selectedCurrency
                  );

                  return (
                    <PackageCard key={packageItem.id}>
                      <PackageImage>
                        <Link href={`/holiday-details/${packageItem.id}`}>
                          <img
                            src={packageItem.imageUrl}
                            alt={packageItem.name}
                          />
                        </Link>
                        <div className="status-badge">Available</div>
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={
                                i < (packageItem.review || 0)
                                  ? "fas fa-star"
                                  : "far fa-star"
                              }
                            />
                          ))}
                        </div>
                        <div className="wishlist-area">
                          <CardWishlistButton
                            itemId={packageItem.id}
                            itemType="Package"
                            size="small"
                            style={{
                              position: "absolute",
                              top: "16px",
                              right: "16px",
                              zIndex: 10,
                            }}
                          />
                        </div>
                      </PackageImage>

                      <PackageContent>
                        <PackageHeader>
                          <div className="location">
                            <i className="fal fa-map-marker-alt" />
                            <span>
                              {capitalizeFirstLetter(packageItem.location.name)}
                            </span>
                          </div>
                          <h3>
                            <Link href={`/holiday-details/${packageItem.id}`}>
                              {packageItem.name}
                            </Link>
                          </h3>
                        </PackageHeader>

                        <PackageDescription>
                          {packageItem.description}
                        </PackageDescription>

                        <PackageMeta>
                          <div className="meta-item">
                            <i className="fal fa-tag" />
                            <span>{packageItem.category.name}</span>
                          </div>
                          <div className="meta-item">
                            <i className="fal fa-hotel" />
                            <span>{packageItem.hotels} Hotels</span>
                          </div>
                          <div className="meta-item">
                            <i className="fal fa-clock" />
                            <span>{packageItem.duration} Days</span>
                          </div>
                        </PackageMeta>

                        <FeaturesList>
                          {packageItem.features
                            .slice(0, viewMode === "grid" ? 3 : 5)
                            .map((feature) => {
                              const iconClass =
                                activityIcons[feature.name.toLowerCase()] ||
                                "fas fa-check";
                              return (
                                <div key={feature.id} className="feature-tag">
                                  <i className={iconClass} />
                                  <span>{feature.name}</span>
                                </div>
                              );
                            })}
                          {packageItem.features.length >
                            (viewMode === "grid" ? 3 : 5) && (
                            <div className="feature-tag">
                              <span>
                                +
                                {packageItem.features.length -
                                  (viewMode === "grid" ? 3 : 5)}{" "}
                                more
                              </span>
                            </div>
                          )}
                        </FeaturesList>

                        <PackageFooter>
                          <PriceSection>
                            <div className="price">
                              {formatPrice(convertedPrice)}
                            </div>
                            <div className="per-person">per person</div>
                          </PriceSection>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <ActionButton
                              className="view-details"
                              onClick={() =>
                                router.push(
                                  `/holiday-details/${packageItem.id}`
                                )
                              }
                            >
                              <i className="fal fa-eye" />
                              View Details
                            </ActionButton>
                            <ActionButton
                              className={`book-now ${
                                animatingId === packageItem.id ? "animate" : ""
                              }`}
                              onClick={() => handleBookNow(packageItem)}
                            >
                              <i className="fal fa-calendar-check" />
                              Book Now
                            </ActionButton>
                          </div>
                        </PackageFooter>
                      </PackageContent>
                    </PackageCard>
                  );
                })}
              </PackagesList>
            )}
          </ContentSection>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default HolidayListPage;
