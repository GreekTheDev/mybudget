import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './App.module.css';

// Importy komponentów
import Sidebar from './components/layout/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import Budget from './pages/Budget/Budget';
import Accounts from './pages/Accounts/Accounts';
// import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
// import NotFound from './pages/NotFound/NotFound';

// Import serwisu inicjalizującego
import { initializeApp } from './services/initService';

function App() {
  // Inicjalizacja aplikacji przy starcie
  useEffect(() => {
    initializeApp().catch(error => {
      console.error('Błąd podczas inicjalizacji aplikacji:', error);
    });
  }, []);

  return (
    <Router>
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.container}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<Transactions />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/reports" element={<div>Raporty (w budowie)</div>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div>Strona nie znaleziona</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
