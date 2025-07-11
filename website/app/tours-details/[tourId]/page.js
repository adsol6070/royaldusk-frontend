"use client";

import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-hot-toast";
import { tourApi } from "@/common/api"; // Assuming you have tourApi similar to packageApi
import SkeletonLoader from "@/components/SkeletonLoader";
import { useRouter } from "next/navigation";
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
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fef7f0;
    color: #f8853d;
  }

  i {
    font-size: 16px;
  }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .breadcrumb-item {
    color: #64748b;

    a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #f8853d;
      }
    }

    &.active {
      color: #1e293b;
      font-weight: 500;
    }
  }

  .separator {
    color: #fed7aa;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeroSection = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #fed7aa;
  position: relative;
`;

const HeroImage = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .availability-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: ${(props) =>
      props.available ? "rgba(34, 197, 94, 0.95)" : "rgba(239, 68, 68, 0.95)"};
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  .tag-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(248, 133, 61, 0.95);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }
`;

const HeroContent = styled.div`
  padding: 24px;

  .location {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 8px;

    i {
      color: #f8853d;
    }
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 16px 0;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.7rem;
    }
  }

  .description {
    color: #64748b;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  overflow: hidden;

  .card-header {
    padding: 20px;
    border-bottom: 1px solid #fef7f0;
    background: #fef7f0;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 20px;
      right: 20px;
      height: 2px;
      background: #f8853d;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .card-content {
    padding: 20px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: #fef7f0;
    border-radius: 8px;
    border: 1px solid #fed7aa;
    transition: all 0.2s ease;

    &:hover {
      background: #f8853d;
      color: white;
      transform: translateY(-1px);
    }

    i {
      color: #f8853d;
      font-size: 16px;
      width: 20px;
      text-align: center;
      transition: color 0.2s ease;
    }

    &:hover i {
      color: white;
    }

    span {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    &:hover span {
      color: white;
    }
  }
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;
  position: sticky;
  top: 120px;
  height: fit-content;

  @media (max-width: 1024px) {
    position: static;
    order: -1;
  }

  .tour-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .availability-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;

    .availability-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;

      &.available {
        background: #dcfce7;
        color: #16a34a;
      }

      &.unavailable {
        background: #fee2e2;
        color: #dc2626;
      }

      i {
        font-size: 12px;
      }
    }
  }

  .price-section {
    background: #fef7f0;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin-bottom: 24px;

    .price-label {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;

      .currency {
        font-size: 16px;
        color: #64748b;
        font-weight: 500;
      }
    }

    .per-person {
      font-size: 13px;
      color: #64748b;
    }
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
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

  &.primary {
    background: #f8853d;
    color: white;

    &:hover {
      background: #e67428;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
  }

  &.success {
    background: #059669;
    color: white;

    &:hover {
      background: #047857;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: #fef7f0;
    color: #f8853d;
    border: 1px solid #fed7aa;

    &:hover {
      background: #f8853d;
      color: white;
    }
  }

  i {
    font-size: 14px;
  }
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #fed7aa;

  .meta-item {
    text-align: center;

    .meta-icon {
      width: 40px;
      height: 40px;
      background: #fef7f0;
      border: 1px solid #fed7aa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px;

      i {
        color: #f8853d;
        font-size: 16px;
      }
    }

    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .meta-label {
      font-size: 12px;
      color: #64748b;
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

const TourDetailPage = ({ params }) => {
  const router = useRouter();

  const tourId = params.tourId;
  const [tourDetail, setTourDetail] = useState(null);
  const [error, setError] = useState("");
  const [animatingId, setAnimatingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTourDetail(tourId) {
      if (tourId) {
        try {
          setLoading(true);
          const response = await tourApi.getTourById(tourId);
          const tourDetailData = response.data;
          setTourDetail(tourDetailData);
        } catch (err) {
          setError("Failed to load tour details.");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchTourDetail(tourId);
  }, [tourId]);

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
  const isAvailable = tourDetail?.tourAvailability === "Available";

  if (loading) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "30px 20px",
            }}
          >
            <SkeletonLoader count={1} width="100%" height="500px" />
          </div>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  if (error || !tourDetail) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <div>
              <h3>Tour Not Found</h3>
              <p>
                The tour you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/tours-and-activities" style={{ color: "#f8853d" }}>
                ← Back to Tours
              </Link>
            </div>
          </div>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  // Get safe location display
  const locationDisplay = getLocationDisplay(tourDetail.location);

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContainer>
            <BackButton onClick={() => router.back()}>
              <i className="fal fa-arrow-left" />
              <span>Back</span>
            </BackButton>
            <Breadcrumb>
              <div className="breadcrumb-item">
                <Link href="/">Home</Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item">
                <Link href="/tours-and-activities">Tours</Link>
              </div>
              {locationDisplay && (
                <>
                  <span className="separator">/</span>
                  <div className="breadcrumb-item">
                    <Link href="#">{locationDisplay}</Link>
                  </div>
                </>
              )}
              <span className="separator">/</span>
              <div className="breadcrumb-item active">{tourDetail.name}</div>
            </Breadcrumb>
          </HeaderContainer>
        </HeaderSection>

        <MainContent>
          <ContentSection>
            <HeroSection>
              <HeroImage available={isAvailable}>
                <img
                  src={
                    tourDetail.imageUrl ||
                    "/assets/images/destinations/default-tour.jpg"
                  }
                  alt={tourDetail.name}
                  onError={(e) => {
                    e.target.src =
                      "/assets/images/destinations/default-tour.jpg";
                  }}
                />
                <div className="availability-badge">
                  {tourDetail.tourAvailability}
                </div>
                {tourDetail.tag && (
                  <div className="tag-badge">{tourDetail.tag}</div>
                )}
              </HeroImage>
              <HeroContent>
                {locationDisplay && (
                  <div className="location">
                    <i className="fal fa-map-marker-alt" />
                    <span>{locationDisplay}</span>
                  </div>
                )}
                <h1>{tourDetail.name}</h1>
              </HeroContent>
            </HeroSection>

            {tourDetail.description && (
              <InfoCard>
                <div className="card-header">
                  <h3>About This Tour</h3>
                </div>
                <div className="card-content">
                  <div
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#374151",
                      textAlign: "justify",
                    }}
                  >
                    {tourDetail.description}
                  </div>
                </div>
              </InfoCard>
            )}
          </ContentSection>

          <SidebarCard>
            <h2 className="tour-title">{tourDetail.name}</h2>

            <div className="availability-section">
              <div
                className={`availability-status ${
                  isAvailable ? "available" : "unavailable"
                }`}
              >
                <i
                  className={`fas ${
                    isAvailable ? "fa-check-circle" : "fa-exclamation-circle"
                  }`}
                />
                <span>{tourDetail.tourAvailability}</span>
              </div>
            </div>

            <div className="price-section">
              <div className="price-label">Starting from</div>
              <div className="price">
                <span className="currency">AED </span>
                {parseFloat(tourDetail.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="per-person">per person</div>
            </div>

            <div className="action-buttons">
              <ActionButton
                className={`book-now ${
                  animatingId === tourDetail.id ? "animate" : ""
                }`}
                onClick={() => handleBookNow(tourDetail)}
                disabled={tourDetail.tourAvailability !== "Available"}
              >
                <i className="fal fa-calendar-check" />
                Book Now
              </ActionButton>

              <ActionButton
                className="secondary"
                onClick={() => router.push("/contact")}
              >
                <i className="fal fa-phone" />
                Contact Us
              </ActionButton>
            </div>

            <MetaInfo>
              {tourDetail.tag && (
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="fal fa-calendar" />
                  </div>
                  <div className="meta-value">{tourDetail.tag}</div>
                  <div className="meta-label">Tour Type</div>
                </div>
              )}

              {locationDisplay && (
                <div className="meta-item">
                  <div className="meta-icon">
                    <i className="fal fa-map-marker-alt" />
                  </div>
                  <div className="meta-value">{locationDisplay}</div>
                  <div className="meta-label">Location</div>
                </div>
              )}

              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fal fa-clock" />
                </div>
                <div className="meta-value">
                  {new Date(tourDetail.createdAt).toLocaleDateString()}
                </div>
                <div className="meta-label">Created At</div>
              </div>
            </MetaInfo>
          </SidebarCard>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default TourDetailPage;
