const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ─── Token management ───

export function getToken() {
    return localStorage.getItem('santeclaire_token')
}

export function setToken(token) {
    localStorage.setItem('santeclaire_token', token)
}

export function removeToken() {
    localStorage.removeItem('santeclaire_token')
    localStorage.removeItem('santeclaire_user')
}

export function getCachedUser() {
    try {
        const raw = localStorage.getItem('santeclaire_user')
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

export function setCachedUser(user) {
    localStorage.setItem('santeclaire_user', JSON.stringify(user))
}

// ─── Base fetch wrapper ───

async function apiFetch(path, options = {}) {
    const token = getToken()
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_URL}${path}`, { ...options, headers })
    const json = await res.json()

    if (!res.ok && res.status === 401) {
        removeToken()
    }

    return json
}

// ─── Auth ───

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Identifiants incorrects')
    }

    const data = await res.json()
    setToken(data.token)

    // Fetch user profile right after login
    const profile = await fetchMe()
    return profile
}

export async function register(payload) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    return res.json()
}

export function logout() {
    removeToken()
}

// ─── User ───

export async function fetchMe() {
    const json = await apiFetch('/me')
    if (json.success) setCachedUser(json.data)
    return json
}

// ─── Patient endpoints ───

export async function fetchPatientStats() {
    return apiFetch('/patient/stats')
}

export async function fetchPatientConsultations() {
    return apiFetch('/patient/consultations')
}

export async function fetchPatientDocuments() {
    return apiFetch('/patient/documents')
}

export async function fetchPatientOrdonnances() {
    return apiFetch('/patient/ordonnances')
}

export async function fetchPatientDossier() {
    return apiFetch('/patient/dossier')
}

// ─── Medecin endpoints ───

export async function fetchMedecinStats() {
    return apiFetch('/medecin/stats')
}

export async function fetchMedecinConsultations() {
    return apiFetch('/medecin/consultations')
}

export async function fetchMedecinPatients() {
    return apiFetch('/medecin/patients')
}

export async function fetchMedecinOrdonnances() {
    return apiFetch('/medecin/ordonnances')
}

export async function fetchMedecinDocuments() {
    return apiFetch('/medecin/documents')
}

export async function fetchMedecinAppointmentsToday() {
    return apiFetch('/medecin/appointments/today')
}

export async function fetchMedecinPatientDetail(patientId) {
    return apiFetch(`/medecin/patient/${patientId}`)
}

// ─── PDF ───

export function getOrdonnancePdfUrl(ordonnanceId) {
    return `${API_URL}/ordonnance/${ordonnanceId}/pdf`
}

export async function downloadOrdonnancePdf(ordonnanceId) {
    const token = getToken()
    const res = await fetch(`${API_URL}/ordonnance/${ordonnanceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Erreur lors du téléchargement')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Ordonnance_${ordonnanceId}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

// ─── Helpers ───

export function isAuthenticated() {
    return !!getToken()
}

export function getUserRole(user) {
    if (!user?.roles) return null
    if (user.roles.includes('ROLE_MEDECIN')) return 'medecin'
    if (user.roles.includes('ROLE_PATIENT')) return 'patient'
    if (user.roles.includes('ROLE_ADMIN')) return 'admin'
    return null
}
