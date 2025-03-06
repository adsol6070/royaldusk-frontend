
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { Col, Row, Form, Button, Card } from "react-bootstrap";
import styled from "styled-components";
import { theme } from "../../constants/theme";
import { FaTrash } from "react-icons/fa";
import Table from "../../components/Table";
import useMenuCategories from "./useCategory";


const View = styled.div`
  background: transparent;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  
  .delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
`;

const MenuCategories = () => {
  const {
    menuCategories,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    handleDeleteCategory
  } = useMenuCategories();

  const columns = [
    {
      Header: "Category Name",
      accessor: "name",
      Cell: ({ cell }) => <span>{cell.value}</span>,
    },
    {
      Header: "Action",
      Cell: ({ cell }) => {
        const categoryId = cell.row.original._id;

        return (
          <ActionButtons>
            <View>
              <FaTrash size="16" onClick={() => handleDeleteCategory(categoryId)} />
            </View>
          </ActionButtons>
        );
      },
    },
  ];

  return (
    <>
      <PageBreadcrumb title="Menu Categories" subName="Menu Categories" />
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
            <h4>Create New Category</h4>
          </Card.Header>
          <Card.Body
            style={{
              border: "none",
              background: `${theme.colors.almostWhite}`,
              padding: "0px 20px 20px 20px",
            }}
          >
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Form.Group>

              <Button
                style={{ background: "black" }}
                className="mt-3"
                onClick={handleCreateCategory}
              >
                Create Category
              </Button>
            </Form>
          </Card.Body>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12}>
          <Table columns={columns} data={menuCategories} title="Category List" />
        </Col>
      </Row>
    </>
  );
};

export default MenuCategories;
