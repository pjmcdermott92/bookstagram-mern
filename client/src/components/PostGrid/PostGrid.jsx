import { useAppContext } from '../../providers/BookstagramProvider.jsx';
import Post from '../Post/Post.jsx';
import './PostGrid.scss';

const PostGrid = () => {
    const { postService } = useAppContext();

    if (!postService?.posts?.length) return 'No Posts were found.'
    return (
        <div className='PostGrid'>
            {postService?.posts?.length && postService.posts.map(post => {
                return <Post key={post._id} {...post} />
            })}
        </div>
    )
}

export default PostGrid;
