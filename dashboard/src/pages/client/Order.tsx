import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import Table from "../../components/Table";
import useOrder from "./useClient";

const Order = () => {
  const { loading, error, orders = [] } = useOrder();
  const navigate = useNavigate();

  const columns = [
    {
      Header: "Order ID",
      accessor: "_id",
    },
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
          <div>
            <button
              className="edit-btn"
              onClick={() => navigate(`/${productId}`)}
            >
              ✏️
            </button>
          </div>
        );
      },
    },
  ];
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!Array.isArray(orders)) return <div>Error: Data format is incorrect</div>;

  // Render the Table component with the columns and data
  return (
    <>
      <PageBreadcrumb title="Order List" subName="Order" />
      <Table columns={columns} data={orders} title="Order List" />
    </>
  );
};

export default Order;
