import React, { createContext, useContext, useEffect, useState } from "react";
import { rolesApi } from "../../common";
import { useAuthContext } from "./AuthContext";

interface PermissionContextProps {
  permissions: { [key: string]: boolean } | null;
  loading: boolean;
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined
);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const [permissions, setPermissions] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     try {
  //       const response = await rolesApi.getPermission();
        
  //       const userPermissions = response.data.find(
  //         (permission: any) => permission.role === user.role
  //       );

  //       if (userPermissions) {
  //         setPermissions(userPermissions.rights);
  //       } else {
  //         setPermissions(null); 
  //       }
  //     } catch (error) {
  //       console.error("Error fetching permissions:", error);
  //       setPermissions(null); // Handle error state as necessary
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPermissions();
  // }, [user.role]); 

  return (
    <PermissionContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
