import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { Col, Modal, Button, ListGroup } from "react-bootstrap";
import Table from "../../components/Table";
import { FaEye } from "react-icons/fa";
import { rolesApi } from "../../common";

const Permissions = () => {
  const [permissionsData, setPermissionsData] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const columns = useMemo(
    () => [
      {
        Header: "Role Name",
        accessor: "role",
        Cell: ({ value }: { value: string }) => value.toUpperCase(),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }: { value: string }) =>
          new Date(value).toLocaleDateString(),
      },
      {
        Header: "View Permissions",
        Cell: ({ row }: { row: any }) => (
          <FaEye
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => handleViewPermissions(row.original)}
          />
        ),
      },
    ],
    []
  );

  const fetchPermissions = async () => {
    try {
      const permissions = await rolesApi.getPermission();
      setPermissionsData(permissions.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleViewPermissions = (permission: any) => {
    setSelectedPermissions(permission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPermissions(null);
  };

  const handleTogglePermission = async (key: string, value: boolean) => {
    if (!selectedPermissions) return;

    const updatedRights = {
      ...selectedPermissions.rights,
      [key]: !value,
    };

    const updatedPermission = { ...selectedPermissions, rights: updatedRights };
    setSelectedPermissions(updatedPermission);

    setUpdating(true);
    try {
      await rolesApi.updatePermission(selectedPermissions._id, {
        rights: updatedRights,
      });

      setPermissionsData((prevData) =>
        prevData.map((item) =>
          item._id === selectedPermissions._id ? updatedPermission : item
        )
      );
    } catch (error) {
      console.error("Error updating permission:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <PageBreadcrumb title="Permissions List" subName="Permissions" />
      <Col xs={12}>
        <Table
          columns={columns}
          data={permissionsData}
          title="Permissions List"
        />
      </Col>

      {selectedPermissions && (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedPermissions.role} Permissions</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
            <h5 className="mb-4">Permissions Overview:</h5>
            <ListGroup variant="flush">
              {Object.entries(selectedPermissions.rights).map(
                ([key, value]) => (
                  <ListGroup.Item
                    key={key}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      fontSize: "1.1rem",
                      padding: "0.75rem 1.25rem",
                      backgroundColor: value ? "#e8f5e9" : "#ffebee",
                      borderColor: value ? "#66bb6a" : "#ef5350",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      !updating && handleTogglePermission(key, value)
                    }
                  >
                    <span style={{ fontWeight: 500 }}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span
                      className={`badge ${
                        value ? "bg-success" : "bg-danger"
                      } p-2`}
                      style={{
                        fontSize: "0.9rem",
                        textTransform: "capitalize",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {value ? "Allowed" : "Not Allowed"}
                    </span>
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Permissions;
