import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { openDB } from "idb";
import { ROUTES } from "../../../common/constants/routes";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const initializeDB = async () => {
    const db = await openDB("BlogDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("blogs")) {
          db.createObjectStore("blogs", { keyPath: "id", autoIncrement: true });
        }
      },
    });
    return db;
  };

  const fetchBlogs = async () => {
    const db = await initializeDB();

    if (!db.objectStoreNames.contains("blogs")) {
      console.error("Object store 'blogs' not found.");
      return; // Avoid crashing the app
    }

    const allBlogs = await db.getAll("blogs");
    console.log("All Blogs:", allBlogs);

    const modifiedBlogs = allBlogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      category: blog.category.label,
      status: blog.status,
      publishDate: blog.publishDate,
    }));
    setBlogs(modifiedBlogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Delete blog from IndexedDB
  const handleDelete = async (id: number) => {
    const db = await openDB("BlogDB", 1);
    await db.delete("blogs", id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
    toast.success("Blog deleted successfully!");
  };

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">📜 Blog List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="success"
          onClick={() => {
            const route = ROUTES.PRIVATE.CREATE_BLOG;
            navigate(typeof route === "function" ? route() : route);
          }}
        >
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
