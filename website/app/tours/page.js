"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ReveloLayout from "@/layout/ReveloLayout";
import styled, { keyframes } from "styled-components";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { tourApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

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

const ToursList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  &.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
`;

const TourCard = styled.div`
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

const TourImage = styled.div`
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
    
    &.available {
      color: #059669;
    }
    
    &.unavailable {
      color: #dc2626;
    }
  }

  .tag-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(248, 133, 61, 0.9);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: white;
  }
`;

const TourContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  
  .grid-view & {
    padding: 20px;
  }
`;

const TourHeader = styled.div`
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

const TourDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TourMeta = styled.div`
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

const TourFooter = styled.div`
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

    .currency {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
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

// Helper function to safely handle location display
const getLocationDisplay = (location) => {
  if (!location) return '';
  
  if (typeof location === 'string') {
    return capitalizeFirstLetter(location);
  }
  
  if (typeof location === 'object' && location.name) {
    return capitalizeFirstLetter(location.name);
  }
  
  return String(location);
};

// Helper function to safely get location for filtering
const getLocationForFilter = (item) => {
  if (!item.location) return '';
  
  if (typeof item.location === 'string') {
    return item.location;
  }
  
  if (typeof item.location === 'object' && item.location.name) {
    return item.location.name;
  }
  
  return String(item.location);
};

const FilterSidebarComponent = ({ data = [], onFilterChange, onClearFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const maxPrice = data.length > 0 ? Math.max(...data.map((item) => parseFloat(item.price))) : 2000;
  
  // Safely extract locations
  const locations = Array.from(new Set(
    data.map((item) => getLocationForFilter(item)).filter(Boolean)
  ));
  
  const tags = Array.from(new Set(data.map((item) => item.tag))).filter(Boolean);
  const availabilityOptions = Array.from(new Set(data.map((item) => item.tourAvailability))).filter(Boolean);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    onFilterChange({
      priceRange,
      locations: selectedLocations,
      tags: selectedTags,
      availability: selectedAvailability,
      searchTerm,
    });
  }, [priceRange, selectedLocations, selectedTags, selectedAvailability, searchTerm, onFilterChange]);

  const handleClearFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedLocations([]);
    setSelectedTags([]);
    setSelectedAvailability([]);
    setSearchTerm("");
    onClearFilters();
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };

  const handleAvailabilityChange = (availability) => {
    setSelectedAvailability((prev) =>
      prev.includes(availability)
        ? prev.filter((item) => item !== availability)
        : [...prev, availability]
    );
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
        <div className="filter-title">Search</div>
        <SearchInput
          type="text"
          placeholder="Search tours..."
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
          <span className="range">AED{priceRange[0]} - AED{priceRange[1]}</span>
        </PriceDisplay>
      </FilterSection>

      {locations.length > 0 && (
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
      )}

      {tags.length > 0 && (
        <FilterSection>
          <div className="filter-title">Tags</div>
          <CheckboxList>
            {tags.map((tag) => (
              <CheckboxItem key={tag}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {capitalizeFirstLetter(tag)}
              </CheckboxItem>
            ))}
          </CheckboxList>
        </FilterSection>
      )}

      {availabilityOptions.length > 0 && (
        <FilterSection>
          <div className="filter-title">Availability</div>
          <CheckboxList>
            {availabilityOptions.map((availability) => (
              <CheckboxItem key={availability}>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(availability)}
                  onChange={() => handleAvailabilityChange(availability)}
                />
                {availability}
              </CheckboxItem>
            ))}
          </CheckboxList>
        </FilterSection>
      )}
    </FilterSidebar>
  );
};

