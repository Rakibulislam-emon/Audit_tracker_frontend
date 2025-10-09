import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "./columns";

export default function TableMobile({ users, token }) {
  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { token },
  });

  return (
    <div className="space-y-3 md:hidden">
      {table.getRowModel().rows.map((row) => (
        <div key={row.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold">{row.getValue("name")}</h4>
              <p className="text-sm text-gray-600">{row.getValue("email")}</p>
            </div>
            {flexRender(
              row.getVisibleCells().find((c) => c.column.id === "role")?.column.columnDef.cell,
              row.getVisibleCells().find((c) => c.column.id === "role")?.getContext()
            )}
          </div>
          <div className="flex  justify-between mt-2 text-sm text-gray-500">
            <span>Status:</span>
            {flexRender(
              row.getVisibleCells().find((c) => c.column.id === "isActive")?.column.columnDef.cell,
              row.getVisibleCells().find((c) => c.column.id === "isActive")?.getContext()
            )}
          </div>
          <div className="flex justify-between mt-2 border-t pt-2 text-xs">
            <span>ID: {row.original._id.slice(-6)}</span>
            {flexRender(
              row.getVisibleCells().find((c) => c.column.id === "actions")?.column.columnDef.cell,
              row.getVisibleCells().find((c) => c.column.id === "actions")?.getContext()
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
