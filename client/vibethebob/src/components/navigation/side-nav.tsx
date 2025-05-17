import { User } from "@/types/user";
import { NavItem } from "./nav-item";
import { siteConfig } from "@/config/site";

interface SideNavProps {
  user: User;
}

export function SideNav({ user }: SideNavProps) {
  return (
    <aside className="hidden w-64 border-r bg-gray-50/50 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold">{siteConfig.name}</span>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-2">
          {siteConfig.navigation.map((item) => {
            // Check if the user has the required role for this item
            if (item.role && item.role !== user.role) {
              return null;
            }
            
            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                items={item.items}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 