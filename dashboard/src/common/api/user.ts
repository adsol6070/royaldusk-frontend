import { HttpClient } from '../helpers'
const accessTokenKey = '_VELONIC_AUTH'

const getAuthHeaders = (isMultipart: boolean = false) => {
	const token: string | null = localStorage.getItem(accessTokenKey)
	let headers: { [key: string]: string } = {}

	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	if (isMultipart) {
		headers['Content-Type'] = 'multipart/form-data'
	}

	return headers
}

function AuthService() {
	return {
		createUser: (values: any) => {
			return HttpClient.post('users/createUser', values, {
				headers: getAuthHeaders(),
			})
		},
		getUser() {
			return HttpClient.get('users/getUsers',{
				headers: getAuthHeaders(),
			})
		},
		getUserById: (id:string) => {
			return HttpClient.get(`users/getUserId/${id}`,{
				headers: getAuthHeaders(),
			})
		},
		updateUser: (values: any) => {
			return HttpClient.post('users/updateUser/:id', values, {
				headers: getAuthHeaders(),
			})
		},
		deleteUser: (id: string) => {	
			return HttpClient.delete(`users/deleteUser/${id}`,{
				headers: getAuthHeaders(),
			})
		},
	}
}
export default AuthService()
