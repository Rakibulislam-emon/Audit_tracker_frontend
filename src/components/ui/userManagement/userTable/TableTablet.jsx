import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns } from "./columns";

export default function TableTablet({ users, token }) {
  const table = useReactTable({
    data: users || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { token },
  });

  return (
    <table className="hidden md:block lg:hidden overflow-x-auto ">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id} className="border px-2 py-2 text-center">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border px-2 py-2 text-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
