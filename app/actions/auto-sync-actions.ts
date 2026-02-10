"use server";

import { getConfig } from "./config-actions";
import { listPdfFiles, savePdfFilesToDatabase } from "./pdf-actions";
import { addSyncLog } from "./sync-log-actions";
import { logEvent, logError, logWarning } from "@/lib/logger";

export interface AutoSyncResult {
  success: boolean;
  certifiedResult?: {
    success: boolean;
    message: string;
    scanned: number;
  };
  regularResult?: {
    success: boolean;
    message: string;
    scanned: number;
  };
  message: string;
}

/**
 * Run auto-sync for both mail queues
 */
export async function runAutoSync(): Promise<AutoSyncResult> {
  logEvent("Auto-sync started", { trigger: "scheduled" });

  const configResult = await getConfig();
  
  if (!configResult.success || !configResult.config) {
    logError("Auto-sync failed to load configuration");
    return {
      success: false,
      message: "Failed to load configuration",
    };
  }

  const config = configResult.config;

  // Check if auto-sync is enabled
  if (!config.autoSyncEnabled) {
    logWarning("Auto-sync triggered but disabled");
    return {
      success: false,
      message: "Auto-sync is disabled",
    };
  }

  const results: AutoSyncResult = {
    success: true,
    message: "",
  };

  // Sync Certified Mail Queue
  if (config.uncPathCertified) {
    try {
      const listResult = await listPdfFiles(config.uncPathCertified);
      
      if (listResult.success && listResult.files) {
        const saveResult = await savePdfFilesToDatabase(
          listResult.files,
          config.uncPathCertified,
          "certified",
          false // Don't skip logging
        );
        
        logEvent("Certified mail sync completed", {
          filesScanned: listResult.files.length,
          success: saveResult.success,
        });
        
        results.certifiedResult = {
          success: saveResult.success,
          message: saveResult.message,
          scanned: listResult.files.length,
        };
      } else {
        const errorMsg = listResult.error || "Failed to list PDF files";
        logError(errorMsg, { queueType: "certified", uncPath: config.uncPathCertified });
        
        // Log the error
        await addSyncLog({
          queueType: "certified",
          uncPath: config.uncPathCertified,
          filesScanned: 0,
          filesAdded: 0,
          filesUpdated: 0,
          filesDeleted: 0,
          errors: 1,
          status: "error",
          message: errorMsg,
        });
        
        results.certifiedResult = {
          success: false,
          message: errorMsg,
          scanned: 0,
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logError(error instanceof Error ? error : new Error(message), {
        queueType: "certified",
        uncPath: config.uncPathCertified,
      });
      
      await addSyncLog({
        queueType: "certified",
        uncPath: config.uncPathCertified,
        filesScanned: 0,
        filesAdded: 0,
        filesUpdated: 0,
        filesDeleted: 0,
        errors: 1,
        status: "error",
        message,
      });
      
      results.certifiedResult = {
        success: false,
        message,
        scanned: 0,
      };
    }
  }

  // Sync Regular Mail Queue
  if (config.uncPathRegular) {
    try {
      const listResult = await listPdfFiles(config.uncPathRegular);
      
      if (listResult.success && listResult.files) {
        const saveResult = await savePdfFilesToDatabase(
          listResult.files,
          config.uncPathRegular,
          "regular",
          false // Don't skip logging
        );
        
        logEvent("Regular mail sync completed", {
          filesScanned: listResult.files.length,
          success: saveResult.success,
        });
        
        results.regularResult = {
          success: saveResult.success,
          message: saveResult.message,
          scanned: listResult.files.length,
        };
      } else {
        const errorMsg = listResult.error || "Failed to list PDF files";
        logError(errorMsg, { queueType: "regular", uncPath: config.uncPathRegular });
        
        await addSyncLog({
          queueType: "regular",
          uncPath: config.uncPathRegular,
          filesScanned: 0,
          filesAdded: 0,
          filesUpdated: 0,
          filesDeleted: 0,
          errors: 1,
          status: "error",
          message: errorMsg,
        });
        
        results.regularResult = {
          success: false,
          message: errorMsg,
          scanned: 0,
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logError(error instanceof Error ? error : new Error(message), {
        queueType: "regular",
        uncPath: config.uncPathRegular,
      });
      
      await addSyncLog({
        queueType: "regular",
        uncPath: config.uncPathRegular,
        filesScanned: 0,
        filesAdded: 0,
        filesUpdated: 0,
        filesDeleted: 0,
        errors: 1,
        status: "error",
        message,
      });
      
      results.regularResult = {
        success: false,
        message,
        scanned: 0,
      };
    }
  }

  // Build summary message
  const parts: string[] = [];
  if (results.certifiedResult) {
    parts.push(`Certified: ${results.certifiedResult.success ? "OK" : "Failed"}`);
  }
  if (results.regularResult) {
    parts.push(`Regular: ${results.regularResult.success ? "OK" : "Failed"}`);
  }
  
  results.message = parts.length > 0 ? parts.join(", ") : "No queues configured";
  results.success = 
    (results.certifiedResult?.success ?? true) && 
    (results.regularResult?.success ?? true);

  logEvent("Auto-sync completed", {
    success: results.success,
    message: results.message,
    certifiedScanned: results.certifiedResult?.scanned ?? 0,
    regularScanned: results.regularResult?.scanned ?? 0,
  });

  return results;
}

/**
 * Get auto-sync status
 */
export async function getAutoSyncStatus(): Promise<{
  enabled: boolean;
  interval: number;
}> {
  const configResult = await getConfig();
  
  if (!configResult.success || !configResult.config) {
    return { enabled: false, interval: 5 };
  }

  return {
    enabled: configResult.config.autoSyncEnabled,
    interval: configResult.config.autoSyncInterval,
  };
}
