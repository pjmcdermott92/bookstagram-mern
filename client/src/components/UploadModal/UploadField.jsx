import { useRef } from 'react';
import { useAlerts } from '../../providers/BookstagramProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFile } from '@fortawesome/free-solid-svg-icons';

const UploadField = ({ value, onChange }) => {
    const { setAlert } = useAlerts();
    const imageField = useRef();

    const onDragEnter = () => imageField.current.classList.add('dragged');
    const onDragLeave = () => imageField.current.classList.remove('dragged');
    const onDrop = () => imageField.current.classList.remove('dragged');

    const onFileDrop = e => {
        const fileExists = e.target.files[0];
        if (fileExists) {
            if (fileExists.size > 4194304) return setAlert('Image is too large. Image must be less than 4MB.', 'danger');
            onChange(fileExists);
        }
    }

    const removeFile = () => onChange(null);

    if (value) return (
        <div className='fileUploaded'>
            <div>
                <FontAwesomeIcon icon={faFile} />
                <span>{value.name}</span>
            </div>
            <button
                type='button'
                className='btn-link'
                onClick={removeFile}
            >
                &times; Change Image
            </button>
        </div>
    );

    return (
        <div className='uploadField'>
            <label
                htmlFor='imageUpload'
                ref={imageField}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <input
                    type='file'
                    accept='image/*'
                    name='image'
                    id='imageUpload'
                    onChange={onFileDrop}
                />
                <div className='file-icon'>
                    <FontAwesomeIcon icon={faImage} />
                </div>
                <p>Drag an image here to upload or click to choose file.</p>
                <p><small>Only image files are accepted, and file size must be less than 4MB.</small></p>
            </label>
        </div>
    )
}

export default UploadField;
