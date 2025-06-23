"use client";

import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 30px;
  }

  .content {
    color: white;

    .subtitle {
      font-size: 14px;
      font-weight: 600;
      color: black;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }

    h1 {
      color: white;
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        font-size: 2.2rem;
      }
    }

    p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin: 0;
    }
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo-container {
      background: rgba(255, 255, 255, 0.15);
      padding: 30px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      img {
        height: 80px;
        width: auto;
      }
    }

    .license {
      margin-top: 16px;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);

      .license-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }

      .license-number {
        font-size: 14px;
        font-weight: 600;
        color: white;
      }
    }
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-2px);
  }

  i {
    font-size: 14px;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AboutContent = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  padding: 40px;

  .section-header {
    margin-bottom: 32px;

    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }

    p {
      font-size: 16px;
      color: #64748b;
      line-height: 1.7;
      margin: 0;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 32px 0;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #fef7f0;
      border-radius: 8px;
      border: 1px solid #fed7aa;
      transition: all 0.2s ease;

      &:hover {
        background: #f8853d;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(248, 133, 61, 0.2);
      }

      .feature-icon {
        width: 36px;
        height: 36px;
        background: #f8853d;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s ease;

        i {
          color: white;
          font-size: 16px;
        }
      }

      &:hover .feature-icon {
        background: white;

        i {
          color: #f8853d;
        }
      }

      .feature-text {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        transition: color 0.2s ease;
      }

      &:hover .feature-text {
        color: white;
      }
    }
  }

  .cta-section {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid #fef7f0;

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
      color: white;
      padding: 14px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.2s ease;

      &:hover {
        background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
        text-decoration: none;
        color: white;
      }

      i {
        font-size: 14px;
      }
    }
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .card-header {
    margin-bottom: 20px;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    .stat-item {
      text-align: center;

      .number {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f8853d;
        display: block;
        margin-bottom: 4px;
      }

      .label {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .card-header {
    margin-bottom: 20px;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .services-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .service-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #fef7f0;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #fed7aa;
        background: #fef7f0;
      }

      .service-icon {
        width: 32px;
        height: 32px;
        background: #fef7f0;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        i {
          color: #f8853d;
          font-size: 14px;
        }
      }

      .service-content {
        .title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2px;
        }

        .status {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;

          &.available {
            background: #dcfce7;
            color: #166534;
          }

          &.coming-soon {
            background: #fef3c7;
            color: #92400e;
          }
        }
      }
    }
  }
`;

const TeamCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .card-header {
    margin-bottom: 20px;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .team-member {
    display: flex;
    align-items: center;
    gap: 16px;

    .member-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #fed7aa;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .member-info {
      flex: 1;

      .name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .role {
        font-size: 13px;
        color: #f8853d;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .social-links {
        display: flex;
        gap: 8px;

        a {
          width: 28px;
          height: 28px;
          background: #fef7f0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8853d;
          text-decoration: none;
          transition: all 0.2s ease;

          &:hover {
            background: #f8853d;
            color: white;
          }

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .card-header {
    margin-bottom: 20px;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .contact-icon {
        width: 36px;
        height: 36px;
        background: #fef7f0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        i {
          color: #f8853d;
          font-size: 14px;
        }
      }

      .contact-content {
        .label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .value {
          font-size: 14px;
          font-weight: 500;
          color: #374151;

          a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s ease;

            &:hover {
              color: #f8853d;
            }
          }
        }
      }
    }
  }

  .contact-cta {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #fef7f0;

    .contact-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: center;
      background: #fef7f0;
      color: #f8853d;
      border: 1px solid #fed7aa;
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;

      &:hover {
        background: #f8853d;
        color: white;
        text-decoration: none;
        transform: translateY(-1px);
      }

      i {
        font-size: 14px;
      }
    }
  }
`;

