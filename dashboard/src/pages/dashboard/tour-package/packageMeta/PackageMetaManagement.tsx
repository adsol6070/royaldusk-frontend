import React, { useState } from "react";
import styled from "styled-components";
import PackageCategoryList from "./PackageCategories";
import PackageFeatureList from "./PackageFeatures";
import PackageItineraryList from "./PackageItenaries";
import PackageServiceList from "./PackageServices";
import PackagePolicyList from "./PackagePolicies";
import PackageLocationList from "./PackageLocation";

const TABS = [
  { key: "categories", label: "📦 Categories", Component: PackageCategoryList },
  { key: "features", label: "🚀 Features", Component: PackageFeatureList },
  { key: "services", label: "🛎️ Services", Component: PackageServiceList },
  { key: "itineraries", label: "🗺️ Itineraries", Component: PackageItineraryList },
  { key: "policies", label: "📜 Policies", Component: PackagePolicyList },
  { key: "locations", label: "📍 Locations", Component: PackageLocationList },
];

const PackageManagementPage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  const ActiveComponent = TABS.find(tab => tab.key === activeTab)?.Component;

  return (
    <>
      <HeaderSection>
        <Heading>🎛️ Package Essentials Management</Heading>
        <Divider />
      </HeaderSection>

      <TabWrapper>
        {TABS.map(({ key, label }) => (
          <TabButton
            key={key}
            active={activeTab === key}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </TabButton>
        ))}
      </TabWrapper>
      <Divider />
      <TabContent>
        {ActiveComponent && <ActiveComponent />}
      </TabContent>
    </>
  );
};

export default PackageManagementPage;

// Styled Components

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SubHeading = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
`;

const Divider = styled.hr`
  width: 80px;
  border: 2px solid #d78149;
  margin: 16px auto;
  border-radius: 4px;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "#d78149" : "#f8f9fa")};
  color: ${({ active }) => (active ? "#fff" : "#d78149")};
  border: 2px solid #d78149;
  border-radius: 50px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ active }) => (active ? "#d78149" : "rgba(255, 157, 0, 0.1)")};
  }
`;

const TabContent = styled.div`
  padding: 30px 15px;
`;
