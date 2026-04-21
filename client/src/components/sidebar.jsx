import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, LayoutPanelTop, ChartNoAxesCombined, LogOut, FileText, Settings, Plug,BookOpen,Flower2, Sprout,Lock,SquareActivity} from "lucide-react";
import * as Logo from "../components/logo";

export function Sidebar({ user, setLogoutOpen}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <aside className={`sidebar h-[100vh] bg-white flex flex-col col-start-1 col-end-2 row-start-1 row-span-full p-4 rounded-[10px] shadow-lg ${isMobile ? 'w-[50%]' : 'w-auto'}`}>

      <div className="logo_div flex items-center justify-center h-[10%] w-[95%] mb-6 text-xl font-bold text-green-600">
        {isMobile ? <Logo.Img /> : <Logo.Db_Logo />}
      </div>

      {/* Nav Buttons */}
      <div className="flex flex-col items-center justify-start gap-2 flex-grow h-full w-full">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <LayoutPanelTop strokeWidth={1.5} size={18} />
          {isMobile ? <span className="text-xs">Dashboard</span> : <p className="text-sm mr-2 whitespace-nowrap">Dashboard</p>}
        </NavLink>

        {/* Manage Plants */}
        {user?.role === "admin" &&
          <NavLink
            to="/manage_plants"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }>
            <Sprout strokeWidth={1.5} size={18} />
            {isMobile ? <span className="text-xs">Manage</span> : <p className="text-sm mr-2 whitespace-nowrap">Manage Plants</p>}
          </NavLink>
        }

        {/* Users */}
        {user?.role === "admin" &&
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }
          >
            <User strokeWidth={1.5} size={18} />
            {isMobile ? <span className="text-xs">Users</span> : <p className="text-sm mr-2 whitespace-nowrap">Users</p>}
          </NavLink>
        }

        {/* Analytics */}
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <ChartNoAxesCombined strokeWidth={1.5} size={18} />
          {isMobile ? <span className="text-xs">Reports</span> : <p className="text-sm mr-2 whitespace-nowrap">Reports</p>}
        </NavLink>

        {/* Irrigation Monitoring and Logs */}
        <NavLink
          to="/irrigation_monitoring_logs"
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <SquareActivity strokeWidth={1.5} size={18} />
          {isMobile ? <span className="text-xs text-center leading-tight">Irrigation</span> : <p className="text-sm mr-2 whitespace-nowrap">Irrigation Monitoring and Logs</p>}
        </NavLink>

        {/* Batch History - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/batch_history"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }
          >
            <FileText strokeWidth={1.5} size={18} />
            {isMobile ? <span className="text-xs">History</span> : <p className="text-sm mr-2 whitespace-nowrap">Batch History</p>}
          </NavLink>
        )}

        {/* Plants */}
        <NavLink
          to="/plants"
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <Flower2 strokeWidth={1.5} size={18} />
          {isMobile ? <span className="text-xs">Plants</span> : <p className="text-sm mr-2 whitespace-nowrap">Plants</p>}
        </NavLink>

        {/* Password Requests */}
        {user?.role === "admin" &&
          <NavLink
            to="/password_request"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }>
            <Lock strokeWidth={1.5} size={18} />
            {isMobile ? <span className="text-xs">Passwords</span> : <p className="text-sm mr-2 whitespace-nowrap">Password Requests</p>}
          </NavLink>
        }

        <div className="flex items-center flex-col justify-start py-12 my-12 border-t-1 border-[var(--metal-dark4)] w-full">

          {/* User Guide */}
          <NavLink
            to="/user_guide"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }>
            <BookOpen strokeWidth={1.5} size={18} />
            {isMobile ? <span className="text-xs">Guide</span> : <p className="text-sm mr-2 whitespace-nowrap">User Guide</p>}
          </NavLink>

          {/* Logout Button */}
          <button
            className={`text-sm cursor-pointer flex justify-center items-center ${isMobile ? 'w-full h-14 flex-col gap-0.5' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]`}
            onClick={() => setLogoutOpen(true)}>
            <LogOut strokeWidth={1.5} size={18} />
            {isMobile && <span className="text-xs">Logout</span>}
            {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Logout</p>}
          </button>

        </div>

      </div>
    </aside>
  );
}