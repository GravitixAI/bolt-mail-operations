"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Database,
  FolderOpen,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getConfig,
  saveConfig,
  testMySqlConnection,
  testUncPath,
  type ConfigValues,
  type TestConnectionResult,
} from "@/app/actions/config-actions";
import {
  getSyncLogs,
  type SyncLogEntry,
} from "@/app/actions/sync-log-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Format a sync log entry as a one-liner string
 */
function formatSyncLogEntry(log: SyncLogEntry): string {
  const time = new Date(log.syncedAt).toLocaleTimeString();
  const date = new Date(log.syncedAt).toLocaleDateString();
  const queue = log.queueType === "certified" ? "Certified" : "Regular";
  
  const parts: string[] = [];
  if (log.filesAdded > 0) parts.push(`+${log.filesAdded}`);
  if (log.filesUpdated > 0) parts.push(`~${log.filesUpdated}`);
  if (log.filesDeleted > 0) parts.push(`-${log.filesDeleted}`);
  if (log.errors > 0) parts.push(`${log.errors} err`);
  
  const changes = parts.length > 0 ? parts.join(", ") : "no changes";
  const statusIcon = log.status === "success" ? "✓" : log.status === "partial" ? "⚠" : "✗";
  
  return `[${date} ${time}] ${statusIcon} ${queue}: ${log.filesScanned} scanned (${changes})`;
}

interface ConfigModalProps {
  trigger?: React.ReactNode;
  onConfigSaved?: (config: ConfigValues) => void;
}

