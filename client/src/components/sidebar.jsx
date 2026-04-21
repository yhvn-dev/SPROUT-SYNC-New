import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, LayoutPanelTop, ChartNoAxesCombined, LogOut, FileText, BookOpen, Flower2, Sprout, Lock, SquareActivity } from "lucide-react";
import * as Logo from "../components/logo";

export function Sidebar({ user, setLogoutOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navClass = ({ isActive }) =>
    `flex ${isMobile ? 'flex-col py-3 px-1 gap-1' : 'flex-row gap-2 py-1 px-2 justify-start'} justify-center items-center transition-all duration-300 rounded-[10px] my-1 w-full
    ${isActive
      ? "text-white bg-[var(--sancgb)] shadow-lg"
      : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
    }`;

  const MobileLabel = ({ children }) => (
    <span className="text-[9px] leading-tight text-center">{children}</span>
  );

  return (
    <aside className={`sidebar h-[100vh] bg-white flex flex-col col-start-1 col-end-2 row-start-1 row-span-full rounded-[10px] shadow-lg ${isMobile ? 'w-[85px] p-2' : 'w-auto p-4'}`}>

      <div className="logo_div flex items-center justify-center h-[10%] w-full mb-6 text-xl font-bold text-green-600">
        {isMobile ? <Logo.Img /> : <Logo.Db_Logo />}
      </div>

      {/* Nav Buttons */}
      <div className={`flex flex-col items-center justify-start flex-grow w-full ${isMobile ? 'overflow-y-auto gap-0' : 'gap-2'}`}>

        {/* Dashboard */}
        <NavLink to="/dashboard" end className={navClass}>
          <LayoutPanelTop strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {isMobile
            ? <MobileLabel>Dashboard</MobileLabel>
            : <p className="text-sm mr-2 whitespace-nowrap">Dashboard</p>
          }
        </NavLink>

        {/* Manage Plants - Admin only */}
        {user?.role === "admin" &&
          <NavLink to="/manage_plants" className={navClass}>
            <Sprout strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>Manage Plants</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">Manage Plants</p>
            }
          </NavLink>
        }

        {/* Users - Admin only */}
        {user?.role === "admin" &&
          <NavLink to="/users" className={navClass}>
            <User strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>Users</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">Users</p>
            }
          </NavLink>
        }

        {/* Reports */}
        <NavLink to="/reports" className={navClass}>
          <ChartNoAxesCombined strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {isMobile
            ? <MobileLabel>Reports</MobileLabel>
            : <p className="text-sm mr-2 whitespace-nowrap">Reports</p>
          }
        </NavLink>

        {/* Irrigation Monitoring and Logs */}
        <NavLink to="/irrigation_monitoring_logs" className={navClass}>
          <SquareActivity strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {isMobile
            ? <MobileLabel>Irrigation</MobileLabel>
            : <p className="text-sm mr-2 whitespace-nowrap">Irrigation Monitoring and Logs</p>
          }
        </NavLink>

        {/* Batch History - Admin only */}
        {user?.role === "admin" &&
          <NavLink to="/batch_history" className={navClass}>
            <FileText strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>Batch History</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">Batch History</p>
            }
          </NavLink>
        }

        {/* Plants */}
        <NavLink to="/plants" className={navClass}>
          <Flower2 strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {isMobile
            ? <MobileLabel>Plants</MobileLabel>
            : <p className="text-sm mr-2 whitespace-nowrap">Plants</p>
          }
        </NavLink>

        {/* Password Requests - Admin only */}
        {user?.role === "admin" &&
          <NavLink to="/password_request" className={navClass}>
            <Lock strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>Password Req.</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">Password Requests</p>
            }
          </NavLink>
        }

        {/* Bottom section */}
        <div className={`flex items-center flex-col justify-start mt-auto border-t border-[var(--metal-dark4)] w-full ${isMobile ? 'py-3' : 'py-6'}`}>

          {/* User Guide */}
          <NavLink to="/user_guide" className={navClass}>
            <BookOpen strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>User Guide</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">User Guide</p>
            }
          </NavLink>

          {/* Logout Button */}
          <button
            className={`text-sm cursor-pointer flex ${isMobile ? 'flex-col py-3 px-1 gap-1' : 'flex-row gap-2 py-1 px-2 justify-start'} justify-center items-center transition-all duration-300 rounded-[10px] my-1 w-full hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]`}
            onClick={() => setLogoutOpen(true)}>
            <LogOut strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {isMobile
              ? <MobileLabel>Logout</MobileLabel>
              : <p className="text-sm mr-2 whitespace-nowrap">Logout</p>
            }
          </button>

        </div>

      </div>
    </aside>
  );
}