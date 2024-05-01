"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type MarcaColumn = {
  id: string
  nombre: string
  valor: string
  creadoEn: string
}

export const columns: ColumnDef<MarcaColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre:",
  },
  {
    accessorKey: "valor",
    header: "Marcas:",
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
