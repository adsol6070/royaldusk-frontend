import React from "react";
import styled from "styled-components";
import { theme } from "../../constants/theme";
import useAddMenu from "./useClient";
import { cartApi } from "../../common";
import { useAuthContext } from "../../common/context/AuthContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  veg?: boolean;
  nonVeg?: boolean;
}

interface UseAddMenuResponse {
  loading: boolean;
  error: string | null;
  menuItems: Product[];
}

const CardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  text-align: center;
  padding: 10px 10px 20px;
  background-color: ${theme.colors.almostWhite};
  cursor: pointer;
  &:hover {
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
  height: 200px;
`;

const ProductName = styled.h5`
  margin-top: 10px;
  font-family: ${theme.fonts.bold};
`;

const ProductDesc = styled.p`
  font-size: 15px;
  text-align: left;
`;

const ProductPrice = styled.p`
  font-size: 1.2em;
  font-weight: bold;
  color: #f60;
  font-size: 15px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FoodType = styled.span<{ isVeg: boolean }>`
  font-size: 0.8em;
  font-weight: normal;
  padding-right: 10px;
  margin-left: 10px;
  color: ${(props) => (props.isVeg ? "green" : "red")};
`;

const AddToCartButton = styled.button`
  background-color: #f60;
  color: white;
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #e55;
  }
`;

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { user } = useAuthContext();

  const addToCart = async () => {
    try {
      const cartData = {
        userId: user.sub,
        tableId: user.tableID,
        items: [{ menuItem: product._id, quantity: 1 }],
        action: "add",
      };

      await cartApi.addToCart(cartData);
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <CardContainer>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductPrice>
        ${product.price}
        {product.veg && <FoodType isVeg={true}>Veg</FoodType>}
        {product.nonVeg && <FoodType isVeg={false}>Non-Veg</FoodType>}
      </ProductPrice>
      <ProductDesc>{product.description}</ProductDesc>
      <AddToCartButton onClick={addToCart}>Add To Cart</AddToCartButton>
    </CardContainer>
  );
};

const MenuList: React.FC = () => {
  const { loading, error, menuItems }: UseAddMenuResponse = useAddMenu();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="row justify-content-left">
        {menuItems.map((product) => (
          <div className="col-md-3" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
