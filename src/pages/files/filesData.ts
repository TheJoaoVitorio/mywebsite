export interface FileItem {
  id: string;
  name: string;
  type: 'file';
  size: string;
  bytes: number;
  extension: string;
  downloadUrl: string;
  created: string;
  folderName: string;
  description?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  key: string;
  fileCount: number;
  created: string;
  files: FileItem[];
}

export type ExplorerItem = FileItem | FolderItem;

export const MEDIAFIRE_ROOT_URL = "https://www.mediafire.com/folder/c3lrnst04o3xk/Files";

export const FOLDERS_DATA: FolderItem[] = [
  {
    id: 'folder-database',
    name: 'database',
    type: 'folder',
    key: '3aybs0y6hcj5q',
    fileCount: 13,
    created: '11/09/2026',
    files: [
      {
        id: 'movyr0hx6tth0qq',
        name: 'accesspv.exe',
        type: 'file',
        size: '36.8 KB',
        bytes: 36864,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/movyr0hx6tth0qq/accesspv.exe/file',
        created: '11/09/2026 14:54',
        folderName: 'database',
        description: 'Visualizador de senhas para arquivos Access (.mdb)'
      },
      {
        id: 'rqezjpyaw9kh7tz',
        name: 'DBF View Installer.exe',
        type: 'file',
        size: '1.09 MB',
        bytes: 1096224,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/rqezjpyaw9kh7tz/DBF_View_Installer.exe/file',
        created: '11/09/2026 14:39',
        folderName: 'database',
        description: 'Instalador do utilitário DBF View para tabelas dBase/Clipper'
      },
      {
        id: '1rmrhzx53dlkq4k',
        name: 'MDBPlus.exe',
        type: 'file',
        size: '5.30 MB',
        bytes: 5304832,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/1rmrhzx53dlkq4k/MDBPlus.exe/file',
        created: '11/09/2026 14:53',
        folderName: 'database',
        description: 'Editor e visualizador avançado para bancos de dados Microsoft Access'
      },
      {
        id: '2fphph3kmq8oi7u',
        name: 'mysql-installer-community-5.7.20.0.msi',
        type: 'file',
        size: '394.5 MB',
        bytes: 394584064,
        extension: 'msi',
        downloadUrl: 'https://www.mediafire.com/file/2fphph3kmq8oi7u/mysql-installer-community-5.7.20.0.msi/file',
        created: '11/09/2026 14:39',
        folderName: 'database',
        description: 'Instalador Oficial MySQL Community Server 5.7'
      },
      {
        id: 'ti6w37owctmy5rq',
        name: 'mysql-workbench-community-8.0.38-winx64.msi',
        type: 'file',
        size: '43.7 MB',
        bytes: 43704320,
        extension: 'msi',
        downloadUrl: 'https://www.mediafire.com/file/ti6w37owctmy5rq/mysql-workbench-community-8.0.38-winx64.msi/file',
        created: '11/09/2026 14:46',
        folderName: 'database',
        description: 'Ferramenta gráfica MySQL Workbench 8.0 para modelagem e SQL'
      },
      {
        id: 'akz5sdrlk796o24',
        name: 'PdxEditor.rar',
        type: 'file',
        size: '6.44 MB',
        bytes: 6445930,
        extension: 'rar',
        downloadUrl: 'https://www.mediafire.com/file/akz5sdrlk796o24/PdxEditor.rar/file',
        created: '11/09/2026 14:52',
        folderName: 'database',
        description: 'Editor e reparador de tabelas Paradox (.db)'
      },
      {
        id: 'n11xbjqz7lnyd0d',
        name: 'postgresql-11.22-1-windows-x64.exe',
        type: 'file',
        size: '353.2 MB',
        bytes: 353229320,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/n11xbjqz7lnyd0d/postgresql-11.22-1-windows-x64.exe/file',
        created: '11/09/2026 14:40',
        folderName: 'database',
        description: 'Instalador PostgreSQL versão 11.22 64-bit'
      },
      {
        id: 'muc3eoczkwpukke',
        name: 'postgresql-13.20-1-windows-x64.exe',
        type: 'file',
        size: '340.5 MB',
        bytes: 340507928,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/muc3eoczkwpukke/postgresql-13.20-1-windows-x64.exe/file',
        created: '11/09/2026 14:40',
        folderName: 'database',
        description: 'Instalador PostgreSQL versão 13.20 64-bit'
      },
      {
        id: '67j9h56q2hn608i',
        name: 'postgresql-14.18-2-windows-x64.exe',
        type: 'file',
        size: '348.7 MB',
        bytes: 348760888,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/67j9h56q2hn608i/postgresql-14.18-2-windows-x64.exe/file',
        created: '11/09/2026 14:41',
        folderName: 'database',
        description: 'Instalador PostgreSQL versão 14.18 64-bit'
      },
      {
        id: 'o91feqruapioymx',
        name: 'postgresql-9.1.23-1-windows-x64.exe',
        type: 'file',
        size: '53.1 MB',
        bytes: 53161936,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/o91feqruapioymx/postgresql-9.1.23-1-windows-x64.exe/file',
        created: '11/09/2026 15:01',
        folderName: 'database',
        description: 'Instalador legado PostgreSQL versão 9.1.23 64-bit'
      },
      {
        id: 'ojnjibpn4bwcez4',
        name: 'postgresql_12.exe',
        type: 'file',
        size: '369.9 MB',
        bytes: 369981832,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/ojnjibpn4bwcez4/postgresql_12.exe/file',
        created: '11/09/2026 14:40',
        folderName: 'database',
        description: 'Instalador PostgreSQL versão 12 64-bit'
      },
      {
        id: 'ejs5w70dznf65vx',
        name: 'SQL2022-SSEI-Eval.exe',
        type: 'file',
        size: '4.29 MB',
        bytes: 4290992,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/ejs5w70dznf65vx/SQL2022-SSEI-Eval.exe/file',
        created: '11/09/2026 14:48',
        folderName: 'database',
        description: 'Microsoft SQL Server 2022 Evaluation Installer'
      },
      {
        id: 'u7kr3zc7niyakid',
        name: 'SYSDBA Out.exe',
        type: 'file',
        size: '424.9 KB',
        bytes: 424960,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/u7kr3zc7niyakid/SYSDBA_Out.exe/file',
        created: '11/09/2026 14:53',
        folderName: 'database',
        description: 'Ferramenta utilitária de banco de dados SYSDBA'
      }
    ]
  },
  {
    id: 'folder-remote',
    name: 'remote',
    type: 'folder',
    key: 'uwqnyc4pht0p6',
    fileCount: 2,
    created: '11/09/2026',
    files: [
      {
        id: 'l6sew0ozfvg6y67',
        name: 'HopToDesk.exe',
        type: 'file',
        size: '7.25 MB',
        bytes: 7257480,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/l6sew0ozfvg6y67/HopToDesk.exe/file',
        created: '11/09/2026 14:42',
        folderName: 'remote',
        description: 'Software de suporte e acesso remoto gratuito e criptografado'
      },
      {
        id: 'vsyskzuar4iyp29',
        name: 'rustdesk-1.4.6-x86_64.exe',
        type: 'file',
        size: '24.2 MB',
        bytes: 24252504,
        extension: 'exe',
        downloadUrl: 'https://www.mediafire.com/file/vsyskzuar4iyp29/rustdesk-1.4.6-x86_64.exe/file',
        created: '11/09/2026 14:50',
        folderName: 'remote',
        description: 'Cliente RustDesk versão 1.4.6 para controle e suporte remoto'
      }
    ]
  }
];

