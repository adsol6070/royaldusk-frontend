"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const FilterSidebar = ({ data = [], onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedNights, setSelectedNights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Max price from data
  const maxPrice = data.length > 0 ? Math.max(...data.map((item) => item.price)) : 1000;

  // Set of unique categories
  const categories = Array.from(new Set(data.map((item) => item.category?.name))).filter(Boolean);

  // Unique nights based on duration (nights = duration - 1)
  const nightsOptions = Array.from(
    new Set(data.map((item) => Math.max(1, item.duration - 1)))
  ).sort((a, b) => a - b);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  useEffect(() => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      nights: selectedNights,
      searchTerm,
    });
  }, [priceRange, selectedCategories, selectedNights, searchTerm, onFilterChange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleNightsChange = (night) => {
    setSelectedNights((prev) =>
      prev.includes(night)
        ? prev.filter((item) => item !== night)
        : [...prev, night]
    );
  };

  return (
    <div className="shop-sidebar sidebar-widget">
      {/* Price Range */}
      <div className="widget mb-4" data-aos="fade-up">
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
            AED {priceRange[0]} - AED {priceRange[1]}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="widget mb-4" data-aos="fade-up">
        <h6 className="widget-title">Filter by Category</h6>
        <ul className="checkbox-list">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category}>
                <label>
                  <input
                    type="checkbox"
                    value={category}
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)}
                  />{" "}
                  {capitalizeFirstLetter(category)}
                </label>
              </li>
            ))
          ) : (
            <li>No categories available</li>
          )}
        </ul>
      </div>

      {/* Nights Filter */}
      <div className="widget mb-4" data-aos="fade-up">
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
                  />{" "}
                  {night} Nights
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
