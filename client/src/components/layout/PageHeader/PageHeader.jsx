import { useState } from 'react';
import { useAppContext } from '../../../providers/BookstagramProvider';
import { useModals } from '../../../providers/BookstagramProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
import AppLogo from '../AppLogo/AppLogo';
import UploadModal from '../../UploadModal/UploadModal';
import './PageHeader.scss';

const PageHeader = ({ setShowSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { postService, setContext, setIsLoading } = useAppContext();
    const { openModal } = useModals();

    const onSearch = async ({ target: { value } }) => {
        setSearchQuery(value);
        await postService.searchPosts(value);
        setContext();
        setIsLoading(false);
    }
    
    return (
        <header className='PageHeader'>
            <button
                className='PageHeader__sidebarToggleBtn'
                onClick={() => setShowSidebar(true)}
            >
                <span className='bars' />
            </button>
            <div className='PageHeader__AppBrand'>
                <AppLogo />
            </div>
            <div className='PageHeader__Search'>
                <div className='SearchBar'>
                    <input
                        className='SearchBar--input'
                        type='search'
                        placeholder='search...'
                        value={searchQuery}
                        onChange={onSearch}
                    />
                    <button className='SearchBar--searchBtn'>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
            <div className='PageHeader__HeaderUpload'>
                <button
                    className='btn btn-gradient btnUpload'
                    onClick={() => openModal(UploadModal)}
                >
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                    <span>Add Post</span>
                </button>
            </div>
        </header>
    )
}

export default PageHeader;
