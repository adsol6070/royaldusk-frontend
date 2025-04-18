import { HttpClient } from '../helpers';

const Blog_Base_Url = "http://localhost:7200";

// const accessTokenKey = 'access_token';

// // Function to get authorization headers
// const getAuthHeaders = (isMultipart = false) => {
//   const token = localStorage.getItem(accessTokenKey);
//   const headers = {};

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (isMultipart) {
//     headers['Content-Type'] = 'multipart/form-data';
//   }

//   return headers;
// };

// BlogService for managing blog operations
function BlogService() {
  return {

    // Retrieve all blog posts
    getAllPosts: () => {
      return HttpClient.get(`${Blog_Base_Url}/blogs`, { _skipAuth: true });
    },

    // Retrieve a single blog post by ID
    getPostById: (id) => {
      return HttpClient.get(`${Blog_Base_Url}/blogs/${id}`, { _skipAuth: true });
    },
    
    getAllBlogCategories: () => {
      return HttpClient.get(`${Blog_Base_Url}/blogCategories`, { _skipAuth: true });
    },

    getPostByCategory: (category) => {
      return HttpClient.get(`${Blog_Base_Url}/blogs/category/${category}`, { _skipAuth: true });
    },

  };
}

export default BlogService();
