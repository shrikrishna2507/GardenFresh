import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gf_user');
    const token  = localStorage.getItem('gf_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
      // Refresh from server
      authAPI.getMe()
        .then(res => { setUser(res.data.user); localStorage.setItem('gf_user', JSON.stringify(res.data.user)); })
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('gf_token', res.data.token);
    localStorage.setItem('gf_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}! 👋`);
    return res.data.user;
  }

  async function register(data) {
    const res = await authAPI.register(data);
    localStorage.setItem('gf_token', res.data.token);
    localStorage.setItem('gf_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success('Account created! Welcome to GardenFresh 🌿');
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem('gf_token');
    localStorage.removeItem('gf_user');
    setUser(null);
    toast.success('Logged out successfully');
  }

  function updateUser(updated) {
    setUser(updated);
    localStorage.setItem('gf_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
