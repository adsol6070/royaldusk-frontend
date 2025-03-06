import Banner from "@/components/Banner";
import Counter from "@/components/Counter";
import SectionTitle from "@/components/SectionTitle";
import Client from "@/components/slider/Client";
import Testimonial from "@/components/slider/Testimonial";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
const page = () => {
  return (
    <ReveloLayout>
      <Banner pageTitle={"About Us"} />
      {/* About Area start */}
      <section className="about-area-two py-100 rel z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div
              className="col-xl-3"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <span className="subtitle mb-35">About ROYAL DUSK TOURS - FZCO</span>
            </div>
            <div className="col-xl-9">
              <div
                className="about-page-content"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row">
                  <div className="col-lg-8 pe-lg-5 me-lg-5">
                    <div className="section-title mb-25">
                      <h2>
                      Exploring the World with Expertise – Your Ultimate Travel Companion
                      </h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="experience-years rmb-20">
                      {/* <span className="title bgc-secondary">
                      Trusted Travel Experts
                      </span>
                      <span className="text">Providing</span>
                      <span className="years">28+</span> */}
                      <img src="/assets/images/logos/rdusk-logo.png" alt="logo" />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <p>
                    License No - 56942 <br />
                    we specialize in crafting unforgettable travel experiences with professionalism and expertise. Whether you seek thrilling adventures, luxurious getaways, or seamless business trips, our dedicated team ensures every journey is smooth, enjoyable, and tailored to your needs. With years of industry experience and a passion for exploration, we provide top-notch services, from visa assistance to customized tour packages. Let us turn your travel dreams into reality!
                    </p>
                    <ul className="list-style-two mt-35">
                      <li>Experience Agency</li>
                      <li>Professional Team</li>
                      <li>Low Cost Travel</li>
                      <li>Online Support 24/7</li>
                    </ul>
                    <Link href="tour-and-activities" className="theme-btn style-three mt-30">
                      <span data-hover="Explore Tours">Explore Tours</span>
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Area end */}
    
      {/* Team Area start */}
      <section className="about-team-area pb-70 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-50"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle title={"Expertise That Takes You Places"} subtitle2="Seamless travel, unforgettable experiences" />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div
                className="team-item hover-content"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img src="/assets/images/team/guide1.jpg" alt="Guide" />
                <div className="content">
                  <h6>Ravdeep Sandhu</h6>
                  <span className="designation">Founder</span>
                  <div className="social-style-one inner-content">
                    <Link href="contact">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link href="contact">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link href="contact">
                      <i className="fab fa-instagram" />
                    </Link>
                    <a href="#">
                      <i className="fab fa-pinterest-p" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Team Area end */}
    </ReveloLayout>
  );
};
export default page;
