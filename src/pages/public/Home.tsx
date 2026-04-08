import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axios";
import ProductCard from "../../components/ProductCard";
import { Loader } from "../../components/ui/Loader";
import type { Product, Category } from "../../types";

const Home = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/public/products");
      return res.data?.data?.all ?? [];
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data?.data ?? res.data ?? [];
    },
  });

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryId ? p.categoryId === categoryId : true;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-10 mb-10 text-white">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4 border border-white/30">
            🛍️ New arrivals every week
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
            Shop Everything<br />You Love
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed">
            Discover thousands of products across all categories at unbeatable prices.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -right-4 -bottom-20 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-w-[180px]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading && <Loader text="Loading products..." />}
      {isError && (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-500 font-medium">Failed to load products. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-slate-500">
              <span className="text-slate-900 font-bold">{filtered.length}</span> products found
            </p>
            {categoryId && (
              <button onClick={() => setCategoryId("")} className="text-xs text-indigo-600 hover:underline font-medium">
                Clear filter ✕
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-slate-500 font-medium">No products match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
