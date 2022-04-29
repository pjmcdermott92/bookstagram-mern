import { useState, useEffect } from 'react';
import { useAppContext } from '../../providers/BookstagramProvider';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PostGrid from '../../components/PostGrid/PostGrid';
import Loader from '../../components/layout/Loader/Loader';
import './HomePage.scss';

const HomePage = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const { isLoading, setContext, postService } = useAppContext();

    useEffect(() => {
        const fetchPosts = async () => {
            await postService.getAllPosts();
            setContext();
        }
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },  []);

    if (isLoading) return <Loader />
    return (
        <>
        <PageHeader setShowSidebar={setShowSidebar} />
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className='contentWrapper'>
            <h1>{postService.searchQuery?.length > 0
                    ? `Showing results for: ${postService.searchQuery}`
                    : 'Latest Posts'
            }</h1>
            <PostGrid />
        </main>
        </>
    )
}

export default HomePage;
