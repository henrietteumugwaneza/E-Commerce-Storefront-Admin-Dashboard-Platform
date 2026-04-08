import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import type { Product } from "../types";

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/public/products");
      return res.data?.data?.all ?? [];
    },
  });
