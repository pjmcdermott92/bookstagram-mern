import { Navigate } from 'react-router-dom';
import { useAppContext, useModals } from '../../providers/BookstagramProvider';
import { AppLogo, Loader } from '../../components/layout';
import AuthModal from '../../components/AuthModal/AuthModal';
import './LandingPage.scss';

const LandingPage = () => {
    const { authService, isLoading } = useAppContext();
    const { openModal } = useModals();

    if (authService.isLoggedIn) return <Navigate to='/app' />
    if (isLoading) return <Loader />
    
    return (
        <div className='LandingPage'>
            <div className='LandingPage__container'>
                <AppLogo type='light' responsive={false} />
                <h1>Share the Story</h1>
                <h3>A place for readers, collectors, and book enthusiasts to share their latest read.</h3>
                <button
                    className='btn btn-lg btn-gradient'
                    onClick={() => openModal(AuthModal)}
                >
                    Log In or Sign Up
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
