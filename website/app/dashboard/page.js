"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/common/context/AuthContext";
import ReveloLayout from "@/layout/ReveloLayout";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { userApi, bookingApi } from "@/common/api";

const DashboardSection = styled.section`
  padding: 40px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 100px);
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const UserDetails = styled.div`
  h2 {
    margin: 0 0 0.5rem;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  background: ${(props) => (props.active ? "#fff3e6" : "transparent")};
  color: ${(props) => (props.active ? "#ee8b50" : "#666")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  font-size: 1rem;

  &:hover {
    background: #fff3e6;
    color: #ee8b50;
  }

  i {
    font-size: 1.2rem;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const BookingCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    color: #333;
  }
`;

const BookingStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${(props) =>
    props.status === "Confirmed" ? "#e6f4ea" : "#fff3e6"};
  color: ${(props) => (props.status === "Confirmed" ? "#34a853" : "#ee8b50")};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  h4 {
    margin: 0 0 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    color: #333;
    font-weight: 500;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ee8b50;
  }
`;

const HelpText = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const SubmitButton = styled.button`
  background: #ee8b50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e56d1f;
  }

  &:disabled {
    background: #ffd5b8;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;

  i {
    font-size: 3rem;
    color: #ddd;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem;
    color: #333;
  }

  p {
    margin: 0;
  }
`;
const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  fontWeight: "600",
  color: "#333",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  fontSize: "0.95rem",
  color: "#444",
};

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
          <div>
            <h2>Profile Settings</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
                <HelpText>Email address cannot be changed</HelpText>
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </SubmitButton>
            </Form>
          </div>
        );

      case "bookings":
        return (
          <div>
            <h2>My Bookings</h2>
            {bookingLoading ? (
              <p>Loading bookings...</p>
            ) : userBookings.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f0f0f0" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Package</th>
                    <th style={thStyle}>Travel Date</th>
                    <th style={thStyle}>Booking Date</th>
                    <th style={thStyle}>Travelers</th>
                    <th style={thStyle}>Amount Paid</th>
                    <th style={thStyle}>Currency</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{booking.packageName}</td>
                      <td style={tdStyle}>
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>{booking.travelers}</td>
                      <td style={tdStyle}>
                        {booking.currency?.toUpperCase()}{" "}
                        {booking.totalAmountPaid / 100}
                      </td>
                      <td style={tdStyle}>
                        {booking.currency?.toUpperCase() || "-"}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "0.3rem 0.7rem",
                            borderRadius: "12px",
                            background:
                              booking.status === "Confirmed"
                                ? "#d4edda"
                                : "#fff3cd",
                            color:
                              booking.status === "Confirmed"
                                ? "#155724"
                                : "#856404",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{booking.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState>
                <i className="fal fa-calendar-alt fa-3x mb-3" />
                <h3>No Bookings Yet</h3>
                <p>
                  Start exploring our holiday packages and plan your next
                  adventure!
                </p>
                <Link href="/holidays" className="theme-btn style-two">
                  Browse Packages
                </Link>
              </EmptyState>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!userInfo) return null;

  return (
    <ReveloLayout>
      <DashboardSection>
        <DashboardContainer>
          <DashboardHeader>
            <UserInfo>
              <UserAvatar>
                {userInfo.profileImage ? (
                  <img src={userInfo.profileImage} alt={userInfo.name} />
                ) : (
                  getInitial(userInfo.name)
                )}
              </UserAvatar>
              <UserDetails>
                <h2>{userInfo.name}</h2>
                <p>{userInfo.email}</p>
              </UserDetails>
            </UserInfo>
          </DashboardHeader>

          <DashboardGrid>
            <Sidebar>
              <SidebarNav>
                <NavItem
                  active={activeTab === "profile"}
                  onClick={() => {
                    setActiveTab("profile");
                    router.push("/dashboard?tab=profile");
                  }}
                >
                  <i className="fal fa-user" />
                  Profile Settings
                </NavItem>
                <NavItem
                  active={activeTab === "bookings"}
                  onClick={() => {
                    setActiveTab("bookings");
                    router.push("/dashboard?tab=bookings");
                  }}
                >
                  <i className="fal fa-calendar-alt" />
                  My Bookings
                </NavItem>
              </SidebarNav>
            </Sidebar>

            <ContentArea>{renderContent()}</ContentArea>
          </DashboardGrid>
        </DashboardContainer>
      </DashboardSection>
    </ReveloLayout>
  );
}
