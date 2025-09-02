"use client";
import Counter from "@/components/Counter";
import SearchFilter from "@/components/SearchFilter";
import SectionTitle from "@/components/SectionTitle";
import Destination from "@/components/slider/Destination";
import HotDeals from "@/components/slider/HotDeals";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { packageApi, tourApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import { useCurrency } from "@/common/context/CurrencyContext";
import { CardWishlistButton } from "@/components/wishlistButton";

const bookNowAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const PlatformHero = styled.section`
  background: url("/assets/images/hero/hero-one.jpg");
  padding: 100px 0 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  .hero-content {
    text-align: center;
    color: white;
    position: relative;
    z-index: 2;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;

    h1 {
      color: white;
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 24px;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        font-size: 3rem;
      }

      @media (max-width: 480px) {
        font-size: 2.5rem;
      }
    }

    .platform-description {
      font-weight: 600;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
      line-height: 1.6;
    }
  }
`;

const SearchWidget = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin: -40px 20px 40px;
  box-shadow: 0 8px 32px rgba(248, 133, 61, 0.12);
  position: relative;
  z-index: 10;

  .search-header {
    text-align: center;
    margin-bottom: 24px;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    p {
      color: #64748b;
      margin: 0;
    }
  }

  .service-tabs {
    display: flex;
    background: #fef7f0;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
    overflow-x: auto;

    /* Reserve space for scrollbar to prevent layout shift */
    padding-bottom: 10px; /* Add extra padding to accommodate scrollbar */
    margin-bottom: 18px; /* Reduce margin to compensate for extra padding */

    /* Custom scrollbar styling */
    scrollbar-width: none; /* Hide scrollbar for Firefox by default */

    /* Webkit browsers (Chrome, Safari, Edge) */
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent; /* No background track */
    }

    &::-webkit-scrollbar-thumb {
      background: transparent; /* Hidden by default */
      border-radius: 10px;
      transition: background 0.3s ease;
    }

    /* Show scrollbar only on hover */
    &:hover {
      scrollbar-width: thin;
      scrollbar-color: #f8853d transparent;

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #f8853d, #e67428);
      }

      &::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(90deg, #e67428, #d65e1f);
      }
    }

    /* Add smooth scroll behavior */
    scroll-behavior: smooth;

    .tab {
      flex: 1;
      min-width: 140px;
      padding: 12px 16px;
      text-align: center;
      border-radius: 8px;
      font-weight: 500;
      color: #64748b;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      border: none;
      background: none;

      i {
        font-size: 16px;
      }

      &.active {
        background: #f8853d;
        color: white;
        box-shadow: 0 2px 8px rgba(248, 133, 61, 0.3);
      }

      &.coming-soon {
        opacity: 0.5;
        cursor: not-allowed;

        &::after {
          content: "Coming Soon";
          position: absolute;
          top: -8px;
          right: -8px;
          background: #f59e0b;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }

      /* Add hover effect for available tabs */
      &:not(.coming-soon):not(.active):hover {
        background: rgba(248, 133, 61, 0.1);
        color: #f8853d;
      }
    }
  }

  .search-content {
    .search-section {
      .search-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
        align-items: end;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        .search-field {
          .label {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
            display: block;
          }

          .search-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;

            &:focus {
              outline: none;
              border-color: #f8853d;
            }
          }
        }

        .search-button {
          padding: 12px 24px;
          background: #f8853d;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;

          &:hover {
            background: #e67428;
          }

          i {
            font-size: 16px;
          }
        }
      }
    }

    .coming-soon-message {
      text-align: center;
      padding: 40px 20px;
      color: #64748b;

      i {
        font-size: 3rem;
        color: #d1d5db;
        margin-bottom: 16px;
      }

      h4 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: #374151;
      }

      p {
        margin: 0;
      }
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;

      .search-result-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background 0.2s ease;
        display: flex;
        align-items: center;
        gap: 12px;

        &:hover {
          background: #f9fafb;
        }

        &:last-child {
          border-bottom: none;
        }

        .result-image {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;

          .result-name {
            font-size: 14px;
            font-weight: 500;
            color: #1e293b;
            margin-bottom: 2px;
          }

          .result-meta {
            font-size: 12px;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 8px;

            .location {
              display: flex;
              align-items: center;
              gap: 2px;
            }

            .price {
              font-weight: 500;
              color: #f8853d;
            }
          }
        }
      }

      .no-results {
        padding: 20px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
      }
    }
  }
`;

const PlatformServices = styled.section`
  padding: 60px 0;
  background: white;

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 40px;
  }

  .service-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f8853d, #e67428);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(248, 133, 61, 0.15);

      &::before {
        transform: scaleX(1);
      }
    }

    &.available {
      cursor: pointer;
    }

    &.coming-soon {
      opacity: 0.7;

      .status-badge {
        position: absolute;
        top: 16px;
        right: 16px;
        background: #f59e0b;
        color: white;
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
      }
    }

    .service-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #f8853d, #e67428);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;

      i {
        font-size: 2rem;
        color: white;
      }
    }

    h4 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    p {
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 0;
    }

    .service-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;

      .stat {
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
    }
  }
