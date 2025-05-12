import { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import styled from "styled-components";
import { theme } from "@/config/theme.config";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route-paths.config";
import { useUserById } from "@/hooks/useUser";

const Header = ({ onToggleSidebar }: any) => {
  const { logoutUser, userInfo } = useAuth();
  const userId = userInfo?.custom_claims?.user_id;
  const { data: user } = useUserById(String(userId));
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    const [userData, setUserData] = useState({
      name: "",
      email: "",
    });

  useEffect(() => {
    if (user) {
      setUserData({
        name: capitalizeFirstLetter(user.name ?? "John"),
        email: user.email || "johndoe@gmail.com",
      });
    }
  }, [user]);

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
        <p>{userData.name}</p>
        <ProfileButton onClick={handleDropdownToggle}>
          <FaRegUserCircle color={theme.colors.white} size={24} />
          <UserName>{userData.name}</UserName>
        </ProfileButton>

        {isDropdownOpen && (
          <DropdownMenu>
            <DropdownItemButton
              onClick={() => {
                if (userId) {
                  navigate(ROUTES.PRIVATE.PROFILE(userId));
                  setIsDropdownOpen(false);
                }
              }}
            >
              View Profile
            </DropdownItemButton>
            <DropdownItemButton onClick={logoutUser}>
              Logout
            </DropdownItemButton>
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    grid-column: 3;
    justify-self: end;
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
