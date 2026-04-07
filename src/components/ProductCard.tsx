const ProductCard = ({ product }: any) => {
  return (
    <div className="border p-4 rounded shadow">
      <img src={product.image} className="h-40 w-full object-cover" />
      <h2>{product.title}</h2>
      <p>${product.price}</p>
    </div>
  );
};

export default ProductCard;