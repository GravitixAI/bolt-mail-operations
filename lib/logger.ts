import winston from "winston";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// App metadata included in every log entry
const getAppMeta = () => ({
  name: process.env.APP_NAME || "bolt-mail-operations",
  version: process.env.npm_package_version || "1.0.0",
  environment: process.env.NODE_ENV || "development",
});

// JSON format for BOLT Server compatibility
const jsonFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...metadata,
      app: getAppMeta(),
    });
  }
);

// Filter to only include logs with 'request' field (access.log)
const accessFilter = winston.format((info) => {
  return info.request ? info : false;
});

// Filter to exclude logs with 'request' and 'error' fields (app.log)
const appFilter = winston.format((info) => {
  return !info.request && !info.error ? info : false;
});

// Filter for errors only (error.log)
const errorFilter = winston.format((info) => {
  return info.level === "error" || info.level === "fatal" || info.error
    ? info
    : false;
});

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // access.log - HTTP requests only
    new winston.transports.File({
      filename: path.join(logDir, "access.log"),
      format: winston.format.combine(accessFilter(), jsonFormat),
    }),

    // app.log - Application events only (no HTTP, no errors)
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      format: winston.format.combine(appFilter(), jsonFormat),
    }),

    // error.log - Errors only
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      format: winston.format.combine(errorFilter(), jsonFormat),
    }),
  ],
});

// Type definitions
export interface RequestInfo {
  method: string;
  url: string;
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
}

export interface ResponseInfo {
  statusCode: number;
}

export interface UserInfo {
  id: string | number;
  username?: string;
  role?: string;
}

/**
 * Log an HTTP request (goes to access.log)
 */
export function logRequest(
  req: RequestInfo,
  res: ResponseInfo,
  duration: number,
  user?: UserInfo
) {
  const level = res.statusCode >= 400 ? "warn" : "info";

  logger.log(level, "HTTP Request", {
    request: {
      method: req.method,
      url: req.url,
      endpoint: req.url.split("?")[0],
      ip:
        req.ip ||
        (req.headers?.["x-forwarded-for"] as string | undefined) ||
        "unknown",
      userAgent: req.headers?.["user-agent"],
      referer: req.headers?.["referer"],
      duration,
      statusCode: res.statusCode,
    },
    user: user || { id: "anonymous", username: "N/A" },
  });

  // Also log to error.log if it's a server error
  if (res.statusCode >= 500) {
    logger.error("Server error response", {
      error: {
        name: "HTTPError",
        message: `Server returned ${res.statusCode}`,
        code: String(res.statusCode),
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip || "unknown",
      },
      user,
    });
  }
}

/**
 * Log an application event (goes to app.log)
 */
export function logEvent(message: string, context?: Record<string, unknown>) {
  logger.info(message, { context });
}

/**
 * Log a warning (goes to app.log)
 */
export function logWarning(message: string, context?: Record<string, unknown>) {
  logger.warn(message, { context });
}

/**
 * Log an error (goes to error.log)
 */
export function logError(
  error: Error | string,
  context?: {
    request?: { method: string; url: string; ip?: string };
    user?: { id: string; username?: string };
    [key: string]: unknown;
  }
) {
  if (typeof error === "string") {
    logger.error(error, {
      error: {
        name: "Error",
        message: error,
      },
      ...context,
    });
  } else {
    logger.error(error.message, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    });
  }
}

/**
 * Log a fatal error (goes to error.log)
 */
export function logFatal(error: Error, context?: Record<string, unknown>) {
  logger.log("fatal", error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  });
}

// Log application startup
export function logStartup(port?: number) {
  logEvent("Application started", {
    port: port || 3000,
    nodeVersion: process.version,
    pid: process.pid,
  });
}
