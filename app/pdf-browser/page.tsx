"use client";

import * as React from "react";
import { useState } from "react";
import { Navbar, NavLink } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, FolderOpen, FileText, Loader2, AlertCircle, AlertTriangle, Eye } from "lucide-react";
import { listPdfFiles, type PdfFile, type PdfListResult } from "@/app/actions/pdf-actions";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Format a username (firstname.lastname) into a display name
 * Handles various casing scenarios:
 * - all lowercase: john.smith -> John Smith
 * - ALL CAPS: JOHN.SMITH -> John Smith
 * - Already proper: John.Smith -> John Smith
 * - Pascal case preserved: rejana.macdonald -> Rejana MacDonald
 */
function formatDisplayName(username: string | null): string | null {
  if (!username) return null;

  // Common name prefixes that should remain lowercase followed by capital
  const specialPrefixes = ["mc", "mac", "o'", "de", "van", "von", "la", "le"];

  const formatNamePart = (part: string): string => {
    // Handle hyphenated names (e.g., Bona-Palma)
    if (part.includes("-")) {
      return part
        .split("-")
        .map((p) => formatNamePart(p))
        .join("-");
    }

    const lower = part.toLowerCase();

    // Check for special prefixes (Mc, Mac, O', etc.)
    for (const prefix of specialPrefixes) {
      if (lower.startsWith(prefix) && lower.length > prefix.length) {
        const rest = part.slice(prefix.length);
        // Capitalize the prefix properly and the next letter
        const formattedPrefix =
          prefix.charAt(0).toUpperCase() + prefix.slice(1);
        const formattedRest = rest.charAt(0).toUpperCase() + rest.slice(1).toLowerCase();
        return formattedPrefix + formattedRest;
      }
    }

    // Standard capitalization: first letter upper, rest lower
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  };

  const parts = username.split(".");
  if (parts.length >= 2) {
    const firstName = formatNamePart(parts[0]);
    const lastName = formatNamePart(parts.slice(1).join(" ")); // Handle middle names if any
    return `${firstName} ${lastName}`;
  }

  return formatNamePart(username);
}

export default function PdfBrowserPage() {
  const [uncPath, setUncPath] = useState("");
  const [result, setResult] = useState<PdfListResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = await listPdfFiles(uncPath);
      setResult(data);
    } catch {
      setResult({ success: false, error: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = (file: PdfFile) => {
    // Open the PDF in a new window
    const fullPath = `${result?.path}\\${file.name}`;
    // For UNC paths, we'll need to use file:// protocol
    const fileUrl = `file:///${fullPath.replace(/\\/g, "/")}`;
    window.open(fileUrl, "pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        logo={<Mail className="h-8 w-8 text-primary" />}
        title="BOLT Mail Operations"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/pdf-browser" active>
          PDF Browser
        </NavLink>
      </Navbar>

      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-6 w-6" />
              Certified Mail PDF Queue
            </CardTitle>
            <CardDescription>
              Enter a UNC path to list all PDF files in that directory (e.g., \\wart\PDF_Output\Mail_Certified)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                placeholder="\\server\share\folder"
                value={uncPath}
                onChange={(e) => setUncPath(e.target.value)}
                className="flex-1 font-mono"
              />
              <Button type="submit" disabled={loading || !uncPath.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    List PDFs
                  </>
                )}
              </Button>
            </form>

            {result && !result.success && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{result.error}</span>
              </div>
            )}

            {result && result.success && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Path: <code className="bg-muted px-2 py-1 rounded">{result.path}</code>
                  </p>
                  <Badge variant="secondary">
                    {result.files?.length || 0} PDF{result.files?.length !== 1 ? "s" : ""} in queue
                  </Badge>
                </div>

                {/* Debug: Show sample filenames */}
                {result.sampleFilenames && result.sampleFilenames.length > 0 && (
                  <div className="p-3 bg-muted rounded-lg text-xs font-mono">
                    <p className="font-semibold mb-1">Sample filenames (for debugging):</p>
                    {result.sampleFilenames.map((name, i) => (
                      <p key={i} className="text-muted-foreground">{name}</p>
                    ))}
                  </div>
                )}

                {result.files && result.files.length > 0 ? (
                  <TooltipProvider>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px] text-center">View</TableHead>
                            <TableHead>Type of Mail</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Creation Date</TableHead>
                            <TableHead>Creation Time</TableHead>
                            <TableHead className="w-[100px] text-right">Size</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.files.map((file) => (
                            <TableRow
                              key={file.name}
                              className={`cursor-pointer hover:bg-accent ${
                                file.isSmallFile ? "bg-yellow-100 dark:bg-yellow-900/30" : ""
                              }`}
                              onClick={() => handleOpenPdf(file)}
                            >
                              <TableCell className="text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenPdf(file);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 text-primary" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Click to view PDF</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-red-500" />
                                  {file.mailType ? (
                                    file.mailType
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <span className="text-muted-foreground italic underline decoration-dotted cursor-help">
                                          Unknown
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="max-w-md">
                                        <p className="font-semibold mb-1">Unparsed filename:</p>
                                        <p className="font-mono text-xs break-all">{file.name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {file.isSmallFile && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Small file - may be blank or corrupted</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground">
                                {file.user || (
                                  <span className="italic">Unknown</span>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatDisplayName(file.user) || (
                                  <span className="text-muted-foreground italic">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {file.createdDate || (
                                  <span className="text-muted-foreground italic">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {file.createdTime || (
                                  <span className="text-muted-foreground italic">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {formatFileSize(file.size)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TooltipProvider>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No PDF files found in this directory</p>
                  </div>
                )}

                {result.files && result.files.length > 0 && (
                  <p className="text-sm text-muted-foreground text-right">
                    There {result.files.length === 1 ? "is" : "are"}{" "}
                    <strong>{result.files.length}</strong> PDF
                    {result.files.length !== 1 ? "s" : ""} in the queue.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
