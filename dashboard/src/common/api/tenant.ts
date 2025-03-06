import { HttpClient } from '../helpers'

const accessTokenKey = 'authToken'

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
		createTenant: (email: string) => {
			return HttpClient.post(
				`tenant/create/`,
				{ email },
				{
					headers: getAuthHeaders(),
				}
			)
		},
		updateTenant: (orderId: string, statusData: { status: string }) => {
			return HttpClient.patch(
				`orderItems/orderStatus/${orderId}`,
				{ statusData },
				{ headers: getAuthHeaders() }
			)
		},

		
		getallTenant: () => {
			return HttpClient.get('tenant/getAll', { headers: getAuthHeaders() })
		},
	}
}
export default AuthService()
