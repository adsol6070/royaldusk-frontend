"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/common/context/AuthContext";
import ReveloLayout from "@/layout/ReveloLayout";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { userApi, bookingApi } from "@/common/api";

const DashboardContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%);
  padding: 60px 0 40px;
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
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserAvatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background: #10b981;
    border-radius: 50%;
    border: 3px solid white;
  }
`;

const UserDetails = styled.div`
  color: white;

  .greeting {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 8px 0;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .email {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;

  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: block;
  }

  .stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #f8853d;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: ${(props) => (props.active ? "#f8853d" : "#fef7f0")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${(props) => (props.active ? "#f8853d" : "#fed7aa")};

  &:hover {
    background: ${(props) => (props.active ? "#e67428" : "#f8853d")};
    color: white;
    transform: translateX(4px);
  }

  i {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: 30px 40px;
  border-bottom: 1px solid #fef7f0;
  background: #fefaf7;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    i {
      color: #f8853d;
    }
  }

  p {
    color: #64748b;
    margin: 0;
    font-size: 15px;
  }
`;

const ContentBody = styled.div`
  padding: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #374151;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #f8853d;
    font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #fed7aa;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #fefbf8;

  &:focus {
    outline: none;
    border-color: #f8853d;
    background: white;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #f59e0b;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: flex-start;

  &:hover {
    background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
  }

  &:disabled {
    background: #fed7aa;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  i {
    font-size: 14px;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const BookingCard = styled.div`
  background: #fefbf8;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.15);
    border-color: #f8853d;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const BookingTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  i {
    color: #f8853d;
    font-size: 1.1rem;
  }
`;

const BookingStatus = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) =>
    props.status === "Confirmed" ? "#dcfce7" : "#fef3c7"};
  color: ${(props) => (props.status === "Confirmed" ? "#166534" : "#92400e")};
  border: 1px solid
    ${(props) => (props.status === "Confirmed" ? "#bbf7d0" : "#fde68a")};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;

    i {
      color: #f8853d;
    }
  }

  .value {
    font-size: 15px;
    color: #1e293b;
    font-weight: 600;
    margin: 0;
  }
`;

const BookingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #fed7aa;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .amount {
    font-size: 1.2rem;
    font-weight: 700;
    color: #f8853d;
  }

  .payment-status {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    background: #dcfce7;
    color: #166534;
    text-transform: uppercase;
  }
`;

const BookingDate = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #f8853d;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #fef7f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fed7aa;

    i {
      font-size: 2rem;
      color: #f8853d;
    }
  }

  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
  }

  p {
    margin: 0 0 24px 0;
    font-size: 15px;
    line-height: 1.6;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
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
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
  gap: 12px;

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #fed7aa;
    border-top: 3px solid #f8853d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const getInitial = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase();
};

