import api from '../utils/api';

class User {
    constructor() {
        this.id = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.avatar = '';
        this.isLoggedIn = false;
    }

    setIsLoggedIn = value => this.isLoggedIn = value;
    setUserData = ({ _id, firstName, lastName, email, avatar }) => {
        this.id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.avatar = avatar;
    }

    fetchUserData = async () => {
        try {
            const res = await api('/api/v1/users');
            if (!res.success) throw new Error(res.message);
            if (!this.isLoggedIn) this.setIsLoggedIn(true);
            this.setUserData(res.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

class AuthService extends User {
    logOutUser = async () => {
        try {
            const res = await api('/api/v1/users/logout');
            if (!res.success) throw new Error(res.message);
            this.id = '';
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.avatar = '';
            this.isLoggedIn = false;
        } catch (err) {
            return { success: false, message: err };
        }
    }

    logInUser = async ({ email, password }) => {
        const body = { email: email.toLowerCase(), password };

        try {
            const res = await api('/api/v1/users', body, 'POST');
            if (!res.success) throw new Error(res.message);
            this.setIsLoggedIn(true);
            return this.fetchUserData();
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    registerUser = async ({ firstName, lastName, email, password }) => {
        const body = { firstName, lastName, email: email.toLowerCase(), password };

        try {
            const res = await api('/api/v1/users/register', body, 'POST');
            if (!res.success) throw new Error(res.message);
            this.setIsLoggedIn(true);
            return this.fetchUserData();
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

export default AuthService;
