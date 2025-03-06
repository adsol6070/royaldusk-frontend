import { useState } from "react";
import { FaSearch, FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import styled from "styled-components";
import { theme } from "../constants/theme";
import { useAuthContext } from "../common/context/AuthContext";

const Header = ({ onToggleSidebar }: any) => {
  const { logoutUser } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <HamburgerButton onClick={onToggleSidebar}>
          <RxHamburgerMenu />
        </HamburgerButton>
        <SearchContainer>
          <SearchButton>
            <FaSearch />
          </SearchButton>
          <SearchInput type="text" placeholder="search" />
        </SearchContainer>
      </LeftContainer>
      <ProfileContainer>
        <ProfileButton onClick={handleDropdownToggle}>
          <FaRegUserCircle color={theme.colors.black} size={24} />
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

// Styled components

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  height: 69px;
  background-color: ${theme.colors.white};
  border-bottom: 3px solid ${theme.colors.whiteSmoke};
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Small gap between hamburger and search */
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.white};
  border-radius: 30px;
  border: 1px solid #afadab;
  padding: 2px;

  /* Added max-width for larger screens */
  max-width: 400px; /* Adjust this value as needed */
  flex: 1; /* Allow it to grow */

  @media (max-width: 768px) {
    width: 100%; /* Full width on smaller screens */
    grid-column: 2; /* Place it in the center grid column */
    justify-self: center; /* Center it in the grid */
  }
`;

const SearchInput = styled.input`
  border: none;
  padding: 5px 10px;
  border-radius: 20px;
  outline: none;
  flex: 1;
`;

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: #afadab;
  cursor: pointer;
  text-align: center;
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
  color: ${theme.colors.black};
  font-size: 24px;
  cursor: pointer;
`;

export default Header;

// const ProfileLink = styled(Link)`
//   color: ${theme.colors.white};
//   font-size: 24px;
//   margin-left: 20px;
//   text-decoration: none;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     grid-column: 3; /* Place it in the right grid column */
//     justify-self: end; /* Align to the right in the grid */
//   }
// `;
