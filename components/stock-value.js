import { getStockBySlug } from "../actions/get-stock-by-slug";
import { use } from "react";

export const StockValue = ({ slug }) => {
  const stock = use(getStockBySlug(slug));
  return <h1 id="stock">Stock: {stock}</h1>;
};
