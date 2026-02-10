# Deployment Guide: bolt-mail-operations

This guide covers deploying the bolt-mail-operations application to a Windows Server.

## Prerequisites

- **Windows Server** (2019 or later recommended)
- **Node.js 18+** installed ([download](https://nodejs.org/))
- **Git** installed ([download](https://git-scm.com/))
- **pnpm** package manager (install via `npm install -g pnpm`)
- **Network access** to UNC paths for mail PDF directories
- **MySQL database** (optional, for external data storage)

---

## Step 1: Clone the Repository

Open **Command Prompt (CMD)** as Administrator and navigate to your desired installation directory:

```cmd
cd C:\inetpub\wwwroot
git clone https://github.com/GravitixAI/bolt-mail-operations.git
cd bolt-mail-operations
```

---

## Step 2: Install Dependencies

```cmd
pnpm install
```

If prompted about build scripts, approve them:

```cmd
pnpm approve-builds
```

---

## Step 3: Build the Application

```cmd
pnpm build
```

This compiles the Next.js application for production. The build should complete without errors.

---

## Step 4: Install PM2 (Process Manager)

PM2 keeps the application running and restarts it if it crashes:

```cmd
npm install -g pm2
```

---

## Step 5: Create PM2 Ecosystem Config

Create the PM2 configuration file. In CMD, run:

```cmd
echo module.exports = { apps: [{ name: "bolt-mail-operations", script: "node_modules/next/dist/bin/next", args: "start -H 0.0.0.0 -p 3001", cwd: "C:\\inetpub\\wwwroot\\bolt-mail-operations", env: { NODE_ENV: "production", APP_NAME: "bolt-mail-operations" } }] }; > ecosystem.config.js
```

> **Note:** Adjust the `cwd` path if you installed to a different directory.

> **Note:** Change `-p 3001` to use a different port if needed.

---

## Step 6: Set PM2 Home Directory (Recommended)

To avoid permission issues, set a custom PM2 home directory:

```cmd
set PM2_HOME=C:\pm2
```

> **Note:** You'll need to set this environment variable each time you open a new CMD window, or set it permanently in System Environment Variables.

---

## Step 7: Start the Application

```cmd
pm2 start ecosystem.config.js
pm2 save
```

Verify it's running:

```cmd
pm2 status
```

You should see:

```
│ id │ name                  │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼───────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bolt-mail-operations  │ fork     │ 0    │ online    │ 0%       │ ~80mb    │
```

---

## Step 8: Configure Windows Firewall

Allow inbound traffic on your chosen port:

```cmd
netsh advfirewall firewall add rule name="Bolt Mail Operations" dir=in action=allow protocol=tcp localport=3001
```

---

## Step 9: Test the Application

- **Local:** Open `http://localhost:3001` in a browser on the server
- **Network:** Open `http://<server-ip>:3001` from another machine
- **Health Check:** `http://<server-ip>:3001/api/health`

---

## Step 10: Configure Auto-Start on Reboot

To make PM2 start automatically when the server reboots:

```cmd
pm2 startup
```

Follow the instructions provided by the command output.

---

## Step 11: Configure the Application

After deployment, configure the application through the web interface:

1. Open the application in a browser
2. Click the **Settings** (gear icon) in the navigation bar
3. Configure the following:

### UNC Paths Tab
- **Certified Mail Queue:** Enter the UNC path to certified mail PDFs (e.g., `\\server\PDF_Output\Mail_Certified`)
- **Regular Mail Queue:** Enter the UNC path to regular mail PDFs (e.g., `\\server\PDF_Output\Mail_Regular`)
- Click **Test Path** to verify access

### MySQL Tab
- **Host:** MySQL server hostname or IP
- **Port:** MySQL port (default: 3306)
- **Database:** Database name
- **Username:** Database user
- **Password:** Database password
- Click **Test Connection** to verify

### Auto Sync Tab
- **Enable Auto Sync:** Toggle to enable automatic synchronization
- **Sync Interval:** How often to sync (1, 2, 5, 10, 15, or 30 minutes)

---

## Step 12: Create MySQL Table (If Using Database Sync)

If syncing to MySQL, create the required table:

```sql
CREATE TABLE IF NOT EXISTS mail_portal_outgoing_mail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mail_type VARCHAR(50),
    created_by_username VARCHAR(100),
    created_by_name VARCHAR(100),
    creation_date DATE,
    creation_time TIME,
    file_size BIGINT,
    file_modified_at DATETIME,
    is_small_file BOOLEAN DEFAULT FALSE,
    unc_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_file_path (filename, unc_path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Migrating Data from Another Installation

If you have existing configuration data, copy the SQLite database file:

1. Locate `local.db` in your source installation's root directory
2. Stop the target server: `pm2 stop bolt-mail-operations`
3. Copy `local.db` to the target installation's root directory
4. Start the server: `pm2 start bolt-mail-operations`

> **Note:** The `local.db` file contains UNC paths, MySQL credentials, auto-sync settings, and sync logs.

---

## BOLT Server Integration

This application is compatible with BOLT Server monitoring.

### Health Endpoint

BOLT Server can monitor application health at:

```
GET http://<server-ip>:3001/api/health
```

Response format:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-10T23:03:53.623Z",
  "uptime": 3600,
  "version": "1.0.0",
  "checks": {
    "sqlite": { "name": "SQLite (Local)", "status": "up", "responseTime": 1 },
    "mysql": { "name": "MySQL (External)", "status": "up", "responseTime": 19 },
    "autoSync": { "name": "Auto-Sync", "status": "up", "message": "Running every 2 minute(s)" }
  }
}
```

### Log Files

Structured logs for BOLT Server Traffic view are located in the `logs/` directory:

| File | Purpose |
|------|---------|
| `logs/access.log` | HTTP request traffic |
| `logs/app.log` | Application events (sync operations, startup, etc.) |
| `logs/error.log` | Errors and exceptions |

---

## Useful PM2 Commands

| Command | Description |
|---------|-------------|
| `pm2 status` | Check application status |
| `pm2 logs bolt-mail-operations` | View live logs |
| `pm2 logs bolt-mail-operations --lines 100` | View last 100 log lines |
| `pm2 restart bolt-mail-operations` | Restart the application |
| `pm2 stop bolt-mail-operations` | Stop the application |
| `pm2 delete bolt-mail-operations` | Remove from PM2 |
| `pm2 monit` | Real-time monitoring dashboard |

---

## Updating the Application

To update to the latest version:

```cmd
cd C:\inetpub\wwwroot\bolt-mail-operations
pm2 stop bolt-mail-operations
git pull
pnpm install
pnpm build
pm2 start bolt-mail-operations
```

---

## Troubleshooting

### PM2 Permission Errors (EPERM)

If you see `connect EPERM //./pipe/rpc.sock`, set a custom PM2 home:

```cmd
set PM2_HOME=C:\pm2
pm2 start ecosystem.config.js
pm2 save
```

### PM2 Not Working with PowerShell

Use **CMD** instead of PowerShell for PM2 commands. PowerShell has argument parsing issues with PM2.

### Application Stops Immediately

Check the logs:

```cmd
pm2 logs bolt-mail-operations --err --lines 50
```

Common causes:
- Build not completed (`pnpm build`)
- Port already in use
- Missing dependencies

### Port Already in Use

Find what's using the port:

```cmd
netstat -ano | findstr :3001
```

Kill the process or use a different port in `ecosystem.config.js`.

### UNC Path Access Denied

Ensure the Windows service account running PM2 has:
- Read access to the UNC paths
- Network share permissions configured correctly

You may need to run PM2 as a specific user with network access:

```cmd
pm2 start ecosystem.config.js --user <DOMAIN\username>
```

### MySQL Connection Failed

1. Verify MySQL server is running and accessible from this server
2. Check firewall allows outbound connections to MySQL port (default 3306)
3. Verify credentials in the application settings
4. Ensure the database and table exist

### Auto-Sync Not Running

1. Verify auto-sync is enabled in Settings > Auto Sync
2. Check the Sync Log page for error messages
3. Review `logs/app.log` for sync-related events
4. Restart the application: `pm2 restart bolt-mail-operations`

---

## Configuration Reference

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | production |
| `APP_NAME` | Application name (for logging) | bolt-mail-operations |
| `LOG_LEVEL` | Logging verbosity | info |

### File Locations

| File/Directory | Purpose |
|----------------|---------|
| `local.db` | SQLite database (config, sync logs) |
| `ecosystem.config.js` | PM2 process configuration |
| `.next/` | Built application files |
| `logs/` | Application log files |
| `logs/access.log` | HTTP request logs |
| `logs/app.log` | Application event logs |
| `logs/error.log` | Error logs |

---

## Security Recommendations

1. **Use a reverse proxy** (IIS, nginx) for SSL termination
2. **Restrict firewall rules** to specific IP ranges if possible
3. **Secure MySQL credentials** - use a dedicated database user with minimal permissions
4. **Restrict UNC path access** - only grant read access to required directories
5. **Regular backups** of `local.db` and MySQL database
6. **Network segmentation** - ensure the server can only access required network resources

---

## Service Account Requirements

The Windows service account running the application needs:

| Resource | Permission |
|----------|------------|
| Application directory | Read, Write, Execute |
| UNC mail paths | Read |
| MySQL server | Network access (port 3306) |
| Logs directory | Write |

---

## Monitoring Checklist

After deployment, verify:

- [ ] Application accessible at `http://<server-ip>:3001`
- [ ] Health endpoint returns `healthy` status
- [ ] UNC paths accessible (test via Settings)
- [ ] MySQL connection successful (test via Settings)
- [ ] Auto-sync running (check Sync Log page)
- [ ] Log files being written to `logs/` directory
- [ ] PM2 configured for auto-restart on reboot
