import { useState, type Dispatch, type FocusEvent, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './calculadoraServico.module.css';

export default function CalculadoraServico() {
  const navigate = useNavigate();
  const [fixedPrice, setFixedPrice] = useState('0');
  const [hourlyRate, setHourlyRate] = useState('0');
  const [hours, setHours] = useState('0');
  const [profitMargin, setProfitMargin] = useState('50');
  const [showHourlyCalc, setShowHourlyCalc] = useState(false);
  const [calcSalary, setCalcSalary] = useState('5000');
  const [calcScale, setCalcScale] = useState<'5x2' | '6x1'>('5x2');
  const [calcStart, setCalcStart] = useState('09:00');
  const [calcEnd, setCalcEnd] = useState('18:00');
  const [calcLunch, setCalcLunch] = useState('1');

  const values = {
    fixed: parseFloat(fixedPrice) || 0,
    rate: parseFloat(hourlyRate) || 0,
    hours: parseFloat(hours) || 0,
    margin: parseFloat(profitMargin) || 0,
  };

  const operationalCost = values.fixed + values.rate * values.hours;
  const expectedProfit = operationalCost * (values.margin / 100);
  const finalPrice = operationalCost + expectedProfit;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '0') {
      event.target.value = '';
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    if (event.target.value === '') {
      setter('0');
    }
  };

  const applyHourlyRate = () => {
    const [startHour, startMinute] = calcStart.split(':').map(Number);
    const [endHour, endMinute] = calcEnd.split(':').map(Number);

    let dailyHours = endHour + endMinute / 60 - (startHour + startMinute / 60);
    dailyHours -= parseFloat(calcLunch) || 0;

    if (dailyHours <= 0) {
      window.alert('Configuracao de horario invalida.');
      return;
    }

    const scaleFactor = calcScale === '5x2' ? 5 / 7 : 6 / 7;
    const workingDaysPerMonth = 30.416 * scaleFactor;
    const totalHoursPerMonth = dailyHours * workingDaysPerMonth;
    const calculatedRate = (parseFloat(calcSalary) || 0) / totalHoursPerMonth;

    setHourlyRate(calculatedRate.toFixed(2));
    setShowHourlyCalc(false);
  };

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/utils')}>
        <FiArrowLeft size={18} />
        <span>Voltar para Tools</span>
      </button>

      <div className={styles.calculatorWrapper}>
        <div className={styles.titleSection}>
          <h1>Calculadora de Servico</h1>
          <p>Precifique seus servicos de forma profissional e garanta sua margem de lucro.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="fixedPrice">
              Custo Fixo do Servico
              <span>(Despesas, materiais, infraestrutura)</span>
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>R$</span>
              <input
                type="number"
                id="fixedPrice"
                className={`${styles.formInput} ${styles.hasPrefix}`}
                value={fixedPrice}
                onChange={(event) => setFixedPrice(event.target.value)}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, setFixedPrice)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelWithAction}>
              <label htmlFor="hourlyRate">Valor da sua Hora de Trabalho</label>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setShowHourlyCalc((current) => !current)}
              >
                Simular valor da hora
              </button>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>R$</span>
              <input
                type="number"
                id="hourlyRate"
                className={`${styles.formInput} ${styles.hasPrefix} ${styles.hasSuffix}`}
                value={hourlyRate}
                onChange={(event) => setHourlyRate(event.target.value)}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, setHourlyRate)}
                min="0"
                step="0.01"
              />
              <span className={styles.suffix}>/h</span>
            </div>

            {showHourlyCalc && (
              <div className={styles.hourlyCalculatorBox}>
                <h4>Descubra o valor ideal da sua hora</h4>

                <div className={styles.calcGroupRow}>
                  <div className={styles.calcGroup} style={{ flex: 2 }}>
                    <label htmlFor="calcSalary">Salario Alvo (Mes)</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.prefix}>R$</span>
                      <input
                        type="number"
                        id="calcSalary"
                        className={`${styles.formInput} ${styles.hasPrefix}`}
                        value={calcSalary}
                        onChange={(event) => setCalcSalary(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.calcGroup} style={{ flex: 1.5 }}>
                    <label htmlFor="calcScale">Escala</label>
                    <select
                      id="calcScale"
                      className={styles.formInput}
                      value={calcScale}
                      onChange={(event) => setCalcScale(event.target.value as '5x2' | '6x1')}
                    >
                      <option value="5x2">5x2 (Seg-Sex)</option>
                      <option value="6x1">6x1 (Seg-Sab)</option>
                    </select>
                  </div>
                </div>

                <div className={`${styles.calcGroupRow} ${styles.timesGrid}`}>
                  <div className={styles.calcGroup}>
                    <label htmlFor="calcStart">Entrada</label>
                    <input
                      type="time"
                      id="calcStart"
                      className={styles.formInput}
                      value={calcStart}
                      onChange={(event) => setCalcStart(event.target.value)}
                    />
                  </div>
                  <div className={styles.calcGroup}>
                    <label htmlFor="calcEnd">Saida</label>
                    <input
                      type="time"
                      id="calcEnd"
                      className={styles.formInput}
                      value={calcEnd}
                      onChange={(event) => setCalcEnd(event.target.value)}
                    />
                  </div>
                  <div className={styles.calcGroup}>
                    <label htmlFor="calcLunch">Almoco (h)</label>
                    <input
                      type="number"
                      id="calcLunch"
                      step="0.5"
                      className={styles.formInput}
                      value={calcLunch}
                      onChange={(event) => setCalcLunch(event.target.value)}
                    />
                  </div>
                </div>

                <button type="button" className={styles.applyBtn} onClick={applyHourlyRate}>
                  Aplicar na Calculadora
                </button>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="hours">Estimativa de Tempo</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                id="hours"
                className={`${styles.formInput} ${styles.hasSuffix}`}
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                onFocus={handleFocus}
                onBlur={(event) => handleBlur(event, setHours)}
                min="0"
                step="0.5"
              />
              <span className={styles.suffix}>horas</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="profitMargin">Margem de Lucro Desejada</label>
            <div className={styles.sliderContainer}>
              <div className={styles.sliderGroup}>
                <input
                  type="range"
                  id="profitMargin"
                  className={styles.slider}
                  value={profitMargin}
                  onChange={(event) => setProfitMargin(event.target.value)}
                  min="0"
                  max="200"
                />
                <div className={styles.sliderValue}>{profitMargin}%</div>
              </div>
              <div>
                <span className={styles.recommendationTag}>Recomendado: 38% a 98%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.calculationHelp}>
          <div className={styles.infoTooltip}>
            <button
              type="button"
              className={styles.infoButton}
              aria-label="Ver como o calculo e feito"
            >
              ?
            </button>
            <div className={styles.tooltipContent} role="tooltip">
              <strong>Como o calculo e feito</strong>
              <span>1. Custos operacionais = custo fixo + (valor da hora x horas estimadas)</span>
              <span>2. Lucro esperado = custos operacionais x margem de lucro</span>
              <span>3. Preco final = custos operacionais + lucro esperado</span>
            </div>
          </div>
          <span className={styles.helpText}>Passe o mouse para ver como calculamos.</span>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.resultItem}>
            <span>Custos Operacionais</span>
            <span className={styles.resultValue}>{formatCurrency(operationalCost)}</span>
          </div>
          <div className={styles.resultItem}>
            <span>Lucro Esperado</span>
            <span className={styles.resultValue}>{formatCurrency(expectedProfit)}</span>
          </div>
          <div className={`${styles.resultItem} ${styles.total}`}>
            <span>Preco Final Recomendado</span>
            <span className={styles.resultValue}>{formatCurrency(finalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
