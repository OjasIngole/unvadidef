import { useState, useEffect } from "react";
import { useLocation, useSearch, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InsertUser, loginSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Registration form schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  name: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const defaultTab = searchParams.get("register") ? "register" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Set up login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Set up register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  // Handle login submission
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  // Handle register submission
  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    const { confirmPassword, terms, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-xl">
        {/* Hero Section */}
        <div className="bg-primary-600 text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-white text-primary-600 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold">UNova</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Your AI-powered Model UN Assistant</h2>
          <p className="text-primary-100 mb-6">
            UNova helps you excel in Model United Nations with AI-powered research, speechwriting, and debate strategy tools.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary-500 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Chat Assistant</h3>
                <p className="text-primary-100 text-sm">Get instant help with research, speeches, and debate strategies</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-500 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Comprehensive Research Tools</h3>
                <p className="text-primary-100 text-sm">Access up-to-date country policies and geopolitical analysis</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-500 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Resolution Drafting</h3>
                <p className="text-primary-100 text-sm">Create professional UN-style resolutions with ease</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Auth Forms */}
        <Card className="md:w-1/2 border-0 rounded-none">
          <CardContent className="p-8 md:p-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {activeTab === "login" ? "Welcome Back" : "Create an Account"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {activeTab === "login" ? "Sign in to your UNova account" : "Join the UNova community"}
                </p>
              </div>
              
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register("email")}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Name (Optional)
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        {...registerForm.register("name")}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        {...registerForm.register("username")}
                        className="mt-1"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500 mt-1">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email" className="text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      {...registerForm.register("email")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password" className="text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      {...registerForm.register("password")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      {...registerForm.register("confirmPassword")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={registerForm.watch("terms")}
                      onCheckedChange={(checked) => {
                        registerForm.setValue("terms", checked === true);
                      }}
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm text-gray-700 dark:text-gray-300"
                      onClick={() => registerForm.setValue("terms", !registerForm.watch("terms"))}
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {registerForm.formState.errors.terms && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.terms.message}
                    </p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
