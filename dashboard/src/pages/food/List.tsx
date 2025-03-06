import { useMemo } from "react";
import "./Table.css";
import { Col, Row } from "react-bootstrap";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { BsTrash } from "react-icons/bs";
import useAddMenu from "./useFood";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";

const List = () => {
  const { menuItems, loading, error, deleteMenuItem } = useAddMenu();

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "imageUrl",
        Cell: ({ value }) => (
          <div className="product-cell">
            <img src={value} alt={value} className="product-image" />
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => <div className="product-cell">{value}</div>,
      },
      {
        Header: "Menu Id",
        accessor: "_id",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`,
      },
      {
        Header: "Status",
        accessor: "availability",
        Cell: ({ value }) => {
          const statusClasses = {
            true: "status-publish",
            false: "status-pending",
          };
          return (
            <span className={`status ${statusClasses[value]}`}>
              {value === "true" ? "Available" : "Out of Stock"}
            </span>
          );
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ cell }) => {
          const productId = cell.row.original._id;
          return (
            <div className="action-buttons">
              <button
                className="edit-btn"
                onClick={() => {
                  navigate(`/food/edit/${productId}`);
                }}
              >
                ✏️
              </button>
              <Delete>
                <BsTrash
                  size="20"
                  onClick={() => {
                    deleteMenuItem(productId);
                  }}
                />
              </Delete>
              <View>
                <FaEye
                  size="20"
                  onClick={() => {
                    navigate(`/food/detail/${productId}`);
                  }}
                />
              </View>
            </div>
          );
        },
      },
    ],
    []
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data: {error}</p>;
  }

  return (
    <>
      <PageBreadcrumb title="Menu List" subName="Menu" />
      <Row>
        <Col xs={12}>
          <Table columns={columns} data={menuItems} title="Food List" />
        </Col>
      </Row>
    </>
  );
};

export default List;

const Delete = styled.div`
  background: transparent;
  cursor: pointer;
`;

const View = styled.div`
  background: transparent;
  cursor: pointer;
`;

/* 
 <Button
  style={{
    backgroundColor: theme.colors.orangeYellow,
    border: "none",
    borderRadius: "4px",
    padding: "5px 10px",
    fontSize: "17px",
    textAlign: "center",
  }}
  >
    <BsPlus size="30" /> Add New Food
  </Button>

*/
