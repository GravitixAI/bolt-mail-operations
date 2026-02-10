"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavLink } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Mail,
  Settings,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
} from "lucide-react";
import { ConfigModal } from "@/components/config-modal";
import { getSyncLogs, type SyncLogEntry } from "@/app/actions/sync-log-actions";
import { getConfig, type ConfigValues } from "@/app/actions/config-actions";

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString();
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return formatDate(date);
}

function StatusBadge({ status }: { status: string }) {
  if (status === "success") {
    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Success
      </Badge>
    );
  }
  if (status === "partial") {
    return (
      <Badge variant="secondary" className="bg-yellow-600 text-white">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Partial
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" />
      Error
    </Badge>
  );
}

function QueueBadge({ queueType }: { queueType: string }) {
  return (
    <Badge variant="outline">
      {queueType === "certified" ? "Certified" : "Regular"}
    </Badge>
  );
}

export default function SyncLogPage() {
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadLogs = async () => {
    try {
      const data = await getSyncLogs(100);
      setLogs(data);
    } catch (error) {
      console.error("Failed to load sync logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadLogs();
  };

  const handleConfigSaved = (config: ConfigValues) => {
    // Reload logs after config changes
    loadLogs();
  };

  // Stats
  const totalSyncs = logs.length;
  const successCount = logs.filter((l) => l.status === "success").length;
  const errorCount = logs.filter((l) => l.status === "error").length;
  const lastSync = logs.length > 0 ? logs[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        logo={<Mail className="h-8 w-8 text-primary" />}
        title="BOLT Mail Operations"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/pdf-browser">Certified Mail</NavLink>
        <NavLink href="/regular-mail">Regular Mail</NavLink>
        <NavLink href="/sync-log" active>
          Sync Log
        </NavLink>
        <ConfigModal
          trigger={
            <button className="p-2 rounded-md hover:bg-accent transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          }
          onConfigSaved={handleConfigSaved}
        />
      </Navbar>

      <div className="container py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Syncs (24h)</CardDescription>
              <CardTitle className="text-3xl">{totalSyncs}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Successful</CardDescription>
              <CardTitle className="text-3xl text-green-600">{successCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Errors</CardDescription>
              <CardTitle className="text-3xl text-red-600">{errorCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last Sync</CardDescription>
              <CardTitle className="text-xl">
                {lastSync ? formatRelativeTime(lastSync.syncedAt) : "Never"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Log Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Sync Activity Log
                </CardTitle>
                <CardDescription>
                  Showing sync operations from the last 24 hours (auto-cleans older entries)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Auto
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Paused
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sync activity recorded yet</p>
                <p className="text-sm mt-2">
                  Sync operations will appear here when you use "Sync to Database"
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Queue</TableHead>
                      <TableHead className="w-[80px] text-right">Scanned</TableHead>
                      <TableHead className="w-[70px] text-right">Added</TableHead>
                      <TableHead className="w-[70px] text-right">Updated</TableHead>
                      <TableHead className="w-[70px] text-right">Removed</TableHead>
                      <TableHead className="w-[70px] text-right">Errors</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[150px]">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <StatusBadge status={log.status} />
                        </TableCell>
                        <TableCell>
                          <QueueBadge queueType={log.queueType} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {log.filesScanned}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.filesAdded > 0 ? (
                            <span className="text-green-600">+{log.filesAdded}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.filesUpdated > 0 ? (
                            <span className="text-blue-600">~{log.filesUpdated}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.filesDeleted > 0 ? (
                            <span className="text-orange-600">-{log.filesDeleted}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.errors > 0 ? (
                            <span className="text-red-600">{log.errors}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {log.message || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{formatDate(log.syncedAt)}</div>
                          <div className="text-muted-foreground">{formatTime(log.syncedAt)}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
