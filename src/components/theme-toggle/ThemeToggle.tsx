import React from 'react';
import { FiMoon, FiCoffee } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import styles from './themeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={toggleTheme}
        aria-label={isDark ? "Mudar para tema Light Coffee" : "Mudar para tema Dark"}
        title={isDark ? "Mudar para tema Light Coffee" : "Mudar para tema Dark"}
      >
        <span className={styles.iconWrapper}>
          {isDark ? <FiCoffee size={14} /> : <FiMoon size={14} />}
        </span>
        <span className={styles.label}>
          {isDark ? "Light Coffee" : "Dark Mode"}
        </span>
      </button>
    </div>
  );
}
