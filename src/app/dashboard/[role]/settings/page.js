"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Moon,
  Sun,
  Monitor,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { user, getUserInitials, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <SettingsIcon className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                <div className="grid gap-6 flex-1 w-full">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue={user.name}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      defaultValue={user.email}
                      placeholder="Your email"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue={user.role}
                      disabled
                      className="bg-muted capitalize"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="space-y-4">
                <Label className="text-base">Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`cursor-pointer rounded-xl border-2 p-4 hover:bg-accent hover:text-accent-foreground transition-all ${
                      theme === "light"
                        ? "border-primary bg-accent"
                        : "border-muted"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="space-y-2">
                      <div className="p-2 bg-background rounded-full w-fit border shadow-sm">
                        <Sun className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">Light</h3>
                        <p className="text-sm text-muted-foreground">
                          Clean and bright interface
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-xl border-2 p-4 hover:bg-accent hover:text-accent-foreground transition-all ${
                      theme === "dark"
                        ? "border-primary bg-accent"
                        : "border-muted"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="space-y-2">
                      <div className="p-2 bg-background rounded-full w-fit border shadow-sm">
                        <Moon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">Dark</h3>
                        <p className="text-sm text-muted-foreground">
                          Easy on the eyes
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-xl border-2 p-4 hover:bg-accent hover:text-accent-foreground transition-all ${
                      theme === "system"
                        ? "border-primary bg-accent"
                        : "border-muted"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="space-y-2">
                      <div className="p-2 bg-background rounded-full w-fit border shadow-sm">
                        <Monitor className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">System</h3>
                        <p className="text-sm text-muted-foreground">
                          Match device settings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-destructive">Log out</h3>
                  <p className="text-sm text-muted-foreground">
                    Log out of your account on this device.
                  </p>
                </div>
                <Button variant="destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Email Notifications
                </h3>
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="audit-updates"
                    className="flex flex-col space-y-1"
                  >
                    <span>Audit Updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails when audits are assigned or updated.
                    </span>
                  </Label>
                  <Checkbox id="audit-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="approvals"
                    className="flex flex-col space-y-1"
                  >
                    <span>Approvals</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails when reports need approval.
                    </span>
                  </Label>
                  <Checkbox id="approvals" defaultChecked />
                </div>
                <Separator />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Push Notifications
                </h3>
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="push-mentions"
                    className="flex flex-col space-y-1"
                  >
                    <span>Mentions</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Notify when you are mentioned in comments.
                    </span>
                  </Label>
                  <Checkbox id="push-mentions" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
