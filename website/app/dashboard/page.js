"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/common/context/AuthContext";
import { useWishlist } from "@/common/context/WishlistContext";
import ReveloLayout from "@/layout/ReveloLayout";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { userApi, bookingApi } from "@/common/api";
import { confirmDialog } from "@/utility/ConfirmDialog";

// Keep all your existing styled components (unchanged)
const DashboardContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%);
  padding: 60px 0 40px;
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
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserAvatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background: #10b981;
    border-radius: 50%;
    border: 3px solid white;
  }
`;

const UserDetails = styled.div`
  color: white;

  .greeting {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 8px 0;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .email {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;

  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: block;
  }

  .stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #f8853d;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: ${(props) => (props.active ? "#f8853d" : "#fef7f0")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${(props) => (props.active ? "#f8853d" : "#fed7aa")};

  &:hover {
    background: ${(props) => (props.active ? "#e67428" : "#f8853d")};
    color: white;
    transform: translateX(4px);
  }

  i {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: 30px 40px;
  border-bottom: 1px solid #fef7f0;
  background: #fefaf7;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    i {
      color: #f8853d;
    }
  }

  p {
    color: #64748b;
    margin: 0;
    font-size: 15px;
  }
`;

const ContentBody = styled.div`
  padding: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #374151;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #f8853d;
    font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #fed7aa;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #fefbf8;

  &:focus {
    outline: none;
    border-color: #f8853d;
    background: white;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #f59e0b;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: flex-start;

  &:hover {
    background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
  }

  &:disabled {
    background: #fed7aa;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  i {
    font-size: 14px;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const BookingCard = styled.div`
  background: #fefbf8;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.15);
    border-color: #f8853d;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const BookingTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  i {
    color: #f8853d;
    font-size: 1.1rem;
  }
`;

const BookingStatus = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) =>
    props.status === "Confirmed" ? "#dcfce7" : "#fef3c7"};
  color: ${(props) => (props.status === "Confirmed" ? "#166534" : "#92400e")};
  border: 1px solid
    ${(props) => (props.status === "Confirmed" ? "#bbf7d0" : "#fde68a")};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;

    i {
      color: #f8853d;
    }
  }

  .value {
    font-size: 15px;
    color: #1e293b;
    font-weight: 600;
    margin: 0;
  }
`;

const BookingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #fed7aa;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .amount {
    font-size: 1.2rem;
    font-weight: 700;
    color: #f8853d;
  }

  .payment-status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    background: #dcfce7;
    color: #166534;
    text-transform: uppercase;
  }
`;

const BookingDate = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #f8853d;
  }
`;

// Enhanced Wishlist Styles (keep all existing ones)
const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WishlistCard = styled.div`
  background: #fefbf8;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(248, 133, 61, 0.2);
    border-color: #f8853d;
  }
`;

const WishlistImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #fed7aa 0%, #f8853d 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const PriorityBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => {
    switch(props.priority) {
      case 'High': return 'rgba(239, 68, 68, 0.9)';
      case 'Medium': return 'rgba(245, 158, 11, 0.9)';
      case 'Low': return 'rgba(34, 197, 94, 0.9)';
      default: return 'rgba(107, 114, 128, 0.9)';
    }
  }};
  backdrop-filter: blur(10px);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(239, 68, 68, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);

  ${WishlistCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }

  i {
    font-size: 14px;
  }
`;

const WishlistContent = styled.div`
  padding: 20px;
`;

const WishlistTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WishlistLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 12px;

  i {
    color: #f8853d;
    font-size: 12px;
  }
`;

const WishlistPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .price {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f8853d;
  }

  .duration {
    font-size: 12px;
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 6px;
  }
`;

const WishlistMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;

    i {
      color: #f8853d;
      font-size: 11px;
    }
  }
`;

const WishlistNotes = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  
  .notes-text {
    font-size: 12px;
    color: #374151;
    line-height: 1.4;
    font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const WishlistActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.primary {
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #e2e8f0;
      color: #374151;
    }
  }

  i {
    font-size: 12px;
  }
`;

const PrioritySelect = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;

  label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
  }

  select {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 11px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #f8853d;
    }
  }
