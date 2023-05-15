// routes
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
    useEffect(() => {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }, []);
    return (
        <ThemeProvider>
            <ToastContainer />
            <ScrollToTop />
            <Router />
        </ThemeProvider>
    );
}
