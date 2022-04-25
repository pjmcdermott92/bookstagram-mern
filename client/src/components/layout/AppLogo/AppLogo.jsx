import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logoDark from './logoSymbol-dark.png';
import logoLight from './logoSymbol-light.png';
import './AppLogo.scss'

const AppLogo = ({ type, responsive }) => (
    <div className='AppLogo'>
        <Link to='/'>
            <div className='brandSymbol'>
                <img
                    src={type === 'light' ? logoLight : logoDark}
                    alt="Bookstagram"
                />
            </div>
            <span
                className={`brandText${type === 'light' ? ' light' : ''}`}
                data-responsive={responsive}
            >
                Bookstagram
            </span>
        </Link>
    </div>
);

AppLogo.propTypes = {
    type: PropTypes.string
}

AppLogo.defaultProps = {
    type: 'dark'
}

export default AppLogo;
