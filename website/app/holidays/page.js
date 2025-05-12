"use client";

import Banner from "@/components/Banner";
import Subscribe from "@/components/Subscribe";
import TourSidebar from "@/components/TourSidebar";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import Image from "next/image";
import FormInput from "@/components/ui/FormInput";

const tours = [
  {
    id: 1,
    title: "Bay Cruise by Boat in Bali, Indonesia",
    location: "Bali, Indonesia",
    price: "$58.00",
    duration: "3 days 2 nights",
    guests: "5-8 guest",
    badge: "Featured",
    badgeClass: "bgc-pink",
    image: "/assets/images/destinations/tour-list1.jpg",
  },
  {
    id: 2,
    title: "Buenos Aires, Calafate & Ushuaia",
    location: "Rome, Italy",
    price: "$105.00",
    duration: "3 days 2 nights",
    guests: "5-8 guest",
    badge: "10% Off",
    badgeClass: "",
    image: "/assets/images/destinations/tour-list2.jpg",
  },
  {
    id: 3,
    title: "Camels on desert Morocco, Sahara.",
    location: "Tamnougalt, Morocco",
    price: "$386.00",
    duration: "3 days 2 nights",
    guests: "5-8 guest",
    image: "/assets/images/destinations/tour-list3.jpg",
  },
  {
    id: 4,
    title: "Hakone, Lake Asha Cruise Day Bus Trip",
    location: "Switzerland",
    price: "$293.00",
    duration: "3 days 2 nights",
    guests: "5-8 guest",
    badge: "Popular",
    badgeClass: "bgc-primary",
    image: "/assets/images/destinations/tour-list4.jpg",
  },
  {
    id: 5,
    title: "Best Tour in Tours, France",
    location: "Tours, France",
    price: "$199.00",
    duration: "3 days 2 nights",
    guests: "5-8 guest",
    image: "/assets/images/destinations/tour-list5.jpg",
  },
];

const HolidayListPage = () => {
  const options = [
    { value: "new", label: "Newest" },
    { value: "old", label: "Oldest" },
    { value: "high to low", label: "High To Low" },
    { value: "low to high", label: "Low To High" },
  ];
  return (
    <ReveloLayout>
      <Banner pageTitle="Holidays" pageName="Holiday Packages" />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <div className="row">
            <TourSidebar />
            <div className="col-lg-9">
              <div className="shop-shorter rel z-3 mb-20 d-flex align-items-center flex-wrap">
                <ul className="grid-list mb-15 me-2 d-flex">
                  <li>
                    <a href="#">
                      <i className="fal fa-border-all" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="far fa-list" />
                    </a>
                  </li>
                </ul>
                <div className="sort-text mb-15 me-4 me-xl-auto">
                  34 Tours found
                </div>
                <div className="sort-text mb-15 me-4">
                  <FormInput
                    // label="Sort"
                    name="sort"
                    // register={register}
                    placeholder="Sort By"
                    as="select"
                    border="none"
                    options={options}
                    // error={errors.sort}
                  />
                </div>
              </div>

              {/* Tours List */}
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="destination-item style-three bgc-lighter mb-4"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image position-relative">
                    {tour.badge && (
                      <span className={`badge ${tour.badgeClass || ""}`}>
                        {tour.badge}
                      </span>
                    )}
                    <a href="#" className="heart">
                      <i className="fas fa-heart" />
                    </a>
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      width={800}
                      height={500}
                      layout="responsive"
                      objectFit="cover"
                    />
                  </div>
                  <div className="content">
                    <div className="destination-header d-flex justify-content-between align-items-center">
                      <span className="location">
                        <i className="fal fa-map-marker-alt" /> {tour.location}
                      </span>
                      <div className="ratting">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star" />
                        ))}
                      </div>
                    </div>
                    <h5>
                      <Link href="/holiday-details">{tour.title}</Link>
                    </h5>
                    <p>
                      Explore the best of {tour.location}. Discover culture,
                      nature, and unforgettable experiences.
                    </p>
                    <ul className="blog-meta d-flex flex-wrap">
                      <li>
                        <i className="far fa-clock" /> {tour.duration}
                      </li>
                      <li>
                        <i className="far fa-user" /> {tour.guests}
                      </li>
                    </ul>
                    <div className="destination-footer d-flex justify-content-between align-items-center">
                      <span className="price">
                        <span>{tour.price}</span>/person
                      </span>
                      <Link
                        href="/holiday-details"
                        className="theme-btn style-two style-three"
                      >
                        <span data-hover="Enquiry">Enquiry</span>
                        <i className="fal fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Optional: Subscribe or Pagination */}
              {/* <Subscribe /> */}
            </div>
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
};

export default HolidayListPage;
