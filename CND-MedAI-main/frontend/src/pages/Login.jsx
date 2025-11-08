import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Mail, Lock, Building, MapPin, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import LogoSpinner from "../components/LogoSpinner";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    doctorId: "",
    email: "",
    password: "",
    confirmPassword: "",
    hospitalName: "",
    area: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, register, isAuthenticated, loading } = useAuth();

  // Get ?mode=login or ?mode=register
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const defaultTab = mode === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginChange = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!loginData.email || !loginData.password) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please enter both email and password', 
        variant: 'destructive' 
      });
      return;
    }

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      setLoginData({ email: '', password: '' });
      navigate('/dashboard');
    } else {
      // map status to friendly message
      const message = result?.error || (result?.status === 401 ? 'Invalid email or password' : 'Unable to sign in');
      setAuthError(message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!registerData.fullName || !registerData.doctorId || !registerData.email || !registerData.password || 
        !registerData.hospitalName || !registerData.area) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please fill in all required fields', 
        variant: 'destructive' 
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({ 
        title: 'Password Mismatch', 
        description: 'Passwords do not match', 
        variant: 'destructive' 
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({ 
        title: 'Password Too Short', 
        description: 'Password must be at least 6 characters long', 
        variant: 'destructive' 
      });
      return;
    }

    const result = await register({
      fullName: registerData.fullName,
      doctorId: registerData.doctorId,
      email: registerData.email,
      password: registerData.password,
      hospitalName: registerData.hospitalName,
      area: registerData.area,
    });

    if (result.success) {
      // Move user to login tab and prefill email, leave password empty for manual entry
      setRegisterData({
        fullName: '',
        doctorId: '',
        email: '',
        password: '',
        confirmPassword: '',
        hospitalName: '',
        area: '',
      });
      setLoginData(prev => ({ ...prev, email: registerData.email, password: '' }));
      setActiveTab('login');
      toast({
        title: 'Registration Complete',
        description: 'Registration successful — your email has been pre-filled on the Login tab. Please enter your password to sign in.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 py-12 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Back to Home Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl overflow-hidden shadow-lg">
              <img
                src="/Logo.png"
                alt="MedAI Assist logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-display">
              MedAI Assist
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Advanced AI-powered medical diagnostics platform for Cancer and Neurological disorders.
          </p>
        </div>

        {/* Login/Register Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {authError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {authError}
              </div>
            )}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2 text-sm font-medium font-body">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        className={`h-12 focus:ring-2 ${authError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2 text-sm font-medium font-body">
                        <Lock className="h-4 w-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          className={`h-12 pr-10 focus:ring-2 ${authError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {authError && (
                        <p className="text-xs text-red-600">{authError}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-body"
                    disabled={loading}
                  >
                    {loading ? (
                      <LogoSpinner
                        inline
                        size={20}
                        ringWidth={3}
                        label="Signing in..."
                        className="mx-auto"
                        labelClassName="text-white font-semibold"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" className="text-blue-600 hover:underline" onClick={() => toast({ title: 'Coming soon', description: 'Password reset isn\'t set up yet.' })}>
                      Forgot password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="flex items-center gap-2 text-sm font-medium font-body">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="register-name"
                        name="fullName"
                        type="text"
                        placeholder="Dr. John Smith"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-doctor-id" className="flex items-center gap-2 text-sm font-medium font-body">
                        <User className="h-4 w-4" />
                        Doctor ID
                      </Label>
                      <Input
                        id="register-doctor-id"
                        name="doctorId"
                        type="text"
                        placeholder="DOC12345"
                        value={registerData.doctorId}
                        onChange={handleRegisterChange}
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="flex items-center gap-2 text-sm font-medium font-body">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="flex items-center gap-2 text-sm font-medium font-body">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min 6 characters"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm" className="flex items-center gap-2 text-sm font-medium font-body">
                          <Lock className="h-4 w-4" />
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="register-confirm"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-hospital" className="flex items-center gap-2 text-sm font-medium font-body">
                        <Building className="h-4 w-4" />
                        Hospital Name
                      </Label>
                      <Input
                        id="register-hospital"
                        name="hospitalName"
                        type="text"
                        placeholder="General Hospital"
                        value={registerData.hospitalName}
                        onChange={handleRegisterChange}
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-area" className="flex items-center gap-2 text-sm font-medium font-body">
                        <MapPin className="h-4 w-4" />
                        Area/Location
                      </Label>
                      <Input
                        id="register-area"
                        name="area"
                        type="text"
                        placeholder="New York, NY"
                        value={registerData.area}
                        onChange={handleRegisterChange}
                        required
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-body"
                    disabled={loading}
                  >
                    {loading ? (
                      <LogoSpinner
                        inline
                        size={20}
                        ringWidth={3}
                        label="Creating Account..."
                        className="mx-auto"
                        labelClassName="text-white font-semibold"
                      />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                By using MedAI Assist, you agree to our{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => toast({ title: 'Coming soon', description: 'Terms of service page will be available soon.' })}
                >
                  terms of service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => toast({ title: 'Coming soon', description: 'Privacy policy page will be available soon.' })}
                >
                  privacy policy
                </button>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
