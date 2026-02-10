"use server";

import { db, initDB } from "@/lib/db";
import { appConfig, CONFIG_KEYS } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";

// Initialize DB on first load
initDB();

export interface ConfigValues {
  uncPathCertified: string;
  uncPathRegular: string;
  mysqlHost: string;
  mysqlPort: string;
  mysqlDatabase: string;
  mysqlUser: string;
  mysqlPassword: string;
  autoSyncEnabled: boolean;
  autoSyncInterval: number; // In minutes
}

export interface ConfigResult {
  success: boolean;
  message?: string;
  config?: ConfigValues;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  details?: {
    serverVersion?: string;
    database?: string;
  };
}

/**
 * Get a single config value by key
 */
async function getConfigValue(key: string): Promise<string | null> {
  const result = await db
    .select()
    .from(appConfig)
    .where(eq(appConfig.key, key))
    .limit(1);

  return result.length > 0 ? result[0].value : null;
}

/**
 * Set a config value (upsert)
 */
async function setConfigValue(key: string, value: string): Promise<void> {
  const existing = await db
    .select()
    .from(appConfig)
    .where(eq(appConfig.key, key))
    .limit(1);

  const now = new Date();

  if (existing.length > 0) {
    await db
      .update(appConfig)
      .set({ value, updatedAt: now })
      .where(eq(appConfig.key, key));
  } else {
    await db.insert(appConfig).values({
      key,
      value,
      createdAt: now,
      updatedAt: now,
    });
  }
}

/**
 * Get all configuration values
 */
export async function getConfig(): Promise<ConfigResult> {
  try {
    // Check for legacy unc_path and migrate if needed
    const legacyPath = await getConfigValue(CONFIG_KEYS.UNC_PATH);
    const certifiedPath = await getConfigValue(CONFIG_KEYS.UNC_PATH_CERTIFIED);
    
    const autoSyncEnabledStr = await getConfigValue(CONFIG_KEYS.AUTO_SYNC_ENABLED);
    const autoSyncIntervalStr = await getConfigValue(CONFIG_KEYS.AUTO_SYNC_INTERVAL);
    
    const config: ConfigValues = {
      uncPathCertified: certifiedPath || legacyPath || "",
      uncPathRegular: (await getConfigValue(CONFIG_KEYS.UNC_PATH_REGULAR)) || "",
      mysqlHost: (await getConfigValue(CONFIG_KEYS.MYSQL_HOST)) || "",
      mysqlPort: (await getConfigValue(CONFIG_KEYS.MYSQL_PORT)) || "3306",
      mysqlDatabase: (await getConfigValue(CONFIG_KEYS.MYSQL_DATABASE)) || "",
      mysqlUser: (await getConfigValue(CONFIG_KEYS.MYSQL_USER)) || "",
      mysqlPassword: (await getConfigValue(CONFIG_KEYS.MYSQL_PASSWORD)) || "",
      autoSyncEnabled: autoSyncEnabledStr === "true",
      autoSyncInterval: autoSyncIntervalStr ? parseInt(autoSyncIntervalStr, 10) : 5, // Default 5 minutes
    };

    return { success: true, config };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load configuration";
    return { success: false, message };
  }
}

/**
 * Save all configuration values
 */
export async function saveConfig(config: ConfigValues): Promise<ConfigResult> {
  try {
    await setConfigValue(CONFIG_KEYS.UNC_PATH_CERTIFIED, config.uncPathCertified);
    await setConfigValue(CONFIG_KEYS.UNC_PATH_REGULAR, config.uncPathRegular);
    await setConfigValue(CONFIG_KEYS.MYSQL_HOST, config.mysqlHost);
    await setConfigValue(CONFIG_KEYS.MYSQL_PORT, config.mysqlPort);
    await setConfigValue(CONFIG_KEYS.MYSQL_DATABASE, config.mysqlDatabase);
    await setConfigValue(CONFIG_KEYS.MYSQL_USER, config.mysqlUser);
    await setConfigValue(CONFIG_KEYS.MYSQL_PASSWORD, config.mysqlPassword);
    await setConfigValue(CONFIG_KEYS.AUTO_SYNC_ENABLED, config.autoSyncEnabled ? "true" : "false");
    await setConfigValue(CONFIG_KEYS.AUTO_SYNC_INTERVAL, config.autoSyncInterval.toString());

    return { success: true, message: "Configuration saved successfully" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save configuration";
    return { success: false, message };
  }
}

/**
 * Test MySQL database connection
 */
export async function testMySqlConnection(config: {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
}): Promise<TestConnectionResult> {
  if (!config.host || !config.database || !config.user) {
    return {
      success: false,
      message: "Please fill in all required fields (host, database, user)",
    };
  }

  let connection: mysql.Connection | null = null;

  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: parseInt(config.port) || 3306,
      database: config.database,
      user: config.user,
      password: config.password,
      connectTimeout: 10000, // 10 second timeout
    });

    // Test the connection with a simple query
    const [rows] = await connection.execute("SELECT VERSION() as version");
    const version = (rows as Array<{ version: string }>)[0]?.version || "Unknown";

    return {
      success: true,
      message: "Connection successful!",
      details: {
        serverVersion: version,
        database: config.database,
      },
    };
  } catch (error) {
    let message = "Connection failed";

    if (error instanceof Error) {
      // Provide user-friendly error messages
      if (error.message.includes("ECONNREFUSED")) {
        message = `Cannot connect to MySQL server at ${config.host}:${config.port}. Is the server running?`;
      } else if (error.message.includes("ENOTFOUND")) {
        message = `Host "${config.host}" not found. Please check the hostname.`;
      } else if (error.message.includes("Access denied")) {
        message = "Access denied. Please check your username and password.";
      } else if (error.message.includes("Unknown database")) {
        message = `Database "${config.database}" does not exist.`;
      } else if (error.message.includes("ETIMEDOUT")) {
        message = "Connection timed out. Please check the host and port.";
      } else {
        message = error.message;
      }
    }

    return { success: false, message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Test UNC path accessibility
 */
export async function testUncPath(uncPath: string): Promise<TestConnectionResult> {
  if (!uncPath || uncPath.trim() === "") {
    return { success: false, message: "Please enter a UNC path" };
  }

  try {
    const fs = await import("fs/promises");
    const stats = await fs.stat(uncPath.trim());

    if (!stats.isDirectory()) {
      return { success: false, message: "The path exists but is not a directory" };
    }

    // Try to read the directory to verify access
    const entries = await fs.readdir(uncPath.trim());
    const pdfCount = entries.filter((e) => e.toLowerCase().endsWith(".pdf")).length;

    return {
      success: true,
      message: `Path accessible! Found ${pdfCount} PDF file(s).`,
      details: {
        database: uncPath.trim(),
      },
    };
  } catch (error) {
    let message = "Path not accessible";

    if (error instanceof Error) {
      if (error.message.includes("ENOENT")) {
        message = "Path not found or does not exist";
      } else if (error.message.includes("EACCES") || error.message.includes("EPERM")) {
        message = "Access denied to the specified path";
      } else {
        message = error.message;
      }
    }

    return { success: false, message };
  }
}
