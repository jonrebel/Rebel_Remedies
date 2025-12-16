import { getAccessToken, logout } from "../auth/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function buildUrl(path) {
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
}

export async function apiFetch(path, options = {}) {
    const token = getAccessToken();

    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(buildUrl(path), { ...options, headers });

    if (response.status === 401) {
        logout();
    }

    return response;
}

export { buildUrl };
