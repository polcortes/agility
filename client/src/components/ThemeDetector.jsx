/* eslint-disable react/prop-types */
import { useEffect } from 'react';

const ThemeDetector = ({ theme, setTheme }) => {
    // const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const [theme, setTheme] = useState(prefersDarkMode ? 'dark' : 'light');

    useEffect(() => {
        if (window.localStorage.getItem('theme')) {
            const storageTheme = window.localStorage.getItem('theme');
            if (storageTheme === 'dark') {
                document.documentElement.classList.add('dark');
                setTheme('dark');
            }
            else {
                document.documentElement.classList.remove('dark');
                setTheme('light');
            }
        } else {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'));
            setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            window.localStorage.setItem('theme', theme);

            return () => {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'));
            }
        }
    }, []);

    return null;
}

export default ThemeDetector;