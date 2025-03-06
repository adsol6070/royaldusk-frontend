import Banner from "@/components/Banner";
import Subscribe from "@/components/Subscribe";
import TourSidebar from "@/components/TourSidebar";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Tour & Activities"} />
      {/* Tour Grid Area start */}

      <section className="tour-grid-page py-100 rel z-1">
        <div className="container">
          <div className="row">
            <TourSidebar />
            <div className="col-lg-9">
              <div className="shop-shorter rel z-3 mb-20">
                <ul className="grid-list mb-15 me-2">
                  <li>
                    <Link href="/contact">
                      <i className="fal fa-border-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <i className="far fa-list" />
                    </Link>
                  </li>
                </ul>
                <div className="sort-text mb-15 me-4 me-xl-auto">
                  2 Tours found
                </div>
                <div className="sort-text mb-15 me-4">Sort By</div>
                <select>
                  <option value="default" selected="">
                    Short By
                  </option>
                  <option value="new">Newness</option>
                  <option value="old">Oldest</option>
                  <option value="hight-to-low">High To Low</option>
                  <option value="low-to-high">Low To High</option>
                </select>
              </div>
              <div className="tour-grid-wrap">
                <div className="row">
                  <div className="col-xl-4 col-md-6">
                    <div
                      className="destination-item tour-grid style-three bgc-lighter"
                      data-aos="fade-up"
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      <div className="image">
                        <span className="badge bgc-pink">Featured</span>
                        <Link href="/contact" className="heart">
                          <i className="fas fa-heart" />
                        </Link>
                        <img
                          src="/assets/images/destinations/zoo-image.jpg"
                          alt="Tour List"
                        />
                      </div>
                      <div className="content">
                        <div className="destination-header">
                          <span className="location">
                            <i className="fal fa-map-marker-alt" /> Dubai
                          </span>
                          <div className="ratting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <h6>
                          <Link href="/contact">Emirates Park Zoo</Link>
                        </h6>
                        {/* <ul className="blog-meta">
                          <li>
                            <i className="far fa-clock" /> 3 days 2 nights
                          </li>
                          <li>
                            <i className="far fa-user" /> 5-8 guest
                          </li>
                        </ul> */}
                        <div className="destination-footer">
                          <span className="price">
                            <span>AED 45.00</span>/person
                          </span>
                          <Link
                            href="/contact"
                            className="theme-btn style-two style-three"
                          >
                            <i className="fal fa-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div
                      className="destination-item tour-grid style-three bgc-lighter"
                      data-aos="fade-up"
                      data-aos-duration={1500}
                      data-aos-delay={50}
                      data-aos-offset={50}
                    >
                      <div className="image">
                        <Link href="/contact" className="heart">
                          <i className="fas fa-heart" />
                        </Link>
                        <img
                          src="/assets/images/destinations/desert-safari.jpg"
                          alt="Tour List"
                        />
                      </div>
                      <div className="content">
                        <div className="destination-header">
                          <span className="location">
                            <i className="fal fa-map-marker-alt" /> Dubai
                          </span>
                          <div className="ratting">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                        <h6>
                          <Link href="/contact">Desert Safari Abu Dhabii</Link>
                        </h6>
                        {/* <ul className="blog-meta">
                          <li>
                            <i className="far fa-clock" /> 3 days 2 nights
                          </li>
                          <li>
                            <i className="far fa-user" /> 5-8 guest
                          </li>
                        </ul> */}
                        <div className="destination-footer">
                          <span className="price">
                            <span>AED 195.00</span>/person
                          </span>
                          <Link
                            href="/contact"
                            className="theme-btn style-two style-three"
                          >
                            <i className="fal fa-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Grid Area end */}
      {/* Newsletter Area start */}
      {/* <Subscribe /> */}
      {/* Newsletter Area end */}
    </ReveloLayout>
  );
};
export default page;
