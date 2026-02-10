"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Sparkles,
  Code,
  Palette,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function ThemeSwitcherDemo() {
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Header */}
      <Navbar
        logo={<Palette className="h-8 w-8 text-primary" />}
        title="Theme Switcher Demo"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container py-12">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="mr-1 h-3 w-3" />
              50+ Beautiful Themes
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Experience Beautiful Themes
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from over 50 carefully crafted themes with both light and
              dark modes. Each theme features unique color palettes, typography,
              and styling.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Main Content */}
        <main className="container pb-12 space-y-8">
          {/* Alerts Grid */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Alert Components</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert showing the default styling.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  This is a destructive alert for error messages.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Cards and Tabs */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Cards & Tabs</h3>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your application experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for updates
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Volume ({sliderValue}%)</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                      Configure advanced options and features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Progress Example</Label>
                      <Progress value={progress} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Configuration</Label>
                      <Input placeholder="Enter API key" type="password" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* Buttons Showcase */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Button Variants</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                  <Button>
                    <Code className="mr-2 h-4 w-4" />
                    With Icon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges Showcase */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Badge Variants</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Success
                  </Badge>
                  <Badge variant="secondary">
                    <Zap className="mr-1 h-3 w-3" />
                    Premium
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Color Palette Preview */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Color Palette Preview</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Primary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-md bg-primary" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Main brand color
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Secondary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-md bg-secondary" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Supporting color
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-md bg-accent" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Highlight color
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Destructive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-md bg-destructive" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Error & danger
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features Grid */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Features</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Palette className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>50+ Themes</CardTitle>
                  <CardDescription>
                    Choose from a vast collection of professionally designed
                    themes
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Light & Dark Modes</CardTitle>
                  <CardDescription>
                    Every theme supports both light and dark variants
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Instant Switch</CardTitle>
                  <CardDescription>
                    Change themes instantly without page reload
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js, Tailwind CSS, and shadcn/ui
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

