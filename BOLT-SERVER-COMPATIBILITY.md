# BOLT Server Compatibility Guide

This document outlines the requirements for making your application compatible with **BOLT Server** monitoring. Examples are provided for Next.js applications.

---

## Table of Contents

1. [Health Check Endpoint](#health-check-endpoint)
2. [Log Folder Structure](#log-folder-structure)
3. [Log Files and Their Purpose](#log-files-and-their-purpose)
4. [Log Entry Format](#log-entry-format)
5. [Implementing Logging](#implementing-logging)
6. [Quick Start Checklist](#quick-start-checklist)

---

## Health Check Endpoint

BOLT Server monitors application health by making HTTP requests to a configurable health endpoint. The default endpoint is `/api/health`.

### Implementation

#### For Next.js App Router (Next.js 13+)

Create the file: `app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';

interface HealthCheck {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: Record<string, HealthCheck>;
}

// Track server start time for uptime calculation
const startTime = Date.now();

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const checks: Record<string, HealthCheck> = {};
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  // Database check (example - adapt to your database)
  try {
    const dbStart = Date.now();
    // Replace with your actual database health check
    // await prisma.$queryRaw`SELECT 1`;
    // await db.execute('SELECT 1');
    const dbResponseTime = Date.now() - dbStart;
    
    checks.database = {
      name: 'Database',
      status: 'up',
      responseTime: dbResponseTime,
    };
  } catch (error) {
    checks.database = {
      name: 'Database',
      status: 'down',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
    overallStatus = 'unhealthy';
  }

  // Redis/Cache check (optional - add if applicable)
  // try {
  //   const cacheStart = Date.now();
  //   await redis.ping();
  //   checks.cache = {
  //     name: 'Cache',
  //     status: 'up',
  //     responseTime: Date.now() - cacheStart,
  //   };
  // } catch (error) {
  //   checks.cache = {
  //     name: 'Cache',
  //     status: 'down',
  //     message: error instanceof Error ? error.message : 'Cache connection failed',
  //   };
  //   if (overallStatus === 'healthy') overallStatus = 'degraded';
  // }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '0.0.0',
    checks,
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(response, { status: httpStatus });
}
```

#### For Next.js Pages Router

Create the file: `pages/api/health.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheck {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: Record<string, HealthCheck>;
}

const startTime = Date.now();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const checks: Record<string, HealthCheck> = {};
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  // Database check (adapt to your database)
  try {
    const dbStart = Date.now();
    // await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      name: 'Database',
      status: 'up',
      responseTime: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      name: 'Database',
      status: 'down',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
    overallStatus = 'unhealthy';
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '0.0.0',
    checks,
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  
  return res.status(httpStatus).json(response);
}
```

### Expected Response Format

```json
{
  "status": "healthy",
  "timestamp": "2026-01-12T18:31:15.233Z",
  "uptime": 3600,
  "version": "1.0.0",
  "checks": {
    "database": {
      "name": "Database",
      "status": "up",
      "responseTime": 5
    }
  }
}
```

### Status Definitions

| Status | HTTP Code | Description |
|--------|-----------|-------------|
| `healthy` | 200 | All systems operational |
| `degraded` | 200 | Core functionality works, some services impaired |
| `unhealthy` | 503 | Critical services down, application not functional |

---

## Log Folder Structure

BOLT Server's Traffic view reads logs from a configurable folder. The default location is:

```
{application-root}/logs/
```

### Required Structure

```
your-app/
├── logs/
│   ├── access.log          # HTTP request logs ONLY
│   ├── app.log             # Application events (non-HTTP)
│   ├── error.log           # Errors and exceptions
│   └── archive/            # Rotated/archived logs (optional)
│       ├── access-2026-01-11.log
│       └── error-2026-01-11.log
├── src/
├── package.json
└── ...
```

### Setup

Create the logs directory:

```bash
mkdir -p logs
```

Add to `.gitignore`:

```gitignore
# Logs
logs/
*.log
```

---

## Log Files and Their Purpose

> ⚠️ **Important**: Each log file serves a distinct purpose. Do NOT duplicate entries across files.

### `access.log` - HTTP Request Traffic

**Purpose**: Record all incoming HTTP requests for traffic analysis.

**What to log**:
- ✅ All API endpoint requests
- ✅ All page requests
- ✅ Request method, URL, status code, duration
- ✅ Client IP, user agent
- ✅ Authenticated user info (if available)

**What NOT to log**:
- ❌ Application startup/shutdown
- ❌ Background job events
- ❌ Business logic events
- ❌ Errors (these go to `error.log`)

**Log levels**:
- `info` - Successful requests (2xx)
- `warn` - Client errors (4xx)

**Example entries**:
```json
{"timestamp":"2026-01-12T21:35:31.343Z","level":"info","message":"HTTP Request","request":{"method":"GET","url":"/api/users","endpoint":"/api/users","ip":"192.168.1.100","userAgent":"Mozilla/5.0...","duration":45,"statusCode":200},"user":{"id":"user_123","username":"john@example.com"},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T21:36:00.000Z","level":"warn","message":"HTTP Request","request":{"method":"GET","url":"/api/users/invalid","endpoint":"/api/users/[id]","ip":"192.168.1.100","duration":5,"statusCode":404},"user":{"id":"anonymous","username":"N/A"},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}
```

---

### `app.log` - Application Events

**Purpose**: Record application lifecycle and business logic events (non-HTTP).

**What to log**:
- ✅ Application startup and shutdown
- ✅ Configuration loaded/changed
- ✅ Background job execution (start, complete, fail)
- ✅ Scheduled task events
- ✅ Business events (user registered, order placed, etc.)
- ✅ Cache operations (cleared, warmed)
- ✅ Database migrations
- ✅ External service connections

**What NOT to log**:
- ❌ HTTP requests (these go to `access.log`)
- ❌ Errors with stack traces (these go to `error.log`)

**Log levels**:
- `debug` - Detailed diagnostic info (development only)
- `info` - Normal application events
- `warn` - Unusual but non-critical events

**Example entries**:
```json
{"timestamp":"2026-01-12T21:30:00.000Z","level":"info","message":"Application started","context":{"port":3000,"nodeVersion":"22.19.0","pid":12345},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T21:35:00.000Z","level":"info","message":"User registered","context":{"userId":"user_456","method":"oauth","provider":"google"},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T22:00:00.000Z","level":"info","message":"Scheduled job completed","context":{"jobName":"cleanupExpiredSessions","deletedCount":42,"duration":1250},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T22:05:00.000Z","level":"warn","message":"Rate limit threshold approaching","context":{"endpoint":"/api/search","currentRate":95,"limit":100},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}
```

---

### `error.log` - Errors and Exceptions

**Purpose**: Record all errors, exceptions, and failures for debugging.

**What to log**:
- ✅ Unhandled exceptions
- ✅ Caught errors that are significant
- ✅ Database query failures
- ✅ External API failures
- ✅ Authentication/authorization failures
- ✅ Validation errors with context
- ✅ Any 5xx HTTP responses

**What NOT to log**:
- ❌ Successful operations
- ❌ Normal HTTP requests (even 4xx client errors)
- ❌ Application lifecycle events

**Log levels**:
- `error` - Recoverable errors
- `fatal` - Unrecoverable errors (app may crash)

**Example entries**:
```json
{"timestamp":"2026-01-12T21:40:00.000Z","level":"error","message":"Database query failed","error":{"name":"PrismaClientKnownRequestError","message":"Connection refused","stack":"PrismaClientKnownRequestError: Connection refused\n    at ...","code":"P1001"},"request":{"method":"POST","url":"/api/orders","ip":"192.168.1.100"},"user":{"id":"user_123"},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T21:45:00.000Z","level":"error","message":"External API request failed","error":{"name":"FetchError","message":"ECONNREFUSED","code":"ECONNREFUSED"},"context":{"service":"payment-gateway","endpoint":"https://api.stripe.com/charges"},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}

{"timestamp":"2026-01-12T21:50:00.000Z","level":"fatal","message":"Uncaught exception - shutting down","error":{"name":"TypeError","message":"Cannot read property 'id' of undefined","stack":"TypeError: Cannot read property 'id' of undefined\n    at processOrder (/app/services/order.ts:45:12)\n    at ..."},"app":{"name":"my-app","version":"1.0.0","environment":"production"}}
```

---

## Summary: Which File Gets What?

| Event Type | access.log | app.log | error.log |
|------------|:----------:|:-------:|:---------:|
| HTTP 2xx response | ✅ | ❌ | ❌ |
| HTTP 4xx response | ✅ | ❌ | ❌ |
| HTTP 5xx response | ✅ | ❌ | ✅ |
| App startup/shutdown | ❌ | ✅ | ❌ |
| User login/logout | ❌ | ✅ | ❌ |
| Business events | ❌ | ✅ | ❌ |
| Background jobs | ❌ | ✅ | ❌ |
| Database errors | ❌ | ❌ | ✅ |
| Unhandled exceptions | ❌ | ❌ | ✅ |
| External API failures | ❌ | ❌ | ✅ |

---

## Log Entry Format

All log files use **JSON Lines (JSONL)** format - one JSON object per line.

### Standard Log Entry Schema

```typescript
interface LogEntry {
  // Required fields
  timestamp: string;          // ISO 8601 format
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  
  // For HTTP requests (access.log)
  request?: {
    method: string;           // GET, POST, PUT, DELETE, etc.
    url: string;              // Full URL path with query string
    endpoint: string;         // API endpoint or page route (without query)
    ip: string;               // Client IP address
    userAgent?: string;       // Browser/client user agent
    referer?: string;         // Referring URL
    duration?: number;        // Request duration in ms
    statusCode?: number;      // HTTP response status code
  };
  
  // For authenticated requests
  user?: {
    id: string | number;      // User ID
    username?: string;        // Username or email
    role?: string;            // User role
  };
  
  // For errors (error.log)
  error?: {
    name: string;             // Error name/type
    message: string;          // Error message
    stack?: string;           // Stack trace
    code?: string;            // Error code
  };
  
  // For application events (app.log)
  context?: Record<string, unknown>;
  
  // Required: Application metadata
  app: {
    name: string;             // Application name
    version: string;          // Application version
    environment: string;      // development, staging, production
  };
}
```

---

## Implementing Logging

### Using Winston (Recommended)

Install Winston:

```bash
npm install winston
# or
pnpm add winston
```

Create `lib/logger.ts`:

```typescript
import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// App metadata included in every log entry
const appMeta = {
  name: process.env.APP_NAME || 'my-app',
  version: process.env.npm_package_version || '0.0.0',
  environment: process.env.NODE_ENV || 'development',
};

// JSON format for BOLT Server compatibility
const jsonFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...metadata,
    app: appMeta,
  });
});

// Filter to only include logs with 'request' field
const accessFilter = winston.format((info) => {
  return info.request ? info : false;
});

// Filter to exclude logs with 'request' field
const appFilter = winston.format((info) => {
  return !info.request && !info.error ? info : false;
});

// Filter for errors only
const errorFilter = winston.format((info) => {
  return info.level === 'error' || info.level === 'fatal' || info.error ? info : false;
});

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
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
      filename: path.join(logDir, 'access.log'),
      format: winston.format.combine(accessFilter(), jsonFormat),
    }),
    
    // app.log - Application events only (no HTTP, no errors)
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      format: winston.format.combine(appFilter(), jsonFormat),
    }),
    
    // error.log - Errors only
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      format: winston.format.combine(errorFilter(), jsonFormat),
    }),
  ],
});

/**
 * Log an HTTP request (goes to access.log)
 */
export function logRequest(
  req: { method: string; url: string; ip?: string; headers?: Record<string, string> },
  res: { statusCode: number },
  duration: number,
  user?: { id: string; username?: string; role?: string }
) {
  const level = res.statusCode >= 400 ? 'warn' : 'info';
  
  logger.log(level, 'HTTP Request', {
    request: {
      method: req.method,
      url: req.url,
      endpoint: req.url.split('?')[0],
      ip: req.ip || req.headers?.['x-forwarded-for'] || 'unknown',
      userAgent: req.headers?.['user-agent'],
      referer: req.headers?.['referer'],
      duration,
      statusCode: res.statusCode,
    },
    user: user || { id: 'anonymous', username: 'N/A' },
  });
  
  // Also log to error.log if it's a server error
  if (res.statusCode >= 500) {
    logger.error('Server error response', {
      error: {
        name: 'HTTPError',
        message: `Server returned ${res.statusCode}`,
        code: String(res.statusCode),
      },
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip || 'unknown',
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
  error: Error,
  context?: {
    request?: { method: string; url: string; ip?: string };
    user?: { id: string; username?: string };
    [key: string]: unknown;
  }
) {
  logger.error(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
}

/**
 * Log a fatal error (goes to error.log)
 */
export function logFatal(error: Error, context?: Record<string, unknown>) {
  logger.log('fatal', error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  });
}
```

### Usage Examples

```typescript
import { logRequest, logEvent, logWarning, logError } from '@/lib/logger';

// In your API route or middleware - log HTTP request
logRequest(req, res, duration, { id: user.id, username: user.email });

// Application startup
logEvent('Application started', { port: 3000, nodeVersion: process.version });

// Business event
logEvent('Order placed', { orderId: 'ORD-123', total: 99.99, userId: 'user_456' });

// Background job
logEvent('Cleanup job completed', { jobName: 'expiredSessions', deleted: 42 });

// Warning
logWarning('Rate limit approaching', { endpoint: '/api/search', current: 95, limit: 100 });

// Error
try {
  await database.query('...');
} catch (err) {
  logError(err as Error, { 
    request: { method: 'POST', url: '/api/orders' },
    user: { id: 'user_123' }
  });
}
```

---

## Quick Start Checklist

### Required

- [ ] Create `/api/health` endpoint with standard response format
- [ ] Create `logs/` directory in project root
- [ ] Add `logs/` to `.gitignore`
- [ ] Install Winston logging library
- [ ] Configure separate log files:
  - [ ] `access.log` - HTTP requests only
  - [ ] `app.log` - Application events only
  - [ ] `error.log` - Errors only
- [ ] Use `logRequest()` for all HTTP traffic
- [ ] Use `logEvent()` for application events
- [ ] Use `logError()` for all errors

### Recommended

- [ ] Add database health check to `/api/health`
- [ ] Configure log rotation for production
- [ ] Add user context to logs when authenticated
- [ ] Set `APP_NAME` environment variable
- [ ] Add request logging middleware

### Environment Variables

Add to your `.env` file:

```env
# Application
APP_NAME=your-app-name
NODE_ENV=production

# Logging
LOG_LEVEL=info
```

---

## Support

For questions or issues with BOLT Server compatibility, contact the BOLT Server team or refer to the BOLT Server documentation.

---

*Last updated: January 2026*