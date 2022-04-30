import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAppContext, useAlerts } from '../../providers/BookstagramProvider';
import { FormField } from '../layout';
import UploadField from './UploadField';
import './UploadModal.scss';

const UploadModal = ({ close }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [values, setValues] = useState({ title: '', file: null });
    const { postService, setContext } = useAppContext();
    const { setAlert } = useAlerts();

    const onChange = ({ target: {name, value}}) => {
        setValues({ ...values, [name]: value });
    }

    const onSubmit = async e => {
        e.preventDefault();
        setIsUploading(true);
        const urls = await postService.getUploadUrl();
        if (!urls.success) {
            setAlert('Error uploading image', 'danger');
            setIsUploading(false);
        } else {
            const { imageUrl, uploadUrl } = urls.data;
            await axios.put(uploadUrl, values.file, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ({ loaded, total }) => {
                    setUploadPercent(Math.round((loaded * 100) / total));
                }
            });
            const savePost = await postService.savePost({ imageUrl, title: values.title });
            if (savePost.success) {
                close();
                setContext();
                setAlert('Post uploaded', 'success');
            }
            setIsUploading(false);
        }
    }

    return (
        <>
        <div className='modal--header'>
            <h2>Add Post</h2>
        </div>
        <div className='modal--body'>
            <div className='UploadModal'>
                {isUploading ? (
                    <div className='UploadModal__uploading'>
                        <p>Your post is being uploaded. Please wait...</p>
                        <div className='UploadModal__progress'>
                            <span className='UploadModal__progress--percent'>{uploadPercent}%</span>
                            <div
                                className='UploadModal__progress--bar'
                                style={{ width: `${uploadPercent}%`}}
                            />
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <FormField
                            name='title'
                            label='Image Title'
                            type='text'
                            maxLength='40'
                            value={values.title}
                            onChange={onChange}
                        />
                        <UploadField
                            value={values.file}
                            onChange={file => setValues({ ...values, file })}
                        />
                        {values.title?.length && values.file ? (
                            <button
                                type='submit'
                                className='btn btn-primary btn-block btn-large'
                            >
                                Upload
                            </button>
                        ) : null}
                    </form>
                )}
            </div>
            <button
                className='btn btn-block'
                onClick={() => close()}
            >
                Cancel
            </button>
        </div>
        </>
    )
}

UploadModal.propTypes = {
    close: PropTypes.func.isRequired
}

export default UploadModal;
