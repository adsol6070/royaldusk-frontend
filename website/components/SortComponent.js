"use client";

import { useState, useEffect } from "react";

const SortComponent = ({ data, setData, controls = ["price", "review", "date"] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [sortReview, setSortReview] = useState("");
  const [sortDate, setSortDate] = useState("");

  // Update data based on sorting and search
  useEffect(() => {
    let sortedData = [...data];

    // Search
    if (searchTerm) {
      sortedData = sortedData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price Sorting
    if (sortPrice) {
      sortedData.sort((a, b) =>
        sortPrice === "price-high" ? b.price - a.price : a.price - b.price
      );
    }

    // Review Sorting
    if (sortReview) {
      sortedData.sort((a, b) =>
        sortReview === "review-high"
          ? (b.review || 0) - (a.review || 0)
          : (a.review || 0) - (b.review || 0)
      );
    }

    // Date Sorting
    if (sortDate) {
      sortedData.sort((a, b) =>
        sortDate === "new"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setData(sortedData);
  }, [searchTerm, sortPrice, sortReview, sortDate, data, setData]);

  return (
    <div className="sort-component d-flex flex-wrap gap-3 align-items-center">
      {/* Search Field */}
      <div className="search-field my-1">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control border rounded py-1 px-2"
        />
      </div>

      {/* Price Sorting */}
      {controls.includes("price") && (
        <div className="sort-price my-1">
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="form-select"
          >
            <option value="">Sort by Price</option>
            <option value="price-high">High to Low</option>
            <option value="price-low">Low to High</option>
          </select>
        </div>
      )}

      {/* Review Sorting */}
      {controls.includes("review") && (
        <div className="sort-review my-1">
          <select
            value={sortReview}
            onChange={(e) => setSortReview(e.target.value)}
            className="form-select"
          >
            <option value="">Sort by Review</option>
            <option value="review-high">High to Low</option>
            <option value="review-low">Low to High</option>
          </select>
        </div>
      )}

      {/* Date Sorting */}
      {controls.includes("date") && (
        <div className="sort-date my-1">
          <select
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
            className="form-select"
          >
            <option value="">Sort by Date</option>
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SortComponent;
