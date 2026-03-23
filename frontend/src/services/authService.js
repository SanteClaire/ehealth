const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

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
    },

    // Patient APIs
    async getPatientConsultations() {
        const response = await fetch(`${API_URL}/patient/consultations`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async getPatientStats() {
        const response = await fetch(`${API_URL}/patient/stats`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    // Medecin APIs
    async getMedecinConsultations() {
        const response = await fetch(`${API_URL}/medecin/consultations`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async getMedecinStats() {
        const response = await fetch(`${API_URL}/medecin/stats`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    },

    async getMedecinTodayAppointments() {
        const response = await fetch(`${API_URL}/medecin/appointments/today`, {
            headers: getAuthHeaders()
        });
        return await response.json();
    }
};
