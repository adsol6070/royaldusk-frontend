import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import {
  usePackageLocations,
  useCreatePackageLocation,
  useUpdatePackageLocation,
  useDeletePackageLocation,
} from "@/hooks/usePackage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const PackageLocationList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", image: null as File | null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const locationsPerPage = 5;

  const { data: locations = [] } = usePackageLocations();
  const createLocation = useCreatePackageLocation();
  const updateLocation = useUpdatePackageLocation();
  const deleteLocation = useDeletePackageLocation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB

      if (file.size > maxSizeInBytes) {
        toast.error("Image size must be less than 1 MB");
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveLocation = () => {
    if (!formData.name || (!formData.image && !editingLocation)) {
      toast.error("Name and image are required.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    if (formData.image) uploadData.append("imageUrl", formData.image);

    if (editingLocation) {
      updateLocation.mutate({ id: editingLocation.id, data: uploadData });
    } else {
      createLocation.mutate(uploadData);
    }

    setShowModal(false);
    setEditingLocation(null);
    setFormData({ name: "", image: null });
    setImagePreview(null);
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({ name: location.name, image: null });
    setImagePreview(location.imageUrl);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteLocation.mutate(id);
  };

  const indexOfLast = currentPage * locationsPerPage;
  const indexOfFirst = indexOfLast - locationsPerPage;
  const currentLocations = locations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(locations.length / locationsPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-light">
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingLocation(null);
              setFormData({ name: "", image: null });
              setImagePreview(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" />
            Add Location
          </Button>
        </div>

        {locations.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="shadow-sm rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentLocations.map((loc, index) => (
                  <tr key={loc.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <img
                        src={loc.imageUrl}
                        alt={loc.name}
                        width="80"
                        height="60"
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    </td>
                    <td>{capitalizeFirstLetter(loc.name)}</td>
                    <td>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="m-1"
                          onClick={() => handleEdit(loc)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="m-1"
                          onClick={() => handleDelete(loc.id)}
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
            <p className="fw-bold">No locations found. Add one now!</p>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingLocation ? "Edit Location" : "Add New Location"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="mt-3 rounded"
                    style={{ width: "100%", height: "auto", maxHeight: 200, objectFit: "cover" }}
                  />
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveLocation}>
              {editingLocation ? "Update Location" : "Save Location"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PackageLocationList;