`;

const WishlistFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #fefaf7;
  border-radius: 12px;
  border: 1px solid #fed7aa;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #fed7aa;
    border-radius: 6px;
    background: white;
    font-size: 13px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #f8853d;
    }
  }
`;

const BulkActions = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #fefaf7;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .bulk-title {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .bulk-button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &.clear {
      background: #ef4444;
      color: white;

      &:hover {
        background: #dc2626;
      }
    }

    &.priority {
      background: #f59e0b;
      color: white;

      &:hover {
        background: #d97706;
      }
    }

    &.remove {
      background: #64748b;
      color: white;

      &:hover {
        background: #475569;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #fef7f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fed7aa;

    i {
      font-size: 2rem;
      color: #f8853d;
    }
  }

  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
  }

  p {
    margin: 0 0 24px 0;
    font-size: 15px;
    line-height: 1.6;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
      text-decoration: none;
      color: white;
    }

    i {
      font-size: 14px;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
  gap: 12px;

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #fed7aa;
    border-top: 3px solid #f8853d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Helper functions (unchanged)
const getDetailPath = (itemType, itemId) => {
  switch (itemType?.toLowerCase()) {
    case 'package':
      return `/holiday-details/${itemId}`;
    case 'tour':
      return `/tour-details/${itemId}`;
    case 'hotel':
      return `/hotel-details/${itemId}`;
    case 'activity':
      return `/activity-details/${itemId}`;
    default:
      return `/holiday-details/${itemId}`;
  }
};

const getBookingPath = (itemType, itemId) => {
  const type = itemType?.toLowerCase() || 'package';
  return `/booking?id=${itemId}&type=${type}`;
};

const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getInitial = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase();
};

export default function DashboardPage() {
  const { userInfo, logout, isAuthLoading } = useAuth();
  const { 
    wishlistItems, 
    wishlistLoading, 
    getUserWishlist, 
    removeFromWishlist, 
    updateWishlistItem,
    bulkRemoveItems,
    bulkUpdatePriority,
    clearWishlist
  } = useWishlist();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [wishlistFilters, setWishlistFilters] = useState({
    sortBy: "dateAdded",
    priceRange: "all",
    priority: "all"
  });
  
  // FIXED: Better state management to prevent multiple API calls
  const [dataLoaded, setDataLoaded] = useState({
    bookings: false,
    wishlist: false
  });
  
  // Use ref to track if requests are in progress
  const requestsInProgress = useRef({
    bookings: false,
    wishlist: false
  });

  // Memoized user data (stable references)
  const userEmail = useMemo(() => userInfo?.email, [userInfo?.email]);
  const userId = useMemo(() => userInfo?.id, [userInfo?.id]);

  // FIXED: Optimized fetch function with proper request prevention
  const fetchUserBookings = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (!userEmail || requestsInProgress.current.bookings || dataLoaded.bookings) {
      return;
    }
    
    try {
      requestsInProgress.current.bookings = true;
      setBookingLoading(true);
      
      const data = { email: userEmail };
      const response = await bookingApi.getBookingByEmail(data);
      
      if (response.success) {
        setUserBookings(response.data);
        setDataLoaded(prev => ({ ...prev, bookings: true }));
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setBookingLoading(false);
      requestsInProgress.current.bookings = false;
    }
  }, [userEmail, dataLoaded.bookings]);

  // FIXED: Optimized wishlist fetch with proper request prevention
  const fetchWishlistData = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (!userId || requestsInProgress.current.wishlist || dataLoaded.wishlist || wishlistItems.length > 0) {
      return;
    }
    
    try {
      requestsInProgress.current.wishlist = true;
      await getUserWishlist();
      setDataLoaded(prev => ({ ...prev, wishlist: true }));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      requestsInProgress.current.wishlist = false;
    }
  }, [userId, dataLoaded.wishlist, wishlistItems.length, getUserWishlist]);

  // Memoized filtered wishlist items
  const filteredWishlistItems = useMemo(() => {
    return wishlistItems
      .filter(item => {
        // Priority filter
        if (wishlistFilters.priority !== "all" && item.priority !== wishlistFilters.priority) {
          return false;
        }

        // Price range filter
        if (wishlistFilters.priceRange !== "all") {
          const itemData = item.package || item.tour || item.hotel || item.activity;
          const price = itemData?.price || itemData?.cost || 0;
          
          switch (wishlistFilters.priceRange) {
            case "under500": return price < 500;
            case "500to1000": return price >= 500 && price <= 1000;
            case "over1000": return price > 1000;
            default: return true;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        const aData = a.package || a.tour || a.hotel || a.activity;
        const bData = b.package || b.tour || b.hotel || b.activity;
        
        switch (wishlistFilters.sortBy) {
          case "dateAdded": 
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "priceHigh": 
            return (bData?.price || bData?.cost || 0) - (aData?.price || aData?.cost || 0);
          case "priceLow": 
            return (aData?.price || aData?.cost || 0) - (bData?.price || bData?.cost || 0);
          case "name": 
            return (aData?.name || aData?.title || '').localeCompare(bData?.name || bData?.title || '');
          case "priority":
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          default: 
            return 0;
        }
      });
  }, [wishlistItems, wishlistFilters]);

  // FIXED: Optimized navigation handler
  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
    
    // Only trigger data loading when switching to a tab, not on every render
    if (tab === "bookings" && userEmail && !dataLoaded.bookings) {
      fetchUserBookings();
    } else if (tab === "wishlist" && userId && !dataLoaded.wishlist) {
      fetchWishlistData();
    }
  }, [activeTab, router, userEmail, userId, dataLoaded.bookings, dataLoaded.wishlist, fetchUserBookings, fetchWishlistData]);

  // Form handlers (unchanged)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await userApi.updateUser(userInfo.id, {
        name: formData.name,
      });
      if (response.status) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Something went wrong while updating profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [loading, userInfo?.id, formData.name]);

  // Wishlist handlers (unchanged)
  const handleRemoveFromWishlist = useCallback(async (itemId) => {
    await removeFromWishlist(itemId);
  }, [removeFromWishlist]);

  const handleUpdatePriority = useCallback(async (itemId, priority) => {
    await updateWishlistItem(itemId, { priority });
  }, [updateWishlistItem]);

  const handleBulkUpdatePriority = useCallback(async () => {
    const nonHighPriorityItems = wishlistItems
      .filter(item => item.priority !== 'High')
      .map(item => item.id);
    
    if (nonHighPriorityItems.length > 0) {
      await bulkUpdatePriority(nonHighPriorityItems, 'High');
    } else {
      toast.info('All items are already set to High priority');
    }
  }, [wishlistItems, bulkUpdatePriority]);

