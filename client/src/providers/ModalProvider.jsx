import { createContext, useReducer } from 'react';
import modalReducer from '../reducers/modalReducer';
import { OPEN_MODAL, CLOSE_MODAL } from '../reducers/actions';
import Modal from '../components/layout/Modal/Modal';

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [modals, dispatch] = useReducer(modalReducer, []);

    const openModal = (component, props = null) => dispatch({
        type: OPEN_MODAL,
        payload: { component, props }
    });

    const closeModal = id => dispatch({
        type: CLOSE_MODAL,
        payload: id
    });

    return <ModalContext.Provider value={{
        modals, openModal, closeModal
    }}>
        {modals?.length ? modals.map(modal =>
            <Modal key={modal.id} {...modal} />
        ) : null}
        {children}
    </ModalContext.Provider>
}

export default ModalProvider;
