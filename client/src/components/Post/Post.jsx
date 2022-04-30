import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext, useAlerts, useModals } from '../../providers/BookstagramProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEllipsis, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PromptModal from '../PromptModal/PromptModal';
import './Post.scss';

const Post = ({ _id, user, avatar, firstName, lastName, imageUrl, title, likes }) => {
    const [showPostContext, setShowPostContext] = useState(false);
    const { authService, postService, setContext } = useAppContext();
    const { setAlert } = useAlerts();
    const { openModal } = useModals();
    const contextBtnRef = useRef();
    const contextMenuRef = useRef();

    useEffect(() => {
        const onClickOutsideMenu = e => {
            if (!contextMenuRef?.current?.contains(e.target)) {
                if (contextBtnRef?.current?.contains(e.target)) return null;
                setShowPostContext(false);
            }
        };
        document.addEventListener('click', onClickOutsideMenu, true);
        return () => document.removeEventListener('click', onClickOutsideMenu, true);
    });

    const isPostLiked = () => likes.some(like => like.user.toString() === authService.id);

    const deletePost = async () => {
        const deletePost = await postService.deletePost(_id);
        if (!deletePost.success) return setAlert(deletePost.message);
        setContext();
        setAlert('Post Deleted', 'success');
    }

    const handleClickLike = async () => {
        const liked = isPostLiked();
        const action = id => liked ? postService.unlikePost(id) : postService.likePost(id);
        const result = await action(_id);
        if (!result.success) return setAlert(action.message, 'danger');
        setContext();
        setAlert(`Post ${liked ? 'Unliked' : 'Liked'}`);
    }

    const handleClickDeletePost = () => {
        setShowPostContext(false);
        openModal(PromptModal, {
            title: 'Delete Post',
            prompt: 'Are you sure you want to delete this post? Deleted posts cannot be recovered.',
            confirmText: 'Delete Post',
            action: () => deletePost()
        })
    }

    return (
        <div className='Post'>
            {user === authService.id ? (
                <>
                <button
                    className='Post__actionBtn'
                    ref={contextBtnRef}
                    onClick={() => setShowPostContext(!showPostContext)}
                >
                    <FontAwesomeIcon icon={faEllipsis} />
                </button>
                {showPostContext ? (
                    <ul ref={contextMenuRef} className='Post__contextMenu'>
                        <li
                            className='Post__contextMenu--menuItem'
                            onClick={handleClickDeletePost}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            <span>Delete Post</span>
                        </li>
                    </ul>
                ) : null}
                </>
            ) : null}
            <div className='Post__postImage'>
                <img src={imageUrl} alt={title} />
            </div>
            <div className='Post__postTitle'>
                {title}
            </div>
            <div className='Post__postMeta'>
                <div className='Post__postMeta--user'>
                    <img src={avatar} alt={`${firstName} ${lastName}`} />
                    <span>{firstName} {lastName}</span>
                </div>
                <button
                    className='Post__postMeta--likeBtn'
                    onClick={handleClickLike}
                >
                    <span className='likeIcon' data-liked={isPostLiked()}>
                        <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <span className='likeCount'>{likes.length}</span>
                </button>
            </div>
        </div>
    )
}


Post.propTypes = {
    _id: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired
}

export default Post;