export default function DashboardPage() {
  const { userInfo, logout, isAuthLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchUserBookings = async () => {
    try {
      const data = {
        email: userInfo.email,
      };
      const response = await bookingApi.getBookingByEmail(data);
      if (response.success) {
        setUserBookings(response.data);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Something went wrong while fetching bookings");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !userInfo) {
      router.push("/login");
      return;
    }

    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
      });
    }

    const tab = searchParams.get("tab");
    if (tab && (tab === "profile" || tab === "bookings")) {
      setActiveTab(tab);
    }

    if (tab === "bookings" && userInfo?.email) {
      setBookingLoading(true);
      fetchUserBookings();
    }
  }, [isAuthLoading, userInfo, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userApi.updateUser(userInfo.id, {
        name: formData.name,
      });
      if (response.status) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Something went wrong while updating profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <ContentHeader>
              <h2>
                <i className="fal fa-user-circle" />
                Profile Settings
              </h2>
              <p>Manage your account information and preferences</p>
            </ContentHeader>
            <ContentBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">
                    <i className="fal fa-user" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">
                    <i className="fal fa-envelope" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    placeholder="Your email address"
                  />
                  <HelpText>
                    <i className="fal fa-info-circle" />
                    Email address cannot be changed for security reasons
                  </HelpText>
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="fal fa-save" />
                      Save Changes
                    </>
                  )}
                </SubmitButton>
              </Form>
            </ContentBody>
          </>
        );

      case "bookings":
        return (
          <>
            <ContentHeader>
              <h2>
                <i className="fal fa-calendar-check" />
                My Bookings
              </h2>
              <p>Track your travel bookings and itineraries</p>
            </ContentHeader>
            <ContentBody>
              {bookingLoading ? (
                <LoadingState>
                  <div className="spinner" />
                  Loading your bookings...
                </LoadingState>
              ) : userBookings.length > 0 ? (
                <BookingsGrid>
                  {userBookings.map((booking, index) => (
                    <BookingCard key={booking.id}>
                      <BookingHeader>
                        <BookingTitle>
                          <i className="fal fa-map-marked-alt" />
                          {booking.packageName}
                        </BookingTitle>
                        <BookingStatus status={booking.status}>
                          {booking.status}
                        </BookingStatus>
                      </BookingHeader>

                      <BookingDetails>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-calendar" />
                            Travel Date
                          </div>
                          <p className="value">
                            {new Date(booking.travelDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-users" />
                            Travelers
                          </div>
                          <p className="value">{booking.travelers} People</p>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">
                            <i className="fal fa-money-bill" />
                            Currency
                          </div>
                          <p className="value">
                            {booking.currency?.toUpperCase() || "N/A"}
                          </p>
                        </DetailItem>
                      </BookingDetails>

                      <BookingFooter>
                        <PaymentInfo>
                          <span className="amount">
                            {booking.currency?.toUpperCase()}{" "}
                            {booking.totalAmountPaid / 100}
                          </span>
                          <span className="payment-status">
                            {booking.paymentStatus}
                          </span>
                        </PaymentInfo>
                        <BookingDate>
                          <i className="fal fa-clock" />
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </BookingDate>
                      </BookingFooter>
                    </BookingCard>
                  ))}
                </BookingsGrid>
              ) : (
                <EmptyState>
                  <div className="empty-icon">
                    <i className="fal fa-calendar-alt" />
                  </div>
                  <h3>No Bookings Yet</h3>
                  <p>
                    Start exploring our amazing holiday packages and plan your
                    next adventure! Discover destinations around the world with
                    our curated travel experiences.
                  </p>
                  <Link href="/holidays" className="cta-button">
                    <i className="fal fa-compass" />
                    Browse Packages
                  </Link>
                </EmptyState>
              )}
            </ContentBody>
          </>
        );

      default:
        return null;
    }
  };

  if (!userInfo) return null;

  return (
    <ReveloLayout>
      <DashboardContainer>
        <HeaderSection>
          <HeaderContent>
            <UserProfile>
              <UserAvatar>
                {userInfo.profileImage ? (
                  <img src={userInfo.profileImage} alt={userInfo.name} />
                ) : (
                  getInitial(userInfo.name)
                )}
              </UserAvatar>
              <UserDetails>
                <div className="greeting">Welcome back</div>
                <h1>{userInfo.name}</h1>
                <p className="email">{userInfo.email}</p>
              </UserDetails>
            </UserProfile>

            <QuickStats>
              <StatCard>
                <span className="stat-number">{userBookings.length}</span>
                <span className="stat-label">Total Bookings</span>
              </StatCard>
              <StatCard>
                <span className="stat-number">
                  {userBookings.filter((b) => b.status === "Confirmed").length}
                </span>
                <span className="stat-label">Confirmed</span>
              </StatCard>
            </QuickStats>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <Sidebar>
            <SidebarTitle>
              <i className="fal fa-cog" />
              Dashboard Menu
            </SidebarTitle>
            <SidebarNav>
              <NavItem
                active={activeTab === "profile"}
                onClick={() => {
                  setActiveTab("profile");
                  router.push("/dashboard?tab=profile");
                }}
              >
                <i className="fal fa-user-circle" />
                Profile Settings
              </NavItem>
              <NavItem
                active={activeTab === "bookings"}
                onClick={() => {
                  setActiveTab("bookings");
                  router.push("/dashboard?tab=bookings");
                }}
              >
                <i className="fal fa-calendar-check" />
                My Bookings
              </NavItem>
            </SidebarNav>
          </Sidebar>

          <ContentArea>{renderContent()}</ContentArea>
        </MainContent>
      </DashboardContainer>
    </ReveloLayout>
  );
}
