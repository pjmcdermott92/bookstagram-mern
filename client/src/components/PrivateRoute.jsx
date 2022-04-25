import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAppContext } from '../providers/BookstagramProvider';

const PrivateRoute = ({ component: Component }) => {
    const { authService } = useAppContext();

    if (authService.isLoggedIn) return <Component />

    return <Navigate to='/' />
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired
}

export default PrivateRoute;