export function ConfigModal({ trigger, onConfigSaved }: ConfigModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [config, setConfig] = useState<ConfigValues>({
    uncPathCertified: "",
    uncPathRegular: "",
    mysqlHost: "",
    mysqlPort: "3306",
    mysqlDatabase: "",
    mysqlUser: "",
    mysqlPassword: "",
    autoSyncEnabled: false,
    autoSyncInterval: 5,
  });

  // Test results
  const [certifiedTestResult, setCertifiedTestResult] = useState<TestConnectionResult | null>(null);
  const [regularTestResult, setRegularTestResult] = useState<TestConnectionResult | null>(null);
  const [mysqlTestResult, setMysqlTestResult] = useState<TestConnectionResult | null>(null);
  const [testingCertified, setTestingCertified] = useState(false);
  const [testingRegular, setTestingRegular] = useState(false);
  const [testingMysql, setTestingMysql] = useState(false);

  // Sync logs
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load config and logs when modal opens
  useEffect(() => {
    if (open) {
      loadConfig();
      loadSyncLogs();
    }
  }, [open]);

  const loadSyncLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await getSyncLogs(50);
      setSyncLogs(logs);
    } catch (error) {
      console.error("Failed to load sync logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const result = await getConfig();
      if (result.success && result.config) {
        setConfig(result.config);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveConfig(config);
      if (result.success) {
        onConfigSaved?.(config);
        setOpen(false);
      } else {
        alert(result.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Failed to save config:", error);
      alert("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleTestCertified = async () => {
    setTestingCertified(true);
    setCertifiedTestResult(null);
    try {
      const result = await testUncPath(config.uncPathCertified);
      setCertifiedTestResult(result);
    } catch {
      setCertifiedTestResult({
        success: false,
        message: "Test failed unexpectedly",
      });
    } finally {
      setTestingCertified(false);
    }
  };

  const handleTestRegular = async () => {
    setTestingRegular(true);
    setRegularTestResult(null);
    try {
      const result = await testUncPath(config.uncPathRegular);
      setRegularTestResult(result);
    } catch {
      setRegularTestResult({
        success: false,
        message: "Test failed unexpectedly",
      });
    } finally {
      setTestingRegular(false);
    }
  };

  const handleTestMysql = async () => {
    setTestingMysql(true);
    setMysqlTestResult(null);
    try {
      const result = await testMySqlConnection({
        host: config.mysqlHost,
        port: config.mysqlPort,
        database: config.mysqlDatabase,
        user: config.mysqlUser,
        password: config.mysqlPassword,
      });
      setMysqlTestResult(result);
    } catch {
      setMysqlTestResult({
        success: false,
        message: "Test failed unexpectedly",
      });
    } finally {
      setTestingMysql(false);
    }
  };

  const updateConfig = (field: keyof ConfigValues, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    // Clear test results when config changes
    if (field === "uncPathCertified") {
      setCertifiedTestResult(null);
    } else if (field === "uncPathRegular") {
      setRegularTestResult(null);
    } else if (field.startsWith("mysql")) {
      setMysqlTestResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the UNC path for PDF files and MySQL database connection.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="unc" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unc" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                UNC Paths
              </TabsTrigger>
              <TabsTrigger value="mysql" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                MySQL
              </TabsTrigger>
              <TabsTrigger value="autosync" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Auto Sync
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unc" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Certified Mail Queue</CardTitle>
                  <CardDescription>
                    The UNC path where certified mail PDFs are stored
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uncPathCertified">UNC Path</Label>
                    <Input
                      id="uncPathCertified"
                      placeholder="\\server\share\Mail_Certified"
                      value={config.uncPathCertified}
                      onChange={(e) => updateConfig("uncPathCertified", e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleTestCertified}
                      disabled={testingCertified || !config.uncPathCertified.trim()}
                    >
                      {testingCertified ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Test Path
                        </>
                      )}
                    </Button>

                    {certifiedTestResult && (
                      <Badge
                        variant={certifiedTestResult.success ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {certifiedTestResult.success ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {certifiedTestResult.success ? "Connected" : "Failed"}
                      </Badge>
                    )}
                  </div>

                  {certifiedTestResult && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        certifiedTestResult.success
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {certifiedTestResult.message}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Regular Mail Queue</CardTitle>
                  <CardDescription>
                    The UNC path where regular mail PDFs are stored
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uncPathRegular">UNC Path</Label>
                    <Input
                      id="uncPathRegular"
                      placeholder="\\server\share\Mail_Regular"
                      value={config.uncPathRegular}
                      onChange={(e) => updateConfig("uncPathRegular", e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleTestRegular}
                      disabled={testingRegular || !config.uncPathRegular.trim()}
                    >
                      {testingRegular ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Test Path
                        </>
                      )}
                    </Button>

                    {regularTestResult && (
                      <Badge
                        variant={regularTestResult.success ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {regularTestResult.success ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {regularTestResult.success ? "Connected" : "Failed"}
                      </Badge>
                    )}
                  </div>

                  {regularTestResult && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        regularTestResult.success
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {regularTestResult.message}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mysql" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">MySQL Connection</CardTitle>
                  <CardDescription>
                    Database connection settings for storing mail records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mysqlHost">Host</Label>
                      <Input
                        id="mysqlHost"
                        placeholder="localhost"
                        value={config.mysqlHost}
                        onChange={(e) => updateConfig("mysqlHost", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mysqlPort">Port</Label>
                      <Input
                        id="mysqlPort"
                        placeholder="3306"
                        value={config.mysqlPort}
                        onChange={(e) => updateConfig("mysqlPort", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mysqlDatabase">Database</Label>
                    <Input
                      id="mysqlDatabase"
                      placeholder="mail_operations"
                      value={config.mysqlDatabase}
                      onChange={(e) => updateConfig("mysqlDatabase", e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="mysqlUser">Username</Label>
                    <Input
                      id="mysqlUser"
                      placeholder="db_user"
                      value={config.mysqlUser}
                      onChange={(e) => updateConfig("mysqlUser", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mysqlPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="mysqlPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={config.mysqlPassword}
                        onChange={(e) => updateConfig("mysqlPassword", e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleTestMysql}
                      disabled={
                        testingMysql ||
                        !config.mysqlHost ||
                        !config.mysqlDatabase ||
                        !config.mysqlUser
                      }
                    >
                      {testingMysql ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Test Connection
                        </>
                      )}
                    </Button>

                    {mysqlTestResult && (
                      <Badge
                        variant={mysqlTestResult.success ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {mysqlTestResult.success ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {mysqlTestResult.success ? "Connected" : "Failed"}
                      </Badge>
                    )}
                  </div>

                  {mysqlTestResult && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        mysqlTestResult.success
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      <p>{mysqlTestResult.message}</p>
                      {mysqlTestResult.details?.serverVersion && (
                        <p className="mt-1 text-xs opacity-75">
                          MySQL Version: {mysqlTestResult.details.serverVersion}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="autosync" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Auto Sync Settings</CardTitle>
                  <CardDescription>
                    Automatically sync PDF files to the database at regular intervals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoSyncEnabled">Enable Auto Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync both mail queues to the database
                      </p>
                    </div>
                    <Switch
                      id="autoSyncEnabled"
                      checked={config.autoSyncEnabled}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({ ...prev, autoSyncEnabled: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="autoSyncInterval">Sync Interval</Label>
                    <Select
                      value={config.autoSyncInterval.toString()}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          autoSyncInterval: parseInt(value, 10),
                        }))
                      }
                      disabled={!config.autoSyncEnabled}
                    >
                      <SelectTrigger id="autoSyncInterval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every 1 minute</SelectItem>
                        <SelectItem value="2">Every 2 minutes</SelectItem>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="10">Every 10 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every 1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How often to check for new PDF files and sync to database
                    </p>
                  </div>

                  {config.autoSyncEnabled && (
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm">
                      <p className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Auto sync will run every {config.autoSyncInterval} minute
                        {config.autoSyncInterval !== 1 ? "s" : ""} when the application is open.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Sync Log</CardTitle>
                      <CardDescription>
                        Recent sync activity (auto-cleans after 24 hours)
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadSyncLogs}
                      disabled={loadingLogs}
                    >
                      {loadingLogs ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingLogs ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : syncLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No sync activity yet
                    </p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1 font-mono text-xs">
                        {syncLogs.map((log) => (
                          <div
                            key={log.id}
                            className={`p-1.5 rounded ${
                              log.status === "success"
                                ? "text-green-700 dark:text-green-400"
                                : log.status === "partial"
                                ? "text-yellow-700 dark:text-yellow-400"
                                : "text-red-700 dark:text-red-400"
                            }`}
                          >
                            {formatSyncLogEntry(log)}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
