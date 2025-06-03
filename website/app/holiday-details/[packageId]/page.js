"use client";

import Modal from "@/components/Modal";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Toaster, toast } from "react-hot-toast";
import { packageApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { activityIcons } from "@/utility/activityIcons";
import { useCart } from "@/common/context/CartContext";
import { useRouter } from "next/navigation";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const Page = ({ params }) => {
  const [showModal, setShowModal] = useState(false);
  const { addToCart, cartItems } = useCart();
  const router = useRouter();

  const packageId = params.packageId;
  const [packageDetail, setPackagedetail] = useState(null);

  console.log("Package Detail:", packageDetail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = () => {
    addToCart(packageDetail);
    toast.success('Package added to cart!');
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  const isInCart = cartItems.some(item => item.id === packageDetail?.id);

  return (
    <ReveloLayout>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      {loading ? (
        <div className="container my-50">
          <SkeletonLoader count={1} width="100%" height="500px" />
        </div>
      ) : (
        <div>
          <div
            className="pt-3 pb-4 text-center"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <h2 className="mb-3">Package Detail</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/holidays">Holidays</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="#">{capitalizeFirstLetter(packageDetail.location.name)}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {packageDetail.name}
                </li>
              </ol>
            </nav>
          </div>

          <section
            className="bg-light"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <div className="container">
              <div className="position-relative">
                <div className="ratio ratio-16x9">
                  <img
                    src={packageDetail.imageUrl}
                    alt={packageDetail.name}
                    className="w-100 img-fluid object-fit-cover"
                  />
                </div>

                <div
                  className="position-absolute top-0 start-0 text-white px-2 py-1 small fw-bold"
                  style={{ backgroundColor: "#ee8b50" }}
                >
                  {`${packageDetail.duration}D / ${packageDetail.duration - 1}N`}
                </div>

                <div
                  className="d-none d-md-block position-absolute top-50 end-0 translate-middle-y bg-white shadow p-4 me-4"
                  style={{ width: "300px", zIndex: "10" }}
                >
                  <h4>{packageDetail.name}</h4>
                  <div className="mb-2">
                    <span className="text-warning">
                      &#9733;&#9733;&#9733;&#9733;&#9734;
                    </span>
                    <span className="text-muted small ms-2">
                      {packageDetail.review} Reviews
                    </span>
                  </div>
                  <div className="border p-3 text-center mt-3">
                    <small className="text-muted d-block">
                      From {packageDetail.currency}
                    </small>
                    <div className="h3 fw-bold mb-1">{packageDetail.price}</div>
                    <small className="text-muted">Per Person</small>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    {isInCart ? (
                      <button
                        className="btn text-white fw-bold"
                        style={{
                          backgroundColor: "#28a745",
                          border: "1px solid #28a745",
                        }}
                        onClick={handleViewCart}
                      >
                        <i className="fal fa-shopping-cart me-2"></i>
                        VIEW CART
                      </button>
                    ) : (
                      <button
                        className="btn text-white fw-bold"
                        style={{
                          backgroundColor: "#ee8b50",
                          border: "1px solid #ee8b50",
                        }}
                        onClick={handleAddToCart}
                      >
                        ADD TO CART
                      </button>
                    )}
                    <button
                      className="btn text-white fw-bold"
                      style={{
                        backgroundColor: "#ee8b50",
                        border: "1px solid #ee8b50",
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      ENQUIRY NOW
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-block d-md-none bg-white shadow p-4 mt-3">
                <h4>{packageDetail.name}</h4>
                <div className="mb-2">
                  <span className="text-warning">
                    &#9733;&#9733;&#9733;&#9733;&#9734;
                  </span>
                  <span className="text-muted small ms-2">
                    {packageDetail.review} Reviews
                  </span>
                </div>
                <div className="border p-3 text-center mt-3">
                  <small className="text-muted d-block">
                    From {packageDetail.currency}
                  </small>
                  <div className="h3 fw-bold mb-1">{packageDetail.price}</div>
                  <small className="text-muted">Per Person</small>
                </div>
                <div className="d-grid gap-2 mt-3">
                  {isInCart ? (
                    <button
                      className="btn text-white fw-bold"
                      style={{
                        backgroundColor: "#28a745",
                        border: "1px solid #28a745",
                      }}
                      onClick={handleViewCart}
                    >
                      <i className="fal fa-shopping-cart me-2"></i>
                      VIEW CART
                    </button>
                  ) : (
                    <button
                      className="btn text-white fw-bold"
                      style={{
                        backgroundColor: "#ee8b50",
                        border: "1px solid #ee8b50",
                      }}
                      onClick={handleAddToCart}
                    >
                      ADD TO CART
                    </button>
                  )}
                  <button
                    className="btn text-white fw-bold"
                    style={{
                      backgroundColor: "#ee8b50",
                      border: "1px solid #ee8b50",
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    ENQUIRY NOW
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Tour Details Area start */}
          <section className="tour-details-page py-50 px-3">
            <div className="container">
              <div className="row">
                <div>
                  <div
                    className="tour-details-content"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Explore Tours</h3>
                    <p>{packageDetail.description} </p>
                    <div className="row pb-55">
                      <div className="col-md-6">
                        <div className="tour-include-exclude mt-30">
                          <h5>Included</h5>
                          <ul className="list-style-one check mt-25">
                            {packageDetail.inclusions.length > 0 ? (
                              packageDetail.inclusions.map((item) => (
                                <li key={item.id}>
                                  <i className="far fa-check check" />
                                  {item.name}
                                </li>
                              ))
                            ) : (
                              <li>No inclusions available.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="tour-include-exclude mt-30">
                          <h5>Excluded</h5>
                          <ul className="list-style-one mt-25">
                            {packageDetail.exclusions.length > 0 ? (
                              packageDetail.exclusions.map((item) => (
                                <li key={item.id}>
                                  <i className="far fa-times" />
                                  {item.name}
                                </li>
                              ))
                            ) : (
                              <li>No exclusions available.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3>Features</h3>
                  <div
                    className="tour-activities mt-30 mb-45"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    {packageDetail.features.length > 0 ? (
                      packageDetail.features.map((item) => {
                        const iconClass =
                          activityIcons[item.name.toLowerCase()] ||
                          "fas fa-map-marked-alt";

                        return (
                          <div className="tour-activity-item" key={item.id}>
                            <i
                              className={iconClass}
                              style={{ marginRight: "8px" }}
                            />
                            <b>{item.name}</b>
                          </div>
                        );
                      })
                    ) : (
                      <div className="tour-activity-item">
                        <b>No features available.</b>
                      </div>
                    )}
                  </div>
                  <TimelineContainer
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <div className="container py-5">
                      <h3 className="fw-bold mb-5">Itinerary</h3>
                      <div className="position-relative">
                        <div className="timeline-line position-absolute top-0 start-0 h-100 bg-secondary"></div>

                        {packageDetail.timeline &&
                        packageDetail.timeline.length > 0 ? (
                          packageDetail.timeline.map((dayItem, index) => (
                            <div
                              key={index}
                              className="timeline-item d-flex flex-column flex-md-row align-items-start align-items-md-center mb-5 position-relative"
                            >
                              <div className="timeline-day text-center mb-3 mb-md-0 me-md-4 position-relative">
                                <div className="bg-white border border-2 rounded-pill px-3 py-1 text-secondary fw-semibold shadow-sm z-2">
                                  Day {dayItem.day}
                                </div>
                                <div className="timeline-dot position-absolute top-50 start-0 translate-middle bg-secondary rounded-circle"></div>
                              </div>

                              <div className="timeline-content m-2 p-4 bg-light rounded w-100">
                                {dayItem.entries.map((entry, entryIndex) => (
                                  <div key={entryIndex} className="mb-3">
                                    <h5 className="fw-semibold mb-1">
                                      {entry.title}
                                    </h5>
                                    <p className="text-muted mb-0">
                                      {entry.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="tour-activity-item">
                            <b>No itinerary available.</b>
                          </div>
                        )}
                      </div>
                    </div>
                  </TimelineContainer>

                  <div
                    className="my-50 p-20 border border-2 border-light rounded"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Important Information</h3>
                    <hr />
                    <p>{packageDetail.importantInfo}</p>
                  </div>

                  <div
                    className="my-50 p-20 border border-2 border-light rounded"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Visa Details</h3>
                    <hr />
                    <p>{packageDetail.policy.visaDetail}</p>
                  </div>

                  <div
                    className="my-50 p-20 border border-2 border-light rounded"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Booking Policy</h3>
                    <hr />
                    <p>{packageDetail.policy.bookingPolicy}</p>
                  </div>

                  <div
                    className="my-50 p-20 border border-2 border-light rounded"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Cancellation Policy</h3>
                    <hr />
                    <p>{packageDetail.policy.cancellationPolicy}</p>
                  </div>

                  <div
                    className="my-50 p-20 border border-2 border-light rounded"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                  >
                    <h3>Payment Terms</h3>
                    <hr />
                    <p>{packageDetail.policy.paymentTerms}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Tour Details Area end */}
        </div>
      )}
    </ReveloLayout>
  );
};

export const TimelineContainer = styled.div`
  .timeline-line {
    width: 2px;
    left: 18px;
  }

  .timeline-day {
    min-width: 90px;
  }

  .timeline-dot {
    width: 12px;
    height: 12px;
    left: -36px;
  }
`;

export default Page;
