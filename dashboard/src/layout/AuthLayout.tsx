import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
     
      <main>
        <Outlet /> {/* Content for login/register */}
      </main>
     
    </div>
  );
};

export default AuthLayout;
