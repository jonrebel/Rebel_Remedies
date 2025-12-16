import { buildUrl } from "../api/apiClient";
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken() {
    return localStorage.getItem(ACCESS_KEY);
}

export function setTokens({ access, refresh }) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
}

export function logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}

export async function login(username, password) {
    const response = await fetch(buildUrl("/api/token/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed (check username/password)");
    }

    const data = await response.json();
    setTokens(data);
    return data;
}
