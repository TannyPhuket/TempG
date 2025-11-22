import { NavLink } from "react-router-dom";
import { Home, Package, Truck, Users } from "lucide-react";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Devices", path: "/devices", icon: Package },
    { name: "Drivers", path: "/drivers", icon: Truck },
    { name: "Users", path: "/users", icon: Users },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">CoolGuard</h1>

      <nav className="flex flex-col gap-2 mt-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
