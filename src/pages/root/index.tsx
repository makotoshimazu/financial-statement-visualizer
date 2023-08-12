import { FC } from 'react';
import style from './style.module.scss';
import { useLocalStorage } from '../../lib/storage';

type FinancialStatement = {
  currentAsset: number;
  nonCurrentAsset: number;
}

export const Root: FC = () => {

  const [fs, setFS] = useLocalStorage<FinancialStatement>('test', {
    currentAsset: 0,
    nonCurrentAsset: 0
  });

  return (
    <>
      <h1 className={style.headerFoo}>visualizer</h1>
      <section className={style.inputArea}>
        <div>
          <h2>資産の部</h2>
          <ul>
            <li>
              <label>
                <span className={style.labelText}>流動資産合計</span>
                <input
                  type="number"
                  value={fs.currentAsset}
                  onChange={(e) => {
                    // setCurrentAsset(Number(e.currentTarget.value));
                    setFS({
                      ...fs,
                      currentAsset: Number(e.currentTarget.value)
                    })
                  }}
                />
              </label>
            </li>
            <li>
              <label>
                <span className={style.labelText}>固定資産合計</span>
                <input
                  type="number"
                  value={fs.nonCurrentAsset}
                  onChange={(e) => {
                    // setNonCurrentAsset(Number(e.currentTarget.value));
                    setFS({
                      ...fs,
                      nonCurrentAsset: Number(e.currentTarget.value)
                    })
                  }}
                />
              </label>
            </li>
            <li>
              <span className={style.labelText}>資産合計</span>
              {fs.currentAsset + fs.nonCurrentAsset}
            </li>
          </ul>
        </div>
        <div className={style.liabilitiesArea}>
          <h2>負債の部</h2>
          <ul>
            <li>
              <label>
                <span className={style.labelText}>流動負債合計</span>
                <input type="number" />
              </label>
            </li>
            <li>
              <label>
                <span className={style.labelText}>固定負債合計</span>
                <input type="number" />
              </label>
            </li>
          </ul>
        </div>
        <div className={style.equityArea}>
          <h2>純資産の部</h2>
          <ul>
            <li>
              <label>
                <span className={style.labelText}>資本金</span>
                <input type="number" />
              </label>
            </li>
            <li>
              <label>
                <span className={style.labelText}>資本余剰金合計</span>
                <input type="number" />
              </label>
            </li>
            <li>
              <label>
                <span className={style.labelText}>利益余剰金</span>
                <input type="number" />
              </label>
            </li>
            <li>
              <div>
                <span className={style.labelText}>株主資本合計</span>{' '}
              </div>
            </li>
            <li>
              <label>
                <span className={style.labelText}>新株予約権</span>
                <input type="number" />
              </label>
            </li>
            <li>
              <div>
                <span className={style.labelText}>純資産合計</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section
        style={{
          height: '200px',
          border: '1px solid #223',
          display: 'grid',
          gridTemplateAreas: "'assets liabilitiesAndEquity'",
          gridTemplateRows: '200px 200px',
        }}
      >
        <div style={{ gridArea: 'assets' }}>
          <div
            style={{
              backgroundColor: '#dd7',
              height: `${
                (fs.currentAsset / (fs.currentAsset + fs.nonCurrentAsset)) * 100
              }%`,
            }}
          >
            <div>流動資産</div>
            <div>{fs.currentAsset}</div>
          </div>
          <div
            style={{
              backgroundColor: '#7dd',
              height: `${
                (fs.nonCurrentAsset / (fs.currentAsset + fs.nonCurrentAsset)) * 100
              }%`,
            }}
          >
            <div>固定資産</div>
            <div>{fs.nonCurrentAsset}</div>
          </div>
        </div>
        <div style={{ gridArea: 'liabilitiesAndEquity' }}>
          <div
            style={{
              backgroundColor: '#d7d',
              height: `${100}%`,
            }}
          >
            <div>流動負債</div>
            <div>{}</div>
          </div>
        </div>
      </section>
    </>
  );
};
