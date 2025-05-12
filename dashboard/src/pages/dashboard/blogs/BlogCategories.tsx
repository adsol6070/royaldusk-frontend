import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from "@/hooks/useBlog";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const CategoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const categoriesPerPage = 10;

  const { data: categories = [] } = useBlogCategories();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, name: categoryName });
    } else {
      createCategory.mutate({ name: categoryName });
    }

    setCategoryName("");
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    deleteCategory.mutate(id);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{duration: 2000}}/>
      <Container className="p-5 shadow-lg rounded bg-light">
        <h2 className="mb-4 text-center fw-bold">📂 Blog Categories</h2>
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingCategory(null);
              setCategoryName("");
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Create Category
          </Button>
        </div>
        {categories.length > 0 ? (
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
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentCategories.map((category, index) => (
                  <tr key={category.id} className="align-middle">
                    <td className="fw-bold">
                      {indexOfFirstCategory + index + 1}
                    </td>
                    <td>{capitalizeFirstLetter(category.name)}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Category</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditCategory(category)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Category</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
            <p className="fw-bold">
              No categories available. Start by creating one!
            </p>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveCategory}>
              {editingCategory ? "Update Category" : "Save Category"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default CategoryList;
