import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { 
  MdDashboard, 
  MdOutlineChangeCircle, 
  MdFormatListBulleted, 
  MdAccountBalanceWallet, 
  MdPieChart, 
  MdOutlineSettingsSuggest,
  MdArrowForward,
  MdArrowBack,
  MdAdd
} from "react-icons/md";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Dodaj klasę do elementu main, gdy sidebar jest zwinięty
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (isCollapsed && !isMobile) {
        mainElement.style.marginLeft = '70px';
        mainElement.style.width = 'calc(100% - 70px)';
      } else if (!isMobile) {
        mainElement.style.marginLeft = '250px';
        mainElement.style.width = 'calc(100% - 250px)';
      } else {
        mainElement.style.marginLeft = '0';
        mainElement.style.width = '100%';
        mainElement.style.paddingBottom = '70px'; // Dodajemy padding na dole dla mobile bottom nav
      }
    }
  }, [isCollapsed, isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Elementy nawigacji dla wersji desktopowej
  const desktopNavItems = [
    { path: '/', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/transactions', label: 'Transakcje', icon: <MdOutlineChangeCircle /> },
    { path: '/budget', label: 'Budżet', icon: <MdFormatListBulleted /> },
    { path: '/accounts', label: 'Konta', icon: <MdAccountBalanceWallet /> },
    { path: '/reports', label: 'Raporty', icon: <MdPieChart /> }
  ];
  
  // Element ustawień, który będzie na dole sidebara
  const settingsItem = { path: '/settings', label: 'Ustawienia', icon: <MdOutlineSettingsSuggest /> };

  // Elementy nawigacji dla wersji mobilnej (bottom navigation)
  const mobileNavItems = [
    { path: '/', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/transactions', label: 'Transakcje', icon: <MdOutlineChangeCircle /> },
    { path: '/transactions/new', label: 'Dodaj', icon: <MdAdd />, isAddButton: true },
    { path: '/budget', label: 'Budżet', icon: <MdFormatListBulleted /> },
    { path: '/settings', label: 'Ustawienia', icon: <MdOutlineSettingsSuggest /> }
  ];

  const sidebarClasses = [
    styles.sidebar,
    isCollapsed ? styles.collapsed : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Sidebar tylko dla wersji desktopowej */}
      {!isMobile && (
        <aside className={sidebarClasses}>
          <div className={styles.sidebarHeader}>
            <NavLink to="/" className={styles.logo}>
              <span className={styles.logoIcon}><MdAccountBalanceWallet /></span>
              {!isCollapsed && <span className={styles.logoText}>BudżetDomowy</span>}
            </NavLink>
            {!isCollapsed && (
              <button 
                className={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label="Zwiń menu"
              >
                <MdArrowBack size={20} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              className={`${styles.toggleButton} ${styles.collapsedToggle}`}
              onClick={toggleSidebar}
              aria-label="Rozwiń menu"
            >
              <MdArrowForward size={20} />
            </button>
          )}

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {desktopNavItems.map((item) => (
                <li key={item.path} className={styles.navItem}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                      isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                    }
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Element ustawień na dole sidebara */}
          <div className={styles.settingsContainer}>
            <NavLink 
              to={settingsItem.path}
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              <span className={styles.navIcon}>{settingsItem.icon}</span>
              {!isCollapsed && <span className={styles.navLabel}>{settingsItem.label}</span>}
            </NavLink>
          </div>
        </aside>
      )}

      {/* Bottom Navigation dla wersji mobilnej */}
      {isMobile && (
        <nav className={styles.bottomNav}>
          <ul className={styles.bottomNavList}>
            {mobileNavItems.map((item) => (
              <li key={item.path} className={styles.bottomNavItem}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive 
                      ? `${styles.bottomNavLink} ${styles.bottomNavLinkActive}` 
                      : styles.bottomNavLink
                  }
                >
                  <span className={styles.bottomNavIcon}>{item.icon}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default Sidebar;