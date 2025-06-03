import { HttpClient } from '../helpers';

function UserApi() {
  return {
    me:() => {
        return HttpClient.get(`/user-service/api/users/me`, { _skipAuth: false });
      },
    updateUser:(id, userData) => {
      return HttpClient.patch(`/user-service/api/users/${id}`, userData, { _skipAuth: false });
    },
  };
}

export default UserApi();
