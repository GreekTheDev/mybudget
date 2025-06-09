import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'Transakcje' },
    { path: '/budget', label: 'Budżet' },
    { path: '/accounts', label: 'Konta' },
    { path: '/reports', label: 'Raporty' },
    { path: '/settings', label: 'Ustawienia' }
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <NavLink to="/" className={styles.logo}>
          <span>BudżetDomowy</span>
        </NavLink>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          ☰
        </button>

        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <NavLink to="/" className={styles.logo} onClick={closeMobileMenu}>
              <span>BudżetDomowy</span>
            </NavLink>
            <button 
              className={styles.mobileMenuClose}
              onClick={closeMobileMenu}
              aria-label="Zamknij menu"
            >
              ✕
            </button>
          </div>
          <ul className={styles.mobileMenuList}>
            {navItems.map((item) => (
              <li key={item.path} className={styles.mobileMenuItem}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? `${styles.mobileMenuLink} ${styles.mobileMenuLinkActive}` : styles.mobileMenuLink
                  }
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;