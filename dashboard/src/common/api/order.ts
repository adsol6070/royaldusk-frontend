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
		reacentOrderByEmail: (email: string) => {
			return HttpClient.post(
				`orderItems/recentOrder/`,
				{ email },
				{
					headers: getAuthHeaders(),
				}
			)
		},
		getImage(id: string) {
			return HttpClient.get(`menuItems/getImage/${id}`, {
				responseType: 'blob',
				headers: getAuthHeaders(),
			})
		},
		updateOrderStatus: (orderId: string, statusData: { status: string }) => {
			return HttpClient.patch(
				`orderItems/orderStatus/${orderId}`,
				{ statusData },
				{ headers: getAuthHeaders() }
			)
		},

		placeOrder: (orderData: any) => {
			return HttpClient.post('orderItems/createorder', orderData, {
				headers: getAuthHeaders(),
			})
		},
		getAllOrders: () => {
			return HttpClient.get('orderItems/orders', { headers: getAuthHeaders() })
		},
	}
}
export default AuthService()
