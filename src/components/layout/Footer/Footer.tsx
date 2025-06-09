import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'Transakcje' },
    { path: '/budget', label: 'Budżet' },
    { path: '/reports', label: 'Raporty' },
    { path: '/settings', label: 'Ustawienia' },
    { path: '/privacy', label: 'Polityka prywatności' },
    { path: '/terms', label: 'Warunki użytkowania' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span>BudżetDomowy</span>
          </Link>
          
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className={styles.right}>
          <p className={styles.copyright}>
            &copy; {currentYear} BudżetDomowy. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;