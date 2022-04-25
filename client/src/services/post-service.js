import api from '../utils/api';

class PostService {
    constructor() {
        this.posts = [];
        this.searchQuery = '';
    }

    addPost = post => this.posts.unshift(post);
    removePost = postId => this.posts = this.posts.filter(post => post._id !== postId);

    getAllPosts = async () => {
        try {
            const res = await api('/posts');
            if (!res.success) throw new Error(res.message);
            this.posts = res.data;
            return { success: true, data: this.posts }
        } catch (err) {
            return { success: false, message: err.message }
        }
    }

    searchPosts = async (query) => {
        this.searchQuery = query;
        try {
            const res = await api(`/posts?query=${query}`);
            if (!res.success) throw new Error(res.message);
            this.posts = res.data;
            return { success: true, data: this.posts }
        } catch (err) {
            return { success: false, message: err.message }
        }
    }

    getUploadUrl = async () => {
        const res = await api('/posts/upload/get-url');
        return res;
    }

    savePost = async ({ imageUrl, title }) => {
        const body = {imageUrl, title };
        try {
            const res = await api('/posts/upload', body, 'POST');
            if (!res.success) throw new Error(res.message);
            this.addPost(res.data);
            return { success: true, data: this.posts };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    likePost = async id => {
        const postIndex = this.posts.findIndex(post => post._id === id);
        try {
            const res = await api(`/posts/like/${id}`, null, 'PUT');
            if (!res.success) throw new Error('Post could not be liked');
            this.posts[postIndex] = res.data;
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    unlikePost = async id => {
        const postIndex = this.posts.findIndex(post => post._id === id);
        try {
            const res = await api(`/posts/unlike/${id}`, null, 'PUT');
            if (!res.success) throw new Error('Could not be unlike post');
            this.posts[postIndex] = res.data;
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    deletePost = async id => {
        try {
            const res = await api(`/posts/${id}`, null, 'DELETE');
            if (!res.success) throw new Error(res.message);
            this.posts = this.posts.filter(post => post._id !== id);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

export default PostService;
