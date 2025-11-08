import { Home, Upload, History, User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { useToast } from "../hooks/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();
  // Resolve API base URL
  const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
    ? process.env.REACT_APP_API_URL.trim()
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${apiBase}/api/auth/me`, { credentials: "include", headers });
        if (res.status === 401) {
          // Not authenticated; rely on ProtectedRoute to guard access.
          setProfile(null);
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load profile");
        }
        const data = await res.json().catch(() => null);
        if (!data || !data.user) {
          setProfile(null);
          return;
        }
        setProfile(data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast({ title: "Error", description: err.message || "Failed to load profile", variant: "destructive" });
      }
    };
    fetchProfile();
  }, [navigate, toast]);

  const handleLogout = async () => {
    // Delegate to AuthContext to ensure global auth state is cleared consistently
    await logout();
  };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home", end: true },
    { to: "/dashboard/upload", icon: Upload, label: "Upload Image" },
    { to: "/dashboard/history", icon: History, label: "Upload History" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo and Title Section */}
      <div className="pt-8 pb-6 border-b border-sidebar-border flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/Logo.png"
            alt="MedAI Assist logo"
            className="w-14 h-14 rounded-full shadow-lg border-2 border-primary bg-white object-contain"
          />
          <h1 className="font-extrabold text-xl text-sidebar-foreground mt-2 tracking-tight">MedAI Assist</h1>
          <p className="text-xs text-muted-foreground text-center max-w-[180px] leading-snug mt-1">
            AI Diagnostic Platform<br />for Cancer & Neurological Disorders
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "bg-gradient-primary text-primary-foreground font-medium shadow-soft"
                  : "text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          <Avatar className="h-10 w-10">
            {profile && profile.profilePicture ? (
              <AvatarImage src={profile.profilePicture} alt={profile.fullName || profile.full_name || 'Profile'} />
            ) : (
              <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                {(profile?.fullName || profile?.full_name || profile?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-sidebar-foreground truncate">
              {profile?.fullName || profile?.full_name || "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email || ""}</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-xl transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to logout? You will need to sign in again to access the dashboard.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Yes, Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
