// @ts-nocheck
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_API,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Optional: interceptors (refresh token, logging, etc.)
// api.interceptors.response.use(
// 	(res) => res,
// 	(err) => {
// 		console.error("API Error:", err?.response || err);
// 		return Promise.reject(err);
// 	}
// );

// Generic handler
async function handleRequest<T>(fn: () => Promise<T>): Promise<T | null> {
	try {
		return await fn();
	} catch (err: any) {
		if (axios.isAxiosError(err)) {
			console.error("API call failed:", err.response?.data || err.message);
		} else {
			console.error("Unexpected error:", err);
		}

		return null;
	}
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
	return handleRequest(() => api.get<T>(url, config).then((res) => res.data));
}

export async function apiPost<T>(url: string, body?: any, config?: AxiosRequestConfig) {
	return handleRequest(() => api.post<T>(url, body, config).then((res) => res.data));
}

export async function apiPatch<T>(url: string, body?: any, config?: AxiosRequestConfig) {
	return handleRequest(() => api.patch<T>(url, body, config).then((res) => res.data));
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
	return handleRequest(() => api.delete<T>(url, config).then((res) => res.data));
}

export default api;
