"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavLink } from "@/components/navbar";
import { Mail, Settings } from "lucide-react";
import { MailQueueView } from "@/components/mail-queue-view";
import { ConfigModal } from "@/components/config-modal";
import { getConfig, type ConfigValues } from "@/app/actions/config-actions";

export default function RegularMailPage() {
  const [uncPath, setUncPath] = useState("");
  const [configLoaded, setConfigLoaded] = useState(false);

  // Load saved UNC path on mount
  useEffect(() => {
    const loadSavedConfig = async () => {
      try {
        const configResult = await getConfig();
        if (configResult.success && configResult.config?.uncPathRegular) {
          setUncPath(configResult.config.uncPathRegular);
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      } finally {
        setConfigLoaded(true);
      }
    };
    loadSavedConfig();
  }, []);

  const handleConfigSaved = (config: ConfigValues) => {
    if (config.uncPathRegular) {
      setUncPath(config.uncPathRegular);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        logo={<Mail className="h-8 w-8 text-primary" />}
        title="BOLT Mail Operations"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/pdf-browser">Certified Mail</NavLink>
        <NavLink href="/regular-mail" active>
          Regular Mail
        </NavLink>
        <NavLink href="/sync-log">Sync Log</NavLink>
        <ConfigModal
          trigger={
            <button className="p-2 rounded-md hover:bg-accent transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          }
          onConfigSaved={handleConfigSaved}
        />
      </Navbar>

      <div className="container py-8">
        {configLoaded && (
          <MailQueueView
            title="Regular Mail PDF Queue"
            description="Enter a UNC path to list all PDF files in the regular mail directory"
            defaultPath={uncPath}
            queueType="regular"
          />
        )}
      </div>
    </div>
  );
}
