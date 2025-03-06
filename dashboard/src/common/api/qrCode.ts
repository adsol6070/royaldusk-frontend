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

interface QRCodeData {
	tableId: string
	qrCode: string
}

const QRCodeService = {
	getQRCodes: (): Promise<{ data: QRCodeData[] }> => {
		return HttpClient.get('qrCode/handleScan', {
			headers: getAuthHeaders(),
		})
	},
	createQRCode: (): Promise<any> => {
		return HttpClient.post('qrCode/generateBarcodesForTables', undefined, {
			headers: getAuthHeaders(),
		})
	},
}

export default QRCodeService
