"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Mail,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: Home,
    children: [
      { name: "Hero Section", href: "/admin/hero" },
      { name: "Assets", href: "/admin/assets" },
      { name: "Services", href: "/admin/services" },
      { name: "Projects", href: "/admin/projects" },
      { name: "About Us", href: "/admin/about-us" },
      { name: "Footer", href: "/admin/footer" },
    ],
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    children: [
      { name: "All Blogs", href: "/admin/blogs" },
      { name: "Create New", href: "/admin/blogs/create" },
    ],
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: Mail,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900">Devure Admin</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive(item.href) || isExpanded(item.name)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isExpanded(item.name) ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isExpanded(item.name) && !collapsed && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block p-2 rounded-lg transition-colors ${
                            isActive(child.href)
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {!collapsed && (
            <div className="text-sm text-gray-500">Admin Panel v1.0</div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("adminAuthenticated");
              localStorage.removeItem("adminUsername");
              window.location.href = "/admin/login";
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
