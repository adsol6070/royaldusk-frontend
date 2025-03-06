import { HttpClient } from "../helpers";
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

function  AuthService(){
    return {
        createCategory:(values:any)=>{
            return HttpClient.post('menuCategory/createCategory',values,{
				headers: getAuthHeaders(),
			});
        },
        getCategory() {
			return HttpClient.get('menuCategory/getCategories',{
				headers: getAuthHeaders(true),
			})
		},
		getCategoryById: (id: any) => {
			return HttpClient.get(`menuCategory/getCategory/:id${id}`,{
				headers: getAuthHeaders(),
			})
		},
		updateCategory: (id:string , values: any) => {
			return HttpClient.put(`menuCategory/updateCategory/:id ${id}`, values,{
				headers: getAuthHeaders(),
			})
		},
		deleteCategory: (id: string) => {
			return HttpClient.delete(`menuCategory/deleteCategory/${id}`,{
				headers: getAuthHeaders(),
			})
		},
    }

}
export default AuthService();
