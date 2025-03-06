import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { FaEye } from "react-icons/fa";
import styled from "styled-components";
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

const generateColumns = (
  navigate: ReturnType<typeof useNavigate>
): Column[] => [
  {
    Header: "Firstname",
    accessor: "firstName",
  },
  {
    Header: "Lastname",
    accessor: "lastName",
  },
  {
    Header: "Phone Number",
    accessor: "phoneNumber",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Action",
    Cell: ({ cell }) => {
      const productId = cell.row.original._id;
      return (
        <ActionButtons>
          <button
            className="edit-btn"
            onClick={() => navigate(`/${productId}`)}
          >
            ✏️
          </button>
          <View>
            <FaEye
              size="20"
              onClick={() => navigate(`/orders/details/${productId}`)}
            />
          </View>
        </ActionButtons>
      );
    },
  },
];

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      // const response = await tenantApi.getallTenant();
      // setOrderItems(response.data);
    } catch (err) {
      console.error("Error fetching order items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const columns = useMemo(() => generateColumns(navigate), [navigate]);

  return (
    <>
      <PageBreadcrumb title="Tenant List" subName="Tenants" />
      <Row>
        <Col xs={12}>
          <Table columns={columns} data={orderItems} title="Tenants List" />
        </Col>
      </Row>
    </>
  );
};

export default OrderList;
