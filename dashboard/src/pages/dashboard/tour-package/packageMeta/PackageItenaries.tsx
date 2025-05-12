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
  usePackageItineraries,
  useCreatePackageItinerary,
  useUpdatePackageItinerary,
  useDeletePackageItinerary,
} from "@/hooks/usePackage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const PackageItineraryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingItinerary, setEditingItinerary] = useState<any>(null);
  const itinerariesPerPage = 10;

  const { data: itineraries = [] } = usePackageItineraries();
  const createItinerary = useCreatePackageItinerary();
  const updateItinerary = useUpdatePackageItinerary();
  const deleteItinerary = useDeletePackageItinerary();

  const handleSaveItinerary = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Both Title and Description are required!");
      return;
    }
    const itineraryData = { title, description };

    if (editingItinerary) {
      updateItinerary.mutate({ id: editingItinerary.id, itineraryData });
    } else {
      createItinerary.mutate(itineraryData);
    }

    setTitle("");
    setDescription("");
    setEditingItinerary(null);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteItinerary.mutate(id);
  };

  const handleEditItinerary = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setTitle(itinerary.title);
    setDescription(itinerary.description);
    setShowModal(true);
  };

  const indexOfLastItinerary = currentPage * itinerariesPerPage;
  const indexOfFirstItinerary = indexOfLastItinerary - itinerariesPerPage;
  const currentItineraries = itineraries.slice(indexOfFirstItinerary, indexOfLastItinerary);
  const totalPages = Math.ceil(itineraries.length / itinerariesPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-light">
        {/* <h2 className="mb-4 text-center fw-bold">🗺️ Itineraries</h2> */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingItinerary(null);
              setTitle("");
              setDescription("");
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Itinerary
          </Button>
        </div>

        {itineraries.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="shadow-sm rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentItineraries.map((itinerary, index) => (
                  <tr key={itinerary.id} className="align-middle">
                    <td className="fw-bold">{indexOfFirstItinerary + index + 1}</td>
                    <td>{capitalizeFirstLetter(itinerary.title)}</td>
                    <td>{capitalizeFirstLetter(itinerary.description)}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Itinerary</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditItinerary(itinerary)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Itinerary</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(itinerary.id)}
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
              No itineraries available. Start by creating one!
            </p>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingItinerary ? "Edit Itinerary" : "Add New Itinerary"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter itinerary title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter itinerary description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveItinerary}>
              {editingItinerary ? "Update Itinerary" : "Save Itinerary"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PackageItineraryList;
