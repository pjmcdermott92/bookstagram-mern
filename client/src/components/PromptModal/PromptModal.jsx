import PropTypes from 'prop-types';

const PromptModal = ({
    close, title, prompt, confirmText, cancelText, action
}) => (
    <>
    <div className='modal--header'>
        <h2>{title}</h2>
    </div>
    <div className='modal--body'>
        <p>{prompt}</p>
    </div>
    <div className='modal--footer'>
        <button
            className='btn'
            onClick={() => close()}
        >
            {cancelText}
        </button>
        <button
            className='btn btn-primary'
            onClick={() => {
                action();
                close();
            }}
        >
            {confirmText}
        </button>
    </div>
    </>
);

PromptModal.propTypes = {
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    prompt: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    action: PropTypes.func.isRequired
}

PromptModal.defaultProps = {
    title: 'Confirmation',
    prompt: 'Are you sure?',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
}

export default PromptModal;
