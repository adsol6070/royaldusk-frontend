import { useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaTrash, FaExclamationCircle } from "react-icons/fa";
import {
  usePackageEnquiries,
  useDeletePackageEnquiry,
} from "@/hooks/usePackage";

const EnquiryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 10;

  const { data: enquiries } = usePackageEnquiries();
  const { mutate: deleteEnquiry } = useDeletePackageEnquiry();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      deleteEnquiry(id);
    }
  };

  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = enquiries?.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((enquiries?.length || 0) / enquiriesPerPage);

  return (
    <Container className="p-5 shadow rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">📬 Enquiry List</h2>

      {(enquiries?.length ?? 0) > 0 ? (
        <>
          <Table responsive striped bordered hover className="shadow-sm">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Adults</th>
                <th>Children</th>
                <th>Remarks</th>
                <th>DOB</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {(currentEnquiries ?? []).map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>{item.adults}</td>
                  <td>{item.children}</td>
                  <td>{item.remarks || "—"}</td>
                      <td>
                    {item.dob
                      ? new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                          hour12: true,
                        }).format(new Date(item.dob))
                      : "N/A"}
                  </td>
                  <td>
                    {item.createdAt
                      ? new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "short",
                          timeStyle: "short",
                          hour12: true,
                        }).format(new Date(item.createdAt))
                      : "N/A"}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Enquiry</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
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
        <div className="text-center text-muted p-5">
          <FaExclamationCircle size={48} className="mb-3 text-secondary" />
          <h5>No enquiries found yet!</h5>
        </div>
      )}
    </Container>
  );
};

export default EnquiryList;
