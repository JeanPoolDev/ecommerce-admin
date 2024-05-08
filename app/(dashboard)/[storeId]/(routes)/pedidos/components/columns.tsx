"use client"

import { ColumnDef } from "@tanstack/react-table"

export type PedidoColumn = {
  id: string;
  telefono: string;
  direccion: string;
  pagado: boolean;
  precioTotal: string;
  productos: string;
  creadoEn: string;
}

export const columns: ColumnDef<PedidoColumn>[] = [
  {
    accessorKey: "productos",
    header: "Productos:",
  },
  {
    accessorKey: "telefono",
    header: "Telefono:",
  },
  {
    accessorKey: "direccion",
    header: "Dirección:",
  },
  {
    accessorKey: "precioTotal",
    header: "Precio Total:",
  },
  {
    accessorKey: "pagado",
    header: "Pagado:",
  },
  {
    accessorKey: "creadoEn",
    header: "Creado En:",
  },
]