export const ROOT_FILES: FileItem[] = [
  {
    id: '72r67niiggs8cp5',
    name: 'FastEditor.rar',
    type: 'file',
    size: '1.77 MB',
    bytes: 1770145,
    extension: 'rar',
    downloadUrl: 'https://www.mediafire.com/file/72r67niiggs8cp5/FastEditor.rar/file',
    created: '11/09/2026 14:50',
    folderName: 'Files',
    description: 'Editor rápido de arquivos compactado em RAR'
  },
  {
    id: 'zrqguf5qdzxgzay',
    name: 'jcpicker.exe',
    type: 'file',
    size: '4.53 MB',
    bytes: 4532000,
    extension: 'exe',
    downloadUrl: 'https://www.mediafire.com/file/zrqguf5qdzxgzay/jcpicker.exe/file',
    created: '11/09/2026 14:47',
    folderName: 'Files',
    description: 'Utilitário seletor de cores e atributos de tela'
  },
  {
    id: 'loi59tk8c1p8php',
    name: 'NexusDB_V4.7512_Trial_for_Rad_Studio_10.3_Rio.exe',
    type: 'file',
    size: '126.0 MB',
    bytes: 126045736,
    extension: 'exe',
    downloadUrl: 'https://www.mediafire.com/file/loi59tk8c1p8php/NexusDB_V4.7512_Trial_for_Rad_Studio_10.3_Rio.exe/file',
    created: '11/09/2026 14:47',
    folderName: 'Files',
    description: 'Biblioteca NexusDB V4.7512 Trial para Embarcadero RAD Studio 10.3 Rio'
  },
  {
    id: '90su33hbw5cal5l',
    name: 'Photoshop CS6 2023-2024.rar',
    type: 'file',
    size: '122.6 MB',
    bytes: 122673884,
    extension: 'rar',
    downloadUrl: 'https://www.mediafire.com/file/90su33hbw5cal5l/Photoshop_CS6_2023-2024.rar/file',
    created: '11/09/2026 15:02',
    folderName: 'Files',
    description: 'Pacote portátil Adobe Photoshop CS6 compactado'
  }
];
