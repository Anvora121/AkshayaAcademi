import { google, Auth } from 'googleapis';
import { Readable } from 'stream';

function getAuthClient(): Auth.GoogleAuth {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Google Drive credentials not configured. Set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in .env'
    );
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
}

export interface DriveUploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink: string;
}

/**
 * Upload a file buffer to Google Drive and make it publicly readable.
 * Returns the file's webViewLink (open in browser) and webContentLink (direct download).
 */
export async function uploadToDrive(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
  folderId: string
): Promise<DriveUploadResult> {
  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  // Convert buffer to a readable stream
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);

  // Upload the file
  const uploadResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: readable,
    },
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = uploadResponse.data.id!;

  // Make the file publicly readable (anyone with the link can view)
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Fetch updated metadata with links
  const meta = await drive.files.get({
    fileId,
    fields: 'id, webViewLink, webContentLink',
  });

  return {
    fileId: meta.data.id!,
    webViewLink: meta.data.webViewLink!,
    webContentLink: meta.data.webContentLink ?? meta.data.webViewLink!,
  };
}
