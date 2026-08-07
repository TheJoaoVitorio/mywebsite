import React, { useState, useEffect, useCallback } from 'react';
import styles from './palavritas.module.css';
import { getDailyWord, getRandomContextWord, getRandomWord, availableCategories } from './words';

type GameMode = 'daily' | 'context' | 'random';
type GameStatus = 'playing' | 'won' | 'lost';
type KeyStatus = 'correct' | 'present' | 'absent' | '';

const ROWS = 6;
const COLS = 5;

const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const modeLabels = {
  daily: 'Diário',
  context: 'Dicas',
  random: 'Aleatório'
};

export default function Palavritas() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<GameMode>('daily');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [targetWord, setTargetWord] = useState('');
  const [tip, setTip] = useState('');
  
  const [board, setBoard] = useState<string[][]>(Array(ROWS).fill(Array(COLS).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  
  const [status, setStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState('');
  const [revealedRows, setRevealedRows] = useState<number[]>([]);

  const startNewGame = useCallback((newMode: GameMode = mode) => {
    let word = '';
    let currentTip = '';

    if (newMode === 'daily') {
      word = getDailyWord();
    } else if (newMode === 'context') {
      const data = getRandomContextWord(selectedCategory);
      word = data.word;
      currentTip = `[${data.category}] ${data.tip}`;
    } else {
      word = getRandomWord();
    }

    setTargetWord(word);
    setTip(currentTip);
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
    setStatus('playing');
    setMessage('');
    setRevealedRows([]);
  }, [mode, selectedCategory]);

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (status === 'playing' && step === 3 && rowIdx === currentRow) {
      setCurrentCol(colIdx);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startNewGame(mode);
  }, [mode, startNewGame]);

  const showMessage = (msg: string, ms = 2000) => {
    setMessage(msg);
    if (ms > 0) {
      setTimeout(() => setMessage(''), ms);
    }
  };

  const onKeyPress = useCallback((key: string) => {
    if (status !== 'playing' || step !== 3) return;

    if (key === 'BACKSPACE') {
      const newBoard = [...board];
      newBoard[currentRow] = [...newBoard[currentRow]];
      if (currentCol < COLS && board[currentRow][currentCol] !== '') {
        newBoard[currentRow][currentCol] = '';
        setBoard(newBoard);
      } else if (currentCol > 0) {
        newBoard[currentRow][currentCol - 1] = '';
        setBoard(newBoard);
        setCurrentCol(currentCol - 1);
      }
    } else if (key === 'ENTER') {
      if (currentCol === COLS) {
        // Validate word
        const guess = board[currentRow].join('');
        // Reveal animation trigger
        setRevealedRows(prev => [...prev, currentRow]);
        
        if (guess === targetWord) {
          setTimeout(() => {
            setStatus('won');
            showMessage('Parabéns!', 0);
          }, COLS * 300 + 300); // Wait for animation
        } else if (currentRow === ROWS - 1) {
          setTimeout(() => {
            setStatus('lost');
            showMessage(targetWord, 0);
          }, COLS * 300 + 300);
        }
        
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      } else {
        showMessage('Letras insuficientes', 1500);
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (currentCol < COLS) {
        const newBoard = [...board];
        newBoard[currentRow] = [...newBoard[currentRow]];
        newBoard[currentRow][currentCol] = key;
        setBoard(newBoard);
        setCurrentCol(currentCol + 1);
      } else if (currentCol === COLS && board[currentRow][COLS - 1] === '') {
         // edge case: if we are at the end but the last cell is somehow empty, fill it
         const newBoard = [...board];
         newBoard[currentRow] = [...newBoard[currentRow]];
         newBoard[currentRow][COLS - 1] = key;
         setBoard(newBoard);
      }
    }
  }, [board, currentCol, currentRow, status, targetWord, step]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE') {
        onKeyPress(key);
      } else if (/^[A-Z]$/.test(key)) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  // Compute key statuses
  const keyStatuses: { [key: string]: KeyStatus } = {};
  revealedRows.forEach(rowIdx => {
    const guess = board[rowIdx];
    const targetArr = targetWord.split('');
    
    // Pass 1: find correct
    guess.forEach((letter, i) => {
      if (letter === targetArr[i]) {
        keyStatuses[letter] = 'correct';
        targetArr[i] = '';
      }
    });
    
    // Pass 2: find present / absent
    guess.forEach((letter, i) => {
      if (letter !== targetWord[i]) {
        if (targetArr.includes(letter)) {
          if (keyStatuses[letter] !== 'correct') {
            keyStatuses[letter] = 'present';
          }
          targetArr[targetArr.indexOf(letter)] = '';
        } else {
          if (keyStatuses[letter] !== 'correct' && keyStatuses[letter] !== 'present') {
            keyStatuses[letter] = 'absent';
          }
        }
      }
    });
  });

  const getCellStatus = (rowIdx: number, colIdx: number): KeyStatus => {
    if (!revealedRows.includes(rowIdx)) return '';
    
    const targetArr = targetWord.split('');
    
    // To correctly color multiple same letters, we need to do full evaluation for the row
    const guess = board[rowIdx];
    const statuses: KeyStatus[] = Array(COLS).fill('absent');
    
    // correct pass
    guess.forEach((l, i) => {
      if (l === targetArr[i]) {
        statuses[i] = 'correct';
        targetArr[i] = '';
      }
    });
    
    // present pass
    guess.forEach((l, i) => {
      if (statuses[i] !== 'correct' && targetArr.includes(l)) {
        statuses[i] = 'present';
        targetArr[targetArr.indexOf(l)] = '';
      }
    });
    
    return statuses[colIdx];
  };

  const getCellAnimation = (rowIdx: number, colIdx: number) => {
    if (!revealedRows.includes(rowIdx)) return {};
    return {
      animationDelay: `${colIdx * 0.3}s`,
    };
  };

  return (
    <div className={styles.container}>
      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.header}>
        <h1 className={styles.title}>PALAVRITAS</h1>
      </div>

      {step === 1 && (
        <div className={`${styles.startScreen} ${styles.slideIn}`}>
          <button 
            className={styles.startButton} 
            onClick={() => setStep(2)}
          >
            Iniciar Jogo
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={`${styles.startScreen} ${styles.slideIn}`}>
          <p className={styles.startText}>Selecione um modo de jogo</p>
          
          <div className={styles.modeCards}>
            <div 
              className={`${styles.modeCard} ${mode === 'daily' ? styles.selected : ''}`}
              onClick={() => setMode('daily')}
            >
              <div className={styles.modeCardTitle}>Diário</div>
              <div className={styles.modeCardDesc}>Adivinhe a palavra do dia. Todos jogam a mesma!</div>
            </div>
            
            <div 
              className={`${styles.modeCard} ${mode === 'context' ? styles.selected : ''}`}
              onClick={() => setMode('context')}
            >
              <div className={styles.modeCardTitle}>Dicas</div>
              <div className={styles.modeCardDesc}>Receba uma dica relacionada a tecnologia e programação.</div>
              {mode === 'context' && (
                <div className={styles.categorySelector} onClick={(e) => e.stopPropagation()}>
                  <span>Categoria:</span>
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={styles.categorySelect}
                  >
                    <option value="Todas">Todas</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div 
              className={`${styles.modeCard} ${mode === 'random' ? styles.selected : ''}`}
              onClick={() => setMode('random')}
            >
              <div className={styles.modeCardTitle}>Aleatório</div>
              <div className={styles.modeCardDesc}>Jogue à vontade com palavras aleatórias.</div>
            </div>
          </div>

          <button 
            className={styles.startButton} 
            onClick={() => setStep(3)}
          >
            Jogar
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={styles.slideIn}>
          <div className={styles.currentModeHeader}>
            <span className={styles.currentModeText}>
              Modo: <strong>{modeLabels[mode]}</strong>
            </span>
            <button className={styles.changeModeBtn} onClick={() => setStep(2)}>
              Trocar
            </button>
          </div>
          {mode === 'context' && tip && (
            <div className={styles.tip}>Dica: {tip}</div>
          )}

          <div className={styles.board}>
            {board.map((row, rowIdx) => (
              <div key={rowIdx} className={styles.row}>
                {row.map((letter, colIdx) => {
                  const statusCell = getCellStatus(rowIdx, colIdx);
                  const isRevealed = revealedRows.includes(rowIdx);
                  
                  let cellClass = styles.cell;
                  if (letter) cellClass += ` ${styles.filled}`;
                  if (isRevealed) {
                    cellClass += ` ${styles.flipped}`;
                  }
                  if (rowIdx === currentRow && colIdx === currentCol && status === 'playing' && step === 3) {
                    cellClass += ` ${styles.focused}`;
                  }
                  
                  // We inject the final background color as a CSS var so the animation can use it
                  let finalColor = '#121212';
                  if (statusCell === 'correct') finalColor = '#3aa394';
                  else if (statusCell === 'present') finalColor = '#d3ad69';
                  else if (statusCell === 'absent') finalColor = '#313131';

                  return (
                    <div 
                      key={colIdx} 
                      className={cellClass}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      style={{
                        ...getCellAnimation(rowIdx, colIdx),
                        '--final-bg': finalColor
                      } as unknown as React.CSSProperties}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.keyboard}>
            {KEYBOARD.map((row, rIdx) => (
              <div key={rIdx} className={styles.keyRow}>
                {row.map(key => {
                  const status = keyStatuses[key];
                  let keyClass = styles.key;
                  if (key === 'ENTER' || key === 'BACKSPACE') keyClass += ` ${styles.wide}`;
                  if (status) keyClass += ` ${styles[status]}`;

                  return (
                    <button
                      key={key}
                      className={keyClass}
                      onClick={() => onKeyPress(key)}
                    >
                      {key === 'BACKSPACE' ? '⌫' : key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {status !== 'playing' && (
            <button className={styles.restartButton} onClick={() => startNewGame()}>
              Jogar Novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
