import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useUsers, useDeleteUser } from "@/hooks/useUser";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: users } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();

  // Filter out admin users
  const filteredUsers = users?.filter((user) => user.role !== "admin") || [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${name}"?`);
    if (confirmed) {
      deleteUser(id);
    }
  };

  return (
    <Container className="p-5 shadow rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">👥 User Management</h2>
      {filteredUsers.length > 0 ? (
        <>
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentUsers.map((user, index) => (
                <tr key={user.id} className="align-middle">
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(user.createdAt))}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete User</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.name)}
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
          <p className="fw-bold">No non-admin users found.</p>
        </div>
      )}
    </Container>
  );
};

export default UserList;
