import { ReactNode } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
};

export type GenericTableProps<T extends Record<string, ReactNode>> = {
  columns: Column<T>[];
  data: T[];
};
