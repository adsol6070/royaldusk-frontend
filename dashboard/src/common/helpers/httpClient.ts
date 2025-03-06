/* eslint-disable indent */
import axios, { AxiosRequestConfig } from 'axios'

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	404: 'Resource or page not found',
}

function HttpClient() {
	const _errorHandler = (error: any) =>
		Promise.reject(
			Object.keys(ErrorCodeMessages).includes(error?.response?.status)
				? ErrorCodeMessages[error.response.status]
				: error.response && error.response.message
				? error.response.message
				: error.message || error
		)

	const _httpClient = axios.create({
		baseURL: "http://localhost:8000/",
		timeout: 6000,
		headers: {
			'Content-Type': 'application/json',
			// 'Content-Type':'multipart/form-data'
		},
	})

	_httpClient.interceptors.response.use((response) => {
		return response
	}, 
	(error) => _errorHandler(error)
);

	return {
		get: (url: string, config: AxiosRequestConfig = {}) => _httpClient.get(url, config),
		post: (url: string, data: any, config: AxiosRequestConfig = {}) =>
			_httpClient.post(url, data, config),
		patch: (url: string, data: any,  config: AxiosRequestConfig = {}) => _httpClient.patch(url, data, config),
		put: (url: string, data: any,  config: AxiosRequestConfig = {}) => _httpClient.put(url, data, config),
		delete: (url: string, config: AxiosRequestConfig = {}) => _httpClient.delete(url, config),
		client: _httpClient,
	}
}

export default HttpClient()
