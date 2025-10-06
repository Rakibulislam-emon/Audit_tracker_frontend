" use client"
import { navItems } from '@/app/dashboard/constants/navItems';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RoleBasedSidebar({ role }) {
  const pathname = usePathname();
  const menuItems = navItems[role] || [];

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0">
      <nav className="py-4">
        {menuItems.map(item => (
          <Link key={item.id} href={item.href} className={pathname === item.href ? 'bg-blue-100' : ''}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
