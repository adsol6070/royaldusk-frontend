import { AuthProvider } from "../context/AuthContext";
import { PermissionProvider } from "../context/PermissionContext";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <PermissionProvider>{children}</PermissionProvider>
    </AuthProvider>
  );
};

export default AppProviders;
