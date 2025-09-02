"use client";

import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Heart, Loader2 } from "lucide-react";
import { useWishlist } from "@/common/context/WishlistContext";
import { useAuth } from "@/common/context/AuthContext";

// Keyframe animations
const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled button component
const StyledWishlistButton = styled.button`
  /* Reset and base styles */
  all: unset;
  box-sizing: border-box;
  
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  /* Size variations */
  ${props => {
    switch (props.$size) {
      case 'small':
        return css`
          width: 36px;
          height: 36px;
          border-radius: 18px;
        `;
      case 'large':
        return css`
          width: 48px;
          height: 48px;
          border-radius: 24px;
        `;
      default:
        return css`
          width: 42px;
          height: 42px;
          border-radius: 21px;
        `;
    }
  }}
  
  /* State-based styling */
  ${props => props.$isInWishlist ? css`
    /* SAVED STATE - Beautiful red gradient */
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
    border: 2px solid #ffffff;
    box-shadow: 
      0 4px 12px rgba(239, 68, 68, 0.3),
      0 2px 6px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
      transform: scale(1.05);
      box-shadow: 
        0 6px 20px rgba(239, 68, 68, 0.4),
        0 4px 12px rgba(239, 68, 68, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  ` : css`
    /* NOT SAVED STATE - Clean white with subtle shadow */
    background: #ffffff;
    border: 2px solid #e5e7eb;
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.1),
      0 1px 4px rgba(0, 0, 0, 0.06);
    
    &:hover {
      background: #fafafa;
      border-color: #d1d5db;
      transform: scale(1.05);
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.08);
    }
    
    &:active {
      transform: scale(0.95);
      background: #f3f4f6;
    }
  `}
  
  /* Transitions */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Focus state */
  &:focus {
    outline: none;
    box-shadow: 
      ${props => props.$isInWishlist 
        ? '0 0 0 3px rgba(239, 68, 68, 0.3)' 
        : '0 0 0 3px rgba(59, 130, 246, 0.3)'
      };
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* Cursor */
  cursor: pointer;
`;

const HeartIcon = styled(Heart)`
  ${props => props.$isInWishlist ? css`
    /* Filled heart - white color */
    color: #ffffff;
    fill: #ffffff;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    animation: ${heartbeat} 2s ease-in-out infinite;
    
    ${StyledWishlistButton}:hover & {
      transform: scale(1.1);
    }
  ` : css`
    /* Outline heart - gray color */
    color: #6b7280;
    fill: none;
    stroke-width: 2;
    
    ${StyledWishlistButton}:hover & {
      color: #ef4444;
      transform: scale(1.1);
    }
  `}
  
  transition: all 0.2s ease-out;
`;

const LoadingSpinner = styled(Loader2)`
  color: ${props => props.$isInWishlist ? '#ffffff' : '#6b7280'};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Ripple effect component
const RippleEffect = styled.div`
  position: absolute;
  border-radius: 50%;
  background: ${props => props.$isInWishlist ? 'rgba(255, 255, 255, 0.4)' : 'rgba(239, 68, 68, 0.3)'};
  transform: scale(0);
  animation: ${ripple} 0.3s ease-out;
  pointer-events: none;
`;

// Shimmer effect for saved state
const ShimmerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%);
  animation: ${shimmer} 2s infinite;
  pointer-events: none;
  border-radius: inherit;
`;

// Main component
export const CardWishlistButton = ({
  itemId,
  itemType,
  className = "",
  size = "medium", // "small", "medium", "large"
  disabled = false,
  onToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const {
    isItemInWishlist,
    addToWishlist,
    removeFromWishlist,
    getWishlistItemByItemId,
    wishlistLoading,
  } = useWishlist();

  if (!isAuthenticated) return null;

  const isInWishlist = isItemInWishlist(itemId);
  const wishlistItem = getWishlistItemByItemId(itemId);
  const [showRipple, setShowRipple] = React.useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || wishlistLoading) return;

    // Trigger ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 300);

    try {
      if (isInWishlist) {
        if (wishlistItem) {
          const success = await removeFromWishlist(wishlistItem.id);
          if (success && onToggle) onToggle(false);
        }
      } else {
        const success = await addToWishlist({
          itemType,
          itemId,
          priority: "Medium",
          notes: "",
        });
        if (success && onToggle) onToggle(true);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 18;
      case 'large': return 26;
      default: return 22;
    }
  };

  return (
    <StyledWishlistButton
      onClick={handleClick}
      disabled={disabled || wishlistLoading}
      $isInWishlist={isInWishlist}
      $size={size}
      className={className}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {wishlistLoading ? (
        <LoadingSpinner 
          size={getIconSize()} 
          $isInWishlist={isInWishlist}
        />
      ) : (
        <HeartIcon
          size={getIconSize()}
          $isInWishlist={isInWishlist}
        />
      )}
      
      {/* Ripple effect on click */}
      {showRipple && (
        <RippleEffect $isInWishlist={isInWishlist} />
      )}
      
      {/* Shimmer effect for saved state */}
      {isInWishlist && <ShimmerOverlay />}
    </StyledWishlistButton>
  );
};

// Usage examples
export const ProductCardWishlist = ({ itemId, itemType }) => (
  <CardWishlistButton
    itemId={itemId}
    itemType={itemType}
    size="medium"
    className="wishlist-overlay"
    style={{ 
      position: 'absolute', 
      top: '12px', 
      right: '12px', 
      zIndex: 10 
    }}
  />
);

export const SmallCardWishlist = ({ itemId, itemType }) => (
  <CardWishlistButton
    itemId={itemId}
    itemType={itemType}
    size="small"
    style={{ 
      position: 'absolute', 
      top: '8px', 
      right: '8px', 
      zIndex: 10 
    }}
  />
);

export const LargeCardWishlist = ({ itemId, itemType }) => (
  <CardWishlistButton
    itemId={itemId}
    itemType={itemType}
    size="large"
    style={{ 
      position: 'absolute', 
      top: '16px', 
      right: '16px', 
      zIndex: 10 
    }}
  />
);