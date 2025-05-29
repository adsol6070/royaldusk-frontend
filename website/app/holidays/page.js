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
import styled from "styled-components";

const SidebarContainer = styled.div`
  @media (max-width: 1000px) {
    display: none;
  }
`;

const HolidayListPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("packages data ", packages);

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
          categories.includes(pkg.category.name)
        );
      }

      // Nights Filtering
      if (nights.length) {
        filtered = filtered.filter((pkg) => {
          const nightMatch = pkg.duration.match(/(\d+)N/);
          const nightCount = nightMatch ? parseInt(nightMatch[1]) : null;
          return nights.includes(nightCount);
        });
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
                  <div>{filteredPackages.length} {filteredPackages.length === 1 ? "Package" : "Packages"} Found</div>
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
                            {packageItem.location}
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

                        <p>{packageItem.description}</p>

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

                        <div className="destination-footer d-flex justify-content-between align-items-center">
                          <span className="price">
                            <span>{packageItem.price}</span> / person
                          </span>

                          <Link
                            href={`/holiday-details/${packageItem.id}`}
                            className="theme-btn style-two style-three"
                          >
                            Enquiry <i className="fal fa-arrow-right" />
                          </Link>
                        </div>
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
