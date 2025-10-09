import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns } from "./columns";

export default function TableDesktop({ users, token }) {
  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { token },
  });

  return (
   <div  className=" border-gray-300 text-sm lg:block hidden">
      <table className="w-full">
        <thead className="bg-gray-100 ">
          {table.getHeaderGroups().map((hg) => (
            <tr  key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border px-3 text-center py-2 ">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 ">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-3 py-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
   </div>
  );
}
