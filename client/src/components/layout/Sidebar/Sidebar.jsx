import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext, useModals, useAlerts } from '../../../providers/BookstagramProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import PromptModal from '../../PromptModal/PromptModal';
import './Sidebar.scss';

const Sidebar = ({ showSidebar, setShowSidebar}) => {
    const { authService, setIsLoading, setContext } = useAppContext();
    const { openModal } = useModals();
    const { setAlert } = useAlerts();
    const { avatar, firstName, lastName } = authService;
    const sidebarRef = useRef();

    useEffect(() => {
        const onClickOutsideSidebar = e => {
            if (!sidebarRef?.current?.contains(e.target)) setShowSidebar(false);
        }
        document.addEventListener('click', onClickOutsideSidebar, true);
        return () => document.removeEventListener('click', onClickOutsideSidebar, true);
    });

    const logOutUser = async () => {
        await authService.logOutUser();
        setContext();
        setIsLoading(false);
        setAlert('You have been logged out');
    }

    const handleClickLogout = () => {
        setShowSidebar(false);
        openModal(PromptModal, {
            title: 'Log Out',
            prompt: 'Are you sure you want to log out?',
            confirmText: 'Log Out',
            action: () => logOutUser()
        });
    }

    return (
        <aside className='Sidebar' data-active={showSidebar} ref={sidebarRef}>
            <button
                className='Sidebar__closeBtn'
                onClick={() => setShowSidebar(false)}
            >
                &times;
            </button>
            <div className='Sidebar__sectionWrapper'>
                <div className='UserAvatar'>
                    <div className='UserAvatar__avatarImg'>
                        <img src={avatar} alt='User Avatar' />
                    </div>
                    <div className='UserAvatar__avatarDetails'>
                        <span className='UserAvatar__avatarDetails--username'>
                            {firstName} {lastName}
                        </span>
                    </div>
                </div>
            </div>
            <div className='Sidebar__sectionWrapper'>
                <div
                    className='Sidebar__actionButton'
                    role='button'
                    onClick={handleClickLogout}
                >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <span>Log Out</span>
                </div>
            </div>
        </aside>
    )
}

Sidebar.propTypes = {
    showSidebar: PropTypes.bool,
    setShowSidebar: PropTypes.func
}

export default Sidebar;
