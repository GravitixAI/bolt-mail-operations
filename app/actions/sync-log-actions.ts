"use server";

import { db, initDB } from "@/lib/db";
import { syncLog, type SyncLog } from "@/lib/db/schema";
import { desc, lt } from "drizzle-orm";

// Initialize DB on first load
initDB();

export interface SyncLogEntry {
  id: number;
  queueType: string;
  uncPath: string;
  filesScanned: number;
  filesAdded: number;
  filesUpdated: number;
  filesDeleted: number;
  errors: number;
  status: string;
  message: string | null;
  syncedAt: Date;
}

export interface AddSyncLogParams {
  queueType: "certified" | "regular";
  uncPath: string;
  filesScanned: number;
  filesAdded: number;
  filesUpdated: number;
  filesDeleted: number;
  errors: number;
  status: "success" | "error" | "partial";
  message?: string;
}

/**
 * Add a new sync log entry
 */
export async function addSyncLog(params: AddSyncLogParams): Promise<void> {
  const now = new Date();

  await db.insert(syncLog).values({
    queueType: params.queueType,
    uncPath: params.uncPath,
    filesScanned: params.filesScanned,
    filesAdded: params.filesAdded,
    filesUpdated: params.filesUpdated,
    filesDeleted: params.filesDeleted,
    errors: params.errors,
    status: params.status,
    message: params.message || null,
    syncedAt: now,
  });

  // Clean up old logs after adding new one
  await cleanupOldLogs();
}

/**
 * Get recent sync logs (last 24 hours by default)
 */
export async function getSyncLogs(limit: number = 100): Promise<SyncLogEntry[]> {
  // First, clean up old logs
  await cleanupOldLogs();

  const logs = await db
    .select()
    .from(syncLog)
    .orderBy(desc(syncLog.syncedAt))
    .limit(limit);

  return logs.map((log) => ({
    id: log.id,
    queueType: log.queueType,
    uncPath: log.uncPath,
    filesScanned: log.filesScanned,
    filesAdded: log.filesAdded,
    filesUpdated: log.filesUpdated,
    filesDeleted: log.filesDeleted,
    errors: log.errors,
    status: log.status,
    message: log.message,
    syncedAt: log.syncedAt,
  }));
}

/**
 * Clean up logs older than 24 hours
 */
export async function cleanupOldLogs(): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db
    .delete(syncLog)
    .where(lt(syncLog.syncedAt, twentyFourHoursAgo));

  return result.changes;
}

