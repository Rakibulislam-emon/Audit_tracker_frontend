import UserActions from "./UserActions";
import UserStatusBadge from "./UserStatusBadge";

export const columns = [
  { accessorKey: "name", header: "Name", cell: (info) => info.getValue() || "N/A" },
  { accessorKey: "email", header: "Email", cell: (info) => info.getValue() || "N/A" },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => <UserStatusBadge role={info.getValue()} />,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info) => <UserStatusBadge active={info.getValue()} />,
  },
  { accessorKey: "lastLogin", header: "Last Login", cell: (info) => new Date(info.getValue()).toLocaleDateString() },
  {
    id: "actions",
    header: "Actions",
    cell: (info) => <UserActions user={info.row.original} token={info.table.options.meta.token} />,
  },
];
