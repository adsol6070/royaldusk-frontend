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
  usePackagePolicies,
  useCreatePackagePolicy,
  useUpdatePackagePolicy,
  useDeletePackagePolicy,
} from "@/hooks/usePackage"; 
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const PackagePolicyList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [formData, setFormData] = useState({
    bookingPolicy: "",
    visaDetail: "",
    cancellationPolicy: "",
    paymentTerms: "",
  });

  const policiesPerPage = 5;

  const { data: policies = [] } = usePackagePolicies();
  const createPolicy = useCreatePackagePolicy();
  const updatePolicy = useUpdatePackagePolicy();
  const deletePolicy = useDeletePackagePolicy();

  const handleSavePolicy = () => {
    const { bookingPolicy, visaDetail, cancellationPolicy, paymentTerms } = formData;
    if (!bookingPolicy || !visaDetail || !cancellationPolicy || !paymentTerms) {
      toast.error("All fields are required.");
      return;
    }

    if (editingPolicy) {
      updatePolicy.mutate({ id: editingPolicy.id, ...formData });
    } else {
      createPolicy.mutate({ ...formData });
    }

    setFormData({
      bookingPolicy: "",
      visaDetail: "",
      cancellationPolicy: "",
      paymentTerms: "",
    });
    setEditingPolicy(null);
    setShowModal(false);
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setFormData({ ...policy });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deletePolicy.mutate(id);
  };

  const indexOfLast = currentPage * policiesPerPage;
  const indexOfFirst = indexOfLast - policiesPerPage;
  const currentPolicies = policies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(policies.length / policiesPerPage);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-light">
        {/* <h2 className="mb-4 text-center fw-bold">📜 Package Policies</h2> */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            onClick={() => {
              setEditingPolicy(null);
              setFormData({
                bookingPolicy: "",
                visaDetail: "",
                cancellationPolicy: "",
                paymentTerms: "",
              });
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" />
            Add Policy
          </Button>
        </div>

        {policies.length > 0 ? (
          <>
            <Table striped bordered hover responsive className="shadow-sm rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Booking</th>
                  <th>Visa</th>
                  <th>Cancellation</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center bg-white">
                {currentPolicies.map((policy, index) => (
                  <tr key={policy.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{capitalizeFirstLetter(policy.bookingPolicy)}</td>
                    <td>{capitalizeFirstLetter(policy.visaDetail)}</td>
                    <td>{capitalizeFirstLetter(policy.cancellationPolicy)}</td>
                    <td>{capitalizeFirstLetter(policy.paymentTerms)}</td>
                    <td>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="m-1"
                          onClick={() => handleEdit(policy)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="m-1"
                          onClick={() => handleDelete(policy.id)}
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
            <p className="fw-bold">No policies found. Add one now!</p>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingPolicy ? "Edit Policy" : "Add New Policy"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {["bookingPolicy", "visaDetail", "cancellationPolicy", "paymentTerms"].map(
                (field) => (
                  <Form.Group className="mb-3" key={field}>
                    <Form.Label>{capitalizeFirstLetter(field.replace(/([A-Z])/g, " $1"))}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder={`Enter ${field}`}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                    />
                  </Form.Group>
                )
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSavePolicy}>
              {editingPolicy ? "Update Policy" : "Save Policy"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default PackagePolicyList;
