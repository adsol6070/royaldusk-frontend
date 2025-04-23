import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Form,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaEye,
} from "react-icons/fa";
import { ROUTES } from "@/config/route-paths.config";
import { useNavigate } from "react-router-dom";
import { useBlogs, useDeleteBlog, useUpdateBlogStatus } from "@/hooks/useBlog";

const BlogList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const { data: blogs } = useBlogs();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: updateBlogStatus } = useUpdateBlogStatus();

  console.log("Blogs:", blogs);
  const handleDelete = async (id: number) => {
    deleteBlog(id);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    console.log("Id:", id);
    console.log("New status:", newStatus);
    updateBlogStatus({ id, status: newStatus });
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs?.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs?.length / blogsPerPage);

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
      {blogs?.length > 0 ? (
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
                  <td>{blog.category_name}</td>
                  <td>
                    <Form.Select
                      value={blog.status}
                      onChange={(e) =>
                        handleStatusChange(blog.id, e.target.value)
                      }
                      className={`fw-bold ${
                        blog.status === "published"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Form.Select>
                  </td>

                  <td>
                    {blog?.published_at
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(blog.published_at))
                      : "N/A"}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Blog</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`${ROUTES.PRIVATE.EDIT_BLOG(blog.id)}`)
                        }
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Preview Blog</Tooltip>}
                    >
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`${ROUTES.PRIVATE.BLOG_DETAILS(blog.id)}`)
                        }
                      >
                        <FaEye />
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
