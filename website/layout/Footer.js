import Counter from "@/components/Counter";
import Link from "next/link";
import { useEffect, useState } from "react";
import { packageApi } from "@/common/api";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const Footer = ({ footer, insta }) => {
  switch (footer) {
    case 1:
      return <Footer1 />;
    default:
      return <Footer2 insta={insta} />;
  }
};
export default Footer;

const Footer2 = ({ insta }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await packageApi.getPackageLocations();
        setLocations(response.data || []);
      } catch (err) {
        console.error("Failed to load footer locations", err);
      }
    };
    fetchLocations();
  }, []);

  return (
    <footer
      className={`main-footer footer-two bgp-bottom bgc-black rel z-15 ${
        insta ? "" : "pt-100 pb-115"
      }`}
      style={{
        backgroundImage: "url(/assets/images/backgrounds/footer-two.png)",
      }}
    >
      {insta && <FooterInstagram />}
      <div className="widget-area">
        <div className="container">
          <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-md-3 row-cols-2">
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-duration={500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-40">
                  <Link href="/">
                    <img
                      src="/assets/images/logos/white-logo.png"
                      width={180}
                      alt="Logo"
                    />
                  </Link>
                </div>
                <div className="footer-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1518.8717896147505!2d55.37710464224426!3d25.11856904046068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6f9f1fbfb607%3A0x4db0a2f5f59532d9!2sIFZA%20Business%20Park!5e0!3m2!1sen!2sin!4v1740376682396!5m2!1sen!2sin"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-md-5">
                <div className="footer-title">
                  <h5>Explore</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/holidays">Holidays</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blogs</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={150}
              data-aos-duration={500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-lg-4">
                <div className="footer-title">
                  <h5>Top Locations</h5>
                </div>
                <ul className="list-style-three">
                  {locations.length > 0 ? (
                    locations.slice(0, 5).map((loc) => (
                      <li key={loc.id}>
                        <Link href={`/holidays-location/${loc.id}`}>
                          {capitalizeFirstLetter(loc.name)}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>No locations found.</li>
                  )}
                </ul>
              </div>
            </div>
            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Get In Touch</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt" />
                    IFZA Business Park, DDP, 56942 - 001, A1 - 3641379065
                  </li>
                  <li>
                    <i className="fal fa-envelope" />
                    <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>
                  </li>
                  <li>
                    <i className="fal fa-phone-volume" />
                    <a href="callto:+919876349140">+91 98763-49140</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom bg-transparent pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="copyright-text text-center">
              <p>
                <a href="">ROYAL DUSK TOURS - FZCO</a> All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterInstagram = () => {
  return (
    <div className="container">
      <div className="footer-instagram pt-100 mb-70">
        <div className="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="col"
              data-aos="zoom-in-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <a
                className="instagram-item"
                href={`/assets/images/instagram/instagram${i}.jpg`}
              >
                <img
                  src={`/assets/images/instagram/instagram${i}.jpg`}
                  alt="Instagram"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
