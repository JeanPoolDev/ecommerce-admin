"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductoColumn = {
  id: string
  nombre: string
  precio: string
  marca: string
  categoria: string
  color: string
  dimension: string
  esDestacado: boolean
  esArchivado: boolean
  creadoEn: string
}

export const columns: ColumnDef<ProductoColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre:",
  },
  {
    accessorKey: "esArchivado",
    header: "Archivado:",
  },
  {
    accessorKey: "esDestacado",
    header: "Destacado:",
  },
  {
    accessorKey: "precio",
    header: "Precio:",
  },
  {
    accessorKey: "marca",
    header: "Marca:",
  },
  {
    accessorKey: "color",
    header: "Color:",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        >
        </div>
      </div>
    )
  },
  {
    accessorKey: "dimension",
    header: "Dimensiones:",
  },
  {
    accessorKey: "creadoEn",
    header: "Creado En:",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
