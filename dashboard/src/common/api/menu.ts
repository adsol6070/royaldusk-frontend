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

interface Menu {
	_id: string
	name: string
	price: string
	image: string
}

function AuthService() {
	return {
		createMenu: (values: Menu) => {
			return HttpClient.post('menuItems/createmenu', values, {
				headers: getAuthHeaders(true),
			})
		},
		getMenu() {
			return HttpClient.get('menuItems/getmenu', { headers: getAuthHeaders() })
		},
		getMenuById: (id: string) => {
			return HttpClient.get(`menuItems/getmenubyid/${id}`,{ headers: getAuthHeaders() })
		},
		updateMenu: (id: string, values: Menu) => {
			return HttpClient.put(`menuItems/updatemenu/${id}`, values, {
				headers: getAuthHeaders(true),
			})
		},
		deleteMenu: (id: string) => {
			return HttpClient.delete(`menuItems/deletemenu/${id}`,{ headers: getAuthHeaders() })
		},

		getImage(id: string) {
			return HttpClient.get(`menuItems/getImage/${id}`, {
				responseType: 'blob',
				headers: getAuthHeaders(),
			})
		},
	}
}
export default AuthService()