`;

const FeaturedSection = styled.section`
  padding: 40px 0;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h3 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .view-all {
      font-size: 14px;
      color: #f8853d;
      text-decoration: none;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;

      &:hover {
        text-decoration: none;
        color: #e67428;
      }
    }
  }

  .filters {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    .filter-btn {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: white;
      color: #64748b;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover,
      &.active {
        border-color: #f8853d;
        background: #f8853d;
        color: white;
      }
    }
  }
`;

// Package Card Component
const PackageCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease;

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 8px 32px rgba(248, 133, 61, 0.12);
    transform: translateY(-4px);
  }

  .image {
    height: 200px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(5, 150, 105, 0.95);
      backdrop-filter: blur(10px);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .location-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(248, 133, 61, 0.9);
        transform: scale(1.05);
      }

      i {
        margin-right: 4px;
      }
    }

    .tag-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(248, 133, 61, 0.9);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }
    .wishlist-area {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  .content {
    padding: 20px;

    .item-meta {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;

      .duration {
        font-size: 12px;
        color: #64748b;
        background: #fef7f0;
        padding: 6px 12px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;

        i {
          font-size: 10px;
          color: #f8853d;
        }
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #f8853d;

        i {
          font-size: 14px;
        }

        span {
          color: #64748b;
          margin-left: 4px;
        }
      }
    }

    h6 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
      line-height: 1.4;

      a {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: #f8853d;
        }
      }
    }

    .category-badge {
      font-size: 12px;
      color: #f8853d;
      background: #fef7f0;
      padding: 4px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 12px;
      font-weight: 500;
      border: 1px solid #fed7aa;

      i {
        margin-right: 4px;
      }
    }

    .package-features {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;

      .feature {
        font-size: 11px;
        background: #f1f5f9;
        color: #475569;
        padding: 4px 8px;
        border-radius: 8px;
        font-weight: 500;

        i {
          margin-right: 3px;
          color: #059669;
        }
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .price {
        font-weight: 700;
        color: #1e293b;
        font-size: 16px;

        .currency {
          font-size: 14px;
          color: #f8853d;
          font-weight: 600;
        }

        small {
          color: #64748b;
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
`;

// Tour Card Component
const TourCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease;

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 8px 32px rgba(248, 133, 61, 0.12);
    transform: translateY(-4px);
  }

  .image {
    height: 200px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(5, 150, 105, 0.95);
      backdrop-filter: blur(10px);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .location-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(248, 133, 61, 0.9);
        transform: scale(1.05);
      }

      i {
        margin-right: 4px;
      }
    }

    .tag-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(99, 102, 241, 0.9);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }
    .wishlist-area {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  .content {
    padding: 20px;

    .item-meta {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;

      .tour-type {
        font-size: 12px;
        color: #6366f1;
        background: #f0f9ff;
        padding: 6px 12px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        border: 1px solid #e0e7ff;

        i {
          font-size: 10px;
        }
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #f8853d;

        i {
          font-size: 14px;
        }

        span {
          color: #64748b;
          margin-left: 4px;
        }
      }
    }

    h6 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
      line-height: 1.4;

      a {
        color: inherit;
        text-decoration: none;

        &:hover {
          color: #f8853d;
        }
      }
    }

    .category-badge {
      font-size: 12px;
      color: #6366f1;
      background: #f0f9ff;
      padding: 4px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 12px;
      font-weight: 500;
      border: 1px solid #e0e7ff;

      i {
        margin-right: 4px;
      }
    }

    .tour-highlights {
      color: #64748b;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .price {
        font-weight: 700;
        color: #1e293b;
        font-size: 16px;

        .currency {
          font-size: 14px;
          color: #f8853d;
          font-weight: 600;
        }

        small {
          color: #64748b;
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  font-weight: 500;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 12px;
  }
`;

const PopularDestinations = styled.section`
  padding: 60px 0;
  background: white;

  .destinations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 32px;

    /* Ensure maximum 4 columns and proper centering */
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
      max-width: 1200px;
      margin: 32px auto 0;
    }

    @media (max-width: 1199px) and (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 899px) and (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
    }
  }

  .destination-card {
    position: relative;
    height: 200px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 32px rgba(248, 133, 61, 0.15);
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.3s ease;
    }

    &:hover .background {
      transform: scale(1.1);
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.6)
      );

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: none;
      }
    }

    .content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      color: white;
      z-index: 1;

      h5 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 4px;
        color: white;
      }

      p {
        font-size: 14px;
        opacity: 0.9;
        margin: 0;
      }
    }
  }
