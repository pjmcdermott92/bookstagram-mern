import { useRef, useEffect } from 'react';
import { useModals } from '../../../providers/BookstagramProvider';
import PropTypes from 'prop-types';
import './Modal.scss';

const Modal = ({ id, component: Component, props }) => {
    const { closeModal } = useModals();
    const modalRef = useRef();

    useEffect(() => {
        const onClickOutsideModal = e => {
            if (!modalRef?.current?.contains(e.target)) closeModal(id);
        };
        document.addEventListener('click', onClickOutsideModal, true);
        return () => document.removeEventListener('click', onClickOutsideModal, true);
    });

    return (
        <div className='modal'>
            <div ref={modalRef} className='modal__container'>
                <div
                    className='modal--close-btn'
                    role='presentation'
                    onClick={() => closeModal(id)}
                >
                    &times;
                </div>
                <Component {...props} close={() => closeModal(id)} />
            </div>
        </div>
    );
}

Modal.propTypes = {
    id: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    props: PropTypes.object
}

export default Modal;
