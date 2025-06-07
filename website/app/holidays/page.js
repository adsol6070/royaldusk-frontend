"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SkeletonLoader from "@/components/SkeletonLoader";
import { packageApi } from "@/common/api";
import ReveloLayout from "@/layout/ReveloLayout";
import Banner from "@/components/Banner";
import SortComponent from "@/components/SortComponent";
import { activityIcons } from "@/utility/activityIcons";
import FilterSidebar from "@/components/FilterSidebar";
import styled, { keyframes } from "styled-components";
import { useCart } from "@/common/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const addToCartAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const SidebarContainer = styled.div`
  @media (max-width: 1000px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  font-weight: 500;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &.add-to-cart {
    background-color: #ee8b50;
    color: white;
    &:hover {
      background-color: #e56d1f;
    }
    &.animate {
      animation: ${addToCartAnimation} 0.5s ease;
    }
  }

  &.view-cart {
    background-color: #28a745;
    color: white;
    &:hover {
      background-color: #218838;
    }
  }

  i {
    font-size: 16px;
  }
`;

const PackageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #ee8b50;

  .currency {
    font-size: 14px;
    color: #666;
  }
`;

const HolidayListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  console.log("packages ", packages);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await packageApi.getAllPackages();
        const packagesData = response.data;

        const availablePackages = packagesData.filter(
          (packageItem) => packageItem.availability !== "ComingSoon"
        );

        setPackages(availablePackages);
        setFilteredPackages(availablePackages);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  const handleAddToCart = (packageItem) => {
    setAnimatingId(packageItem.id);
    addToCart(packageItem);
    toast.success("Package added to cart!");
    setTimeout(() => {
      setAnimatingId(null);
    }, 500);
  };

  const handleViewCart = () => {
    router.push("/cart");
  };

  const isInCart = (packageId) => {
    return cartItems.some((item) => item.id === packageId);
  };

  const handleFilterChange = useCallback(
    ({ priceRange, categories, nights, searchTerm }) => {
      let filtered = [...packages];

      // Price Filtering
      filtered = filtered.filter(
        (pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
      );

      // Category Filtering
      if (categories.length) {
        filtered = filtered.filter((pkg) =>
          categories.includes(pkg.category?.name)
        );
      }

      // Nights Filtering (duration - 1 = nights)
      if (nights.length) {
        filtered = filtered.filter((pkg) => {
          const nightsCount = Math.max(1, pkg.duration - 1);
          return nights.includes(nightsCount);
        });
      }

      // Search Term Filtering
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (pkg) =>
            pkg.name.toLowerCase().includes(searchLower) ||
            pkg.location.toLowerCase().includes(searchLower)
        );
      }

      setFilteredPackages(filtered);
    },
    [packages]
  );
  return (
    <ReveloLayout>
      <Banner pageTitle="Holidays" pageName="Holiday Packages" />

      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          {loading ? (
            <SkeletonLoader count={4} width="100%" height="120px" />
          ) : (
            <div className="row">
              <SidebarContainer className="col-lg-3 col-md-6 col-sm-10">
                <FilterSidebar
                  data={packages}
                  onFilterChange={handleFilterChange}
                />
              </SidebarContainer>

              <div className="col-lg-9">
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                  <div>
                    {filteredPackages.length}{" "}
                    {filteredPackages.length === 1 ? "Package" : "Packages"}{" "}
                    Found
                  </div>
                  <SortComponent
                    data={packages}
                    setData={setFilteredPackages}
                    controls={["price", "date"]}
                  />
                </div>

                {filteredPackages.length === 0 ? (
                  <p
                    className="no-packages-text text-center"
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      padding: "20px 0",
                    }}
                  >
                    No packages available.
                  </p>
                ) : (
                  filteredPackages.map((packageItem) => (
                    <div
                      key={packageItem.id}
                      className="destination-item style-three bgc-lighter mb-4"
                    >
                      <div className="image position-relative">
                        <Link href={`/holiday-details/${packageItem.id}`}>
                          <img
                            src={packageItem.imageUrl}
                            alt={packageItem.name}
                            height={350}
                            width={600}
                            style={{ objectFit: "cover", width: "100%" }}
                          />
                        </Link>
                      </div>

                      <div className="content">
                        <div className="destination-header d-flex justify-content-between align-items-center">
                          <span className="location">
                            <i className="fal fa-map-marker-alt" />{" "}
                            {capitalizeFirstLetter(packageItem.location.name)}
                          </span>

                          <div className="ratting">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={
                                  i < (packageItem.review || 0)
                                    ? "fas fa-star"
                                    : "far fa-star"
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <h5>
                          <Link href={`/holiday-details/${packageItem.id}`}>
                            {packageItem.name}
                          </Link>
                        </h5>

                        <p>
                          {packageItem.description.length > 100
                            ? `${packageItem.description.slice(0, 100)}...`
                            : packageItem.description}
                        </p>

                        <ul className="blog-meta d-flex flex-wrap">
                          <li className="text-sm">
                            <i className="fas fa-tags" />{" "}
                            {packageItem.category.name}
                          </li>
                          <li className="text-sm">
                            <i className="far fa-hotel" /> Hotels:{" "}
                            {packageItem.hotels}
                          </li>
                        </ul>

                        <ul className="blog-meta d-flex flex-wrap">
                          {packageItem.features.map((item) => {
                            const iconClass =
                              activityIcons[item.name.toLowerCase()] ||
                              "fas fa-map-marked-alt";

                            return (
                              <li
                                key={item.id}
                                className="text-sm me-3 mb-2 d-flex align-items-center"
                              >
                                <i
                                  className={iconClass}
                                  style={{ marginRight: "8px" }}
                                />
                                {item.name}
                              </li>
                            );
                          })}
                        </ul>

                        <PackageFooter>
                          <Price>
                            <span className="currency">
                              {packageItem.currency}{" "}
                            </span>
                            {packageItem.price}
                          </Price>
                          {isInCart(packageItem.id) ? (
                            <ActionButton
                              className="view-cart"
                              onClick={handleViewCart}
                            >
                              <i className="fal fa-shopping-cart"></i>
                              VIEW CART
                            </ActionButton>
                          ) : (
                            <ActionButton
                              className={`add-to-cart ${
                                animatingId === packageItem.id ? "animate" : ""
                              }`}
                              onClick={() => handleAddToCart(packageItem)}
                            >
                              <i className="fal fa-shopping-cart"></i>
                              ADD TO CART
                            </ActionButton>
                          )}
                        </PackageFooter>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </ReveloLayout>
  );
};

export default HolidayListPage;
