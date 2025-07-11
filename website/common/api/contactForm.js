import { HttpClient } from "../helpers";

function ContactFormApi() {
  return {
    submitContactForm: (payload) => {
      return HttpClient.post(`/user-service/api/contact/submit`, payload, {
        _skipAuth: true,
      });
    },
  };
}

export default ContactFormApi();
