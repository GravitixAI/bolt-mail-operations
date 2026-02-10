"use server";

import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";
import { getConfig } from "./config-actions";
import { addSyncLog } from "./sync-log-actions";

export interface PdfFile {
  name: string;
  size: number;
  modifiedAt: string;
  // Parsed fields from filename
  mailType: string | null;
  user: string | null;
  createdDate: string | null;
  createdTime: string | null;
  // Flag for potentially problematic files
  isSmallFile: boolean;
  // Raw filename for debugging
  rawFilename: string;
}

export interface PdfListResult {
  success: boolean;
  files?: PdfFile[];
  error?: string;
  path?: string;
  // Debug: sample filenames to check pattern
  sampleFilenames?: string[];
}

export interface SaveToDatabaseResult {
  success: boolean;
  message: string;
  inserted?: number;
  updated?: number;
  deleted?: number;
  errors?: number;
  scanned?: number;
}

/**
 * Parse PDF filename to extract mail type, user, date, and time
 * Formats supported:
 *   - MailCert_firstname.lastname_YYYYMMDD-HHMMSSCC.pdf
 *   - MailCert_firstname.lastname_YYYYMMDD-HHMMSS-NN.pdf (with sequence number)
 * Examples:
 *   - MailCert_Andriana.Morris_20260210-10393801.pdf
 *   - MailCert_Jennifer.Ruiz_20260209-155008-01.pdf
 */
function parsePdfFilename(filename: string): {
  mailType: string | null;
  user: string | null;
  createdDate: string | null;
  createdTime: string | null;
  rawFilename: string;
} {
  // Regex pattern matching: Type_User_Date-Time(-Sequence).pdf
  // Time can be 6-8 digits, optionally followed by -NN sequence number
  // User can have hyphens in names (e.g., Matilda.Bona-Palma)
  const pattern = /^(?<Type>.+)_(?<User>[a-zA-Z]+\.[a-zA-Z-]+)_(?<Date>\d{8})-(?<Time>\d{6,8})(?:-\d+)?\.pdf$/i;
  const match = filename.match(pattern);

  if (!match || !match.groups) {
    return {
      mailType: null,
      user: null,
      createdDate: null,
      createdTime: null,
      rawFilename: filename,
    };
  }

  const { Type, User, Date: dateStr, Time: timeStr } = match.groups;

  // Format date: YYYYMMDD -> YYYY-MM-DD
  const formattedDate = dateStr
    ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
    : null;

  // Format time: HHMMSS(CC) -> HH:MM:SS
  // Only use first 6 digits for time display
  const formattedTime = timeStr
    ? `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`
    : null;

  return {
    mailType: Type || null,
    user: User || null,
    createdDate: formattedDate,
    createdTime: formattedTime,
    rawFilename: filename,
  };
}

