import React from 'react';
import { create } from 'zustand';
import styles from './Tab.module.scss';

interface TabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const useTabStore = create<TabState>((set) => ({
  activeTab: 'accountSearch',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

interface TabProps {
  tabs: { id: string; label: string }[];
}

const Tab: React.FC<TabProps> = ({ tabs }) => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className={styles.tab__wrap}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${styles.tab__btn} ${activeTab === tab.id && styles.tab__btn__active}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tab;
export { useTabStore };