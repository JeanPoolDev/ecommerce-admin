'use client';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
 } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

interface CellActionProps {
  data: BillboardColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir Menú</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Acción
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Copy  className="mr-2 h-4 w-4"/>
          Copiar Id
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit  className="mr-2 h-4 w-4"/>
          Actualizar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash  className="mr-2 h-4 w-4"/>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}