"use client";

import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, rgb(248, 133, 61) 0%, rgb(230, 116, 40) 50%, rgb(214, 94, 31) 100%);;
  padding: 60px 0;
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
  text-align: center;
  color: white;

  .subtitle {
    font-size: 11px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.8);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin: 0;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-2px);
  }

  i {
    font-size: 12px;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

const PolicyContent = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .policy-header {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;

    h2 {
      font-size: 1.4rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .last-updated {
      font-size: 11px;
      color: #64748b;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  }

  .policy-section {
    margin-bottom: 24px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 12px 0;
      padding-left: 12px;
      border-left: 3px solid #f8853d;
    }

    p {
      font-size: 12px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 8px 0;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        color: #1e293b;
        font-weight: 600;
      }

      a {
        color: #f8853d;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: #f8853d;
          text-decoration: underline;
        }
      }
    }
  }

  .contact-highlight {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;

    .contact-title {
      font-size: 13px;
      font-weight: 600;
      color: #f8853d;
      margin: 0 0 8px 0;
    }

    .contact-details {
      font-size: 12px;
      color: #f8853d;
      line-height: 1.5;

      strong {
        color: #f8853d;
      }

      a {
        color: #f8853d;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuickNavCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .card-header {
    margin-bottom: 16px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .nav-item {
      font-size: 11px;
      color: #64748b;
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
        color: #f8853d;
      }

      &.active {
        background: #eff6ff;
        color: #f8853d;
        font-weight: 500;
      }
    }
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .card-header {
    margin-bottom: 16px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .summary-points {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .point-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px;
      border-radius: 6px;
      background: #f8fafc;

      .point-icon {
        width: 16px;
        height: 16px;
        background: #f8853d;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;

        i {
          color: white;
          font-size: 8px;
        }
      }

      .point-text {
        font-size: 10px;
        color: #475569;
        line-height: 1.4;
      }
    }
  }
`;

const LegalCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .card-header {
    margin-bottom: 16px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .legal-links {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .legal-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      text-decoration: none;
      color: #64748b;
      font-size: 11px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #3b82f6;
        background: #f8fafc;
        color: #f8853d;
        text-decoration: none;
      }

      .link-icon {
        width: 24px;
        height: 24px;
        background: #f1f5f9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 10px;
          color: #64748b;
        }
      }

      &:hover .link-icon {
        background: #eff6ff;

        i {
          color: #f8853d;
        }
      }

      .link-content {
        flex: 1;

        .title {
          font-weight: 500;
          margin-bottom: 1px;
        }

        .desc {
          font-size: 9px;
          opacity: 0.8;
        }
      }
    }
  }
`;

const ContactCard = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 20px;

  .card-header {
    margin-bottom: 16px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #0c4a6e;
      margin: 0;
    }
  }

  .contact-info {
    font-size: 11px;
    color: #0369a1;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .contact-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    justify-content: center;
    background: #f8853d;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 11px;
    transition: all 0.2s ease;

    &:hover {
      background: #f8853d;
      color: white;
      text-decoration: none;
      transform: translateY(-1px);
    }

    i {
      font-size: 10px;
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
            <div className="subtitle">Legal Documentation</div>
            <h1>Privacy Policy</h1>
            <p>
              Understanding how we collect, use, and protect your personal information while using our travel services and platform.
            </p>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <PolicyContent>
            <div className="policy-header">
              <h2>Privacy Policy</h2>
              <div className="last-updated">Last updated: July 2025</div>
            </div>

            <div className="policy-section">
              <h4>1. Information We Collect</h4>
              <p><strong>a. Personal Information:</strong> When you create an account or book a package, we may collect your full name, email, phone number, payment details, travel preferences, and login credentials.</p>
              <p><strong>b. Non-Personal Information:</strong> This includes IP address, browser type, device info, and site usage data.</p>
            </div>

            <div className="policy-section">
              <h4>2. How We Use Your Information</h4>
              <p>We use your data to manage accounts, confirm bookings, send updates or promotions, improve our services, and comply with legal obligations.</p>
            </div>

            <div className="policy-section">
              <h4>3. Sharing of Information</h4>
              <p>We don't sell your data. We may share it with trusted partners (like hotels or tour providers), payment processors, and legal authorities if required.</p>
            </div>

            <div className="policy-section">
              <h4>4. Cookies and Tracking Technologies</h4>
              <p>Cookies help us remember your preferences and improve your experience. You can modify cookie settings in your browser.</p>
            </div>

            <div className="policy-section">
              <h4>5. Use of Camera and Photo Access</h4>
              <p>Our mobile app may request access to your device's camera or photo gallery for specific features such as uploading travel documents or profile pictures. This data is used only for its intended purpose and is not shared or stored without your explicit consent.</p>
            </div>

            <div className="policy-section">
              <h4>6. Use of Location Data</h4>
              <p>Our mobile app may collect location data (GPS or network-based) to provide location-based travel recommendations, nearby tours, or region-specific content. Location access is optional and can be controlled through your device settings.</p>
            </div>

            <div className="policy-section">
              <h4>7. Account Management</h4>
              <p>You can log in to view or update your account, log out anytime, or contact us at <a href="mailto:go@royaldusk.com">go@royaldusk.com</a> to request deletion.</p>
            </div>

            <div className="policy-section">
              <h4>8. Data Security</h4>
              <p>We use SSL encryption, secure servers, and regular audits to keep your data safe.</p>
            </div>

            <div className="policy-section">
              <h4>9. Your Rights</h4>
              <p>You may request access, correction, or deletion of your personal data. Contact us at <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>.</p>
            </div>

            <div className="policy-section">
              <h4>10. Third-Party Links</h4>
              <p>Our website or app may contain links to third-party websites. We are not responsible for their content or privacy practices.</p>
            </div>

            <div className="policy-section">
              <h4>11. Updates to This Policy</h4>
              <p>This Privacy Policy may be updated. Check this page regularly for changes. Continued use implies agreement to the latest version.</p>
            </div>

            <div className="contact-highlight">
              <div className="contact-title">Contact Information</div>
              <div className="contact-details">
                <strong>Royal Dusk Tours FZCO</strong><br />
                IFZA Business Park, Dubai<br />
                Email: <a href="mailto:go@royaldusk.com">go@royaldusk.com</a><br />
                Phone: <a href="tel:+919876349140">+91 98763-49140</a>
              </div>
            </div>
          </PolicyContent>

          <Sidebar>
            <QuickNavCard>
              <div className="card-header">
                <h3>Quick Navigation</h3>
              </div>
              <div className="nav-list">
                <div className="nav-item active">Information Collection</div>
                <div className="nav-item">Data Usage</div>
                <div className="nav-item">Information Sharing</div>
                <div className="nav-item">Cookies & Tracking</div>
                <div className="nav-item">Camera & Photo Access</div>
                <div className="nav-item">Location Data</div>
                <div className="nav-item">Account Management</div>
                <div className="nav-item">Data Security</div>
                <div className="nav-item">Your Rights</div>
                <div className="nav-item">Contact Information</div>
              </div>
            </QuickNavCard>

            <SummaryCard>
              <div className="card-header">
                <h3>Key Points</h3>
              </div>
              <div className="summary-points">
                <div className="point-item">
                  <div className="point-icon">
                    <i className="fal fa-shield" />
                  </div>
                  <div className="point-text">We protect your personal information with industry-standard security measures</div>
                </div>
                <div className="point-item">
                  <div className="point-icon">
                    <i className="fal fa-user" />
                  </div>
                  <div className="point-text">You have full control over your personal data and privacy settings</div>
                </div>
                <div className="point-item">
                  <div className="point-icon">
                    <i className="fal fa-times" />
                  </div>
                  <div className="point-text">We never sell your personal information to third parties</div>
                </div>
                <div className="point-item">
                  <div className="point-icon">
                    <i className="fal fa-cog" />
                  </div>
                  <div className="point-text">Cookie preferences can be managed through browser settings</div>
                </div>
              </div>
            </SummaryCard>

            <LegalCard>
              <div className="card-header">
                <h3>Related Documents</h3>
              </div>
              <div className="legal-links">
                <Link href="/terms" className="legal-link">
                  <div className="link-icon">
                    <i className="fal fa-file-alt" />
                  </div>
                  <div className="link-content">
                    <div className="title">Terms of Service</div>
                    <div className="desc">Platform usage terms</div>
                  </div>
                </Link>
                <Link href="/cookie-policy" className="legal-link">
                  <div className="link-icon">
                    <i className="fal fa-cookie" />
                  </div>
                  <div className="link-content">
                    <div className="title">Cookie Policy</div>
                    <div className="desc">Cookie usage details</div>
                  </div>
                </Link>
                <Link href="/data-policy" className="legal-link">
                  <div className="link-icon">
                    <i className="fal fa-database" />
                  </div>
                  <div className="link-content">
                    <div className="title">Data Policy</div>
                    <div className="desc">Data handling practices</div>
                  </div>
                </Link>
              </div>
            </LegalCard>

            <ContactCard>
              <div className="card-header">
                <h3>Need Help?</h3>
              </div>
              <div className="contact-info">
                Have questions about our privacy practices? Our support team is here to help you understand how we protect your information.
              </div>
              <Link href="/contact" className="contact-button">
                <i className="fal fa-comment" />
                Contact Support
              </Link>
            </ContactCard>
          </Sidebar>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;