import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";

const Home = () => {
  const { data, isLoading } = useProducts();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((p: any) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default Home;