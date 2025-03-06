import { HttpClient } from "../helpers";
const accessTokenKey = "authToken";

const getAuthHeaders = (isMultipart: boolean = false) => {
  const token: string | null = localStorage.getItem(accessTokenKey);
  let headers: { [key: string]: string } = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
};
function Permissions() {
  return {
    createPermission: (values: any) => {
      return HttpClient.post("permissions/create", values, {
        headers: getAuthHeaders(),
      });
    },
    updatePermission(id: string, data: any) {
      return HttpClient.patch(`permissions/updateById/${id}`, data, {
        headers: getAuthHeaders(),
      });
    },
    getPermission: () => {
      return HttpClient.get("permissions/getAll", {
        headers: getAuthHeaders(),
      });
    },
    getPermissionByName: (role: string) => {
      return HttpClient.post(
        `permissions/getByName/${role}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
    },
    deletePermission: (id: string) => {
      return HttpClient.delete(`permissions/deleteById/${id}`, {
        headers: getAuthHeaders(),
      });
    },
  };
}
export default Permissions();