const Page = () => {
  const router = useRouter();

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <BackButton onClick={() => router.back()}>
            <i className="fal fa-arrow-left" />
            <span>Back</span>
          </BackButton>

          <HeaderContent>
            <div className="content">
              <div className="subtitle">About Royal Dusk Tours</div>
              <h1>Your Ultimate Travel Companion</h1>
              <p>
                Exploring the world with expertise, crafting unforgettable
                travel experiences with professionalism and dedication to
                excellence in every journey.
              </p>
            </div>

            <div className="logo-section">
              <div className="logo-container">
                <img
                  src="/assets/images/logos/about-logo.png"
                  alt="Royal Dusk Tours"
                />
              </div>
              <div className="license">
                <div className="license-label">License Number</div>
                <div className="license-number">56942</div>
              </div>
            </div>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <AboutContent>
            <div className="section-header">
              <h2>Trusted Travel Platform Since Day One</h2>
              <p>
                We specialize in crafting unforgettable travel experiences with
                professionalism and expertise. Whether you seek thrilling
                adventures, luxurious getaways, or seamless business trips, our
                dedicated team ensures every journey is smooth, enjoyable, and
                tailored to your needs.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fal fa-star" />
                </div>
                <span className="feature-text">Experience Agency</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fal fa-users" />
                </div>
                <span className="feature-text">Professional Team</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fal fa-tag" />
                </div>
                <span className="feature-text">Competitive Pricing</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fal fa-headset" />
                </div>
                <span className="feature-text">24/7 Support</span>
              </div>
            </div>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "32px",
              }}
            >
              With years of industry experience and a passion for exploration,
              we provide top-notch services, from visa assistance to customized
              tour packages. Our platform is designed to make travel booking
              seamless, efficient, and reliable. Let us turn your travel dreams
              into reality with our comprehensive travel solutions and dedicated
              customer support.
            </p>

            <div className="cta-section">
              <Link href="/holidays" className="cta-button">
                <i className="fal fa-compass" />
                Explore Our Packages
              </Link>
            </div>
          </AboutContent>

          <Sidebar>
            <StatsCard>
              <div className="card-header">
                <h3>Platform Statistics</h3>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="number">500+</span>
                  <span className="label">Travel Packages</span>
                </div>
                <div className="stat-item">
                  <span className="number">50+</span>
                  <span className="label">Destinations</span>
                </div>
                <div className="stat-item">
                  <span className="number">5000+</span>
                  <span className="label">Happy Travelers</span>
                </div>
                <div className="stat-item">
                  <span className="number">24/7</span>
                  <span className="label">Support</span>
                </div>
              </div>
            </StatsCard>

            <ServiceCard>
              <div className="card-header">
                <h3>Our Services</h3>
              </div>
              <div className="services-list">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="fal fa-suitcase" />
                  </div>
                  <div className="service-content">
                    <div className="title">Holiday Packages</div>
                    <div className="status available">Available</div>
                  </div>
                </div>

                <div className="service-item">
                  <div className="service-icon">
                    <i className="fal fa-plane" />
                  </div>
                  <div className="service-content">
                    <div className="title">Flight Booking</div>
                    <div className="status coming-soon">Coming Soon</div>
                  </div>
                </div>

                <div className="service-item">
                  <div className="service-icon">
                    <i className="fal fa-hotel" />
                  </div>
                  <div className="service-content">
                    <div className="title">Hotel Reservations</div>
                    <div className="status coming-soon">Coming Soon</div>
                  </div>
                </div>

                <div className="service-item">
                  <div className="service-icon">
                    <i className="fal fa-map-marked-alt" />
                  </div>
                  <div className="service-content">
                    <div className="title">Guided Tours</div>
                    <div className="status coming-soon">Coming Soon</div>
                  </div>
                </div>
              </div>
            </ServiceCard>

            <TeamCard>
              <div className="card-header">
                <h3>Leadership</h3>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <img
                    src="/assets/images/team/guide1.jpg"
                    alt="Ravdeep Sandhu"
                  />
                </div>
                <div className="member-info">
                  <div className="name">Ravdeep Sandhu</div>
                  <div className="role">Founder & CEO</div>
                  <div className="social-links">
                    <a href="#" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in" />
                    </a>
                    <a href="#" aria-label="Twitter">
                      <i className="fab fa-twitter" />
                    </a>
                    <a href="#" aria-label="Email">
                      <i className="fal fa-envelope" />
                    </a>
                  </div>
                </div>
              </div>
            </TeamCard>

            <ContactCard>
              <div className="card-header">
                <h3>Get in Touch</h3>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fal fa-envelope" />
                  </div>
                  <div className="contact-content">
                    <div className="label">Email</div>
                    <div className="value">
                      <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fal fa-phone" />
                  </div>
                  <div className="contact-content">
                    <div className="label">Phone</div>
                    <div className="value">
                      <a href="tel:+919876349140">+91 98763-49140</a>
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fal fa-map-marker-alt" />
                  </div>
                  <div className="contact-content">
                    <div className="label">Location</div>
                    <div className="value">IFZA Business Park, Dubai</div>
                  </div>
                </div>
              </div>

              <div className="contact-cta">
                <Link href="/contact" className="contact-button">
                  <i className="fal fa-comment" />
                  Contact Us
                </Link>
              </div>
            </ContactCard>
          </Sidebar>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;
