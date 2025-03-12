import { useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const sampleBlogs = [
  {
    id: 1,
    title: "Understanding React Hook Form",
    category: "Technology",
    status: "Published",
    publishDate: "2024-03-10",
  },
  {
    id: 2,
    title: "SEO Strategies for 2024",
    category: "Business",
    status: "Draft",
    publishDate: "2024-04-05",
  },
  {
    id: 3,
    title: "How AI is Transforming Healthcare",
    category: "Health",
    status: "Published",
    publishDate: "2024-05-15",
  },
  {
    id: 4,
    title: "Cybersecurity Trends 2024",
    category: "Technology",
    status: "Published",
    publishDate: "2024-06-01",
  },
  {
    id: 5,
    title: "Effective Digital Marketing Tactics",
    category: "Business",
    status: "Draft",
    publishDate: "2024-06-10",
  },
  {
    id: 6,
    title: "Healthy Lifestyle Tips",
    category: "Health",
    status: "Published",
    publishDate: "2024-06-20",
  },
  {
    id: 7,
    title: "Best Practices for Remote Work",
    category: "Business",
    status: "Published",
    publishDate: "2024-07-01",
  },
  {
    id: 8,
    title: "Web Development Trends 2025",
    category: "Technology",
    status: "Draft",
    publishDate: "2024-07-05",
  },
  {
    id: 9,
    title: "Blockchain Innovations in 2025",
    category: "Technology",
    status: "Published",
    publishDate: "2024-07-10",
  },
  {
    id: 10,
    title: "Social Media Growth Strategies",
    category: "Business",
    status: "Draft",
    publishDate: "2024-07-15",
  },
  {
    id: 11,
    title: "Mental Health Awareness in the Workplace",
    category: "Health",
    status: "Published",
    publishDate: "2024-07-20",
  },
  {
    id: 12,
    title: "The Future of E-commerce",
    category: "Business",
    status: "Published",
    publishDate: "2024-07-25",
  },
  {
    id: 13,
    title: "Cloud Computing Security Best Practices",
    category: "Technology",
    status: "Draft",
    publishDate: "2024-07-30",
  },
  {
    id: 14,
    title: "Fitness Trends for 2025",
    category: "Health",
    status: "Published",
    publishDate: "2024-08-05",
  },
  {
    id: 15,
    title: "AI-Powered Chatbots for Business",
    category: "Technology",
    status: "Published",
    publishDate: "2024-08-10",
  },
  {
    id: 16,
    title: "Green Energy Solutions",
    category: "Business",
    status: "Draft",
    publishDate: "2024-08-15",
  },
  {
    id: 17,
    title: "Preventing Data Breaches",
    category: "Technology",
    status: "Published",
    publishDate: "2024-08-20",
  },
  {
    id: 18,
    title: "The Rise of Voice Search",
    category: "Business",
    status: "Draft",
    publishDate: "2024-08-25",
  },
  {
    id: 19,
    title: "Telemedicine: The New Normal",
    category: "Health",
    status: "Published",
    publishDate: "2024-08-30",
  },
  {
    id: 20,
    title: "Best Cyber Hygiene Practices",
    category: "Technology",
    status: "Draft",
    publishDate: "2024-09-05",
  },
  {
    id: 21,
    title: "The Evolution of UI/UX Design",
    category: "Technology",
    status: "Published",
    publishDate: "2024-09-10",
  },
  {
    id: 22,
    title: "Effective Content Marketing Strategies",
    category: "Business",
    status: "Draft",
    publishDate: "2024-09-15",
  },
  {
    id: 23,
    title: "The Role of Nutrition in Mental Health",
    category: "Health",
    status: "Published",
    publishDate: "2024-09-20",
  },
  {
    id: 24,
    title: "5G and the Future of Connectivity",
    category: "Technology",
    status: "Published",
    publishDate: "2024-09-25",
  },
  {
    id: 25,
    title: "How to Start a Successful Startup",
    category: "Business",
    status: "Draft",
    publishDate: "2024-09-30",
  },
  {
    id: 26,
    title: "Smart Home Technology Trends",
    category: "Technology",
    status: "Published",
    publishDate: "2024-10-05",
  },
  {
    id: 27,
    title: "Mindfulness for Professionals",
    category: "Health",
    status: "Draft",
    publishDate: "2024-10-10",
  },
  {
    id: 28,
    title: "Growth Hacking Techniques for Startups",
    category: "Business",
    status: "Published",
    publishDate: "2024-10-15",
  },
];

const BlogList = () => {
  const [blogs, setBlogs] = useState(sampleBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    toast.success("Blog deleted successfully!");
  };

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">📜 Blog List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" href="/create-blog">
          <FaPlus className="me-2" /> Create Blog
        </Button>
      </div>
      {blogs.length > 0 ? (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="shadow-sm rounded"
          >
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Publish Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentBlogs.map((blog, index) => (
                <tr key={blog.id} className="align-middle">
                  <td className="fw-bold">{indexOfFirstBlog + index + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 rounded-pill fw-bold ${
                        blog.status === "Published"
                          ? "bg-success text-white"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td>{blog.publishDate}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Blog</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Blog</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      ) : (
        <div className="text-center text-muted p-4">
          <FaExclamationCircle size={50} className="mb-3 text-secondary" />
          <p className="fw-bold">No blogs available. Start by creating one!</p>
        </div>
      )}
    </Container>
  );
};

export default BlogList;
