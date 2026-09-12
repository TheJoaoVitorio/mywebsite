import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiSearch,
  FiDownload,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiShare2,
  FiDatabase,
  FiMonitor,
  FiArchive,
  FiCpu,
  FiHardDrive,
  FiFolder,
  FiPackage,
  FiRefreshCw
} from 'react-icons/fi';
import styles from './files.module.css';
import {
  MEDIAFIRE_ROOT_URL,
  type FolderItem,
  type FileItem,
  type ExplorerItem
} from './filesData';
import {
  fetchLiveFolderContent,
  MEDIAFIRE_ROOT_KEY
} from '../../services/mediafireService';

interface CurrentLocation {
  key: string;
  name: string;
}

export default function Files() {
  const navigate = useNavigate();

  // Navigation history: stack of locations, starting with Root
  const [history, setHistory] = useState<CurrentLocation[]>([
    { key: MEDIAFIRE_ROOT_KEY, name: 'Files' }
  ]);

  // Current active location
  const currentLocation = history[history.length - 1];
  const isRoot = history.length === 1;

  // State for live content
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Selected item for the Inspector panel
  const [selectedItem, setSelectedItem] = useState<ExplorerItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch live content for the active location
  const loadContent = useCallback(async (location: CurrentLocation, isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const liveData = await fetchLiveFolderContent(location.key, location.name);
      setFolders(liveData.folders);
      setFiles(liveData.files);

      // Select the first item by default if nothing selected or folder changed
      if (liveData.files.length > 0) {
        setSelectedItem(liveData.files[0]);
      } else if (liveData.folders.length > 0) {
        setSelectedItem(liveData.folders[0]);
      } else {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Erro ao carregar conteúdo do MediaFire:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Effect on location change
  useEffect(() => {
    loadContent(currentLocation);
  }, [currentLocation, loadContent]);

  // Manual refresh trigger
  const handleRefresh = () => {
    loadContent(currentLocation, true);
  };

  // Filtered items (by search query if active)
  const displayedItems = useMemo<ExplorerItem[]>(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchedFolders = folders.filter(f => f.name.toLowerCase().includes(q));
      const matchedFiles = files.filter(f => f.name.toLowerCase().includes(q));
      return [...matchedFolders, ...matchedFiles];
    }
    return [...folders, ...files];
  }, [folders, files, searchQuery]);

  // Click handlers
  const handleItemClick = (item: ExplorerItem) => {
    setSelectedItem(item);
  };

  const handleItemDoubleClick = (item: ExplorerItem) => {
    if (item.type === 'folder') {
      setSearchQuery('');
      setHistory(prev => [...prev, { key: item.key, name: item.name }]);
    } else if (item.downloadUrl) {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      setSearchQuery('');
      setHistory(prev => prev.slice(0, prev.length - 1));
    } else {
      navigate('/');
    }
  };

  // Copy link
  const handleCopyLink = () => {
    if (!selectedItem) return;
    const url = selectedItem.type === 'file' ? selectedItem.downloadUrl : `${MEDIAFIRE_ROOT_URL}/${selectedItem.name}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for folder icon representation
  const getFolderEmbossIcon = (folderName: string) => {
    const name = folderName.toLowerCase();
    if (name.includes('data') || name.includes('db') || name.includes('sql')) {
      return <FiDatabase className={styles.folderEmbossIcon} />;
    }
    if (name.includes('remote') || name.includes('desk')) {
      return <FiMonitor className={styles.folderEmbossIcon} />;
    }
    return <FiFolder className={styles.folderEmbossIcon} />;
  };

  // Helper for file icon representation
  const getFileGraphicIcon = (file: FileItem) => {
    const ext = file.extension.toLowerCase();
    const name = file.name.toLowerCase();

    if (name.includes('sql') || name.includes('db') || name.includes('postgres') || name.includes('mysql')) {
      return <FiDatabase className={styles.fileGraphicIcon} style={{ color: '#e3b341' }} />;
    }
    if (name.includes('desk') || name.includes('remote')) {
      return <FiMonitor className={styles.fileGraphicIcon} style={{ color: '#34d399' }} />;
    }
    if (ext === 'rar' || ext === 'zip' || ext === '7z') {
      return <FiArchive className={styles.fileGraphicIcon} style={{ color: '#f87171' }} />;
    }
    if (name.includes('photoshop') || name.includes('editor') || name.includes('picker')) {
      return <FiCpu className={styles.fileGraphicIcon} style={{ color: '#60a5fa' }} />;
    }
    return <FiPackage className={styles.fileGraphicIcon} />;
  };

  // Inspector titles
  const isSelectedFile = selectedItem?.type === 'file';
  const inspectorTitle = selectedItem ? selectedItem.name : 'Nenhum item selecionado';
  const inspectorSubtitle = selectedItem
    ? isSelectedFile
      ? `${selectedItem.extension.toUpperCase()} • ${selectedItem.size}`
      : `Pasta • ${selectedItem.fileCount} itens`
    : '';

  return (
    <div className={styles.pageContainer}>
      {/* ── Top Header Navigation ─────────────────────────────────── */}
      <header className={styles.topHeader}>
        <button className={styles.backPortfolioBtn} onClick={() => navigate('/')}>
          <FiArrowLeft />
          <span>Voltar ao Portfólio</span>
        </button>

        <a
          href={MEDIAFIRE_ROOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mediafireBadge}
          title="Abrir pasta oficial no MediaFire"
        >
          <span>MediaFire Live Sync</span>
          <FiExternalLink size={12} />
        </a>
      </header>

      {/* ── OS Window Frame ───────────────────────────────────────── */}
      <div className={styles.windowFrame}>
        {/* Titlebar */}
        <div className={styles.titlebar}>
          <div className={styles.titlebarNav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handleGoBack}
              title={isRoot ? "Voltar ao Portfólio" : "Subir nível de pasta"}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              disabled
              title="Avançar"
            >
              <FiChevronRight />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              title="Visualização em Grade"
            >
              <FiGrid />
            </button>
          </div>

          <div className={styles.titlebarCenter}>
            {history.map((loc, idx) => {
              const isLast = idx === history.length - 1;
              return (
                <span key={loc.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {idx > 0 && <span style={{ opacity: 0.4 }}>/</span>}
                  {isLast ? (
                    <span>{loc.name}</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.folderBreadcrumbBtn}
                      onClick={() => setHistory(prev => prev.slice(0, idx + 1))}
                    >
                      {loc.name}
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          <div className={styles.titlebarControls}>
            {/* Refresh Button to check new files in MediaFire in real time */}
            <button
              type="button"
              className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`}
              onClick={handleRefresh}
              title="Sincronizar e verificar novos arquivos no MediaFire"
            >
              <FiRefreshCw />
            </button>

            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIconBtn} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.windowButtons}>
              <button
                type="button"
                className={`${styles.windowDot} ${styles.dotClose}`}
                onClick={() => navigate('/')}
                title="Fechar e voltar ao Portfólio"
              />
              <button
                type="button"
                className={`${styles.windowDot} ${styles.dotMin}`}
                title="Minimizar"
              />
              <button
                type="button"
                className={`${styles.windowDot} ${styles.dotMax}`}
                title="Maximizar"
              />
            </div>
          </div>
        </div>

        {/* Window Content (Grid Left + Inspector Right) */}
        <div className={styles.windowContent}>
          {/* Main Grid Area */}
          <div className={styles.mainGridArea}>
            {isLoading ? (
              <div className={styles.emptyGrid}>
                <FiRefreshCw size={36} className={styles.spinning} style={{ color: 'var(--accent-primary)', marginBottom: 16 }} />
                <p>Sincronizando com a pasta do MediaFire...</p>
              </div>
            ) : displayedItems.length === 0 ? (
              <div className={styles.emptyGrid}>
                <FiHardDrive size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p>Nenhum item encontrado{searchQuery ? ` para "${searchQuery}"` : ' nesta pasta'}.</p>
              </div>
            ) : (
              <div className={styles.itemsGrid}>
                {displayedItems.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  const isFolder = item.type === 'folder';

                  return (
                    <div
                      key={item.id}
                      className={`${styles.gridItem} ${isSelected ? styles.gridItemSelected : ''}`}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      title={isFolder ? `Pasta ${item.name} (${item.fileCount} itens) - Clique duplo para abrir` : `${item.name} (${item.size})`}
                    >
                      <div className={styles.itemIconBox}>
                        {isFolder ? (
                          <div className={styles.folderGraphic}>
                            {getFolderEmbossIcon(item.name)}
                          </div>
                        ) : (
                          <div className={styles.fileGraphic}>
                            {getFileGraphicIcon(item)}
                            <span className={styles.fileGraphicExt}>{item.extension}</span>
                          </div>
                        )}
                      </div>

                      <span className={styles.itemLabel}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inspector Panel (Right) */}
          <aside className={styles.inspectorPanel}>
            {selectedItem ? (
              <>
                {/* Big Preview Poster */}
                <div className={styles.inspectorPreview}>
                  {selectedItem.type === 'folder' ? (
                    <FiFolder className={styles.inspectorPreviewIcon} style={{ fontSize: 64 }} />
                  ) : (
                    getFileGraphicIcon(selectedItem)
                  )}
                </div>

                {/* Header Info */}
                <div className={styles.inspectorHeader}>
                  <h2 className={styles.inspectorTitle}>{inspectorTitle}</h2>
                  <p className={styles.inspectorSubtitle}>{inspectorSubtitle}</p>
                </div>

                {/* Action Buttons Bar */}
                <div className={styles.inspectorActions}>
                  {isSelectedFile && (
                    <a
                      href={selectedItem.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      title="Baixar arquivo diretamente do MediaFire"
                    >
                      <FiDownload />
                    </a>
                  )}

                  {selectedItem.type === 'folder' && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() => handleItemDoubleClick(selectedItem)}
                      title="Abrir pasta"
                    >
                      <FiFolder />
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleCopyLink}
                    title="Copiar link"
                  >
                    {copied ? <FiCheck color="#34d399" /> : <FiCopy />}
                  </button>

                  <a
                    href={isSelectedFile ? selectedItem.downloadUrl : `${MEDIAFIRE_ROOT_URL}/${selectedItem.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                    title="Abrir página no MediaFire"
                  >
                    <FiExternalLink />
                  </a>

                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleCopyLink}
                    title="Compartilhar"
                  >
                    <FiShare2 />
                  </button>
                </div>

                {/* Metadata Section */}
                <div className={styles.infoSection}>
                  <h3 className={styles.infoSectionTitle}>Informações</h3>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Modificado</span>
                    <span className={styles.infoValue}>{selectedItem.created}</span>
                  </div>

                  {isSelectedFile && (
                    <>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Tamanho</span>
                        <span className={styles.infoValue}>{selectedItem.size}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Extensão</span>
                        <span className={styles.infoValue}>.{selectedItem.extension.toUpperCase()}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Pasta</span>
                        <span className={styles.infoValue}>{selectedItem.folderName}</span>
                      </div>

                      {selectedItem.description && (
                        <div className={styles.infoRow} style={{ flexDirection: 'column', gap: 4, marginTop: 4 }}>
                          <span className={styles.infoLabel}>Descrição</span>
                          <span className={styles.infoValue} style={{ textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {selectedItem.description}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem.type === 'folder' && (
                    <>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Contagem</span>
                        <span className={styles.infoValue}>{selectedItem.fileCount} arquivos</span>
                      </div>

                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Chave da Pasta</span>
                        <span className={styles.infoValue}>{selectedItem.key}</span>
                      </div>
                    </>
                  )}

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Hospedagem</span>
                    <span className={styles.infoValue}>MediaFire Cloud (Tempo Real)</span>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyGrid}>
                <p>Nenhum item selecionado</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
