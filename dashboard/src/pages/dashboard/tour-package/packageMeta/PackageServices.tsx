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
  usePackageServices,
  useCreatePackageServices,
  useUpdatePackageServices,
  useDeletePackageServices,
} from "@/hooks/usePackage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const PackageServiceList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [editingService, setEditingService] = useState<any>(null);
  const servicesPerPage = 10;

  const { data: services = [] } = usePackageServices();
  const createService = useCreatePackageServices();
  const updateService = useUpdatePackageServices();
  const deleteService = useDeletePackageServices();

  const handleSaveService = async () => {
    if (!serviceName.trim()) {
      toast.error("Service name cannot be empty!");
      return;
    }

    if (editingService) {
      updateService.mutate({ id: editingService.id, name: serviceName });
    } else {
      createService.mutate({ name: serviceName });
    }

    setServiceName("");
    setEditingService(null);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteService.mutate(id);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceName(service.name);
    setShowModal(true);
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-light">
        {/* <h2 className="mb-4 text-center fw-bold">🎯 Services</h2> */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingService(null);
              setServiceName("");
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Service
          </Button>
        </div>

        {services.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="shadow-sm rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentServices.map((service, index) => (
                  <tr key={service.id} className="align-middle">
                    <td className="fw-bold">{indexOfFirstService + index + 1}</td>
                    <td>{capitalizeFirstLetter(service.name)}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Service</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditService(service)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Service</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
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
              No services available. Start by creating one!
            </p>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingService ? "Edit Service" : "Add New Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter service name"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveService}>
              {editingService ? "Update Service" : "Save Service"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PackageServiceList;
