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
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route-paths.config";
import { usePackages, useUpdatePackageAvailability, useDeletePackage } from "@/hooks/usePackage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import Swal from "sweetalert2";

const PackageList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 10;

  const { data: customPackages } = usePackages();
  const { mutate: deletePackage } = useDeletePackage();
  const { mutate: updatePackageAvailability } = useUpdatePackageAvailability();
console.log("Custom Packages:", customPackages);

const handleDelete = (id: string) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This package will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result: any) => {
    if (result.isConfirmed) {
      deletePackage(id);
      Swal.fire("Deleted!", "The package has been deleted.", "success");
    }
  });
};

  const handleAvailabilityChange = (id: string, newAvailability: string) => {
    updatePackageAvailability({ id, availability: newAvailability });
  };

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = customPackages?.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil((customPackages?.length || 0) / packagesPerPage);

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">🌍 Package List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="success"
          onClick={() => {
            const route = ROUTES.PRIVATE.CREATE_PACKAGE;
            navigate(typeof route === "function" ? route() : route);
          }}
        >
          <FaPlus className="me-2" /> Create Package
        </Button>
      </div>
      {currentPackages && currentPackages?.length > 0 ? (
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
                <th>S.No</th>
                <th>Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentPackages &&
                currentPackages.map((customPackage, index) => (
                  <tr key={customPackage.id} className="align-middle">
                    <td className="fw-bold">
                      {indexOfFirstPackage + index + 1}
                    </td>
                    <td>{capitalizeFirstLetter(customPackage.name)}</td>
                    <td>{capitalizeFirstLetter(customPackage.location.name)}</td>
                    <td>{capitalizeFirstLetter(customPackage.category.name)}</td>
                    <td>
                      <Form.Select
                        value={customPackage.availability}
                        onChange={(e: any) =>
                          handleAvailabilityChange(
                            customPackage.id,
                            e.target.value
                          )
                        }
                        className={`fw-bold ${
                          customPackage.availability === "Available"
                            ? "text-success"
                            : customPackage.availability === "SoldOut"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="SoldOut">Sold Out</option>
                        <option value="ComingSoon">Coming Soon</option>
                      </Form.Select>
                    </td>
                    <td>
                      {customPackage.createdAt
                        ? new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).format(new Date(customPackage.createdAt))
                        : "N/A"}
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Package</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(
                              `${ROUTES.PRIVATE.EDIT_PACKAGE(customPackage.id)}`
                            )
                          }
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Preview Package</Tooltip>}
                      >
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(
                              `${ROUTES.PRIVATE.PACKAGE_DETAILS(
                                customPackage.id
                              )}`
                            )
                          }
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Package</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(customPackage.id)}
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
          <p className="fw-bold">No packages found. Start by creating one!</p>
        </div>
      )}
    </Container>
  );
};

export default PackageList;
