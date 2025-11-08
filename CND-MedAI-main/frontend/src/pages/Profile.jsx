import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";   
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";   
import { Camera, Mail, Building, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import LogoSpinner from "../components/LogoSpinner";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    full_name: "",
    doctor_id: "",
    email: "",
    hospital_name: "",
    area: "",
    profile_picture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
          ? process.env.REACT_APP_API_URL.trim()
          : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:5000'
            : '';

        const res = await fetch(`${apiBase}/api/profile`, { credentials: "include" });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load profile");
        }
        const data = await res.json();
        console.log("Profile data received:", data); // Debug log
        setProfile({
          full_name: data.full_name || "",
          doctor_id: data.doctor_id || "",
          email: data.email || "",
          hospital_name: data.hospital_name || "",
          area: data.area || "",
          profile_picture: data.profile_picture || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        toast({ title: "Error", description: err.message || "Failed to load profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        // Update profile picture on backend
        const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
          ? process.env.REACT_APP_API_URL.trim()
          : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:5000'
            : '';

        const res = await fetch(`${apiBase}/api/profile`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_picture: base64String,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to update profile picture");
        }

        const data = await res.json();
        setProfile(prev => ({
          ...prev,
          profile_picture: data.profile_picture || "",
        }));

        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated successfully.",
        });
      };

      reader.onerror = () => {
        throw new Error("Failed to read image file");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to update profile picture", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LogoSpinner label="Loading profile..." />
      </div>
    );
  }

  return (
  <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <Card className="border-border lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {profile.profile_picture ? (
                  <AvatarImage src={profile.profile_picture} alt={profile.full_name} />
                ) : (
                  <AvatarFallback className="text-3xl bg-gradient-primary text-primary-foreground">
                    {(profile.full_name && profile.full_name.charAt(0)) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gradient-primary hover:opacity-90 shadow-medium"
                onClick={handlePhotoClick}
                disabled={uploading}
              >
                <Camera className="h-5 w-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">{profile.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{profile.hospital_name || "No hospital set"}</p>
              {uploading && <p className="text-xs text-teal-500 mt-2">Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Dr. John Smith"
                value={profile.full_name || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_id">Doctor ID</Label>
              <Input
                id="doctor_id"
                name="doctor_id"
                placeholder="DOC12345"
                value={profile.doctor_id || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital_name">Hospital / Institution</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hospital_name"
                  name="hospital_name"
                  placeholder="General Hospital"
                  value={profile.hospital_name || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area / Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="area"
                  name="area"
                  placeholder="New York, NY"
                  value={profile.area || ""}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your MedAI Assist details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="text-lg font-semibold">{profile.hospital_name || "Not specified"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{profile.area || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;