import { HttpClient } from '../helpers';

function AuthApi() {
  return {
    login: (data) => {
      return HttpClient.post(`/user-service/api/auth/login`, data);
    },

    register: (data) => {
      return HttpClient.post(`/user-service/api/auth/register`, data);
    },

    logout: () => {
      return HttpClient.post(`/user-service/api/auth/logout`);
    },

    forgotPassword: (email) => {
      return HttpClient.post(`/user-service/api/auth/forgot-password`, { email });
    },

    resetPassword: (data) => {
      return HttpClient.post(`/user-service/api/auth/reset-password`, data);
    },

    resendVerificationEmail: (email) => {
      return HttpClient.post(`/user-service/api/auth/resend-verification-email`, { email });
    },

    verifyEmail: (verificationCode) => {
      return HttpClient.post(`/user-service/api/auth/verify-email`, { verificationCode });
    },

    googleSignIn: (idToken) => {
      return HttpClient.post(`/user-service/api/auth/google`, { idToken });
    },

     appleSignIn: (idToken) => {
      return HttpClient.post(`/user-service/api/auth/apple`, { idToken });
    },
  };
}

export default AuthApi();
