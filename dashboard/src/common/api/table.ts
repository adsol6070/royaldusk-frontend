import { HttpClient } from '../helpers';

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

interface Table {
  tableNumber: string;
  capacity: string;
}

const tableService = {
  getTables: (): Promise<{ data: Table[] }> => {
    return HttpClient.get('table/getAllTables',{ headers: getAuthHeaders() });
  },
  createTable: (tableData: Table): Promise<{ data: Table }> => {
    return HttpClient.post('table/createTable', tableData,{
      headers: getAuthHeaders(),
    });
  },
  updateTable: (id: string, tableData: Table): Promise<{ data: Table }> => {
    return HttpClient.patch(`table/updateTable/${id}`, tableData,{
      headers: getAuthHeaders(),
    });
  },
  deleteTable: (id: string): Promise<{ data: Table }> => {
    return HttpClient.delete(`table/deleteTable/${id}`,{
      headers: getAuthHeaders(),
    });
  },
};

export default tableService;
