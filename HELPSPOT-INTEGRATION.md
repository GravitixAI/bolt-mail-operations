# HelpSpot Integration API

This document describes how to integrate with the BOLT Mail Operations server's HelpSpot removal request API endpoint.

## Overview

The BOLT Mail Operations server provides an API endpoint for requesting removal of PDF files from the mail queue. When called, it creates a HelpSpot ticket on behalf of the user, replicating the functionality of the legacy `helpspot_ticket.php` script.

## API Endpoint

### POST `/api/pdf/removal-request`

Creates a HelpSpot ticket to request removal of a PDF file from the mail queue.

#### Request

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "filename": "MailCert_John.Doe_20260211-120000.pdf",
  "queue": "certified",
  "userEmail": "john.doe@cadcollin.org"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | The PDF filename to request removal for. Must end with `.pdf` and cannot contain path separators. |
| `queue` | string | Yes | Which queue the file is in. Must be either `"certified"` or `"regular"`. |
| `userEmail` | string | Yes | The requesting user's email address. Must be a valid email format. |

#### Response

**Success (201 Created):**

```json
{
  "success": true,
  "message": "Removal request submitted successfully. Please check your email for confirmation.",
  "ticketId": "12345"
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid request body, missing fields, or invalid filename/queue |
| 404 | File not found in database |
| 500 | Server error (HelpSpot not configured, API error, etc.) |

**Error Response Format:**

```json
{
  "success": false,
  "error": "Error description here"
}
```

## Client Integration Example

### JavaScript/TypeScript (React/Next.js)

```typescript
interface RemovalRequestResponse {
  success: boolean;
  message?: string;
  ticketId?: string;
  error?: string;
}

async function requestFileRemoval(
  filename: string,
  queue: "certified" | "regular",
  userEmail: string
): Promise<RemovalRequestResponse> {
  const response = await fetch("/api/pdf/removal-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      queue,
      userEmail,
    }),
  });

  return response.json();
}

// Usage example
const handleTrashClick = async (filename: string, queue: "certified" | "regular") => {
  // Get user email from your authentication system
  const userEmail = getCurrentUserEmail(); // Implement based on your auth system
  
  try {
    const result = await requestFileRemoval(filename, queue, userEmail);
    
    if (result.success) {
      // Show success message to user
      alert(result.message);
      // Optionally refresh the file list
    } else {
      // Show error message
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert("Failed to submit removal request. Please try again.");
  }
};
```

### React Component Example

```tsx
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface TrashButtonProps {
  filename: string;
  queue: "certified" | "regular";
  userEmail: string;
  onSuccess?: () => void;
}

export function TrashButton({ filename, queue, userEmail, onSuccess }: TrashButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!confirm(`Are you sure you want to request removal of ${filename}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/pdf/removal-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, queue, userEmail }),
      });

      const result = await response.json();

      if (result.success) {
        alert("A helpdesk ticket was created on your behalf. Please check your email for confirmation.");
        onSuccess?.();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Failed to submit removal request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 hover:bg-gray-100 rounded"
      title="Request removal"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-red-500" />
      )}
    </button>
  );
}
```

## Proxy Configuration

If your client application uses a proxy to forward requests to the BOLT Mail Operations server, ensure the `/api/pdf/removal-request` path is included in your proxy configuration.

### IIS web.config Example

```xml
<rewrite>
  <rules>
    <rule name="BOLT Mail Operations API" stopProcessing="true">
      <match url="^api/pdf/(.*)" />
      <action type="Rewrite" url="http://bolt-server:3000/api/pdf/{R:1}" />
    </rule>
  </rules>
</rewrite>
```

### Next.js rewrites Example

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/pdf/:path*',
        destination: 'http://bolt-server:3000/api/pdf/:path*',
      },
    ];
  },
};
```

## User Email Handling

The `userEmail` field should be populated with the authenticated user's email address. This is used to:

1. Set the requester email on the HelpSpot ticket
2. Send confirmation emails to the user

### Getting User Email from Windows Authentication

If using Windows Authentication (like the original PHP application), the client needs to extract the user email from the authentication context.

**PHP (original method):**
```php
$user = str_replace("CADCOLLIN\\", "", $_SERVER['AUTH_USER']) . '@cadcollin.org';
```

**JavaScript equivalent (if AUTH_USER is available via headers):**
```javascript
// If your proxy passes the AUTH_USER header
const authUser = request.headers.get('x-auth-user') || '';
const userEmail = authUser.replace('CADCOLLIN\\', '') + '@cadcollin.org';
```

## Security Notes

1. **File Verification**: The API verifies that the requested file exists in the database before creating a ticket. This prevents arbitrary file removal requests.

2. **Filename Validation**: The API rejects filenames containing path traversal characters (`..`, `/`, `\`).

3. **Queue Validation**: Only `"certified"` and `"regular"` are accepted as valid queue values.

4. **HelpSpot Credentials**: API credentials are stored on the server and not exposed to clients.

## Workflow Summary

1. User clicks trash icon on a PDF file in the mail queue view
2. Client sends POST request to `/api/pdf/removal-request`
3. Server validates the request and verifies the file exists
4. Server creates a HelpSpot ticket via the HelpSpot API
5. HelpSpot sends confirmation email to the user
6. Help desk staff processes the ticket and removes the file
7. User is notified of completion

This workflow maintains the same user experience as the original PHP implementation while centralizing the HelpSpot integration in the BOLT Mail Operations server.
