"use client";

import Modal from "@/components/Modal";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { packageApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { activityIcons } from "@/utility/activityIcons";

const page = ({ params }) => {
  const [showModal, setShowModal] = useState(false);

  const packageId = params.packageId;
  // const packageId = "cbf394b2-20fa-4699-8545-1f79741980c0";
  const [packageDetail, setPackagedetail] = useState(null);
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
            class="pt-3 pb-4 text-center"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
            <h2 class="mb-3">Package Detail</h2>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li class="breadcrumb-item">
                  <a href="#">Holidays</a>
                </li>
                <li class="breadcrumb-item">
                  <a href="#">{packageDetail.location}</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {packageDetail.name}
                </li>
              </ol>
            </nav>
          </div>
          <section
            class="bg-light"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <div class="container">
              <div class="position-relative">
                <div class="ratio ratio-16x9">
                  <img
                    src={`${packageDetail.imageUrl}`}
                    alt={packageDetail.name}
                    class="w-100 img-fluid object-fit-cover"
                  />
                </div>

                <div
                  class="position-absolute top-0 start-0 text-white px-2 py-1 small fw-bold"
                  style={{ backgroundColor: "#ee8b50" }}
                >
                  {packageDetail.duration}
                </div>

                <div
                  class="d-none d-md-block position-absolute top-50 end-0 translate-middle-y bg-white shadow p-4 me-4"
                  style={{ width: "300px;", zIndex: "10;" }}
                >
                  <h4>{packageDetail.name}</h4>
                  <div class="mb-2">
                    <span class="text-warning">
                      &#9733;&#9733;&#9733;&#9733;&#9734;
                    </span>
                    <span class="text-muted small ms-2">{packageDetail.review} Reviews</span>
                  </div>
                  <div class="border p-3 text-center mt-3">
                    <small class="text-muted d-block">From {packageDetail.currency}</small>
                    <div class="h3 fw-bold mb-1">{packageDetail.price}</div>
                    <small class="text-muted">Per Person</small>
                  </div>
                  <div class="d-grid mt-3">
                    <button
                      class="btn text-white fw-bold"
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

              <div class="d-block d-md-none bg-white shadow p-4 mt-3">
                <h4>{packageDetail.name}</h4>
                <div class="mb-2">
                  <span class="text-warning">
                    &#9733;&#9733;&#9733;&#9733;&#9734;
                  </span>
                  <span class="text-muted small ms-2">{packageDetail.review} Reviews</span>
                </div>
                <div class="border p-3 text-center mt-3">
                  <small class="text-muted d-block">From {packageDetail.currency}</small>
                  <div class="h3 fw-bold mb-1">{packageDetail.price}</div>
                  <small class="text-muted">Per Person</small>
                </div>
                <div class="d-grid mt-3">
                  <button
                    class="btn text-white fw-bold"
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
                          <div className="tour-activity-item">
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
                        {packageDetail.itineraries.length > 0 ? (
                          packageDetail.itineraries.map((item, index) => (
                            <div className="timeline-item d-flex flex-column flex-md-row align-items-start align-items-md-center mb-5 position-relative">
                              <div className="timeline-day text-center mb-3 mb-md-0 me-md-4 position-relative">
                                <div className="bg-white border border-2 rounded-pill px-3 py-1 text-secondary fw-semibold shadow-sm z-2">
                                  Day {index + 1}
                                </div>
                                <div className="timeline-dot position-absolute top-50 start-0 translate-middle bg-secondary rounded-circle"></div>
                              </div>
                              <div className="timeline-content m-2 p-4 bg-light rounded w-100">
                                <h5 className="fw-semibold">{item.title}</h5>
                                <p className="text-muted mb-0">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="tour-activity-item">
                            <b>No features available.</b>
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
        </div>
      )}
      {/* Tour Details Area end */}
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

export default page;
