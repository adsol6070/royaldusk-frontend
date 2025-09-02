import { Toaster } from "react-hot-toast";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/hooks/useBlog";
import { usePackages, usePackageEnquiries } from "@/hooks/usePackage";
import { useBookings } from "@/hooks/useBookings";
import { useTours } from "@/hooks/useTour";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: blogs } = useBlogs();
  const { data: packages } = usePackages();
  const { data: tours } = useTours();
  const { data: enquiries } = usePackageEnquiries();
  const { data: bookings } = useBookings();

  const dashboardStats = [
    {
      id: "enquiries",
      title: "Total Enquiries",
      value: enquiries?.length ?? 0,
      icon: "fas fa-envelope",
      route: "/app/dashboard/package/packageenquiry",
    },
    {
      id: "bookings",
      title: "Total Bookings",
      value: bookings?.length ?? 0,
      icon: "fas fa-calendar-check",
      route: "/app/dashboard/bookings/list",
    },
    {
      id: "packages",
      title: "Packages",
      value: packages?.length ?? 0,
      icon: "fas fa-route",
      route: "/app/dashboard/package/list",
    },
    {
      id: "tours",
      title: "Tours",
      value: tours?.length ?? 0,
      icon: "fas fa-map-marked-alt",
      route: "/app/dashboard/tours/list",
    },
    {
      id: "blogs",
      title: "Blogs",
      value: blogs?.length ?? 0,
      icon: "fas fa-blog",
      route: "/app/dashboard/blogs/list",
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <DashboardContainer>
      <Toaster position="top-right" />

      <Header>
        <HeaderContent>
          <div className="title-section">
            <h1>Admin Dashboard</h1>
            <p>
              Welcome back!
            </p>
          </div>
          <div className="date-section">
            <div className="current-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </HeaderContent>
      </Header>

      <MainContent>
        <SectionTitle>
          <h2>Business Overview</h2>
          <p>Click on any section to manage it</p>
        </SectionTitle>

        <StatsGrid>
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} onClick={() => handleCardClick(stat.route)}>
              <i className={stat.icon}></i>
              <div className="info">
                <h4>{stat.title}</h4>
                <p>{stat.value}</p>
              </div>
            </StatCard>
          ))}
        </StatsGrid>
      </MainContent>

      <ActionSection>
        <ActionTitle>Quick Actions</ActionTitle>
        <ActionGrid>
          <ActionButton onClick={() => navigate("/app/dashboard/contact/list")}>
            <i className="fas fa-edit"></i>
            Contact Entries
          </ActionButton>
          <ActionButton
            onClick={() => navigate("/app/dashboard/newsletter/list")}
          >
            <i className="fas fa-edit"></i>
            Newsletter Entries
          </ActionButton>
          <ActionButton
            onClick={() => navigate("/app/dashboard/package/create")}
          >
            <i className="fas fa-plus-circle"></i>
            Add New Package
          </ActionButton>
          <ActionButton onClick={() => navigate("/app/dashboard/tours/create")}>
            <i className="fas fa-map-plus"></i>
            Add New Tour
          </ActionButton>
          <ActionButton onClick={() => navigate("/app/dashboard/blogs/create")}>
            <i className="fas fa-edit"></i>
            Write Blog Post
          </ActionButton>
        </ActionGrid>
      </ActionSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title-section {
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }
  }

  .date-section {
    .current-date {
      background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;

const MainContent = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  i {
    font-size: 24px;
    color: #3b82f6;
  }

  .info {
    h4 {
      font-size: 16px;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin: 0;
    }
  }
`;

const ActionSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
`;

const ActionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
`;

const ActionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 200px;
  background-color: #f8853d;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s ease;

  i {
    font-size: 16px;
  }

  &:hover {
    background-color: #e67428;
  }
`;

export default Dashboard;
