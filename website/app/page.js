"use client";
import Counter from "@/components/Counter";
import SearchFilter from "@/components/SearchFilter";
import SectionTitle from "@/components/SectionTitle";
import Destination from "@/components/slider/Destination";
import HotDeals from "@/components/slider/HotDeals";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { packageApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useCart } from "@/common/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";

const addToCartAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
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
    .packages-search {
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

const FeaturedPackages = styled.section`
  padding: 40px 0;

  .packages-header {
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
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #059669;
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
  }

  .content {
    padding: 20px;

    .package-meta {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;

      .duration {
        font-size: 12px;
        color: #64748b;
        background: #fef7f0;
        padding: 4px 8px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 4px;

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

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .price {
        font-weight: 700;
        color: #1e293b;
        font-size: 16px;

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

  &.add-to-cart {
    background-color: #f8853d;
    color: white;
    &:hover {
      background-color: #e67428;
      transform: translateY(-1px);
    }
    &.animate {
      animation: ${addToCartAnimation} 0.5s ease;
    }
  }

  &.view-cart {
    background-color: #059669;
    color: white;
    &:hover {
      background-color: #047857;
      transform: translateY(-1px);
    }
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 32px;
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

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("packages");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, cartItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await packageApi.getAllPackages();
        const availablePackages = response.data.filter(
          (pkg) => pkg.availability !== "ComingSoon"
        );
        setFeaturedPackages(availablePackages.slice(0, 8));
      } catch (err) {
        console.error("Failed to load featured packages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (packageItem) => {
    setAnimatingId(packageItem.id);
    addToCart(packageItem);
    toast.success("Package added to cart!");
    setTimeout(() => setAnimatingId(null), 500);
  };

  const handleLocationClick = (location) => {
    if (location?.name) {
      router.push(`/holidays?location=${encodeURIComponent(location.name)}`);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/holidays?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/holidays");
    }
  };

  const isInCart = (id) => cartItems.some((item) => item.id === id);
  const handleViewCart = () => router.push("/cart");

  const services = [
    {
      id: "packages",
      icon: "fal fa-route",
      title: "Travel Packages",
      description:
        "Complete tour packages with accommodation, meals, and guided experiences",
      available: true,
      stats: { number: "120+", label: "Packages" },
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
    {
      id: "tours",
      icon: "fal fa-map-marked",
      title: "Custom Tours",
      description: "Personalized tour experiences tailored to your preferences",
      available: false,
      stats: { number: "Soon", label: "Experiences" },
    },
  ];

  const popularDestinations = [
    {
      name: "Manali",
      packages: "15 packages",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      name: "Goa",
      packages: "12 packages",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
    },
    {
      name: "Kerala",
      packages: "18 packages",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
    },
    {
      name: "Rajasthan",
      packages: "22 packages",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop",
    },
  ];

  return (
    <ReveloLayout>
      <PlatformContainer>
        {/* Enhanced Platform Hero */}
        <PlatformHero>
          <div className="container">
            <div className="hero-content">
              <h1>Royal Dusk Tours</h1>
              <p className="platform-description">
                From curated travel packages to flight bookings, hotel
                reservations, and custom tours - we're building the ultimate
                travel experience platform.
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
                <div
                  key={service.id}
                  className={`tab ${activeTab === service.id ? "active" : ""} ${
                    !service.available ? "coming-soon" : ""
                  }`}
                  onClick={() => service.available && setActiveTab(service.id)}
                >
                  <i className={service.icon} />
                  {service.title}
                </div>
              ))}
            </div>

            <div className="search-content">
              {activeTab === "packages" && (
                <div className="packages-search">
                  <div className="search-grid">
                    <div className="search-field">
                      <label className="label">
                        Search destinations, packages, or experiences
                      </label>
                      <input
                        type="text"
                        className="search-input"
                        placeholder="e.g. Manali, Adventure tours, Beach holidays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <button className="search-button" onClick={handleSearch}>
                      <i className="fal fa-search" />
                      Search Packages
                    </button>
                  </div>
                </div>
              )}

              {activeTab !== "packages" && (
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
                  onClick={() =>
                    service.available &&
                    service.id === "packages" &&
                    router.push("/holidays")
                  }
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

        {/* Popular Destinations */}
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
                exclusive packages
              </p>
            </div>

            <div className="destinations-grid">
              {popularDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="destination-card"
                  onClick={() =>
                    router.push(
                      `/holidays?location=${encodeURIComponent(
                        destination.name
                      )}`
                    )
                  }
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

        {/* Featured Packages */}
        <FeaturedPackages>
          <div className="container">
            <div className="packages-header">
              <h3>Featured Packages</h3>
              <Link href="/holidays" className="view-all">
                View All Packages
                <i className="fal fa-arrow-right" />
              </Link>
            </div>

            <div className="filters">
              <button className="filter-btn active">All Packages</button>
              <button className="filter-btn">Adventure</button>
              <button className="filter-btn">Family</button>
              <button className="filter-btn">Luxury</button>
              <button className="filter-btn">Budget</button>
            </div>

            <div className="row">
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <SkeletonLoader
                      height="320px"
                      width="100%"
                      style={{ borderRadius: "16px" }}
                    />
                  </div>
                ))
              ) : featuredPackages.length === 0 ? (
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
                    No Packages Available
                  </h4>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Check back soon for exciting new travel packages!
                  </p>
                </div>
              ) : (
                featuredPackages.map((pkg) => (
                  <div key={pkg.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <PackageCard>
                      <div className="image">
                        <img src={pkg.imageUrl} alt={pkg.name} />
                        <div className="status-badge">Available</div>
                        {pkg.location?.name && (
                          <div
                            className="location-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLocationClick(pkg.location);
                            }}
                          >
                            <i className="fal fa-map-marker-alt" />
                            {pkg.location.name}
                          </div>
                        )}
                      </div>
                      <div className="content">
                        <div className="package-meta">
                          <div className="duration">
                            <i className="fal fa-clock" />
                            {pkg.duration || "5 Days"}
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
                          <Link href={`/holiday-details/${pkg.id}`}>
                            {pkg.name}
                          </Link>
                        </h6>

                        <div className="footer">
                          <span className="price">
                            {pkg.currency} {pkg.price}
                            <small>/person</small>
                          </span>
                          {isInCart(pkg.id) ? (
                            <ActionButton
                              className="view-cart"
                              onClick={handleViewCart}
                            >
                              <i className="fal fa-eye" /> View Cart
                            </ActionButton>
                          ) : (
                            <ActionButton
                              className={`add-to-cart ${
                                animatingId === pkg.id ? "animate" : ""
                              }`}
                              onClick={() => handleAddToCart(pkg)}
                            >
                              <i className="fal fa-plus" /> Add to Cart
                            </ActionButton>
                          )}
                        </div>
                      </div>
                    </PackageCard>
                  </div>
                ))
              )}
            </div>
          </div>
        </FeaturedPackages>

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
                    <Counter end={120} />+
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
                    <Counter end={50} />+
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
                    <Counter end={2500} />+
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Happy Customers
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

        {/* Travel Categories */}
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
              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=adventure"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                      className="fal fa-mountain"
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
                      Adventure Tours
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Thrilling experiences for the adventurous soul
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=family"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                    <i className="fal fa-users" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="content">
                    <h6
                      style={{
                        fontSize: "16px",
                        marginBottom: "8px",
                        color: "inherit",
                      }}
                    >
                      Family Packages
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Perfect getaways for family bonding time
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=luxury"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                    <i className="fal fa-crown" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="content">
                    <h6
                      style={{
                        fontSize: "16px",
                        marginBottom: "8px",
                        color: "inherit",
                      }}
                    >
                      Luxury Tours
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Premium experiences with world-class service
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=honeymoon"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                    <i className="fal fa-heart" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="content">
                    <h6
                      style={{
                        fontSize: "16px",
                        marginBottom: "8px",
                        color: "inherit",
                      }}
                    >
                      Honeymoon Specials
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Romantic getaways for newlyweds
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=weekend"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                      className="fal fa-calendar-weekend"
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
                      Weekend Getaways
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Quick escapes for busy professionals
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-md-4 mb-4">
                <Link
                  href="/holidays?category=spiritual"
                  className="action-card d-block"
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
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f8853d";
                    e.target.style.color = "white";
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(248, 133, 61, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fef7f0";
                    e.target.style.color = "inherit";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
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
                    <i className="fal fa-om" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="content">
                    <h6
                      style={{
                        fontSize: "16px",
                        marginBottom: "8px",
                        color: "inherit",
                      }}
                    >
                      Spiritual Tours
                    </h6>
                    <p
                      style={{ fontSize: "14px", margin: 0, color: "#64748b" }}
                    >
                      Sacred journeys for inner peace
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section style={{ padding: "80px 0", background: "#fef7f0" }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "16px",
                  }}
                >
                  Stay Updated with Latest Offers
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "1.1rem",
                    marginBottom: "32px",
                  }}
                >
                  Subscribe to our newsletter and be the first to know about
                  exclusive deals, new destinations, and special packages.
                </p>
                <div
                  style={{ display: "flex", gap: "12px", maxWidth: "400px" }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: "2px solid #fed7aa",
                      borderRadius: "8px",
                      fontSize: "14px",
                      background: "white",
                    }}
                  />
                  <button
                    style={{
                      padding: "12px 24px",
                      background: "#f8853d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#e67428";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#f8853d";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div
                  style={{
                    width: "300px",
                    height: "300px",
                    background: "linear-gradient(135deg, #f8853d, #e67428)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    color: "white",
                  }}
                >
                  <div>
                    <i
                      className="fal fa-envelope"
                      style={{ fontSize: "4rem", marginBottom: "16px" }}
                    />
                    <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                      Join 10,000+ Travelers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default HomePage;
