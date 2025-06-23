import Link from "next/link";
import { useEffect, useState } from "react";
import { packageApi } from "@/common/api";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import styled from "styled-components";

const PlatformFooter = styled.footer`
  background: #1e293b;
  color: #e2e8f0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 20px;
    margin-top: 0;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 30px;
      height: 2px;
      background: #f8853d;
      border-radius: 1px;
    }
  }
`;

const CompanyInfo = styled.div`
  .logo {
    margin-bottom: 20px;

    img {
      height: 36px;
      width: auto;
    }
  }

  .description {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #cbd5e1;

    &:last-child {
      margin-bottom: 0;
    }

    i {
      width: 16px;
      color: #f8853d;
      flex-shrink: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #f8853d;
        text-decoration: none;
      }
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 12px;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: "";
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      background: #f8853d;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s ease;
    position: relative;
    padding-left: 0;

    &:hover {
      color: #f8853d;
      text-decoration: none;
      padding-left: 12px;
    }
  }
`;

const SupportLinks = styled.div`
  .support-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #334155;
    font-size: 14px;
    transition: all 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      padding-left: 8px;
      border-color: #f8853d;
    }

    i {
      width: 16px;
      color: #f8853d;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    &:hover i {
      transform: scale(1.1);
    }

    a {
      color: #cbd5e1;
      text-decoration: none;
      flex: 1;
      transition: color 0.2s ease;

      &:hover {
        color: #f8853d;
        text-decoration: none;
      }
    }

    .external-icon {
      color: #64748b;
      font-size: 12px;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #334155;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-size: 13px;
  color: #94a3b8;

  .company-name {
    color: #f8853d;
    font-weight: 600;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 640px) {
    gap: 16px;
  }

  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 13px;
    position: relative;
    transition: color 0.2s ease;

    &:hover {
      color: #f8853d;
      text-decoration: none;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: #f8853d;
      transition: width 0.2s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const BusinessInfo = styled.div`
  background: #0f172a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #334155;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f8853d, #e67428);
  }

  .business-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    i {
      color: #f8853d;
      font-size: 16px;
    }

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #f8fafc;
      margin: 0;
    }
  }

  .business-details {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;

    .license-info {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #334155;

      .license-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #64748b;
        }

        .value {
          color: #f8853d;
          font-weight: 600;
        }
      }
    }
  }
`;

const SocialLinks = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 12px;

  .social-link {
    width: 36px;
    height: 36px;
    background: #334155;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 1px solid #475569;

    &:hover {
      background: #f8853d;
      color: white;
      border-color: #f8853d;
      transform: translateY(-2px);
    }

    i {
      font-size: 16px;
    }
  }
`;

const Footer = ({ footer, insta }) => {
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
    <PlatformFooter>
      <FooterContent>
        <FooterGrid>
          {/* Company Information */}
          <FooterSection>
            <CompanyInfo>
              <div className="logo">
                <Link href="/">
                  <img
                    src="/assets/images/logos/white-logo.png"
                    alt="Royal Dusk Tours"
                  />
                </Link>
              </div>
              <div className="description">
                Professional travel booking platform offering curated holiday
                packages with seamless booking experience and 24/7 customer
                support.
              </div>
              <div className="contact-item">
                <i className="fal fa-envelope" />
                <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>
              </div>
              <div className="contact-item">
                <i className="fal fa-phone" />
                <a href="tel:+919876349140">+91 98763-49140</a>
              </div>
              <div className="contact-item">
                <i className="fal fa-map-marker-alt" />
                <span>IFZA Business Park, Dubai, UAE</span>
              </div>

              {/* Social Media Links */}
              <SocialLinks>
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram" />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-link" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp" />
                </a>
              </SocialLinks>
            </CompanyInfo>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection>
            <h3>Quick Links</h3>
            <FooterLinks>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/holidays">Browse Packages</Link>
              </li>
              <li>
                <Link href="/cart">My Cart</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/booking-lookup">Track Booking</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </FooterLinks>
          </FooterSection>

          {/* Popular Destinations */}
          <FooterSection>
            <h3>Top Destinations</h3>
            <FooterLinks>
              {locations.length > 0 ? (
                locations.slice(0, 6).map((loc) => (
                  <li key={loc.id}>
                    <Link href={`/holidays-location/${loc.id}`}>
                      {capitalizeFirstLetter(loc.name)}
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ color: "#64748b" }}>Loading destinations...</li>
              )}
            </FooterLinks>
          </FooterSection>

          {/* Support & Help */}
          <FooterSection>
            <h3>Support & Help</h3>
            <SupportLinks>
              <div className="support-item">
                <i className="fal fa-life-ring" />
                <Link href="/support">Help Center</Link>
              </div>
              <div className="support-item">
                <i className="fal fa-headset" />
                <Link href="/contact">Contact Support</Link>
              </div>
              <div className="support-item">
                <i className="fal fa-question-circle" />
                <Link href="/faqs">FAQs</Link>
              </div>
              <div className="support-item">
                <i className="fal fa-file-alt" />
                <Link href="/terms">Terms & Conditions</Link>
              </div>
              <div className="support-item">
                <i className="fal fa-shield-alt" />
                <Link href="/privacy">Privacy Policy</Link>
              </div>
            </SupportLinks>
          </FooterSection>
        </FooterGrid>

        {/* Business Information */}
        <BusinessInfo>
          <div className="business-header">
            <i className="fal fa-building" />
            <h4>Business Information</h4>
          </div>
          <div className="business-details">
            <div>
              Royal Dusk Tours - FZCO is a licensed travel company operating
              from IFZA Business Park, Dubai Investment Park, United Arab
              Emirates.
            </div>
            <div className="license-info">
              <div className="license-item">
                <span className="label">License:</span>
                <span className="value">FZCO-2024-001</span>
              </div>
              <div className="license-item">
                <span className="label">Registration:</span>
                <span className="value">DIP-A1-3641379065</span>
              </div>
              <div className="license-item">
                <span className="label">Established:</span>
                <span className="value">2024</span>
              </div>
            </div>
          </div>
        </BusinessInfo>

        <FooterBottom>
          <Copyright>
            © 2024 <span className="company-name">Royal Dusk Tours - FZCO</span>
            . All rights reserved.
          </Copyright>
          <LegalLinks>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </PlatformFooter>
  );
};

export default Footer;
