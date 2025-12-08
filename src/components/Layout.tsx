import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Boxes, LayoutDashboard, LogOut, CalendarDays } from "lucide-react";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-50 p-4 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Boxes className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-bold tracking-tight">RoomBooking</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/rooms"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Rooms
          </Link>

          {user?.role === "User" && (
            <Link
              to="/my-bookings"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              My Bookings
            </Link>
          )}

          {(user?.role === "Admin" || user?.role === "Manager") && (
            <>
              <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Management
              </div>

              {user.role === "Admin" && (
                <>
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                  >
                    <Boxes className="h-4 w-4" />
                    Users
                  </Link>
                  <Link
                    to="/admin/rooms"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Manage Rooms
                  </Link>
                </>
              )}

              <Link
                to="/admin/bookings"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                All Bookings
              </Link>
            </>
          )}
        </nav>

        <div className="pt-4 mt-auto border-t border-slate-800">
          <div className="px-4 py-2 mb-2 text-xs text-slate-400">
            Logged in as:{" "}
            <span className="text-slate-200 font-medium block">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background overflow-auto">
        <div className="h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
