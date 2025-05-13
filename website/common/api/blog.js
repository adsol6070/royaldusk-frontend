import { HttpClient } from '../helpers';

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
      return HttpClient.get(`/blog-service/api/blogs`, { _skipAuth: true });
    },

    // Retrieve a single blog post by ID
    getPostById: (id) => {
      return HttpClient.get(`/blog-service/api/blogs/${id}`, { _skipAuth: true });
    },
    
    getAllBlogCategories: () => {
      return HttpClient.get(`/blog-service/api/blogCategories`, { _skipAuth: true });
    },

    getPostByCategoryID: (categoryID) => {
      return HttpClient.get(`/blog-service/api/blogs/category/${categoryID}`, { _skipAuth: true });
    },

  };
}

export default BlogService();
