import uuid from '../utils/uuid';
import { OPEN_MODAL, CLOSE_MODAL } from './actions';

const modalReducer = (state, action) => {
    const { type, payload } = action;

    switch(type) {
        case OPEN_MODAL:
            const { component, props } = payload;
            if (state?.length && state?.map(modal => modal.component === component)) {
                return state;
            }
            const id = uuid();
            const modal = { id, component, props };
            return [...state, modal];
        case CLOSE_MODAL:
            return state.filter(modal => modal.id !== payload);
        default:
            return state;
    }
}

export default modalReducer;
