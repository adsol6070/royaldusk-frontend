import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { tableService } from "../../common";
import { Col, Row, Form, Button, Card } from "react-bootstrap";
import styled from "styled-components";
import { FaTrash, FaSave } from "react-icons/fa";
import { theme } from "../../constants/theme";
import Table from "../../components/Table";

const View = styled.div`
  background: transparent;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;

  .edit-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-right: 8px;
  }
`;

const TablesList = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedTableNumber, setEditedTableNumber] = useState<string>("");
  const [editedTableCapacity, setEditedTableCapacity] = useState<string>("");

  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [newTableCapacity, setNewTableCapacity] = useState<string>("");

  const columns = useMemo(
    () => [
      {
        Header: "Table Number",
        accessor: "tableNumber",
        Cell: ({ cell }) => {
          const tableId = cell.row.original._id;
          const isEditing = editRowId === tableId;

          return isEditing ? (
            <input
              type="text"
              value={editedTableNumber}
              onChange={(e) => setEditedTableNumber(e.target.value)}
              onBlur={() => handleSave(tableId)}
              onKeyDown={(e) => e.key === "Enter" && handleSave(tableId)}
              style={{ width: "100%" }}
            />
          ) : (
            <span>{cell.value}</span>
          );
        },
      },
      {
        Header: "Table Capacity",
        accessor: "capacity",
        Cell: ({ cell }) => {
          const tableId = cell.row.original._id;
          const isEditing = editRowId === tableId;

          return isEditing ? (
            <input
              type="number"
              value={editedTableCapacity}
              onChange={(e) => setEditedTableCapacity(e.target.value)}
              onBlur={() => handleSave(tableId)}
              onKeyDown={(e) => e.key === "Enter" && handleSave(tableId)}
              style={{ width: "100%" }}
            />
          ) : (
            <span>{cell.value}</span>
          );
        },
      },
      {
        Header: "Action",
        Cell: ({ cell }) => {
          const tableId = cell.row.original._id;
          const isEditing = editRowId === tableId;

          return (
            <ActionButtons>
              {isEditing ? (
                <button
                  className="edit-btn"
                  onClick={() => handleSave(tableId)}
                >
                  <FaSave size="19" />
                </button>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(
                      tableId,
                      cell.row.original.tableNumber,
                      cell.row.original.capacity
                    )
                  }
                >
                  ✏️
                </button>
              )}
              <View>
                <FaTrash size="16" onClick={() => handleDelete(tableId)}/>
              </View>
            </ActionButtons>
          );
        },
      },
    ],
    [editRowId, editedTableNumber, editedTableCapacity]
  );

  const handleEdit = (
    tableId: string,
    tableNumber: string,
    capacity: string
  ) => {
    setEditRowId(tableId);
    setEditedTableNumber(tableNumber);
    setEditedTableCapacity(capacity);
  };

  const handleSave = async (tableId: string) => {
    try {
      await tableService.updateTable(tableId, {
        tableNumber: editedTableNumber,
        capacity: editedTableCapacity,
      });
      const updatedTables = tables.map((table) =>
        table._id === tableId
          ? {
              ...table,
              tableNumber: editedTableNumber,
              capacity: editedTableCapacity,
            }
          : table
      );
      setTables(updatedTables);
    } catch (error) {
      console.error("Error updating table:", error);
    } finally {
      setEditRowId(null);
    }
  };

  const handleDelete = async (tableId: string) => {
    try {
      await tableService.deleteTable(tableId); 
      const updatedTables = tables.filter((table) => table._id !== tableId);
      setTables(updatedTables);
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const tables = await tableService.getTables();
      const modifiedTables = tables.data.map((table) => ({
        _id: table._id,
        tableNumber: table.tableNumber,
        capacity: table.capacity,
      }));
      setTables(modifiedTables);
    } catch (error) {
      console.error("Error while fetching tables:", error);
    }
  };

  const handleCreateTable = async () => {
    if (!newTableNumber || !newTableCapacity) return; // Validate input

    try {
      const newTable = {
        tableNumber: newTableNumber,
        capacity: newTableCapacity,
      };
      const createdTable = await tableService.createTable(newTable);

      setTables([...tables, createdTable.data]);

      setNewTableNumber("");
      setNewTableCapacity("");
    } catch (error) {
      console.error("Error creating new table:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <>
      <PageBreadcrumb title="Tables" subName="Tables" />
      <Row>
        <Col xs={12}>
          <Card.Header
            style={{
              border: "none",
              background: `${theme.colors.almostWhite}`,
              padding: "20px",
              ...theme.fonts.bold,
            }}
          >
            <h4>Create New Table</h4>
          </Card.Header>
          <Card.Body
            style={{
              border: "none",
              background: `${theme.colors.almostWhite}`,
              padding: "0px 20px 20px 20px",
            }}
          >
            <Form>
              <Form.Group controlId="formTableNumber">
                <Form.Label>Table Number</Form.Label>
                <Form.Control
                  type="text"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formTableCapacity" className="mt-2">
                <Form.Label>Table Capacity</Form.Label>
                <Form.Control
                  type="number"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                />
              </Form.Group>

              <Button
                style={{ background: "black" }}
                className="mt-3"
                onClick={handleCreateTable}
              >
                Create Table
              </Button>
            </Form>
          </Card.Body>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>
          <Table columns={columns} data={tables} title="Table List" />
        </Col>
      </Row>
    </>
  );
};

export default TablesList;
