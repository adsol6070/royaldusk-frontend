import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import styled from "styled-components";
import { theme } from "@/config/theme.config";
import { useAuth } from "@/context/AuthContext";

const Header = ({ onToggleSidebar }: any) => {
  const { logoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer>
      <HamburgerButton onClick={onToggleSidebar}>
        <RxHamburgerMenu />
      </HamburgerButton>
      <ProfileContainer>
        <ProfileButton onClick={handleDropdownToggle}>
          <FaRegUserCircle color={theme.colors.white} size={24} />
        </ProfileButton>
        {isDropdownOpen && (
          <DropdownMenu>
            <DropdownItem href="/profile">View Profile</DropdownItem>
            <DropdownItem onClick={() => logoutUser()}>Logout</DropdownItem>
          </DropdownMenu>
        )}
      </ProfileContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  height: ${theme.layout.navbarHeight};
  background-color: ${theme.colors.navbarBackground};
  border-bottom: 3px solid ${theme.colors.whiteSmoke};
  flex-wrap: nowrap;
`;

const ProfileContainer = styled.div`
  position: relative; /* Necessary for positioning the dropdown menu */

  @media (max-width: 768px) {
    grid-column: 3; /* Place it in the right grid column */
    justify-self: end; /* Align to the right in the grid */
  }
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.black};
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.white};
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 8px 16px;
  color: ${theme.colors.black};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lightGray};
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.white};
  font-size: 24px;
  cursor: pointer;
`;

export default Header;
