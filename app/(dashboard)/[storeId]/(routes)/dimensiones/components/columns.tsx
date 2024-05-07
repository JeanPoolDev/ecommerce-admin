"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type DimensionColumn = {
  id: string
  nombre: string
  valor: string
  creadoEn: string
}

export const columns: ColumnDef<DimensionColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre:",
  },
  {
    accessorKey: "valor",
    header: "Dimensión:",
  },
  {
    accessorKey: "creadoEn",
    header: "Creando en:",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