const TourAndActivitiesPage = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("list");
  const router = useRouter();

  // Fetch tours from API
  useEffect(() => {
    async function fetchTours() {
      try {
        setLoading(true);
        const response = await tourApi.getAllTours(); 
        const toursData = response.data;
        console.log("tour data", toursData)
        
        // Filter available tours
        const availableTours = toursData.filter(
          (tour) => tour.tourAvailability !== "ComingSoon"
        );
        
        setTours(availableTours);
        setFilteredTours(availableTours);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to load tours");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTours();
  }, []);

  const handleBookNow = (tour) => {
    setAnimatingId(tour.id);
    
    // Navigate to booking page with tour details
    const bookingUrl = `/booking?id=${tour.id}&type=tour`;
    router.push(bookingUrl);
    
    // Show success message
    toast.success("Redirecting to booking page...");
    
    // Clear animation after delay
    setTimeout(() => setAnimatingId(null), 500);
  };

  const handleFilterChange = useCallback(
    ({ priceRange, locations, tags, availability, searchTerm }) => {
      let filtered = [...tours];

      // Price filter
      filtered = filtered.filter(
        (tour) => {
          const price = parseFloat(tour.price);
          return price >= priceRange[0] && price <= priceRange[1];
        }
      );

      // Location filter
      if (locations.length) {
        filtered = filtered.filter((tour) =>
          locations.includes(getLocationForFilter(tour))
        );
      }

      // Tag filter
      if (tags.length) {
        filtered = filtered.filter((tour) =>
          tags.includes(tour.tag)
        );
      }

      // Availability filter
      if (availability.length) {
        filtered = filtered.filter((tour) =>
          availability.includes(tour.tourAvailability)
        );
      }

      // Search filter
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (tour) => {
            const location = getLocationForFilter(tour);
            return (
              tour.name?.toLowerCase().includes(searchLower) ||
              location.toLowerCase().includes(searchLower) ||
              tour.description?.toLowerCase().includes(searchLower)
            );
          }
        );
      }

      setFilteredTours(filtered);
    },
    [tours]
  );

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...filteredTours].sort((a, b) => {
      switch (value) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    setFilteredTours(sorted);
  };

  const handleClearFilters = () => {
    setFilteredTours(tours);
  };

  const totalDestinations = Array.from(new Set(
    tours.map(tour => getLocationForFilter(tour)).filter(Boolean)
  )).length;

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContainer>
            <HeaderTitle>
              <h1>Tours & Activities</h1>
              <p>Discover amazing destinations and experiences</p>
            </HeaderTitle>
            <QuickStats>
              <div className="stat-item">
                <span className="number">{tours.length}</span>
                <span className="label">Tours</span>
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
            data={tours}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <ContentSection>
            <ContentHeader>
              <ResultsInfo>
                <div className="count">{filteredTours.length} tours found</div>
                <div className="description">
                  {filteredTours.length !== tours.length && 
                    `from ${tours.length} total tours`
                  }
                </div>
              </ResultsInfo>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <ViewToggle>
                  <button 
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fal fa-list" /> List
                  </button>
                  <button 
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fal fa-th" /> Grid
                  </button>
                </ViewToggle>
                
                <SortControls>
                  <span className="sort-label">Sort:</span>
                  <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </SortControls>
              </div>
            </ContentHeader>

            {loading ? (
              <ToursList className={`${viewMode}-view`}>
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} height="250px" width="100%" style={{ borderRadius: "12px" }} />
                ))}
              </ToursList>
            ) : filteredTours.length === 0 ? (
              <EmptyState>
                <div className="empty-icon">
                  <i className="fal fa-search" />
                </div>
                <h3>No tours found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="reset-btn" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </EmptyState>
            ) : (
              <ToursList className={`${viewMode}-view`}>
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id}>
                    <TourImage>
                      <Link href={`/tours-details/${tour.id}`}>
                        <img 
                          src={tour.imageUrl || '/assets/images/destinations/default-tour.jpg'} 
                          alt={tour.name}
                          onError={(e) => {
                            e.target.src = '/assets/images/destinations/default-tour.jpg';
                          }}
                        />
                      </Link>
                      
                      {tour.tourAvailability && (
                        <div className={`status-badge ${tour.tourAvailability.toLowerCase()}`}>
                          {tour.tourAvailability}
                        </div>
                      )}
                      
                      {tour.tag && (
                        <div className="tag-badge">
                          {tour.tag}
                        </div>
                      )}
                    </TourImage>

                    <TourContent>
                      <TourHeader>
                        <div className="location">
                          <i className="fal fa-map-marker-alt" />
                          <span>{getLocationDisplay(tour.location)}</span>
                        </div>
                        <h3>
                          <Link href={`/tours-details/${tour.id}`}>
                            {tour.name}
                          </Link>
                        </h3>
                      </TourHeader>

                      {tour.description && (
                        <TourDescription>
                          {tour.description}
                        </TourDescription>
                      )}

                      <TourMeta>
                        <div className="meta-item">
                          <i className="fal fa-calendar" />
                          <span>Created: {new Date(tour.createdAt).toLocaleDateString()}</span>
                        </div>
                        {tour.tag && (
                          <div className="meta-item">
                            <i className="fal fa-tag" />
                            <span>{tour.tag}</span>
                          </div>
                        )}
                        <div className="meta-item">
                          <i className="fal fa-check-circle" />
                          <span>{tour.tourAvailability}</span>
                        </div>
                      </TourMeta>

                      <TourFooter>
                        <PriceSection>
                          <div className="price">
                            <span className="currency">AED </span>
                            {parseFloat(tour.price).toLocaleString('en-IN', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          <div className="per-person">per person</div>
                        </PriceSection>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <ActionButton 
                            className="view-details"
                            onClick={() => router.push(`/tours-details/${tour.id}`)}
                          >
                            <i className="fal fa-eye" />
                            View Details
                          </ActionButton>
                          <ActionButton
                            className={`book-now ${animatingId === tour.id ? 'animate' : ''}`}
                            onClick={() => handleBookNow(tour)}
                            disabled={tour.tourAvailability !== 'Available'}
                          >
                            <i className="fal fa-calendar-check" />
                            Book Now
                          </ActionButton>
                        </div>
                      </TourFooter>
                    </TourContent>
                  </TourCard>
                ))}
              </ToursList>
            )}
          </ContentSection>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default TourAndActivitiesPage;