"use client";

import Modal from "@/components/Modal";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-hot-toast";
import { packageApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { activityIcons } from "@/utility/activityIcons";
import { useRouter } from "next/navigation";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
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

const CurrencySelector = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;

  .currency-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #fed7aa;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    color: #374151;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: #f8853d;
      box-shadow: 0 0 0 2px rgba(248, 133, 61, 0.1);
    }
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

  .duration-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(248, 133, 61, 0.95);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }

  .rating-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(10px);

    .stars {
      display: flex;
      gap: 2px;

      i {
        font-size: 12px;
        color: #f8853d;
      }
    }

    .count {
      font-size: 12px;
      margin-left: 4px;
    }
  }

  .wishlist-area {
    position: absolute;
    bottom: 20px;
    left: 20px;
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

const InclusionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .inclusion-section {
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;

      i {
        color: #f8853d;

        &.fa-times {
          color: #dc2626;
        }
      }
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .list-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 14px;
        line-height: 1.5;

        i {
          margin-top: 2px;
          font-size: 12px;
          color: #f8853d;

          &.fa-times {
            color: #dc2626;
          }
        }

        span {
          color: #374151;
        }
      }
    }
  }
`;

const Timeline = styled.div`
  .timeline-item {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      left: 19px;
      top: 40px;
      bottom: -24px;
      width: 2px;
      background: #fed7aa;
    }

    .day-marker {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: #f8853d;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(248, 133, 61, 0.3);
    }

    .day-content {
      flex: 1;
      background: #fef7f0;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #fed7aa;

      .entries {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .entry {
          .entry-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 6px;
          }

          .entry-description {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin: 0;
          }
        }
      }
    }
  }
