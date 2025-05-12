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
import { Toaster, toast } from "react-hot-toast";
import {
  usePackageFeatures,
  useCreatePackageFeatures,
  useUpdatePackageFeatures,
  useDeletePackageFeatures,
} from "@/hooks/usePackage"; 
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const PackageFeatureList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [featureName, setFeatureName] = useState("");
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const featuresPerPage = 10;

  const { data: features = [] } = usePackageFeatures();
  const createFeature = useCreatePackageFeatures();
  const updateFeature = useUpdatePackageFeatures();
  const deleteFeature = useDeletePackageFeatures();

  const handleSaveFeature = async () => {
    if (!featureName.trim()) {
      toast.error("Feature name cannot be empty!");
      return;
    }

    if (editingFeature) {
      updateFeature.mutate({ id: editingFeature.id, name: featureName });
    } else {
      createFeature.mutate({ name: featureName });
    }

    setFeatureName("");
    setEditingFeature(null);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteFeature.mutate(id);
  };

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setFeatureName(feature.name);
    setShowModal(true);
  };

  const indexOfLastFeature = currentPage * featuresPerPage;
  const indexOfFirstFeature = indexOfLastFeature - featuresPerPage;
  const currentFeatures = features.slice(indexOfFirstFeature, indexOfLastFeature);
  const totalPages = Math.ceil(features.length / featuresPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-light">
        {/* <h2 className="mb-4 text-center fw-bold">🚀 Features</h2> */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingFeature(null);
              setFeatureName("");
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Feature
          </Button>
        </div>

        {features.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="shadow-sm rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Feature Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentFeatures.map((feature, index) => (
                  <tr key={feature.id} className="align-middle">
                    <td className="fw-bold">{indexOfFirstFeature + index + 1}</td>
                    <td>{capitalizeFirstLetter(feature.name)}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Feature</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditFeature(feature)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Feature</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(feature.id)}
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
              No features available. Start by creating one!
            </p>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingFeature ? "Edit Feature" : "Add New Feature"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Feature Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter feature name"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveFeature}>
              {editingFeature ? "Update Feature" : "Save Feature"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PackageFeatureList;
