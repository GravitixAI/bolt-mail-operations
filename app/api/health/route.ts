import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import mysql from "mysql2/promise";
import { getConfig } from "@/app/actions/config-actions";
import { logApiRequest } from "@/lib/api-logger";

interface HealthCheck {
  name: string;
  status: "up" | "down" | "degraded";
  responseTime?: number;
  message?: string;
}

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  checks: Record<string, HealthCheck>;
}

// Track server start time for uptime calculation
const startTime = Date.now();

export async function GET(request: NextRequest): Promise<NextResponse<HealthResponse>> {
  const requestStart = Date.now();
  const checks: Record<string, HealthCheck> = {};
  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

  // SQLite (local) database check
  try {
    const sqliteStart = Date.now();
    await db.run(sql`SELECT 1`);
    const sqliteResponseTime = Date.now() - sqliteStart;

    checks.sqlite = {
      name: "SQLite (Local)",
      status: "up",
      responseTime: sqliteResponseTime,
    };
  } catch (error) {
    checks.sqlite = {
      name: "SQLite (Local)",
      status: "down",
      message: error instanceof Error ? error.message : "SQLite connection failed",
    };
    overallStatus = "unhealthy";
  }

  // MySQL database check (if configured)
  try {
    const configResult = await getConfig();
    if (configResult.success && configResult.config?.mysqlHost) {
      const config = configResult.config;
      const mysqlStart = Date.now();

      const connection = await mysql.createConnection({
        host: config.mysqlHost,
        port: parseInt(config.mysqlPort) || 3306,
        database: config.mysqlDatabase,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        connectTimeout: 5000,
      });

      await connection.query("SELECT 1");
      await connection.end();

      const mysqlResponseTime = Date.now() - mysqlStart;

      checks.mysql = {
        name: "MySQL (External)",
        status: "up",
        responseTime: mysqlResponseTime,
      };
    } else {
      checks.mysql = {
        name: "MySQL (External)",
        status: "degraded",
        message: "Not configured",
      };
      if (overallStatus === "healthy") overallStatus = "degraded";
    }
  } catch (error) {
    checks.mysql = {
      name: "MySQL (External)",
      status: "down",
      message: error instanceof Error ? error.message : "MySQL connection failed",
    };
    // MySQL being down makes the app degraded (not unhealthy) since core functionality may still work
    if (overallStatus === "healthy") overallStatus = "degraded";
  }

  // Auto-sync status check
  try {
    const configResult = await getConfig();
    if (configResult.success && configResult.config) {
      const { autoSyncEnabled, autoSyncInterval } = configResult.config;
      checks.autoSync = {
        name: "Auto-Sync",
        status: autoSyncEnabled ? "up" : "degraded",
        message: autoSyncEnabled
          ? `Running every ${autoSyncInterval} minute(s)`
          : "Disabled",
      };
    }
  } catch (error) {
    checks.autoSync = {
      name: "Auto-Sync",
      status: "degraded",
      message: "Unable to check status",
    };
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || "1.0.0",
    checks,
  };

  const httpStatus =
    overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503;

  // Log the health check request
  logApiRequest(request, httpStatus, requestStart);

  return NextResponse.json(response, { status: httpStatus });
}
