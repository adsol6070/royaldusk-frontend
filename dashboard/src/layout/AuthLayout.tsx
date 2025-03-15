import { Outlet } from "react-router-dom";
import ShootingStarsBackground from "../components/AuthBackground";
import styled from "styled-components";

const AuthContainer = styled.main`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  z-index: 1;
`;

const AuthLayout = () => {
  return (
    <>
      <ShootingStarsBackground />
      <AuthContainer>
        <Outlet />
      </AuthContainer>
    </>
  );
};

export default AuthLayout;
