"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UniversalActions({ 
  item, 
  onEdit,
  onDelete 
}) {
  return (
    <>
      {/* DESKTOP: Simple Buttons */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item)}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* MOBILE: Simple Dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(item)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}