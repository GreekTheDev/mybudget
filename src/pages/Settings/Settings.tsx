import { useState } from 'react';
import DataManager from '../../components/settings/DataManager/DataManager';
import styles from './Settings.module.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Ustawienia</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Ogólne
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'data' ? styles.active : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Dane
        </button>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'general' && (
          <div className={styles.comingSoon}>
            <h2>Ustawienia ogólne</h2>
            <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
          </div>
        )}
        {activeTab === 'data' && <DataManager />}
      </div>
    </div>
  );
};

export default Settings;