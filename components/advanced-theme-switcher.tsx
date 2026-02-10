"use client";

import * as React from "react";
import { Check, Palette, Moon, Sun, Shuffle } from "lucide-react";
import { useThemeConfig } from "@/hooks/use-theme-config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function AdvancedThemeSwitcher() {
  const { themes, customTheme, setCustomTheme, isDark, toggleMode } =
    useThemeConfig();
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter themes based on search
  const filteredThemes = React.useMemo(() => {
    if (!search) return themes;
    const query = search.toLowerCase();
    return themes.filter((theme) =>
      theme.name.toLowerCase().includes(query)
    );
  }, [search, themes]);

  // Group themes by category
  const themeCategories = React.useMemo(() => {
    const categories: Record<string, typeof themes> = {
      Honorary: [],
      Tech: [],
      Nature: [],
      Modern: [],
      Fun: [],
      "More...": [],
    };

    const militaryKeywords = ["us", "usaf", "usa", "uscg", "usmc", "usn", "ussf"];
    const techKeywords = [
      "claude",
      "vercel",
      "twitter",
      "supabase",
      "cyberpunk",
      "graphite",
      "t3",
    ];
    const natureKeywords = [
      "ocean",
      "nature",
      "northern",
      "kodama",
      "coastal",
      "solar",
      "starry",
      "sunset",
    ];
    const modernKeywords = [
      "modern",
      "minimal",
      "clean",
      "brutalism",
      "mono",
      "elegant",
    ];
    const funKeywords = [
      "bubblegum",
      "candyland",
      "retro",
      "arcade",
      "youthful",
      "lively",
    ];

    filteredThemes.forEach((theme) => {
      const value = theme.value.toLowerCase();
      const name = theme.name.toLowerCase();

      if (militaryKeywords.some((k) => value.includes(k) || name.includes(k))) {
        categories.Honorary.push(theme);
      } else if (techKeywords.some((k) => value.includes(k) || name.includes(k))) {
        categories.Tech.push(theme);
      } else if (
        natureKeywords.some((k) => value.includes(k) || name.includes(k))
      ) {
        categories.Nature.push(theme);
      } else if (
        modernKeywords.some((k) => value.includes(k) || name.includes(k))
      ) {
        categories.Modern.push(theme);
      } else if (funKeywords.some((k) => value.includes(k) || name.includes(k))) {
        categories.Fun.push(theme);
      } else {
        categories["More..."].push(theme);
      }
    });

    return categories;
  }, [filteredThemes]);

  const handleThemeSelect = (value: string) => {
    setCustomTheme(value);
    setOpen(false);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCustomTheme(themes[randomIndex].value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          {mounted && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background border flex items-center justify-center">
              {isDark ? (
                <Moon className="h-2 w-2" />
              ) : (
                <Sun className="h-2 w-2" />
              )}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[1600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Choose Your Theme And Light Mode</DialogTitle>
          <DialogDescription>
            Select from {themes.length} beautiful themes. Current:{" "}
            <Badge variant="secondary">
              {themes.find((t) => t.value === customTheme)?.name}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Themes</Label>
            <Input
              id="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Mode Toggle and Random Theme Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleMode}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRandomTheme}
              title="Random theme"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>

          {/* Theme Grid with Categories */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="honorary">Honorary</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="nature">Nature</TabsTrigger>
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="fun">Fun</TabsTrigger>
              <TabsTrigger value="more...">More...</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredThemes.map((theme) => (
                    <ThemeCard
                      key={theme.value}
                      theme={theme}
                      isSelected={customTheme === theme.value}
                      onSelect={handleThemeSelect}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {Object.entries(themeCategories).map(([category, categoryThemes]) => (
              <TabsContent
                key={category}
                value={category.toLowerCase()}
              >
                <ScrollArea className="h-[400px] pr-4">
                  {categoryThemes.length > 0 ? (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {categoryThemes.map((theme) => (
                        <ThemeCard
                          key={theme.value}
                          theme={theme}
                          isSelected={customTheme === theme.value}
                          onSelect={handleThemeSelect}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      No themes in this category
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ThemeCardProps {
  theme: { 
    name: string; 
    value: string; 
    cssFile: string;
    colors: {
      primary: string;
      accent: string;
      secondary: string;
      muted: string;
    };
  };
  isSelected: boolean;
  onSelect: (value: string) => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={() => onSelect(theme.value)}
      className={cn(
        "relative flex flex-col gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50 hover:shadow-md",
        isSelected
          ? "border-primary shadow-sm"
          : "border-border"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      )}
      
      {/* 2x2 color swatch grid */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <div 
          className="aspect-square rounded-[var(--radius)] border border-border/50"
          style={{ background: theme.colors.primary }}
        />
        <div 
          className="aspect-square rounded-[var(--radius)] border border-border/50"
          style={{ background: theme.colors.accent }}
        />
        <div 
          className="aspect-square rounded-[var(--radius)] border border-border/50"
          style={{ background: theme.colors.secondary }}
        />
        <div 
          className="aspect-square rounded-[var(--radius)] border border-border/50"
          style={{ background: theme.colors.muted }}
        />
      </div>
      
      <div className="text-left w-full overflow-hidden">
        <p className="text-sm font-medium truncate w-full" title={theme.name}>{theme.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate w-full" title={theme.value}>
          {theme.value}
        </p>
      </div>
    </button>
  );
}

