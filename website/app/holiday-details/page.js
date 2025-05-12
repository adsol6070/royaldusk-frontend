"use client";
import Modal from "@/components/Modal";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";

const page = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ReveloLayout>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div
        class="pt-3 pb-4 text-center"
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-offset="50"
      >
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
              <a href="#">Dubai</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Arabian Summer Retreat
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
                src="https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/djsv57cgackwxjkftpjg/Half%20Day%20Dubai%20City%20Tour.jpg"
                alt="Beach Retreat"
                class="w-100 img-fluid object-fit-cover"
              />
            </div>

            <div
              class="position-absolute top-0 start-0 text-white px-2 py-1 small fw-bold"
              style={{ backgroundColor: "#ee8b50" }}
            >
              3N / 4D
            </div>

            <div
              class="d-none d-md-block position-absolute top-50 end-0 translate-middle-y bg-white shadow p-4 me-4"
              style={{ width: "300px;", zIndex: "10;" }}
            >
              <h4>Arabian Summer Retreat</h4>
              <div class="mb-2">
                <span class="text-warning">
                  &#9733;&#9733;&#9733;&#9733;&#9734;
                </span>
                <span class="text-muted small ms-2">0 Reviews</span>
              </div>
              <div class="border p-3 text-center mt-3">
                <small class="text-muted d-block">From AED</small>
                <div class="h3 fw-bold mb-1">1189.00</div>
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
            <h4>Arabian Summer Retreat</h4>
            <div class="mb-2">
              <span class="text-warning">
                &#9733;&#9733;&#9733;&#9733;&#9734;
              </span>
              <span class="text-muted small ms-2">0 Reviews</span>
            </div>
            <div class="border p-3 text-center mt-3">
              <small class="text-muted d-block">From AED</small>
              <div class="h3 fw-bold mb-1">1189.00</div>
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
                <p>
                  Bali, Indonesia, is a tropical paradise renowned for its
                  breathtaking beaches, vibrant culture, and lush landscapes.
                  Located at the westernmost end of the Lesser Sunda Islands,
                  Bali boasts a warm, tropical climate that makes it a
                  year-round destination. Visitors are drawn to its picturesque
                  beaches like Kuta, Seminyak, and Nusa Dua, ideal for surfing,
                  sunbathing, and diving. The island's rich cultural heritage is
                  evident in its numerous temples, including the iconic Tanah
                  Lot and Uluwatu Temple, as well as in Ubud, the cultural heart
                  of Bali, known for its traditional dance performances and art
                  markets. Nature enthusiasts can explore the terraced rice
                  paddies in Tegallalang, hike up Mount Batur, or visit the
                  stunning waterfalls of Tegenungan and Gitgit.{" "}
                </p>
                <div className="row pb-55">
                  <div className="col-md-6">
                    <div className="tour-include-exclude mt-30">
                      <h5>Included and Excluded</h5>
                      <ul className="list-style-one check mt-25">
                        <li>
                          <i className="far fa-check" /> Pick and Drop Services
                        </li>
                        <li>
                          <i className="far fa-check" /> 1 Meal Per Day
                        </li>
                        <li>
                          <i className="far fa-check" /> Cruise Dinner &amp;
                          Music Event
                        </li>
                        <li>
                          <i className="far fa-check" /> Visit 7 Best Places in
                          the City
                        </li>
                        <li>
                          <i className="far fa-check" /> Bottled Water on Buses
                        </li>
                        <li>
                          <i className="far fa-check" /> Transportation Luxury
                          Tour Bus
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="tour-include-exclude mt-30">
                      <h5>Excluded</h5>
                      <ul className="list-style-one mt-25">
                        <li>
                          <i className="far fa-times" /> Gratuities
                        </li>
                        <li>
                          <i className="far fa-times" /> Hotel pickup and
                          drop-off
                        </li>
                        <li>
                          <i className="far fa-times" /> Lunch, Food &amp;
                          Drinks
                        </li>
                        <li>
                          <i className="far fa-times" /> Optional upgrade to a
                          glass
                        </li>
                        <li>
                          <i className="far fa-times" /> Additional Services
                        </li>
                        <li>
                          <i className="far fa-times" /> Insurance
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <h3>Activities</h3>
              <div
                className="tour-activities mt-30 mb-45"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="tour-activity-item">
                  {/* <i className="flaticon-hiking" /> */}
                  <b>Hiking</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-fishing" /> */}
                  <b>Fishing</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-man" /> */}
                  <b>Kayak shooting</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-kayak-1" /> */}
                  <b>Kayak</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-bonfire" /> */}
                  <b>Campfire</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-flashlight" /> */}
                  <b>Night Exploring</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-cycling" /> */}
                  <b>Biking</b>
                </div>
                <div className="tour-activity-item">
                  {/* <i className="flaticon-meditation" /> */}
                  <b>Yoga</b>
                </div>
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

                    {/* Day 1 */}
                    <div className="timeline-item d-flex flex-column flex-md-row align-items-start align-items-md-center mb-5 position-relative">
                      <div className="timeline-day text-center mb-3 mb-md-0 me-md-4 position-relative">
                        <div className="bg-white border border-2 rounded-pill px-3 py-1 text-secondary fw-semibold shadow-sm z-2">
                          Day 1
                        </div>
                        <div className="timeline-dot position-absolute top-50 start-0 translate-middle bg-secondary rounded-circle"></div>
                      </div>
                      <div className="timeline-content m-2 p-4 bg-light rounded w-100">
                        <h5 className="fw-semibold">
                          Arrival & Dhow Cruise Marina
                        </h5>
                        <p className="text-muted mb-0">
                          A professional driver will greet you at the airport...
                        </p>
                      </div>
                    </div>
                    {/* Day 2 */}
                    <div className="timeline-item d-flex flex-column flex-md-row align-items-start align-items-md-center mb-5 position-relative">
                      <div className="timeline-day text-center mb-3 mb-md-0 me-md-4 position-relative">
                        <div className="bg-white border border-2 rounded-pill px-3 py-1 text-secondary fw-semibold shadow-sm z-2">
                          Day 2
                        </div>
                        <div className="timeline-dot position-absolute top-50 start-0 translate-middle bg-secondary rounded-circle"></div>
                      </div>
                      <div className="timeline-content m-2 p-4 bg-light rounded w-100">
                        <h5 className="fw-semibold">Departure</h5>
                        <p className="text-muted mb-0">
                          A professional driver will greet you at the airport...
                        </p>
                      </div>
                    </div>

                    {/* Other days follow... */}
                  </div>
                </div>
              </TimelineContainer>

              <div
                className="my-50 p-20 border border-2 border-light rounded"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h3>Visa Details</h3>
                <hr />
                <p>
                  This package will comes with 30 days Dubai tourist Visa
                  included. You will have to provide the documents required to
                  process the VISA. Our agent will get in touch you post booking
                  to initiate the Visa process.
                </p>
              </div>

              <div
                className="my-50 p-20 border border-2 border-light rounded"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h3>Important Information</h3>
                <hr />
                <p>
                  We have not blocked the hotels for the above departure. We
                  will provide similar hotel/s if in case the same is/are not
                  available. Rayna reserve the rights to change / amend the
                  itinerary as per the on-ground situation All the transfers
                  will be used on point-to-point basis only Hotel standard check
                  in time is 3 PM and check out time will be 11 AM Guest would
                  need to pay tourism dirhams locally at the hotels These are
                  fixed departure packages hence tours and transfers will be on
                  shared basis unless private option is selected Your flight
                  should reach before 4 PM on day 1 so you would be able to do
                  the evening cruise Room type will be first (basic category of
                  the hotel) if not available similar hotel will be provided.
                </p>
              </div>

              <div
                className="my-50 p-20 border border-2 border-light rounded"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h3>Booking Policy</h3>
                <hr />
                <p>
                  In case Tours or Tickets cancelled after Booking 100 % charges
                  will be applicable.
                </p>
              </div>

              <div
                className="my-50 p-20 border border-2 border-light rounded"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h3>Cancellation Policy</h3>
                <hr />
                <p>
                  We have not blocked the hotels for the above departure. We
                  will provide similar hotel/s if in case the same is/are not
                  available. Rayna reserve the rights to change / amend the
                  itinerary as per the on-ground situation All the transfers
                  will be used on point-to-point basis only Hotel standard check
                  in time is 3 PM and check out time will be 11 AM Guest would
                  need to pay tourism dirhams locally at the hotels These are
                  fixed departure packages hence tours and transfers will be on
                  shared basis unless private option is selected Your flight
                  should reach before 4 PM on day 1 so you would be able to do
                  the evening cruise Room type will be first (basic category of
                  the hotel) if not available similar hotel will be provided.
                </p>
              </div>

              <div
                className="my-50 p-20 border border-2 border-light rounded"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h3>Payment Terms</h3>
                <hr />
                <p>
                  Total amount of the hotel cost is required at the time of
                  booking. The balance payment must be made 21 days prior to the
                  departure failing which the services may be released.
                  Confirmation Vouchers & Travel Documents: You will receive the
                  Booking Confirmation email within 24 hours of the payment
                  made. Hotel / Land voucher and travel insurance will be given
                  to you 48 hours prior to departure Please carry your original
                  travel documents while travelling like valid passport, the
                  hard copies of flight ticket, hotel & land confirmation
                  voucher, Vaccination certificate, PCR test, travel insurance
                  and other related documents. You are requested to check in
                  online prior to the departure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
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
