import React, { createContext, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../utils/api'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null);

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async (email, username, password, confirm_password) => {
    setLoading(true)
    try {
      const data = await api.post('/user/register/', { email, username, password, confirm_password });
      if (data.status === 201) {
        setResponse('ایمیل تائید ارسال شد.')
        setTimeout(() => {
          setResponse(null)
        }, 5000)
      }
    } catch (error) {
      setError(Object.values(error.response?.data || { error: 'Something went wrong' })[0]);
    } finally {
      setLoading(false)
    }
  };

  const handleActivateAccount = async (authCode) => {
    setLoading(true)
    try {
      const data = await api.get(`/user/activate/${authCode}`);
      if (data.status === 200) {
        setResponse('حساب کاربری شما فعال شد.')
        setTimeout(() => {
          setResponse(null)
        }, 5000)
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setResponse('لینک فعال‌سازی نامعتبر است.');
      } else {
        setResponse('خطای نامشخصی رخ داده است.');
      }
      setTimeout(() => {
        setResponse(null);
      }, 5000);
    } finally {
      setLoading(false)
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('user/token/', { email, password });
      localStorage.setItem("authTokens", JSON.stringify(data))
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
    } catch (error) {
      setError(Object.values(error.response?.data || { error: 'Something went wrong' })[0]);
    } finally {
      setLoading(false)
    }
  };

  const handleLogout = () => {
    setAuthTokens(null);
    setUser(null)
    localStorage.removeItem('authTokens');
  };

  const handleForgotPassword = async (email) => {
    setLoading(true)
    try {
      const data = await api.post('user/forgot-password/', { email });
      if (data.status === 200) {
        setResponse('ایمیل بازیابی ارسال شد.')
        setTimeout(() => {
          setResponse(null)
        }, 5000)
      }
    } catch (error) {
      setError(Object.values(error.response?.data || { error: 'Something went wrong' })[0]);
    } finally {
      setLoading(false)
    }
  };

  const handleResetPassword = async (authCode, password, confirm_password) => {
    setLoading(true)
    try {
      const data = await api.post(`user/reset-password/${authCode}`, { password, confirm_password });
      if (data.status === 200) {
        setResponse('گذرواژه با موفقیت تغییر یافت.')
        setTimeout(() => {
          setResponse(null)
        }, 5000)
      }
    } catch (error) {
      setError(Object.values(error.response?.data || { error: 'Something went wrong' })[0]);
    } finally {
      setLoading(false)
    }
  };

  const context = {
    authTokens,
    user,
    loading,
    error,
    setError,
    response,
    handleLogin,
    handleRegister,
    handleActivateAccount,
    handleForgotPassword,
    handleResetPassword,
    handleLogout,
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;