import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
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
import { useTours, useDeleteTour } from "@/hooks/useTour";

const PackageList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 10;

  const { data: tours } = useTours();
  const { mutate: deleteTour } = useDeleteTour();

  const handleDelete = (id: number) => {
    deleteTour(id);
  };

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours?.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil((tours?.length || 0) / toursPerPage);

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
      {tours?.length > 0 ? (
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
                <th>Name</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentTours.map((tour, index) => (
                <tr key={tour.id} className="align-middle">
                  <td className="fw-bold">{indexOfFirstTour + index + 1}</td>
                  <td>{tour.name}</td>
                  <td>{tour.location}</td>
                  <td>
                    {tour.created_at
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(tour.created_at))
                      : "N/A"}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Tour</Tooltip>}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`${ROUTES.PRIVATE.EDIT_TOUR(tour.id)}`)
                        }
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Preview Tour</Tooltip>}
                    >
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`${ROUTES.PRIVATE.TOUR_DETAILS(tour.id)}`)
                        }
                      >
                        <FaEye />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Tour</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(tour.id)}
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
          <p className="fw-bold">No tours found. Start by creating one!</p>
        </div>
      )}
    </Container>
  );
};

export default PackageList;
