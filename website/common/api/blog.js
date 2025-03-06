import HttpClient from '../helpers';

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
    // Create a new blog post
    // createPost: (post) => {
    //   return HttpClient.post('/blog/', post, { headers: getAuthHeaders(true) });
    // },

    // Retrieve all blog posts
    getAllPosts: () => {
      return HttpClient.get('/blog/', { _skipAuth: true });
    },
    // Retrieve an image for a blog post
    // getImage: async (blogId) => {
    //   return await HttpClient.get(`/blog/${blogId}/image`, {
    //     responseType: 'blob',
    //     headers: getAuthHeaders(),
    //   });
    // },

    // Retrieve a single blog post by ID
    getPostById: (postId) => {
      return HttpClient.get(`/blog/${postId}`, { _skipAuth: true });
    },

    // // Update an existing blog post
    // updatePost: (postId, updatedPost) => {
    //   return HttpClient.patch(`/blog/${postId}`, updatedPost, {
    //     headers: getAuthHeaders(true),
    //   });
    // },

    // // Delete a blog post by ID
    // deletePost: (postId) => {
    //   return HttpClient.delete(`/blog/${postId}`, { headers: getAuthHeaders() });
    // },
  };
}

export default BlogService();
