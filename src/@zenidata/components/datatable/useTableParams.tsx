import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface TableParams<T> {
  search: string;
  status: string;
  currentPage: number;
  pageSize: number;
  orderBy: keyof T;
  orderDirection: "asc" | "desc";
}

export const useTableParams = <T extends Record<string, any>>() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🏗️ Initialisation des paramètres depuis l'URL
  const getInitialParams = (): TableParams<T> => {
    return {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
      currentPage: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("limit")) || 20,
      orderBy: (searchParams.get("order_by") as keyof T) || "created_at",
      orderDirection:
        (searchParams.get("order_direction") as "asc" | "desc") || "desc",
    };
  };

  const [params, setParams] = useState<TableParams<T>>(getInitialParams());

  // 🛠️ Fonction pour mettre à jour les paramètres et synchroniser l'URL
  const updateParams = (newParams: Partial<TableParams<T>>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);

    // Mise à jour de l'URL sans rechargement de la page
    const queryString = new URLSearchParams({
      search: updatedParams.search,
      status: updatedParams.status,
      page: String(updatedParams.currentPage),
      limit: String(updatedParams.pageSize),
      order_by: String(updatedParams.orderBy), // 🔥 `orderBy` est `keyof T`
      order_direction: updatedParams.orderDirection,
    });

    navigate(`?${queryString.toString()}`, { replace: true });
  };

  // 🔄 Effet pour synchroniser l'état avec l'URL lorsque l'utilisateur navigue
  useEffect(() => {
    setParams(getInitialParams());
  }, [searchParams]);

  return { params, updateParams };
};