`;

const PolicySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .policy-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #fed7aa;
    overflow: hidden;

    .policy-header {
      padding: 16px 20px;
      background: #fef7f0;
      border-bottom: 1px solid #fed7aa;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
      }
    }

    .policy-content {
      padding: 20px;
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
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

  .package-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .rating-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;

    .stars {
      display: flex;
      gap: 2px;

      i {
        font-size: 14px;
        color: #f8853d;
      }
    }

    .review-count {
      font-size: 14px;
      color: #64748b;
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
    }

    .original-price {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;

      .base-currency {
        text-decoration: line-through;
        opacity: 0.6;
      }
    }

    .per-person {
      font-size: 13px;
      color: #64748b;
    }

    .currency-note {
      font-size: 11px;
      color: #64748b;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #fed7aa;
      font-style: italic;
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

const Page = ({ params }) => {
  const [showModal, setShowModal] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);
  const router = useRouter();

  const packageId = params.packageId;
  const [packageDetail, setPackagedetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    selectedCurrency,
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencyInfo,
    baseCurrency,
  } = useCurrency();

  // Available currencies
  const availableCurrencies = [
    { code: "AED", name: "UAE Dirham" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "SAR", name: "Saudi Riyal" },
  ];

  useEffect(() => {
    async function fetchPackageDetail(packageId) {
      if (packageId) {
        try {
          setLoading(true);
          const response = await packageApi.getPackageById(packageId);
          const packageDetailData = response.data;
          setPackagedetail(packageDetailData);
        } catch (err) {
          setError("Failed to load package details.");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchPackageDetail(packageId);
  }, [packageId]);

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

  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
  };

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

  if (error || !packageDetail) {
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
              <h3>Package Not Found</h3>
              <p>
                The package you're looking for doesn't exist or has been
                removed.
              </p>
              <Link href="/holidays" style={{ color: "#f8853d" }}>
                ← Back to Packages
              </Link>
            </div>
          </div>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  const convertedPrice = convertPrice(
    packageDetail.price,
    baseCurrency,
    selectedCurrency
  );
  const showOriginalPrice = selectedCurrency !== baseCurrency;

  return (
    <ReveloLayout>
      <Modal
        isOpen={showModal}
        packageId={packageDetail?.id}
        packageDetail={packageDetail}
        onClose={() => setShowModal(false)}
      />
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
                <Link href="/holidays">Packages</Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item">
                <Link href="#">
                  {capitalizeFirstLetter(packageDetail.location.name)}
                </Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item active">{packageDetail.name}</div>
            </Breadcrumb>

            <CurrencySelector>
              <span className="currency-label">Currency:</span>
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
          </HeaderContainer>
        </HeaderSection>

        <MainContent>
          <ContentSection>
            <HeroSection>
              <HeroImage>
                <img src={packageDetail.imageUrl} alt={packageDetail.name} />
                <div className="duration-badge">
                  {packageDetail.duration}D / {packageDetail.duration - 1}N
                </div>
                <div className="rating-badge">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={
                          i < (packageDetail.review || 0)
                            ? "fas fa-star"
                            : "far fa-star"
                        }
                      />
                    ))}
                  </div>
                  <span className="count">({packageDetail.review})</span>
                </div>
                <div className="wishlist-area">
                  <CardWishlistButton
                    itemId={packageId}
                    itemType="Package"
                    size="medium"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      zIndex: 10,
                    }}
                  />
                </div>
              </HeroImage>
              <HeroContent>
                <div className="location">
                  <i className="fal fa-map-marker-alt" />
                  <span>
                    {capitalizeFirstLetter(packageDetail.location.name)}
                  </span>
                </div>
                <h1>{packageDetail.name}</h1>
                <p className="description">{packageDetail.description}</p>
              </HeroContent>
            </HeroSection>

            <InfoCard>
              <div className="card-header">
                <h3>Features & Activities</h3>
              </div>
              <div className="card-content">
                <FeatureGrid>
                  {packageDetail.features &&
                  packageDetail.features.length > 0 ? (
                    packageDetail.features.map((feature) => {
                      const iconClass =
                        activityIcons[feature.name.toLowerCase()] ||
                        "fas fa-check";
                      return (
                        <div key={feature.id} className="feature-item">
                          <i className={iconClass} />
                          <span>{feature.name}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="feature-item">
                      <i className="fas fa-info-circle" />
                      <span>No features available</span>
                    </div>
                  )}
                </FeatureGrid>
              </div>
            </InfoCard>

            <InfoCard>
              <div className="card-header">
                <h3>What's Included</h3>
              </div>
              <div className="card-content">
                <InclusionGrid>
                  <div className="inclusion-section">
                    <div className="title">
                      <i className="fas fa-check" />
                      <span>Included</span>
                    </div>
                    <div className="list">
                      {packageDetail.inclusions &&
                      packageDetail.inclusions.length > 0 ? (
                        packageDetail.inclusions.map((item) => (
                          <div key={item.id} className="list-item">
                            <i className="fas fa-check" />
                            <span>{item.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="list-item">
                          <i className="fas fa-info-circle" />
                          <span>No inclusions specified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="inclusion-section">
                    <div className="title">
                      <i className="fas fa-times" />
                      <span>Not Included</span>
                    </div>
                    <div className="list">
                      {packageDetail.exclusions &&
                      packageDetail.exclusions.length > 0 ? (
                        packageDetail.exclusions.map((item) => (
                          <div key={item.id} className="list-item">
                            <i className="fas fa-times" />
                            <span>{item.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="list-item">
                          <i className="fas fa-info-circle" />
                          <span>No exclusions specified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </InclusionGrid>
              </div>
            </InfoCard>

            {packageDetail.timeline && packageDetail.timeline.length > 0 && (
              <InfoCard>
                <div className="card-header">
                  <h3>Day-by-Day Itinerary</h3>
                </div>
                <div className="card-content">
                  <Timeline>
                    {packageDetail.timeline.map((dayItem, index) => (
                      <div key={index} className="timeline-item">
                        <div className="day-marker">{dayItem.day}</div>
                        <div className="day-content">
                          <div className="entries">
                            {dayItem.entries.map((entry, entryIndex) => (
                              <div key={entryIndex} className="entry">
                                <div className="entry-title">{entry.title}</div>
                                <p className="entry-description">
                                  {entry.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Timeline>
                </div>
              </InfoCard>
            )}

            {packageDetail.importantInfo && (
              <InfoCard>
                <div className="card-header">
                  <h3>Important Information</h3>
                </div>
                <div className="card-content">
                  <p style={{ margin: 0, color: "#64748b", lineHeight: "1.6" }}>
                    {packageDetail.importantInfo}
                  </p>
                </div>
              </InfoCard>
            )}

            <PolicySection>
              {packageDetail.policy?.visaDetail && (
                <div className="policy-card">
                  <div className="policy-header">
                    <h4>Visa Requirements</h4>
                  </div>
                  <div className="policy-content">
                    {packageDetail.policy.visaDetail}
                  </div>
                </div>
              )}

              {packageDetail.policy?.bookingPolicy && (
                <div className="policy-card">
                  <div className="policy-header">
                    <h4>Booking Policy</h4>
                  </div>
                  <div className="policy-content">
                    {packageDetail.policy.bookingPolicy}
                  </div>
                </div>
              )}

              {packageDetail.policy?.cancellationPolicy && (
                <div className="policy-card">
                  <div className="policy-header">
                    <h4>Cancellation Policy</h4>
                  </div>
                  <div className="policy-content">
                    {packageDetail.policy.cancellationPolicy}
                  </div>
                </div>
              )}

              {packageDetail.policy?.paymentTerms && (
                <div className="policy-card">
                  <div className="policy-header">
                    <h4>Payment Terms</h4>
                  </div>
                  <div className="policy-content">
                    {packageDetail.policy.paymentTerms}
                  </div>
                </div>
              )}
            </PolicySection>
          </ContentSection>

          <SidebarCard>
            <h2 className="package-title">{packageDetail.name}</h2>

            <div className="rating-section">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={
                      i < (packageDetail.review || 0)
                        ? "fas fa-star"
                        : "far fa-star"
                    }
                  />
                ))}
              </div>
              <span className="review-count">
                {packageDetail.review} reviews
              </span>
            </div>

            <div className="price-section">
              <div className="price-label">Starting from</div>
              <div className="price">{formatPrice(convertedPrice)}</div>
              {showOriginalPrice && (
                <div className="original-price">
                  Original:{" "}
                  <span className="base-currency">
                    {getCurrencyInfo(baseCurrency).symbol} {packageDetail.price}
                  </span>
                </div>
              )}
              <div className="per-person">per person</div>
              {selectedCurrency !== baseCurrency && (
                <div className="currency-note">
                  Prices converted from {baseCurrency} and may vary based on
                  current exchange rates
                </div>
              )}
            </div>

            <div className="action-buttons">
              <ActionButton
                className={`book-now ${
                  animatingId === packageDetail?.id ? "animate" : ""
                }`}
                onClick={() => handleBookNow(packageDetail)}
              >
                <i className="fal fa-calendar-check" />
                Book Now
              </ActionButton>

              <ActionButton
                className="secondary"
                onClick={() => setShowModal(true)}
              >
                <i className="fal fa-envelope" />
                Send Inquiry
              </ActionButton>
            </div>

            <MetaInfo>
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fal fa-clock" />
                </div>
                <div className="meta-value">{packageDetail.duration} Days</div>
                <div className="meta-label">Duration</div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fal fa-hotel" />
                </div>
                <div className="meta-value">{packageDetail.hotels}</div>
                <div className="meta-label">Hotels</div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fal fa-tag" />
                </div>
                <div className="meta-value">{packageDetail.category.name}</div>
                <div className="meta-label">Category</div>
              </div>
            </MetaInfo>
          </SidebarCard>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;
