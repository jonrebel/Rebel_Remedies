import { getAccessToken, logout } from "../auth/auth";

export async function apiFetch(url, options = {}) {
    const token = getAccessToken();

    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        logout();
    }

    return response;
}
