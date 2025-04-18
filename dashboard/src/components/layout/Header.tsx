import { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import styled from "styled-components";
import { theme } from "@/config/theme.config";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route-paths.config";

const Header = ({ onToggleSidebar }: any) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const userDetail: any = JSON.parse(localStorage.getItem("user") || "null");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <HamburgerButton onClick={onToggleSidebar}>
        <RxHamburgerMenu />
      </HamburgerButton>
      <ProfileContainer ref={dropdownRef}>
          <p>{userDetail.custom_claims.user_name}</p>
          <ProfileButton onClick={handleDropdownToggle}>
            <FaRegUserCircle color={theme.colors.white} size={24} />
            <UserName>{capitalizeFirstLetter(userDetail?.custom_claims?.user_name) || "User"}</UserName>
          </ProfileButton>
        {isDropdownOpen && (
          <DropdownMenu>
            <DropdownItemButton onClick={() => 
              {navigate(`${ROUTES.PRIVATE.PROFILE(userDetail.custom_claims.user_id)}`); 
              setIsDropdownOpen(false);}
            }>View Profile</DropdownItemButton>
            <DropdownItemButton onClick={() => logoutUser()}>Logout</DropdownItemButton>
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
  display: flex;
  align-items: center;
  justify-content: center;

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

const UserName = styled.span`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 500;
  margin: 0px 5px;
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

const DropdownItemButton = styled.a`
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
