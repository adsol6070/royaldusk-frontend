import { Toaster } from "react-hot-toast";
import styled from "styled-components";
import { useBlogs } from "@/hooks/useBlog";
import { usePackages, usePackageEnquiries } from "@/hooks/usePackage";
import { useBookings } from "@/hooks/useBookings";

const Dashboard = () => {
  const { data: blogs } = useBlogs();
  const { data: packages } = usePackages();
  const { data: enquiries } = usePackageEnquiries();
  const { data: bookings } = useBookings();

  return (
    <DashboardContainer>
      <Toaster position="top-right" />
      <h1 className="title">📊 Admin Dashboard</h1>
      <StatsWrapper>
        <StatCard>
          <h3>Total Blogs</h3>
          <p>{blogs?.length ?? 0}</p>
        </StatCard>
        <StatCard>
          <h3>Total Packages</h3>
          <p>{packages?.length ?? 0}</p>
        </StatCard>
        <StatCard>
          <h3>Total Enquiries</h3>
          <p>{enquiries?.length ?? 0}</p>
        </StatCard>
        <StatCard>
          <h3>Total Bookings</h3>
          <p>{bookings?.length ?? 0}</p>
        </StatCard>
      </StatsWrapper>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 4rem 2rem;
  margin: 0 auto;

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: #1f2937;
  }
`;

const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 2.25rem;
    font-weight: 700;
    color: #2563eb;
    margin: 0;
  }
`;

export default Dashboard;
