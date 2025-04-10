import '../styles/Header.css';
import { LogOut } from 'lucide-react';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="main-header">
      <h1 className="header-title">AirGuard</h1>
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="logout-icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
