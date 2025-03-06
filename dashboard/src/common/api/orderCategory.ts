import { HttpClient } from "../helpers";



function  orderCategory(){
    return {
        addCategory:(values:any)=>{
            return HttpClient.post('category/addcategories', values);
        },
        getCategory() {
			return HttpClient.get('category/getcategories', {})
		},
		
		
    }

}
export default orderCategory();
