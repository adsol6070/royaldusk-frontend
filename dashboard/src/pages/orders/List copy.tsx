import { useEffect, useMemo, useState } from "react";
import { useTable, Column } from "react-table";
import { Card, Col, Row, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { FaEye } from "react-icons/fa";
import { theme } from "../../constants/theme";
import { orderApi } from "../../common";
import useOrder from "./useOrder";
import styled from "styled-components";
import Table from "../../components/Table";

const View = styled.div`
  background: transparent;
  cursor: pointer;
`;

const StyledCard = styled(Card)`
  border: none;
  background: ${theme.colors.almostWhite};
  padding: 10px;
`;

const Header = styled(Card.Header)`
  border: none;
  background: ${theme.colors.almostWhite};
`;

const Body = styled(Card.Body)`
  border: none;
  background: ${theme.colors.almostWhite};
  padding: 10px;
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
  const { error } = useOrder();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      setOrderItems(response.data);
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

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({
  //     columns,
  //     data: orderItems,
  //   });

  return (
    <>
      <PageBreadcrumb title="Order List" subName="Orders" />
      <Row>
        <Col xs={12}>
          {/* <StyledCard>
            <Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="header-title">Order List</h4>
              </div>
            </Header>
            <Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger">Something went wrong: {error}</Alert>
              ) : (
                <table {...getTableProps()} className="product-table">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={headerGroup.id}
                      >
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()} key={column.id}>
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={row.id}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} key={cell.column.id}>
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Body>
          </StyledCard> */}

          <Table columns={columns} data={orderItems} title="Order List" />
        </Col>
      </Row>
    </>
  );
};

export default OrderList;
