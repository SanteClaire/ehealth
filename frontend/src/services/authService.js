const API_URL = 'http://localhost:8000/api';

export const authService = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/login_check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    async getMe() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            this.logout();
            return null;
        }

        return await response.json();
    },

    logout() {
        localStorage.removeItem('token');
    }
};
