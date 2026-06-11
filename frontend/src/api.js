// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// src/api.js
const BASE_URL = "http://localhost:8080";

export const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // ← auto-attach JWT
            ...options.headers,
        }
    });

    // ← If token expired, force logout
    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";    // ← redirect to login
    }

    return response;
};