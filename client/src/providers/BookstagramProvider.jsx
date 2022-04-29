import { useState, createContext, useContext, useEffect } from 'react';
import AuthService from '../services/auth-service';
import PostService from '../services/post-service';
import AlertProvider, { AlertContext } from './AlertProvider';
import ModalProvider, { ModalContext} from './ModalProvider';

const authService = new AuthService();
const postService = new PostService();
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);
export const useAlerts = () => useContext(AlertContext);
export const useModals = () => useContext(ModalContext);

const BookstagramProvider = ({ children }) => {
    
    useEffect(() => {
        checkIsLoggedIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkIsLoggedIn = async () => {
        setAuthContext({ ...context, isLoading: true });
        await authService.fetchUserData();
        setAuthContext({ ...context });
    }
    const context = {
        isLoading: false,
        setIsLoading: value => setAuthContext({ ...authContext, isLoading: value }),
        authService,
        postService,
        setContext: () => setAuthContext({ ...authContext })
    }
    
    const [authContext, setAuthContext] = useState(context);
    return <AppContext.Provider value={authContext}>
        <AlertProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AlertProvider>
    </AppContext.Provider>
}

export default BookstagramProvider;
