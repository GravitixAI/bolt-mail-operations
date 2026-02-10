"use client";

import { useEffect, useRef } from "react";
import { runAutoSync, getAutoSyncStatus } from "@/app/actions/auto-sync-actions";

interface AutoSyncProviderProps {
  children: React.ReactNode;
}

export function AutoSyncProvider({ children }: AutoSyncProviderProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const settingsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncingRef = useRef(false);
  const enabledRef = useRef(false);
  const intervalRef = useRef(5);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    const performSync = async () => {
      if (syncingRef.current) {
        console.log("[Auto-Sync] Sync already in progress, skipping");
        return;
      }

      syncingRef.current = true;
      console.log(`[Auto-Sync] Running sync at ${new Date().toLocaleTimeString()}`);

      try {
        const result = await runAutoSync();
        console.log(`[Auto-Sync] Complete: ${result.message}`);
      } catch (error) {
        console.error("[Auto-Sync] Error:", error);
      } finally {
        syncingRef.current = false;
      }
    };

    const setupTimer = () => {
      // Clear existing sync timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (!enabledRef.current) {
        console.log("[Auto-Sync] Disabled");
        return;
      }

      const intervalMs = intervalRef.current * 60 * 1000;
      console.log(`[Auto-Sync] Enabled, running every ${intervalRef.current} minute(s)`);

      // Run immediately
      performSync();

      // Setup interval for subsequent runs
      timerRef.current = setInterval(() => {
        performSync();
      }, intervalMs);
    };

    const loadSettings = async () => {
      try {
        const status = await getAutoSyncStatus();
        const settingsChanged = 
          enabledRef.current !== status.enabled || 
          intervalRef.current !== status.interval;

        enabledRef.current = status.enabled;
        intervalRef.current = status.interval;

        // Only restart timer if settings changed
        if (settingsChanged) {
          console.log(`[Auto-Sync] Settings changed - enabled: ${status.enabled}, interval: ${status.interval}min`);
          setupTimer();
        }
      } catch (error) {
        console.error("[Auto-Sync] Failed to load settings:", error);
      }
    };

    // Initial load and setup
    loadSettings();

    // Poll for settings changes every 30 seconds
    settingsTimerRef.current = setInterval(() => {
      loadSettings();
    }, 30000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (settingsTimerRef.current) {
        clearInterval(settingsTimerRef.current);
        settingsTimerRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
