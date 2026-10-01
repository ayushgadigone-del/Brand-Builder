import { GeneratedShot, MediumDef, ProductBrand } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface DriveUploadedFile {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink?: string;
  thumbnailLink?: string;
  mediumName: string;
  aspectRatio: string;
  sizeBytes?: number;
}

export interface DriveBatchExportResult {
  folderId: string;
  folderName: string;
  folderUrl: string;
  savedFiles: DriveUploadedFile[];
  timestamp: number;
}

/**
 * Searches for an existing folder by name or creates a new designated folder in Google Drive.
 */
export async function findOrCreateDesignatedFolder(
  folderName: string,
  accessToken: string
): Promise<DriveFolderInfo> {
  const sanitizedName = folderName.trim() || 'Brand Studio - High-Res Renders';
  const query = `mimeType = 'application/vnd.google-apps.folder' and name = '${sanitizedName.replace(/'/g, "\\'")}' and trashed = false`;

  try {
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        query
      )}&fields=files(id,name,webViewLink)&pageSize=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!listRes.ok) {
      const errBody = await listRes.text();
      console.warn('Google Drive search failed, attempting creation:', errBody);
    } else {
      const listData = await listRes.json();
      if (listData.files && listData.files.length > 0) {
        const found = listData.files[0];
        return {
          id: found.id,
          name: found.name,
          webViewLink: found.webViewLink || `https://drive.google.com/drive/folders/${found.id}`,
        };
      }
    }

    // Folder doesn't exist yet; create it
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizedName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Designated folder for Brand Studio campaign renders and high-resolution commercial assets.',
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Failed to create Google Drive folder: ${createRes.status} ${errorText}`);
    }

    const createdData = await createRes.json();
    return {
      id: createdData.id,
      name: createdData.name,
      webViewLink: createdData.webViewLink || `https://drive.google.com/drive/folders/${createdData.id}`,
    };
  } catch (error: any) {
    console.error('Error finding or creating folder in Google Drive:', error);
    throw error;
  }
}

/**
 * Converts a base64 Data URL or remote image URL into a Blob.
 */
async function urlToBlob(imageUrl: string): Promise<Blob> {
  if (imageUrl.startsWith('data:')) {
    const arr = imageUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image blob: ${res.statusText}`);
  }
  return await res.blob();
}

/**
 * Uploads a single high-resolution image asset into a designated Google Drive folder.
 */
export async function uploadImageAssetToDrive(options: {
  imageUrl: string;
  fileName: string;
  folderId?: string;
  description?: string;
  accessToken: string;
}): Promise<DriveUploadedFile & { sizeBytes: number }> {
  const { imageUrl, fileName, folderId, description, accessToken } = options;

  const imageBlob = await urlToBlob(imageUrl);
  const mimeType = imageBlob.type || 'image/png';

  const metadata = {
    name: fileName,
    mimeType: mimeType,
    ...(folderId ? { parents: [folderId] } : {}),
    description: description || 'High-resolution commercial product rendering generated with locked Visual DNA in Brand Studio',
  };

  const boundary = '-------BrandStudioUploadBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metaHeader = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const metaPart = new Blob([metaHeader], { type: 'text/plain' });
  const mediaHeaderPart = new Blob([mediaHeader], { type: 'text/plain' });
  const closePart = new Blob([closeDelimiter], { type: 'text/plain' });

  const multipartBody = new Blob([metaPart, mediaHeaderPart, imageBlob, closePart], {
    type: `multipart/related; boundary=${boundary}`,
  });

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Google Drive upload failed (${uploadRes.status}): ${errorText}`);
  }

  const uploadedData = await uploadRes.json();

  return {
    id: uploadedData.id,
    name: uploadedData.name,
    webViewLink: uploadedData.webViewLink || `https://drive.google.com/file/d/${uploadedData.id}/view`,
    webContentLink: uploadedData.webContentLink,
    thumbnailLink: uploadedData.thumbnailLink,
    mediumName: '',
    aspectRatio: '',
    sizeBytes: imageBlob.size,
  };
}

/**
 * Saves an entire batch of generated shots to a designated Google Drive folder.
 */
export async function saveBatchToGoogleDrive(options: {
  brand: ProductBrand;
  batchName?: string;
  folderName: string;
  shots: GeneratedShot[];
  mediums: MediumDef[];
  accessToken: string;
  userId?: string;
  onProgress?: (current: number, total: number, itemName: string) => void;
}): Promise<DriveBatchExportResult> {
  const { brand, batchName, folderName, shots, mediums, accessToken, userId, onProgress } = options;

  // Filter completed shots with valid image URLs
  const completedShots = shots.filter((s) => s.status === 'completed' && s.imageUrl);
  if (completedShots.length === 0) {
    throw new Error('No completed images found in this batch to save.');
  }

  // 1. Locate or create designated Google Drive folder
  const folder = await findOrCreateDesignatedFolder(folderName, accessToken);

  const savedFiles: DriveUploadedFile[] = [];

  // 2. Upload each high-resolution shot sequentially
  for (let i = 0; i < completedShots.length; i++) {
    const shot = completedShots[i];
    const medium = mediums.find((m) => m.id === shot.mediumId);
    const mediumTitle = medium ? medium.name : shot.mediumName || 'Shot';
    const ratioClean = (shot.aspectRatio || '1:1').replace(':', 'x');

    const cleanBrandName = (brand.name || 'Brand').replace(/[/\\?%*:|"<>]/g, '-');
    const cleanMediumName = mediumTitle.replace(/[/\\?%*:|"<>]/g, '-');
    const fileName = `${cleanBrandName} - ${cleanMediumName} (${ratioClean}) - HighRes.png`;

    if (onProgress) {
      onProgress(i + 1, completedShots.length, fileName);
    }

    const description = `High-Resolution Commercial Asset\nProduct: ${brand.name}\nCategory: ${brand.category}\nMedium: ${mediumTitle} (${shot.aspectRatio})\nLighting Mood: ${shot.lightingMood || 'Studio'}\nVisual DNA Lock: ${brand.visualDnaLock || 'N/A'}`;

    try {
      const uploaded = await uploadImageAssetToDrive({
        imageUrl: shot.imageUrl!,
        fileName,
        folderId: folder.id,
        description,
        accessToken,
      });

      savedFiles.push({
        ...uploaded,
        mediumName: mediumTitle,
        aspectRatio: shot.aspectRatio,
      });
    } catch (uploadErr: any) {
      console.error(`Failed to upload ${fileName} to Drive:`, uploadErr);
      throw new Error(`Failed to upload ${fileName}: ${uploadErr.message}`);
    }
  }

  const exportResult: DriveBatchExportResult = {
    folderId: folder.id,
    folderName: folder.name,
    folderUrl: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
    savedFiles,
    timestamp: Date.now(),
  };

  // 3. Persist export log to Firestore if user is authenticated
  if (userId) {
    try {
      const exportDocRef = doc(collection(db, 'users', userId, 'driveExports'));
      await setDoc(exportDocRef, {
        userId,
        folderId: folder.id,
        folderName: folder.name,
        folderUrl: exportResult.folderUrl,
        assetCount: savedFiles.length,
        batchName: batchName || `${brand.name} Commercial Batch`,
        timestamp: exportResult.timestamp,
        files: savedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          webViewLink: f.webViewLink,
          mediumName: f.mediumName,
          aspectRatio: f.aspectRatio,
        })),
      });
    } catch (firestoreErr) {
      console.warn('Failed to record Drive export in Firestore:', firestoreErr);
      // Non-fatal; Drive export itself succeeded
    }
  }

  return exportResult;
}
