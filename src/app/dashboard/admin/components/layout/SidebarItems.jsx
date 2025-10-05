import Link from "next/link";

export default function SidebarItem({ href, label, isActive }) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-200 hover:bg-gray-700"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
