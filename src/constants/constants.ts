export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  path: {
    userAuth: {
      login: "/user-auth/login",
      signup: "/user-auth/signup",
      googleLogin: "/user-auth/google",
      me: "/user-auth/me",
    },
  },
};

export const AUTH_TOKEN_KEY = 'auth_token'