import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

interface DecodedToken {
  nameid: string;
  unique_name: string;
  email: string;
  role: string | string[];
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};

export const hasRole = (role: string) => {
  const userInfo = getUserInfo();
  if (!userInfo) return false;
  
  if (Array.isArray(userInfo.role)) {
    return userInfo.role.includes(role);
  }
  
  return userInfo.role === role;
};
