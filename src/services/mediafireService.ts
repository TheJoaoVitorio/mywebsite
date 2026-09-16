import {
  FOLDERS_DATA,
  ROOT_FILES,
  type FolderItem,
  type FileItem
} from '../pages/files/filesData';

export const MEDIAFIRE_ROOT_KEY = 'c3lrnst04o3xk';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(i > 1 ? 1 : 0)) + ' ' + sizes[i];
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Recente';
  try {
    const parts = dateString.split(' ')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return dateString;
}

export interface LiveFolderContent {
  folders: FolderItem[];
  files: FileItem[];
}

// Busca em tempo real na API do MediaFire para qualquer chave de pasta
export async function fetchLiveFolderContent(
  folderKey: string = MEDIAFIRE_ROOT_KEY,
  parentName: string = 'Files'
): Promise<LiveFolderContent> {
  try {
    const [foldersResponse, filesResponse] = await Promise.all([
      fetch(
        `https://www.mediafire.com/api/1.4/folder/get_content.php?folder_key=${folderKey}&content_type=folders&response_format=json`
      ),
      fetch(
        `https://www.mediafire.com/api/1.4/folder/get_content.php?folder_key=${folderKey}&content_type=files&response_format=json`
      )
    ]);

    if (!foldersResponse.ok || !filesResponse.ok) {
      throw new Error('Falha ao comunicar com MediaFire');
    }

    const foldersJson = await foldersResponse.json();
    const filesJson = await filesResponse.json();

    const rawFolders = foldersJson?.response?.folder_content?.folders || [];
    const rawFiles = filesJson?.response?.folder_content?.files || [];

    const mappedFolders: FolderItem[] = rawFolders.map((f: any) => ({
      id: `folder-${f.folderkey}`,
      name: f.name,
      type: 'folder',
      key: f.folderkey,
      fileCount: parseInt(f.file_count, 10) || 0,
      created: formatDate(f.created),
      files: []
    }));

    const mappedFiles: FileItem[] = rawFiles.map((f: any) => {
      const ext = f.filename.split('.').pop() || '';
      const numBytes = parseInt(f.size, 10) || 0;
      return {
        id: f.quickkey,
        name: f.filename,
        type: 'file',
        size: formatBytes(numBytes),
        bytes: numBytes,
        extension: ext,
        downloadUrl: f.links?.normal_download || `https://www.mediafire.com/file/${f.quickkey}/${encodeURIComponent(f.filename)}/file`,
        created: formatDate(f.created),
        folderName: parentName
      };
    });

    return {
      folders: mappedFolders,
      files: mappedFiles
    };
  } catch (error) {
    console.warn('MediaFire live fetch falhou, utilizando cache local:', error);

    // Fallback gracioso com os dados locais
    if (folderKey === MEDIAFIRE_ROOT_KEY) {
      return {
        folders: FOLDERS_DATA,
        files: ROOT_FILES
      };
    }

    const cachedFolder = FOLDERS_DATA.find(f => f.key === folderKey || f.id.includes(folderKey));
    return {
      folders: [],
      files: cachedFolder?.files || []
    };
  }
}
