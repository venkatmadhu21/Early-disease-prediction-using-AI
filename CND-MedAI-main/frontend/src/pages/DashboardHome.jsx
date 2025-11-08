import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Upload, FileText, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import dashboardPreview from "../assets/dashboard-preview.jpg";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayCount: 0,
    totalCount: 0,
    cancerCount: 0,
    neuroCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Resolve API base URL
  const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
    ? process.env.REACT_APP_API_URL.trim()
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : '';

  // Fetch counts for dashboard stats
  const fetchCategoryCounts = async () => {
    try {
      const response = await fetch(`${apiBase}/api/analysis/category-counts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          todayCount: data.todayCount || 0,
          totalCount: data.totalCount || 0,
          cancerCount: data.cancerCount || 0,
          neuroCount: data.neuroCount || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch category counts:', error);
    }
  };

  useEffect(() => {
  fetchCategoryCounts();
  fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${apiBase}/api/analysis/history?limit=3`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const formattedActivity = data.analyses.map(analysis => {
          // Calculate time ago
          const uploadDate = new Date(analysis.createdAt);
          const now = new Date();
          const diffMs = now - uploadDate;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let timeAgo;
          if (diffMins < 60) {
            timeAgo = diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
          } else if (diffHours < 24) {
            timeAgo = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
          } else {
            timeAgo = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
          }

          return {
            type: analysis.imageType || 'Medical Image',
            patient: analysis.patientInfo?.name || 'Unknown Patient',
            result: analysis.results?.diagnosis || analysis.status,
            date: timeAgo
          };
        });
        
        setRecentActivity(formattedActivity);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };

  const statsData = [
  { label: "Today Uploads (24hrs)", value: stats.todayCount.toString(), icon: Activity, color: "text-primary" },
  { label: "Total No of Uploads", value: stats.totalCount.toString(), icon: Upload, color: "text-secondary" },
  { label: "Total Cancer", value: stats.cancerCount.toString(), icon: FileText, color: "text-destructive" },
  { label: "Total Neuro", value: stats.neuroCount.toString(), icon: TrendingUp, color: "text-success" },
  ];

  const getFirstName = () => {
    const name = user?.fullName || user?.full_name || user?.name || "";
    let first = "";
    if (name) {
      first = name.trim().split(" ")[0];
    } else if (user?.email) {
      first = user.email.split("@")[0];
    }
    return first ? first.charAt(0).toUpperCase() + first.slice(1) : "";
  };
  const firstName = getFirstName();

  return (
    <div className="space-y-4">
      {/* Welcome Section and Back Button in same row */}
      <div className="flex items-center justify-between mt-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            {`Welcome to your dashboard${firstName ? `, ${firstName}` : ""}!`}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your diagnostic analyses today.
          </p>
        </div>
        <Button onClick={() => navigate("/")}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold px-4 py-2 rounded-medical shadow-medical hover:shadow-glow transition-all duration-200 hover:scale-105 ml-4">
          Back to Home Page
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-border hover:shadow-medium transition-shadow">
            <CardContent className="p-6 relative h-32 flex items-center justify-center text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={cn("h-12 w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center absolute top-4 right-4", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start analyzing medical images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/dashboard/upload">
              <Button className="w-full justify-start bg-gradient-primary hover:opacity-90" size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Upload New Scan
              </Button>
            </Link>
            <Link to="/dashboard/history">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                View All Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest diagnostic analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No recent activity yet.</p>
                <p className="text-xs mt-1">Upload your first scan to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.patient}</p>
                      <p className={cn(
                        "text-xs font-medium",
                        activity.result.toLowerCase().includes("normal") ? "text-success" : 
                        activity.result === "processing" ? "text-accent" : "text-destructive"
                      )}>
                        {activity.result}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-border overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 space-y-4">
            <CardHeader className="p-0">
              <CardTitle>AI-Powered Diagnostics</CardTitle>
              <CardDescription>
                Advanced machine learning for accurate disease detection
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">Multi-modal image analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">Real-time processing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">98.5% accuracy rate</span>
              </div>
            </CardContent>
          </div>
          <div className="relative h-64 md:h-auto">
            <img
              src={dashboardPreview}
              alt="AI Dashboard Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;