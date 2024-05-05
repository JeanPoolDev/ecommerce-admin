"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ColorColumn = {
  id: string
  nombre: string
  valor: string
  creadoEn: string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre:",
  },
  {
    accessorKey: "valor",
    header: "Marcas:",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.valor}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.valor }}
        >

        </div>
      </div>
    )
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