`;

// Helper function to safely handle location display
const getLocationDisplay = (location) => {
  if (!location) return "";

  if (typeof location === "string") {
    return capitalizeFirstLetter(location);
  }

  if (typeof location === "object" && location.name) {
    return capitalizeFirstLetter(location.name);
  }

  return String(location);
};

const HomePage = () => {
  // Import currency context
  const { selectedCurrency, convertPrice, formatPrice, getCurrencyInfo } =
    useCurrency();

  // Separate state for packages and tours
  const [packagesData, setPackagesData] = useState({
    items: [],
    locations: [],
    categories: [],
    loading: false,
    loaded: false,
  });

  const [toursData, setToursData] = useState({
    items: [],
    locations: [],
    categories: [],
    loading: false,
    loaded: false,
  });

  const [animatingId, setAnimatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  // Function to fetch packages data
  const fetchPackagesData = useCallback(async () => {
    if (packagesData.loaded && !packagesData.loading) return;

    setPackagesData((prev) => ({ ...prev, loading: true }));

    try {
      const response = await packageApi.getAllPackages();
      const availablePackages = response.data.filter(
        (pkg) => pkg.availability !== "ComingSoon"
      );

      // Extract unique locations from packages
      const packageLocations = availablePackages
        .filter((pkg) => pkg.location)
        .map((pkg) => pkg.location)
        .reduce((acc, location) => {
          const existingLocation = acc.find(
            (loc) =>
              (loc.id && location.id && loc.id === location.id) ||
              (loc.name &&
                location.name &&
                loc.name.toLowerCase() === location.name.toLowerCase())
          );
          if (!existingLocation) {
            acc.push(location);
          }
          return acc;
        }, []);

      // Extract unique categories from packages
      const packageCategories = availablePackages
        .filter((pkg) => pkg.category)
        .map((pkg) => pkg.category)
        .reduce((acc, category) => {
          const existingCategory = acc.find(
            (cat) =>
              cat.id === category.id ||
              cat.name.toLowerCase() === category.name.toLowerCase()
          );
          if (!existingCategory) {
            acc.push(category);
          }
          return acc;
        }, []);

      setPackagesData({
        items: availablePackages,
        locations: packageLocations,
        categories: packageCategories,
        loading: false,
        loaded: true,
      });

      console.log("Packages loaded:", availablePackages.length);
      console.log("Package locations:", packageLocations.length);
      console.log("Package categories:", packageCategories.length);
    } catch (error) {
      console.error("Failed to load packages", error);
      setPackagesData((prev) => ({ ...prev, loading: false, loaded: true }));
    }
  }, [packagesData.loaded, packagesData.loading]);

  // Function to fetch tours data
  const fetchToursData = useCallback(async () => {
    if (toursData.loaded && !toursData.loading) return;

    setToursData((prev) => ({ ...prev, loading: true }));

    try {
      const response = await tourApi.getAllTours();
      const availableTours = response.data.filter(
        (tour) => tour.tourAvailability !== "ComingSoon"
      );

      // Extract unique locations from tours
      const tourLocations = availableTours
        .filter((tour) => tour.location)
        .map((tour) => tour.location)
        .reduce((acc, location) => {
          const existingLocation = acc.find(
            (loc) =>
              (loc.id && location.id && loc.id === location.id) ||
              (loc.name &&
                location.name &&
                loc.name.toLowerCase() === location.name.toLowerCase())
          );
          if (!existingLocation) {
            acc.push(location);
          }
          return acc;
        }, []);

      // Extract unique categories from tours
      const tourCategories = availableTours
        .filter((tour) => tour.category)
        .map((tour) => tour.category)
        .reduce((acc, category) => {
          const existingCategory = acc.find(
            (cat) =>
              cat.id === category.id ||
              cat.name.toLowerCase() === category.name.toLowerCase()
          );
          if (!existingCategory) {
            acc.push(category);
          }
          return acc;
        }, []);

      setToursData({
        items: availableTours,
        locations: tourLocations,
        categories: tourCategories,
        loading: false,
        loaded: true,
      });

      console.log("Tours loaded:", availableTours.length);
      console.log("Tour locations:", tourLocations.length);
      console.log("Tour categories:", tourCategories.length);
    } catch (error) {
      console.error("Failed to load tours", error);
      setToursData((prev) => ({ ...prev, loading: false, loaded: true }));
    }
  }, [toursData.loaded, toursData.loading]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "packages") {
      fetchPackagesData();
    } else if (activeTab === "tours") {
      fetchToursData();
    }
  }, [activeTab, fetchPackagesData, fetchToursData]);

  // Initial load to get counts for services section
  useEffect(() => {
    // Load both packages and tours data initially to show proper counts
    const loadInitialData = async () => {
      try {
        // Load packages data for count
        if (!packagesData.loaded && !packagesData.loading) {
          fetchPackagesData();
        }
        // Load tours data for count
        if (!toursData.loaded && !toursData.loading) {
          fetchToursData();
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };

    loadInitialData();
  }, []); // Run only once on mount

  // Clear search results when tab changes
  useEffect(() => {
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchQuery("");
    setActiveCategory("all");
  }, [activeTab]);

  // Add click outside handler to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-field")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookNow = (item) => {
    setAnimatingId(item.id);

    // Navigate to booking page with item details
    const itemType = activeTab === "packages" ? "package" : "tour";
    const bookingUrl = `/booking?id=${item.id}&type=${itemType}`;
    router.push(bookingUrl);

    // Show success message
    toast.success("Redirecting to booking page...");

    // Clear animation after delay
    setTimeout(() => setAnimatingId(null), 500);
  };

  const handleLocationClick = (location) => {
    if (location?.name) {
      const route = activeTab === "packages" ? "/holidays" : "/tours";
      router.push(`${route}?location=${encodeURIComponent(location.name)}`);
    }
  };

  const handleSearch = () => {
    const route = activeTab === "packages" ? "/holidays" : "/tours";
    if (searchQuery.trim()) {
      router.push(`${route}?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(route);
    }
    setShowSearchResults(false);
  };

  // Dynamic search function
  const handleSearchInput = (value) => {
    setSearchQuery(value);

    if (value.trim().length > 2) {
      const currentData = getCurrentData();

      const filtered = currentData.filter((item) => {
        const searchTerm = value.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(searchTerm);
        const matchesLocation =
          (typeof item.location === "string" &&
            item.location.toLowerCase().includes(searchTerm)) ||
          (typeof item.location === "object" &&
            item.location?.name?.toLowerCase().includes(searchTerm));
        const matchesCategory = item.category?.name
          ?.toLowerCase()
          .includes(searchTerm);
        const matchesDescription = item.description
          ?.toLowerCase()
          .includes(searchTerm);

        return (
          matchesName ||
          matchesLocation ||
          matchesCategory ||
          matchesDescription
        );
      });

      setSearchResults(filtered.slice(0, 5)); // Show max 5 results
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleCategoryFilter = (categoryName) => {
    setActiveCategory(categoryName);
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    const currentTabData = activeTab === "packages" ? packagesData : toursData;
    let data = currentTabData.items;

    if (activeCategory !== "all") {
      data = data.filter(
        (item) =>
          item.category?.name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    return data.slice(0, 8); // Show max 8 items on homepage
  };

  const getCurrentLocations = () => {
    return activeTab === "packages"
      ? packagesData.locations
      : toursData.locations;
  };

  const getCurrentCategories = () => {
    return activeTab === "packages"
      ? packagesData.categories
      : toursData.categories;
  };

  const isCurrentTabLoading = () => {
    return activeTab === "packages" ? packagesData.loading : toursData.loading;
  };

  const getCurrentRoute = () => {
    return activeTab === "packages" ? "/holidays" : "/tours";
  };

  const getCurrentDetailRoute = (item) => {
    return activeTab === "packages"
      ? `/holiday-details/${item.id}`
      : `/tours-details/${item.id}`;
  };

  const getCurrentStats = () => {
    const currentTabData = activeTab === "packages" ? packagesData : toursData;
    return {
      items: currentTabData.items.length,
      locations: currentTabData.locations.length,
      categories: currentTabData.categories.length,
    };
  };

  // Currency conversion helper for prices
  const convertItemPrice = (item) => {
    const basePrice = parseFloat(item.price);
    const baseCurrency =
      activeTab === "packages" ? item.currency || "AED" : "AED";
    return convertPrice(basePrice, baseCurrency);
  };

  // Format price with current currency
  const formatItemPrice = (item) => {
    const convertedPrice = convertItemPrice(item);
    return formatPrice(convertedPrice);
  };

  // Dynamic services array that updates with data
  const services = [
    {
      id: "packages",
      icon: "fal fa-route",
      title: "Travel Packages",
      description:
        "Complete tour packages with accommodation, meals, and guided experiences",
      available: true,
      stats: {
        number:
          packagesData.items.length > 0 ? `${packagesData.items.length}+` : 0,
        label: "Packages",
      },
    },
    {
      id: "tours",
      icon: "fal fa-map-marked",
      title: "Tours",
      description: "Exciting tours and activities for memorable experiences",
      available: true,
      stats: {
        number: toursData.items.length > 0 ? `${toursData.items.length}+` : 0,
        label: "Tours",
      },
    },
    {
      id: "flights",
      icon: "fal fa-plane",
      title: "Flight Booking",
      description:
        "Book domestic and international flights at competitive prices",
      available: false,
      stats: { number: "Soon", label: "Airlines" },
    },
    {
      id: "hotels",
      icon: "fal fa-bed",
      title: "Hotel Reservations",
      description: "Find and book hotels worldwide with exclusive discounts",
      available: false,
      stats: { number: "Soon", label: "Properties" },
    },
  ];

  // Dynamic popular destinations based on current tab data
  const getPopularDestinations = () => {
    const currentLocations = getCurrentLocations();
    const currentData =
      activeTab === "packages" ? packagesData.items : toursData.items;

    return currentLocations
      .slice(0, 4)
      .map((location) => {
        // Count items for this location
        const itemCount = currentData.filter((item) => {
          if (!item.location) return false;

          if (typeof item.location === "string") {
            return item.location.toLowerCase() === location.name?.toLowerCase();
          }

          if (typeof item.location === "object" && item.location.name) {
            return (
              item.location.name.toLowerCase() === location.name?.toLowerCase()
            );
          }

          return false;
        }).length;

        const itemType = activeTab === "packages" ? "package" : "tour";
        const itemText =
          itemCount === 1 ? `1 ${itemType}` : `${itemCount} ${itemType}s`;

        return {
          name: capitalizeFirstLetter(location.name || ""),
          packages: itemCount === 0 ? `No ${itemType}s` : itemText,
          image:
            location.imageUrl ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          location: location,
          count: itemCount,
        };
      })
      .filter((dest) => dest.count > 0); // Only show destinations with actual items
  };

  // Render Package Card with currency conversion
  const renderPackageCard = (pkg) => (
    <PackageCard key={pkg.id}>
      <div className="image">
        <Link href={getCurrentDetailRoute(pkg)}>
          <img
            src={pkg.imageUrl || "/assets/images/destinations/default-tour.jpg"}
            alt={pkg.name}
            onError={(e) => {
              e.target.src = "/assets/images/destinations/default-tour.jpg";
            }}
          />
        </Link>

        <div className="status-badge">
          {pkg.availability === "Available" ? "Available" : pkg.availability}
        </div>

        {pkg.location?.name && (
          <div
            className="location-badge"
            onClick={(e) => {
              e.stopPropagation();
              handleLocationClick(pkg.location);
            }}
          >
            <i className="fal fa-map-marker-alt" />
            {capitalizeFirstLetter(pkg.location.name)}
          </div>
        )}

        {pkg.tag && <div className="tag-badge">{pkg.tag}</div>}
        <div className="wishlist-area">
          <CardWishlistButton
            itemId={pkg.id}
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
      </div>

      <div className="content">
        <div className="item-meta">
          <div className="duration">
            <i className="fal fa-calendar-days" />
            {pkg.duration ? `${pkg.duration} Days` : "Multi-Day"}
          </div>
          <div className="rating">
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="far fa-star" />
            <span>(4.2)</span>
          </div>
        </div>

        <h6>
          <Link href={getCurrentDetailRoute(pkg)}>{pkg.name}</Link>
        </h6>

        {pkg.category?.name && (
          <div className="category-badge">
            <i className="fal fa-tag" />
            {capitalizeFirstLetter(pkg.category.name)}
          </div>
        )}

        <div className="footer">
          <span className="price">
            <span className="currency">{selectedCurrency}</span>{" "}
            {formatItemPrice(pkg)}
            <small>/person</small>
          </span>

          <ActionButton
            className={`book-now ${animatingId === pkg.id ? "animate" : ""}`}
            onClick={() => handleBookNow(pkg)}
            disabled={pkg.availability !== "Available"}
          >
            <i className="fal fa-calendar-check" />
            Book Now
          </ActionButton>
        </div>
      </div>
    </PackageCard>
  );

  // Render Tour Card with currency conversion
  const renderTourCard = (tour) => (
    <TourCard key={tour.id}>
      <div className="image">
        <Link href={getCurrentDetailRoute(tour)}>
          <img
            src={
              tour.imageUrl || "/assets/images/destinations/default-tour.jpg"
            }
            alt={tour.name}
            onError={(e) => {
              e.target.src = "/assets/images/destinations/default-tour.jpg";
            }}
          />
        </Link>

        <div className="status-badge">
          {tour.tourAvailability === "Available"
            ? "Available"
            : tour.tourAvailability}
        </div>

        {tour.location?.name && (
          <div
            className="location-badge"
            onClick={(e) => {
              e.stopPropagation();
              handleLocationClick(tour.location);
            }}
          >
            <i className="fal fa-map-marker-alt" />
            {capitalizeFirstLetter(tour.location.name)}
          </div>
        )}

        {tour.tag && <div className="tag-badge">{tour.tag}</div>}
        <div className="wishlist-area">
          <CardWishlistButton
            itemId={tour.id}
            itemType="Tour"
            size="small"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 10,
            }}
          />
        </div>
      </div>

      <div className="content">
        <div className="item-meta">
          <div className="rating">
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="far fa-star" />
            <span>(4.5)</span>
          </div>
        </div>

        <h6>
          <Link href={getCurrentDetailRoute(tour)}>{tour.name}</Link>
        </h6>

        {tour.category?.name && (
          <div className="category-badge">
            <i className="fal fa-tag" />
            {capitalizeFirstLetter(tour.category.name)}
          </div>
        )}

        <div className="footer">
          <span className="price">
            <span className="currency">{selectedCurrency}</span>{" "}
            {formatItemPrice(tour)}
            <small>/person</small>
          </span>

          <ActionButton
            className={`book-now ${animatingId === tour.id ? "animate" : ""}`}
            onClick={() => handleBookNow(tour)}
            disabled={tour.tourAvailability !== "Available"}
          >
            <i className="fal fa-calendar-check" />
            Book Now
          </ActionButton>
        </div>
      </div>
    </TourCard>
  );

  return (
    <ReveloLayout>
      <PlatformContainer>
        {/* Enhanced Platform Hero */}
        <PlatformHero>
          <div className="container">
            <div className="hero-content">
              <h1>Royal Dusk Tours</h1>
              <p className="platform-description">
                From curated travel packages to exciting tours and activities -
                we're building the ultimate travel experience platform.
              </p>
            </div>
          </div>
        </PlatformHero>

        {/* Enhanced Search Widget */}
        <SearchWidget>
          <div className="container">
            <div className="search-header">
              <h3>Find Your Perfect Trip</h3>
              <p>Search across our comprehensive travel services</p>
            </div>

            <div className="service-tabs">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`tab ${activeTab === service.id ? "active" : ""} ${
                    !service.available ? "coming-soon" : ""
                  }`}
                  onClick={() => service.available && setActiveTab(service.id)}
                >
                  <i className={service.icon} />
                  {service.title}
                </button>
              ))}
            </div>

            <div className="search-content">
              {(activeTab === "packages" || activeTab === "tours") && (
                <div className="search-section">
                  <div className="search-grid">
                    <div
                      className="search-field"
                      style={{ position: "relative" }}
                    >
                      <label className="label">
                        Search{" "}
                        {activeTab === "packages"
                          ? "destinations, packages, or experiences"
                          : "tours, activities, or destinations"}
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        placeholder={`e.g. ${
                          activeTab === "packages"
                            ? "Dubai, Culture tours, Luxury holidays"
                            : "City tours, Adventure activities, Cultural experiences"
                        }...`}
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        onFocus={() =>
                          searchQuery.trim().length > 2 &&
                          setShowSearchResults(true)
                        }
                      />

                      {/* Dynamic Search Results with Currency */}
                      {showSearchResults && (
                        <div className="search-results">
                          {searchResults.length > 0 ? (
                            <>
                              {searchResults.map((item) => (
                                <div
                                  key={item.id}
                                  className="search-result-item"
                                  onClick={() => {
                                    router.push(getCurrentDetailRoute(item));
                                    setShowSearchResults(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <img
                                    src={
                                      item.imageUrl ||
                                      "/assets/images/destinations/default-tour.jpg"
                                    }
                                    alt={item.name}
                                    className="result-image"
                                    onError={(e) => {
                                      e.target.src =
                                        "/assets/images/destinations/default-tour.jpg";
                                    }}
                                  />
                                  <div className="result-content">
                                    <div className="result-name">
                                      {item.name}
                                    </div>
                                    <div className="result-meta">
                                      {item.location && (
                                        <span className="location">
                                          <i className="fal fa-map-marker-alt" />
                                          {typeof item.location === "string"
                                            ? capitalizeFirstLetter(
                                                item.location
                                              )
                                            : capitalizeFirstLetter(
                                                item.location.name || ""
                                              )}
                                        </span>
                                      )}
                                      <span className="price">
                                        {selectedCurrency}{" "}
                                        {formatPrice(
                                          convertPrice(
                                            parseFloat(item.price),
                                            activeTab === "packages"
                                              ? item.currency || "AED"
                                              : "AED"
                                          )
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                className="search-result-item"
                                style={{
                                  background: "#f8f9fa",
                                  borderTop: "1px solid #e5e7eb",
                                  justifyContent: "center",
                                  color: "#f8853d",
                                  fontWeight: "500",
                                }}
                                onClick={handleSearch}
                              >
                                <i
                                  className="fal fa-search"
                                  style={{ marginRight: "8px" }}
                                />
                                View all results for "{searchQuery}"
                              </div>
                            </>
                          ) : (
                            <div className="no-results">
                              No {activeTab} found for "{searchQuery}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="search-button" onClick={handleSearch}>
                      <i className="fal fa-search" />
                      Search {activeTab === "packages" ? "Packages" : "Tours"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab !== "packages" && activeTab !== "tours" && (
                <div className="coming-soon-message">
                  <i className="fal fa-clock" />
                  <h4>
                    {services.find((s) => s.id === activeTab)?.title} Coming
                    Soon
                  </h4>
                  <p>
                    We're working hard to bring you this service. Stay tuned for
                    updates!
                  </p>
                </div>
              )}
            </div>
          </div>
        </SearchWidget>

        {/* Platform Services Overview */}
        <PlatformServices>
          <div className="container">
            <div className="text-center">
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Complete Travel Solutions
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Discover our comprehensive range of travel services designed to
                make your journey seamless and memorable
              </p>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${
                    service.available ? "available" : "coming-soon"
                  }`}
                  onClick={() => {
                    if (service.available) {
                      if (service.id === "packages") {
                        router.push("/holidays");
                      } else if (service.id === "tours") {
                        router.push("/tours");
                      }
                    }
                  }}
                >
                  {!service.available && (
                    <div className="status-badge">Coming Soon</div>
                  )}

                  <div className="service-icon">
                    <i className={service.icon} />
                  </div>

                  <h4>{service.title}</h4>
                  <p>{service.description}</p>

                  <div className="service-stats">
                    <div className="stat">
                      <span className="number">{service.stats.number}</span>
                      <span className="label">{service.stats.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PlatformServices>

        {/* Dynamic Popular Destinations */}
        <PopularDestinations>
          <div className="container">
            <div className="text-center">
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Popular Destinations
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto 0",
                }}
              >
                Discover our most sought-after travel destinations with
                exclusive {activeTab === "packages" ? "packages" : "tours"}
              </p>
            </div>

            <div className="destinations-grid">
              {isCurrentTabLoading()
                ? // Loading skeletons - show 4 skeleton boxes
                  Array.from({ length: 4 }).map((_, idx) => (
                    <SkeletonLoader
                      key={idx}
                      height="200px"
                      width="100%"
                      style={{ borderRadius: "16px" }}
                    />
                  ))
                : getPopularDestinations().length === 0
                ? // Empty state - show 4 placeholder boxes instead of full width message
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="destination-card"
                      style={{
                        cursor: "default",
                        opacity: 0.6,
                        background: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: "center",
                        padding: "40px 20px",
                      }}
                    >
                      <div
                        className="overlay"
                        style={{ background: "transparent" }}
                      />
                      <div
                        className="content"
                        style={{ position: "static", color: "#64748b" }}
                      >
                        <i
                          className="fal fa-map-marked-alt"
                          style={{
                            fontSize: "2rem",
                            color: "#d1d5db",
                            marginBottom: "12px",
                            display: "block",
                          }}
                        />
                        <h5
                          style={{
                            color: "#374151",
                            fontSize: "1rem",
                            marginBottom: "4px",
                          }}
                        >
                          No Destinations
                        </h5>
                        <p
                          style={{ fontSize: "12px", opacity: 0.8, margin: 0 }}
                        >
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  ))
                : // Actual destinations
                  getPopularDestinations().map((destination, index) => (
                    <div
                      key={index}
                      className="destination-card"
                      onClick={() => {
                        const route = getCurrentRoute();
                        router.push(
                          `${route}?location=${encodeURIComponent(
                            destination.name
                          )}`
                        );
                      }}
                    >
                      <div
                        className="background"
                        style={{ backgroundImage: `url(${destination.image})` }}
                      />
                      <div className="overlay" />
                      <div className="content">
                        <h5>{destination.name}</h5>
                        <p>{destination.packages}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </PopularDestinations>

        {/* Featured Packages/Tours with Dynamic Category Filters */}
        <FeaturedSection>
          <div className="container">
            <div className="section-header">
              <h3>
                Featured {activeTab === "packages" ? "Packages" : "Tours"}
              </h3>
              <Link href={getCurrentRoute()} className="view-all">
                View All {activeTab === "packages" ? "Packages" : "Tours"}
                <i className="fal fa-arrow-right" />
              </Link>
            </div>

            {/* Dynamic Category Filters */}
            <div className="filters">
              <button
                className={`filter-btn ${
                  activeCategory === "all" ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter("all")}
              >
                All {activeTab === "packages" ? "Packages" : "Tours"}
              </button>
              {getCurrentCategories().map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${
                    activeCategory === category.name ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  {capitalizeFirstLetter(category.name)}
                </button>
              ))}
            </div>

            <div className="row">
              {isCurrentTabLoading() ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <SkeletonLoader
                      height="320px"
                      width="100%"
                      style={{ borderRadius: "16px" }}
                    />
                  </div>
                ))
              ) : getCurrentData().length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i
                    className="fal fa-map-marked-alt"
                    style={{
                      fontSize: "3rem",
                      color: "#d1d5db",
                      marginBottom: "16px",
                    }}
                  />
                  <h4 style={{ color: "#374151", marginBottom: "8px" }}>
                    No {activeTab === "packages" ? "Packages" : "Tours"}{" "}
                    Available
                    {activeCategory !== "all" &&
                      ` in ${capitalizeFirstLetter(activeCategory)} Category`}
                  </h4>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    {activeCategory !== "all"
                      ? `Try selecting a different category or check back soon for new ${activeTab}!`
                      : `Check back soon for exciting new ${
                          activeTab === "packages"
                            ? "travel packages"
                            : "tours and activities"
                        }!`}
                  </p>
                </div>
              ) : (
                getCurrentData().map((item) => (
                  <div
                    key={item.id}
                    className="col-xl-3 col-lg-4 col-md-6 mb-4"
                  >
                    {activeTab === "packages"
                      ? renderPackageCard(item)
                      : renderTourCard(item)}
                  </div>
                ))
              )}
            </div>
          </div>
        </FeaturedSection>

        {/* Platform Stats */}
        <section
          style={{
            padding: "60px 0",
            background:
              "linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%)",
            color: "white",
          }}
        >
          <div className="container">
            <div className="text-center" style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "white",
                }}
              >
                Why Choose Royal Dusk Tours?
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  opacity: 0.9,
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Join thousands of satisfied travelers who trust us with their
                journey
              </p>
            </div>

            <div className="row">
              <div className="col-md-3 col-6 mb-4">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    <Counter end={packagesData.items.length} />+
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Active Packages
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    <Counter end={toursData.items.length} />+
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Tours
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    <Counter end={getCurrentLocations().length} />+
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Destinations
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="text-center">
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    24/7
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Support Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Travel Categories */}
        <section style={{ padding: "60px 0", background: "white" }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                Browse by Category
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Find the perfect travel experience that matches your interests
                and style
              </p>
            </div>

            <div className="row">
              {isCurrentTabLoading() ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="col-md-4 mb-4">
                    <SkeletonLoader
                      height="120px"
                      width="100%"
                      style={{ borderRadius: "16px" }}
                    />
                  </div>
                ))
              ) : getCurrentCategories().length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i
                    className="fal fa-tags"
                    style={{
                      fontSize: "3rem",
                      color: "#d1d5db",
                      marginBottom: "16px",
                    }}
                  />
                  <h4 style={{ color: "#374151", marginBottom: "8px" }}>
                    No Categories Available
                  </h4>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Check back soon for exciting new categories!
                  </p>
                </div>
              ) : (
                getCurrentCategories()
                  .slice(0, 6)
                  .map((category, index) => {
                    // Map category names to appropriate icons
                    const getCategoryIcon = (categoryName) => {
                      const name = categoryName.toLowerCase();
                      switch (name) {
                        case "adventure":
                          return "fal fa-mountain";
                        case "culture":
                          return "fal fa-landmark";
                        case "family":
                          return "fal fa-users";
                        case "luxury":
                          return "fal fa-crown";
                        case "honeymoon":
                          return "fal fa-heart";
                        case "weekend":
                          return "fal fa-calendar";
                        case "spiritual":
                          return "fal fa-om";
                        case "beach":
                          return "fal fa-umbrella-beach";
                        case "nature":
                          return "fal fa-tree";
                        case "food":
                          return "fal fa-utensils";
                        default:
                          return "fal fa-map-marked-alt";
                      }
                    };

                    const getCategoryDescription = (categoryName) => {
                      const name = categoryName.toLowerCase();
                      switch (name) {
                        case "adventure":
                          return "Thrilling experiences for the adventurous soul";
                        case "culture":
                          return "Immerse yourself in local traditions and heritage";
                        case "family":
                          return "Perfect getaways for family bonding time";
                        case "luxury":
                          return "Premium experiences with world-class service";
                        case "honeymoon":
                          return "Romantic getaways for newlyweds";
                        case "weekend":
                          return "Quick escapes for busy professionals";
                        case "spiritual":
                          return "Sacred journeys for inner peace";
                        case "beach":
                          return "Sun, sand, and relaxation by the ocean";
                        case "nature":
                          return "Explore the beauty of natural landscapes";
                        case "food":
                          return "Culinary adventures and local delicacies";
                        default:
                          return "Discover amazing travel experiences";
                      }
                    };

                    return (
                      <div key={category.id} className="col-md-4 mb-4">
                        <Link
                          href={`${getCurrentRoute()}?category=${encodeURIComponent(
                            category.name
                          )}`}
                          className="action-card"
                          style={{
                            height: "120px",
                            padding: "24px",
                            textDecoration: "none",
                            background: "#fef7f0",
                            borderRadius: "16px",
                            border: "1px solid #fed7aa",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            color: "inherit",
                          }}
                          onMouseEnter={(e) => {
                            const card = e.currentTarget;
                            const icon = card.querySelector(".icon");
                            const content = card.querySelector(".content");
                            card.style.background = "#f8853d";
                            card.style.transform = "translateY(-4px)";
                            card.style.boxShadow =
                              "0 8px 32px rgba(248, 133, 61, 0.25)";
                            if (icon) icon.style.background = "white";
                            if (icon) icon.style.color = "#f8853d";
                            if (content) {
                              const h6 = content.querySelector("h6");
                              const p = content.querySelector("p");
                              if (h6) h6.style.color = "white";
                              if (p) p.style.color = "rgba(255, 255, 255, 0.9)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            const card = e.currentTarget;
                            const icon = card.querySelector(".icon");
                            const content = card.querySelector(".content");
                            card.style.background = "#fef7f0";
                            card.style.transform = "translateY(0)";
                            card.style.boxShadow = "none";
                            if (icon) icon.style.background = "#f8853d";
                            if (icon) icon.style.color = "white";
                            if (content) {
                              const h6 = content.querySelector("h6");
                              const p = content.querySelector("p");
                              if (h6) h6.style.color = "inherit";
                              if (p) p.style.color = "#64748b";
                            }
                          }}
                        >
                          <div
                            className="icon"
                            style={{
                              width: "60px",
                              height: "60px",
                              background: "#f8853d",
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <i
                              className={getCategoryIcon(category.name)}
                              style={{ fontSize: "24px" }}
                            />
                          </div>
                          <div className="content">
                            <h6
                              style={{
                                fontSize: "16px",
                                marginBottom: "8px",
                                color: "inherit",
                              }}
                            >
                              {`${capitalizeFirstLetter(category.name)} ${
                                activeTab === "packages" ? "Packages" : "Tours"
                              }`}
                            </h6>
                            <p
                              style={{
                                fontSize: "14px",
                                margin: 0,
                                color: "#64748b",
                              }}
                            >
                              {getCategoryDescription(category.name)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <Subscribe />
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default HomePage;