export async function listPdfFiles(uncPath: string): Promise<PdfListResult> {
  if (!uncPath || uncPath.trim() === "") {
    return { success: false, error: "Please enter a UNC path" };
  }

  // Normalize the path (handle both forward and back slashes)
  const normalizedPath = uncPath.trim();

  try {
    // Check if directory exists
    const stats = await fs.stat(normalizedPath);
    if (!stats.isDirectory()) {
      return { success: false, error: "The specified path is not a directory" };
    }

    // Read directory contents
    const entries = await fs.readdir(normalizedPath, { withFileTypes: true });

    // Filter for PDF files only
    const pdfFiles: PdfFile[] = [];

    // Threshold for "small" files (potentially blank) - 5KB
    const SMALL_FILE_THRESHOLD = 5000;

    for (const entry of entries) {
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        const filePath = path.join(normalizedPath, entry.name);
        const fileStats = await fs.stat(filePath);

        // Parse the filename
        const parsed = parsePdfFilename(entry.name);

        pdfFiles.push({
          name: entry.name,
          size: fileStats.size,
          modifiedAt: fileStats.mtime.toISOString(),
          mailType: parsed.mailType,
          user: parsed.user,
          createdDate: parsed.createdDate,
          createdTime: parsed.createdTime,
          isSmallFile: fileStats.size < SMALL_FILE_THRESHOLD,
          rawFilename: parsed.rawFilename,
        });
      }
    }

    // Sort by creation date/time descending (newest first), fallback to name
    pdfFiles.sort((a, b) => {
      if (a.createdDate && b.createdDate) {
        const dateCompare = b.createdDate.localeCompare(a.createdDate);
        if (dateCompare !== 0) return dateCompare;
        if (a.createdTime && b.createdTime) {
          return b.createdTime.localeCompare(a.createdTime);
        }
      }
      return a.name.localeCompare(b.name);
    });

    // Get first 3 filenames for debugging
    const sampleFilenames = pdfFiles.slice(0, 3).map((f) => f.name);

    return {
      success: true,
      files: pdfFiles,
      path: normalizedPath,
      sampleFilenames,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (errorMessage.includes("ENOENT")) {
      return { success: false, error: "Path not found or not accessible" };
    }
    if (errorMessage.includes("EACCES") || errorMessage.includes("EPERM")) {
      return { success: false, error: "Access denied to the specified path" };
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Format a username (firstname.lastname) into a display name
 */
function formatDisplayName(username: string | null): string | null {
  if (!username) return null;

  const specialPrefixes = ["mc", "mac", "o'", "de", "van", "von", "la", "le"];

  const formatNamePart = (part: string): string => {
    if (part.includes("-")) {
      return part
        .split("-")
        .map((p) => formatNamePart(p))
        .join("-");
    }

    const lower = part.toLowerCase();

    for (const prefix of specialPrefixes) {
      if (lower.startsWith(prefix) && lower.length > prefix.length) {
        const rest = part.slice(prefix.length);
        const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        const formattedRest = rest.charAt(0).toUpperCase() + rest.slice(1).toLowerCase();
        return formattedPrefix + formattedRest;
      }
    }

    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  };

  const parts = username.split(".");
  if (parts.length >= 2) {
    const firstName = formatNamePart(parts[0]);
    const lastName = formatNamePart(parts.slice(1).join(" "));
    return `${firstName} ${lastName}`;
  }

  return formatNamePart(username);
}

/**
 * Save PDF files to the MySQL database (Full Sync)
 * - Inserts new files
 * - Updates existing files
 * - Deletes files no longer in the folder
 */
export async function savePdfFilesToDatabase(
  files: PdfFile[],
  uncPath: string,
  queueType: "certified" | "regular" = "certified",
  skipLog: boolean = false
): Promise<SaveToDatabaseResult> {
  const scanned = files.length;
  
  // Get MySQL config
  const configResult = await getConfig();
  if (!configResult.success || !configResult.config) {
    if (!skipLog) {
      await addSyncLog({
        queueType,
        uncPath,
        filesScanned: scanned,
        filesAdded: 0,
        filesUpdated: 0,
        filesDeleted: 0,
        errors: 1,
        status: "error",
        message: "Failed to load database configuration",
      });
    }
    return { success: false, message: "Failed to load database configuration", scanned };
  }

  const config = configResult.config;

  if (!config.mysqlHost || !config.mysqlDatabase || !config.mysqlUser) {
    if (!skipLog) {
      await addSyncLog({
        queueType,
        uncPath,
        filesScanned: scanned,
        filesAdded: 0,
        filesUpdated: 0,
        filesDeleted: 0,
        errors: 1,
        status: "error",
        message: "MySQL database is not configured",
      });
    }
    return {
      success: false,
      message: "MySQL database is not configured. Please configure it in Settings.",
      scanned,
    };
  }

  let connection: mysql.Connection | null = null;
  let inserted = 0;
  let updated = 0;
  let deleted = 0;
  let errors = 0;

  try {
    connection = await mysql.createConnection({
      host: config.mysqlHost,
      port: parseInt(config.mysqlPort) || 3306,
      database: config.mysqlDatabase,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      connectTimeout: 10000,
    });

    // Start transaction for atomic operation
    await connection.beginTransaction();

    try {
      // Get current filenames in the database for this UNC path
      const [existingRows] = await connection.execute<mysql.RowDataPacket[]>(
        `SELECT filename FROM mail_portal_outgoing_mail WHERE unc_path = ?`,
        [uncPath]
      );
      const existingFilenames = new Set(existingRows.map((row) => row.filename));

      // Track filenames we're inserting/updating
      const currentFilenames = new Set(files.map((f) => f.name));

      // Insert or update each file
      for (const file of files) {
        try {
          const displayName = formatDisplayName(file.user);
          const isExisting = existingFilenames.has(file.name);

          const [result] = await connection.execute<mysql.ResultSetHeader>(
            `INSERT INTO mail_portal_outgoing_mail 
             (filename, mail_type, created_by_username, created_by_name, creation_date, creation_time, file_size, file_modified_at, is_small_file, unc_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               mail_type = VALUES(mail_type),
               created_by_username = VALUES(created_by_username),
               created_by_name = VALUES(created_by_name),
               creation_date = VALUES(creation_date),
               creation_time = VALUES(creation_time),
               file_size = VALUES(file_size),
               file_modified_at = VALUES(file_modified_at),
               is_small_file = VALUES(is_small_file)`,
            [
              file.name,
              file.mailType,
              file.user,
              displayName,
              file.createdDate,
              file.createdTime,
              file.size,
              new Date(file.modifiedAt),
              file.isSmallFile ? 1 : 0,
              uncPath,
            ]
          );

          // affectedRows: 1 = inserted, 2 = updated (MySQL returns 2 for ON DUPLICATE KEY UPDATE)
          if (result.affectedRows === 1 && !isExisting) {
            inserted++;
          } else {
            updated++;
          }
        } catch (err) {
          console.error(`Error inserting/updating ${file.name}:`, err);
          errors++;
        }
      }

      // Delete files that are no longer in the folder
      const filesToDelete = [...existingFilenames].filter(
        (filename) => !currentFilenames.has(filename)
      );

      if (filesToDelete.length > 0) {
        const placeholders = filesToDelete.map(() => "?").join(", ");
        const [deleteResult] = await connection.execute<mysql.ResultSetHeader>(
          `DELETE FROM mail_portal_outgoing_mail WHERE unc_path = ? AND filename IN (${placeholders})`,
          [uncPath, ...filesToDelete]
        );
        deleted = deleteResult.affectedRows;
      }

      // Commit transaction
      await connection.commit();

      // Build result message
      const parts: string[] = [];
      if (inserted > 0) parts.push(`${inserted} added`);
      if (updated > 0) parts.push(`${updated} updated`);
      if (deleted > 0) parts.push(`${deleted} removed`);
      if (errors > 0) parts.push(`${errors} error(s)`);

      const message = parts.length > 0 
        ? `Sync complete: ${parts.join(", ")}.`
        : "No changes to sync.";

      // Log the sync operation
      if (!skipLog) {
        await addSyncLog({
          queueType,
          uncPath,
          filesScanned: scanned,
          filesAdded: inserted,
          filesUpdated: updated,
          filesDeleted: deleted,
          errors,
          status: errors > 0 ? "partial" : "success",
          message,
        });
      }

      return {
        success: true,
        message,
        inserted,
        updated,
        deleted,
        errors,
        scanned,
      };
    } catch (err) {
      // Rollback on error
      await connection.rollback();
      throw err;
    }
  } catch (error) {
    let message = "Failed to save to database";

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        message = "Cannot connect to MySQL server. Is it running?";
      } else if (error.message.includes("Access denied")) {
        message = "Database access denied. Check your credentials.";
      } else if (error.message.includes("doesn't exist")) {
        message = "Table 'mail_portal_outgoing_mail' does not exist. Please create it first.";
      } else {
        message = error.message;
      }
    }

    // Log the error
    if (!skipLog) {
      await addSyncLog({
        queueType,
        uncPath,
        filesScanned: scanned,
        filesAdded: inserted,
        filesUpdated: updated,
        filesDeleted: deleted,
        errors: errors + 1,
        status: "error",
        message,
      });
    }

    return { success: false, message, scanned };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