const handleClearWishlist = useCallback(async () => {
  const confirmed = await confirmDialog({
    title: "Clear your wishlist?",
    text: "All saved items will be removed.",
    confirmButtonText: "Yes, clear it",
  });

  if (confirmed) {
    await clearWishlist();
  }
}, [clearWishlist]);

const handleBulkRemoveItems = useCallback(async () => {
  const confirmed = await confirmDialog({
    title: `Remove ${wishlistItems.length} items?`,
    text: "This will permanently remove all selected wishlist items.",
    confirmButtonText: "Remove All",
  });

  if (confirmed) {
    const allItemIds = wishlistItems.map(item => item.id);
    await bulkRemoveItems(allItemIds);
  }
}, [wishlistItems, bulkRemoveItems]);

  // FIXED: Optimized effects with better dependency management
  useEffect(() => {
    if (isAuthLoading) return;

    if (!userInfo) {
      router.push("/login");
      return;
    }

    // Update form data only when userInfo changes
    setFormData({
      name: userInfo.name || "",
      email: userInfo.email || "",
    });

    // Handle URL tab parameter only once on mount or when userInfo changes
    const tab = searchParams.get("tab");
    if (tab && ["profile", "bookings", "wishlist"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [isAuthLoading, userInfo, router]); // Removed searchParams from dependencies

  // FIXED: Separate effect for initial data loading based on URL tab
  useEffect(() => {
    if (!userInfo || isAuthLoading) return;

    const tab = searchParams.get("tab");
    
    // Load initial data based on URL tab parameter
    if (tab === "bookings" && userEmail && !dataLoaded.bookings && !requestsInProgress.current.bookings) {
      fetchUserBookings();
    } else if (tab === "wishlist" && userId && !dataLoaded.wishlist && !requestsInProgress.current.wishlist) {
      fetchWishlistData();
    }
  }, [userInfo, isAuthLoading, searchParams]); // Only depend on these core values

  // FIXED: Reset data loaded flags when user changes
  useEffect(() => {
    if (userInfo) {
      setDataLoaded({ bookings: false, wishlist: false });
      requestsInProgress.current = { bookings: false, wishlist: false };
    }
  }, [userInfo?.id]); // Only reset when user ID changes

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <ContentHeader>
              <h2>
                <i className="fal fa-user-circle" />
                Profile Settings
              </h2>
              <p>Manage your account information and preferences</p>
            </ContentHeader>
            <ContentBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">
                    <i className="fal fa-user" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">
                    <i className="fal fa-envelope" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    placeholder="Your email address"
                  />
                  <HelpText>
                    <i className="fal fa-info-circle" />
                    Email address cannot be changed for security reasons
                  </HelpText>
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="fal fa-save" />
                      Save Changes
                    </>
                  )}
                </SubmitButton>
              </Form>
            </ContentBody>
          </>
        );

      case "bookings":
        return (
          <>
            <ContentHeader>
              <h2>
                <i className="fal fa-calendar-check" />
                My Bookings
              </h2>
              <p>Track your travel bookings and itineraries</p>
            </ContentHeader>
            <ContentBody>
              {bookingLoading ? (
                <LoadingState>
                  <div className="spinner" />
                  Loading your bookings...
                </LoadingState>
              ) : userBookings.length > 0 ? (
                <BookingsGrid>
                  {userBookings.map((booking) => (
                    <BookingCard key={booking.id}>
                      <BookingHeader>
                        <BookingTitle>
                          <i className="fal fa-map-marked-alt" />
                          {booking.packageName}
                        </BookingTitle>
                        <BookingStatus status={booking.status}>
                          {booking.status}
                        </BookingStatus>
                      </BookingHeader>

                      <BookingDetails>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-calendar" />
                            Travel Date
                          </div>
                          <p className="value">
                            {new Date(booking.travelDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-users" />
                            Travelers
                          </div>
                          <p className="value">{booking.travelers} People</p>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-money-bill" />
                            Currency
                          </div>
                          <p className="value">
                            {booking.currency?.toUpperCase() || "N/A"}
                          </p>
                        </DetailItem>
                      </BookingDetails>

                      <BookingFooter>
                        <PaymentInfo>
                          <span className="amount">
                            {booking.currency?.toUpperCase()}{" "}
                            {booking.totalAmountPaid / 100}
                          </span>
                          <span className="payment-status">
                            {booking.paymentStatus}
                          </span>
                        </PaymentInfo>
                        <BookingDate>
                          <i className="fal fa-clock" />
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </BookingDate>
                      </BookingFooter>
                    </BookingCard>
                  ))}
                </BookingsGrid>
              ) : (
                <EmptyState>
                  <div className="empty-icon">
                    <i className="fal fa-calendar-alt" />
                  </div>
                  <h3>No Bookings Yet</h3>
                  <p>
                    Start exploring our amazing holiday packages and plan your
                    next adventure! Discover destinations around the world with
                    our curated travel experiences.
                  </p>
                  <Link href="/holidays" className="cta-button">
                    <i className="fal fa-compass" />
                    Browse Packages
                  </Link>
                </EmptyState>
              )}
            </ContentBody>
          </>
        );

      case "wishlist":
        return (
          <>
            <ContentHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <h2>
                    <i className="fal fa-heart" />
                    My Wishlist
                  </h2>
                  <p>Your saved holiday packages and dream destinations</p>
                </div>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={handleClearWishlist}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#dc2626'}
                    onMouseOut={(e) => e.target.style.background = '#ef4444'}
                  >
                    <i className="fal fa-trash" />
                    Clear All
                  </button>
                )}
              </div>
            </ContentHeader>
            <ContentBody>
              {wishlistLoading ? (
                <LoadingState>
                  <div className="spinner" />
                  Loading your wishlist...
                </LoadingState>
              ) : wishlistItems.length > 0 ? (
                <>
                  <WishlistFilters>
                    <FilterGroup>
                      <label>Sort by:</label>
                      <select
                        value={wishlistFilters.sortBy}
                        onChange={(e) =>
                          setWishlistFilters(prev => ({
                            ...prev,
                            sortBy: e.target.value
                          }))
                        }
                      >
                        <option value="dateAdded">Date Added</option>
                        <option value="priority">Priority</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="name">Name A-Z</option>
                      </select>
                    </FilterGroup>
                    <FilterGroup>
                      <label>Priority:</label>
                      <select
                        value={wishlistFilters.priority}
                        onChange={(e) =>
                          setWishlistFilters(prev => ({
                            ...prev,
                            priority: e.target.value
                          }))
                        }
                      >
                        <option value="all">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </FilterGroup>
                    <FilterGroup>
                      <label>Price Range:</label>
                      <select
                        value={wishlistFilters.priceRange}
                        onChange={(e) =>
                          setWishlistFilters(prev => ({
                            ...prev,
                            priceRange: e.target.value
                          }))
                        }
                      >
                        <option value="all">All Prices</option>
                        <option value="under500">Under $500</option>
                        <option value="500to1000">$500 - $1000</option>
                        <option value="over1000">Over $1000</option>
                      </select>
                    </FilterGroup>
                    <div style={{ flex: 1 }} />
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fal fa-heart" style={{ color: '#f8853d' }} />
                      {filteredWishlistItems.length} {filteredWishlistItems.length === 1 ? 'item' : 'items'} saved
                    </div>
                  </WishlistFilters>

                  <WishlistGrid>
                    {filteredWishlistItems.map((item) => {
                      const itemData = item.package || item.tour || item.hotel || item.activity;
                      const itemType = item.itemType || 'Package';
                      const itemId = item.packageId || item.tourId || item.hotelId || item.activityId;
                      
                      if (!itemData) return null;

                      return (
                        <WishlistCard key={item.id}>
                          <WishlistImageContainer>
                            <img 
                              src={itemData.imageUrl || itemData.images?.[0] || "/api/placeholder/320/200"} 
                              alt={itemData.name || itemData.title}
                              onError={(e) => {
                                e.target.src = "/api/placeholder/320/200";
                              }}
                            />
                            <PriorityBadge priority={item.priority}>
                              {item.priority} Priority
                            </PriorityBadge>
                            <RemoveButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromWishlist(item.id);
                              }}
                              title="Remove from wishlist"
                            >
                              <i className="fal fa-times" />
                            </RemoveButton>
                          </WishlistImageContainer>

                          <WishlistContent>
                            <WishlistTitle>{itemData.name || itemData.title}</WishlistTitle>
                            
                            <WishlistLocation>
                              <i className="fal fa-map-marker-alt" />
                              {capitalizeFirstLetter(
                                itemData.location?.name || 
                                itemData.destination || 
                                itemData.city || 
                                "Multiple Destinations"
                              )}
                            </WishlistLocation>

                            <WishlistMeta>
                              <div className="meta-item">
                                <i className="fal fa-tag" />
                                {capitalizeFirstLetter(
                                  itemData.category?.name || 
                                  itemData.type || 
                                  itemType
                                )}
                              </div>
                              {itemData.duration && (
                                <div className="meta-item">
                                  <i className="fal fa-clock" />
                                  {itemData.duration} {itemData.duration === 1 ? 'Day' : 'Days'}
                                </div>
                              )}
                              {itemData.rating && (
                                <div className="meta-item">
                                  <i className="fal fa-star" />
                                  {itemData.rating}/5
                                </div>
                              )}
                            </WishlistMeta>

                            <WishlistPrice>
                              <div className="price">
                                {formatCurrency(itemData.price || itemData.cost, itemData.currency || 'USD')}
                                {itemData.per && (
                                  <span style={{ fontSize: '14px', fontWeight: '400', color: '#64748b' }}>
                                    /{itemData.per}
                                  </span>
                                )}
                              </div>
                              <div className="duration">
                                Added {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </WishlistPrice>

                            {item.notes && (
                              <WishlistNotes>
                                <div className="notes-text">{item.notes}</div>
                              </WishlistNotes>
                            )}

                            <WishlistActions>
                              <ActionButton 
                                className="primary"
                                onClick={() => {
                                  const detailPath = getDetailPath(itemType, itemId);
                                  router.push(detailPath);
                                }}
                              >
                                <i className="fal fa-eye" />
                                View Details
                              </ActionButton>
                              <ActionButton 
                                className="secondary"
                                onClick={() => {
                                  const bookingPath = getBookingPath(itemType, itemId);
                                  router.push(bookingPath);
                                }}
                              >
                                <i className="fal fa-calendar-plus" />
                                Book Now
                              </ActionButton>
                            </WishlistActions>

                            <PrioritySelect>
                              <label>Priority:</label>
                              <select
                                value={item.priority}
                                onChange={(e) => {
                                  handleUpdatePriority(item.id, e.target.value);
                                }}
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </PrioritySelect>
                          </WishlistContent>
                        </WishlistCard>
                      );
                    })}
                  </WishlistGrid>

                  {wishlistItems.length > 1 && (
                    <BulkActions>
                      <span className="bulk-title">Bulk Actions:</span>
                      <button
                        onClick={handleBulkUpdatePriority}
                        className="bulk-button priority"
                      >
                        Set All High Priority
                      </button>
                      <button
                        onClick={handleBulkRemoveItems}
                        className="bulk-button remove"
                      >
                        Remove All Items
                      </button>
                    </BulkActions>
                  )}
                </>
              ) : (
                <EmptyState>
                  <div className="empty-icon">
                    <i className="fal fa-heart" />
                  </div>
                  <h3>Your Wishlist is Empty</h3>
                  <p>
                    Start building your dream vacation! Browse our amazing holiday 
                    packages and save your favorites to create the perfect travel wishlist.
                    You can easily compare packages and book when you're ready.
                  </p>
                  <Link href="/holidays" className="cta-button">
                    <i className="fal fa-search" />
                    Explore Packages
                  </Link>
                </EmptyState>
              )}
            </ContentBody>
          </>
        );

      default:
        return null;
    }
  };

  if (!userInfo) return null;

  return (
    <ReveloLayout>
      <DashboardContainer>
        <HeaderSection>
          <HeaderContent>
            <UserProfile>
              <UserAvatar>
                {userInfo.profileImage ? (
                  <img src={userInfo.profileImage} alt={userInfo.name} />
                ) : (
                  getInitial(userInfo.name)
                )}
              </UserAvatar>
              <UserDetails>
                <div className="greeting">Welcome back</div>
                <h1>{userInfo.name}</h1>
                <p className="email">{userInfo.email}</p>
              </UserDetails>
            </UserProfile>

            <QuickStats>
              <StatCard>
                <span className="stat-number">{userBookings.length}</span>
                <span className="stat-label">Total Bookings</span>
              </StatCard>
              <StatCard>
                <span className="stat-number">
                  {userBookings.filter((b) => b.status === "Confirmed").length}
                </span>
                <span className="stat-label">Confirmed</span>
              </StatCard>
              <StatCard>
                <span className="stat-number">{wishlistItems.length}</span>
                <span className="stat-label">Wishlist Items</span>
              </StatCard>
            </QuickStats>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <Sidebar>
            <SidebarTitle>
              <i className="fal fa-cog" />
              Dashboard Menu
            </SidebarTitle>
            <SidebarNav>
              <NavItem
                active={activeTab === "profile"}
                onClick={() => handleTabChange("profile")}
              >
                <i className="fal fa-user-circle" />
                Profile Settings
              </NavItem>
              <NavItem
                active={activeTab === "bookings"}
                onClick={() => handleTabChange("bookings")}
              >
                <i className="fal fa-calendar-check" />
                My Bookings
              </NavItem>
              <NavItem
                active={activeTab === "wishlist"}
                onClick={() => handleTabChange("wishlist")}
              >
                <i className="fal fa-heart" />
                My Wishlist
                {wishlistItems.length > 0 && (
                  <span style={{
                    backgroundColor: '#f8853d',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    marginLeft: 'auto'
                  }}>
                    {wishlistItems.length}
                  </span>
                )}
              </NavItem>
            </SidebarNav>
          </Sidebar>

          <ContentArea>{renderContent()}</ContentArea>
        </MainContent>
      </DashboardContainer>
    </ReveloLayout>
  );
}