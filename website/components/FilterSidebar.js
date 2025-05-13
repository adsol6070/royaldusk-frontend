"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const FilterSidebar = ({ data, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNights, setSelectedNights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Compute maximum values dynamically based on data
  const maxPrice = Math.max(...data.map((item) => item.price), 1000);

  // Extract nights from duration and create a unique set
  const nightsSet = new Set();
  data.forEach((item) => {
    const match = item.duration.match(/(\d+)N/);
    if (match) {
      nightsSet.add(parseInt(match[1]));
    }
  });

  const nightsOptions = Array.from(nightsSet).sort((a, b) => a - b);
  const categories = Array.from(new Set(data.map((item) => item.category.name)));

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Emit filter changes
  useEffect(() => {
    onFilterChange({ priceRange, categories: selectedCategories, nights: selectedNights, searchTerm });
  }, [priceRange, selectedCategories, selectedNights, searchTerm, onFilterChange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleNightsChange = (night) => {
    setSelectedNights((prev) =>
      prev.includes(night) ? prev.filter((item) => item !== night) : [...prev, night]
    );
  };

  return (
      <div className="shop-sidebar sidebar-widget">
        {/* Price Range */}
        <div className="widget mb-4" data-aos="fade-up" data-aos-delay={50} data-aos-duration={1500} data-aos-offset={50}>
          <h6 className="widget-title">Filter by Price</h6>
          <Slider
            range
            min={0}
            max={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
            trackStyle={{ backgroundColor: "#63AB45" }}
            handleStyle={{ borderColor: "#63AB45", backgroundColor: "#63AB45" }}
            railStyle={{ backgroundColor: "rgba(99, 171, 69,0.2)" }}
          />
          <div className="price mt-2">
            <p>
              ${priceRange[0]} - ${priceRange[1]}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="widget mb-4" data-aos="fade-up" data-aos-delay={50} data-aos-duration={1500} data-aos-offset={50}>
          <h6 className="widget-title">Filter by Category</h6>
          <ul className="checkbox-list">
            {categories.map((category) => (
              <li key={category}>
                <label>
                  <input
                    type="checkbox"
                    value={category}
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)}
                  />
                  {" "}{capitalizeFirstLetter(category)}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Nights Filter */}
        <div className="widget mb-4" data-aos="fade-up" data-aos-delay={50} data-aos-duration={1500} data-aos-offset={50}>
          <h6 className="widget-title">Filter by Nights</h6>
          <ul className="checkbox-list">
            {nightsOptions.length > 0 ? (
              nightsOptions.map((night) => (
                <li key={night}>
                  <label>
                    <input
                      type="checkbox"
                      value={night}
                      onChange={() => handleNightsChange(night)}
                      checked={selectedNights.includes(night)}
                    />
                    {" "}{night} Nights
                  </label>
                </li>
              ))
            ) : (
              <li>No night options available</li>
            )}
          </ul>
        </div>
      </div>
  );
};

export default FilterSidebar;
