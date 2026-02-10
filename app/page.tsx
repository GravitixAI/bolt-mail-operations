"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, NavLink } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfigModal } from "@/components/config-modal";
import { getSyncLogs, type SyncLogEntry } from "@/app/actions/sync-log-actions";
import { getConfig, type ConfigValues } from "@/app/actions/config-actions";
import {
  Mail,
  Settings,
  FileText,
  Database,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Activity,
  Inbox,
  Send,
} from "lucide-react";

interface DashboardStats {
  totalSyncs: number;
  successfulSyncs: number;
  errorSyncs: number;
  totalFilesProcessed: number;
  totalAdded: number;
  totalUpdated: number;
  totalDeleted: number;
  lastSyncTime: Date | null;
  certifiedSyncs: number;
  regularSyncs: number;
  autoSyncEnabled: boolean;
  autoSyncInterval: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSyncs: 0,
    successfulSyncs: 0,
    errorSyncs: 0,
    totalFilesProcessed: 0,
    totalAdded: 0,
    totalUpdated: 0,
    totalDeleted: 0,
    lastSyncTime: null,
    certifiedSyncs: 0,
    regularSyncs: 0,
    autoSyncEnabled: false,
    autoSyncInterval: 5,
  });
  const [recentLogs, setRecentLogs] = useState<SyncLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [logs, configResult] = await Promise.all([
        getSyncLogs(50),
        getConfig(),
      ]);

      // Calculate stats from logs
      const totalSyncs = logs.length;
      const successfulSyncs = logs.filter((l) => l.status === "success").length;
      const errorSyncs = logs.filter((l) => l.status === "error").length;
      const totalFilesProcessed = logs.reduce((sum, l) => sum + l.filesScanned, 0);
      const totalAdded = logs.reduce((sum, l) => sum + l.filesAdded, 0);
      const totalUpdated = logs.reduce((sum, l) => sum + l.filesUpdated, 0);
      const totalDeleted = logs.reduce((sum, l) => sum + l.filesDeleted, 0);
      const lastSyncTime = logs.length > 0 ? new Date(logs[0].syncedAt) : null;
      const certifiedSyncs = logs.filter((l) => l.queueType === "certified").length;
      const regularSyncs = logs.filter((l) => l.queueType === "regular").length;

      setStats({
        totalSyncs,
        successfulSyncs,
        errorSyncs,
        totalFilesProcessed,
        totalAdded,
        totalUpdated,
        totalDeleted,
        lastSyncTime,
        certifiedSyncs,
        regularSyncs,
        autoSyncEnabled: configResult.config?.autoSyncEnabled ?? false,
        autoSyncInterval: configResult.config?.autoSyncInterval ?? 5,
      });

      setRecentLogs(logs.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  const getTimeSince = (date: Date | null) => {
    if (!date) return "Never";
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        logo={<Mail className="h-8 w-8 text-primary" />}
        title="BOLT Mail Operations"
      >
        <NavLink href="/" active>
          Home
        </NavLink>
        <NavLink href="/pdf-browser">Certified Mail</NavLink>
        <NavLink href="/regular-mail">Regular Mail</NavLink>
        <NavLink href="/sync-log">Sync Log</NavLink>
        <ConfigModal
          trigger={
            <button className="p-2 rounded-md hover:bg-accent transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          }
        />
      </Navbar>

      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Mail operations overview and quick access
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Auto-Sync Status Banner */}
        <Card className={stats.autoSyncEnabled ? "border-green-500/50 bg-green-500/5" : "border-muted"}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${stats.autoSyncEnabled ? "bg-green-500/20" : "bg-muted"}`}>
                  <Activity className={`h-5 w-5 ${stats.autoSyncEnabled ? "text-green-500" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-medium">
                    Auto-Sync: {stats.autoSyncEnabled ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.autoSyncEnabled
                      ? `Running every ${stats.autoSyncInterval} minute(s)`
                      : "Configure in settings to enable automatic synchronization"}
                  </p>
                </div>
              </div>
              <Badge variant={stats.autoSyncEnabled ? "default" : "secondary"}>
                {stats.autoSyncEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Syncs (24h)</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSyncs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.certifiedSyncs} certified, {stats.regularSyncs} regular
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.totalSyncs > 0
                  ? Math.round((stats.successfulSyncs / stats.totalSyncs) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.successfulSyncs} successful, {stats.errorSyncs} errors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFilesProcessed}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.totalAdded} added, ~{stats.totalUpdated} updated, -{stats.totalDeleted} deleted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTimeSince(stats.lastSyncTime)}</div>
              <p className="text-xs text-muted-foreground">
                {formatTime(stats.lastSyncTime)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/pdf-browser">
            <Card className="group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Inbox className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      Certified Mail Queue
                    </CardTitle>
                    <CardDescription>
                      View and manage certified mail PDFs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/regular-mail">
            <Card className="group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Send className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      Regular Mail Queue
                    </CardTitle>
                    <CardDescription>
                      View and manage regular mail PDFs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/sync-log">
            <Card className="group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      Sync Activity Log
                    </CardTitle>
                    <CardDescription>
                      View detailed sync history and metrics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Logs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Sync Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sync Activity</CardTitle>
              <CardDescription>Last 5 sync operations</CardDescription>
            </div>
            <Link href="/sync-log">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sync activity yet</p>
                <p className="text-sm mt-1">
                  Sync operations will appear here when they run
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {log.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : log.status === "error" ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {log.queueType === "certified" ? "Certified" : "Regular"} Mail
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.filesScanned} scanned
                          {log.filesAdded > 0 && `, +${log.filesAdded}`}
                          {log.filesUpdated > 0 && `, ~${log.filesUpdated}`}
                          {log.filesDeleted > 0 && `, -${log.filesDeleted}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getTimeSince(log.syncedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
