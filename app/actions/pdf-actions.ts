"use server";

import fs from "fs/promises";
import path from "path";

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
