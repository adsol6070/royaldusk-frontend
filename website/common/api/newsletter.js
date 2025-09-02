import { HttpClient } from "../helpers";

function newsletterApi() {
  return {
    subscribe: (email) => {
      return HttpClient.post(`/user-service/api/newsletter/subscribe`, { email }, {
        _skipAuth: true,
      });
    },
  };
}

export default newsletterApi();
