let accessToken: string | null = null;

export const tokenService = {
  getToken: () => accessToken,
  setToken: (token: string | null) => {
    accessToken = token;
  },
  clearToken: () => {
    accessToken = null;
  },
};
