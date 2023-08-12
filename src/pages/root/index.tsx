import { ChangeEvent, FC } from 'react';
import style from './style.module.scss';
import { useLocalStorage } from '../../lib/storage';

type FinancialStatement = {
  // 流動資産
  currentAsset: number;
  // 固定資産
  nonCurrentAsset: number;
  // 流動負債合計
  currentLiabilitiesTotal: number,
  // 短期借入金
  currentDebt: number,
  // 短期社債
  shortTermBonds: number,
  // 固定負債合計
  nonCurrentLiabilitiesTotal: number,
  // 長期借入金
  nonCurrentDebt: number,
  // 社債
  bonds: number,
  // 資本金
  capitalStock: number,
  // 資本剰余金
  capitalSurplus: number,
  // 利益剰余金
  retainedEarnings: number,
  // 新株予約権
  subscriptionRights: number,
  // 純資産合計
  // netAssetsTotal: number,

  // PL
  // 売上高
  plSales: number,
  // 売上原価
  plCostOfSales: number,
  // 販管費
  plSalesAndAdministrativeExpenses: number,
  // 営業外収益
  plNonOperatingIncome: number,
  // 営業外費用
  plNonOperatingExpenses: number,
  // 税引前当期純利益
  plProfitBeforeTax: number,
  // 法人税等
  plCorporateTax: number,
}

export const Root: FC = () => {

  const [fs, setFS] = useLocalStorage<FinancialStatement>('test', {
    currentAsset: 0,
    nonCurrentAsset: 0,
    currentLiabilitiesTotal: 0,
    currentDebt: 0,
    nonCurrentLiabilitiesTotal: 0,
    nonCurrentDebt: 0,
    retainedEarnings: 0,
    shortTermBonds: 0,
    bonds: 0,
    capitalStock: 0,
    capitalSurplus: 0,
    subscriptionRights: 0,
    plSales: 0,
    plCostOfSales: 0,
    plSalesAndAdministrativeExpenses: 0,
    plNonOperatingIncome: 0,
    plNonOperatingExpenses: 0,
    plProfitBeforeTax: 0,
    plCorporateTax: 0
  });

  const createInputElement = (key: keyof FinancialStatement, label: string) => {
    return (<li>
      <label><span className={style.labelText}>{label}</span>
      <input type="number" value={fs[key]} onChange={(e) => {
  const n = Number(e.currentTarget.value)
  if (Number.isNaN(n)) return;
  setFS({
    ...fs,
    [key]: n
  })
}
      } />
      </label>
    </li>)
  }

  // 株主資本合計
  const shareHoldersEquityKeys: Array<keyof FinancialStatement> = ['capitalStock', 'capitalSurplus', 'retainedEarnings'];
  const shareHoldersEquity = shareHoldersEquityKeys.map(key => fs[key]).reduce((acc, cur) => acc + cur, 0);
  // 純資産合計
  const otherNetAssetsKeys: Array<keyof FinancialStatement> = ['subscriptionRights'];
  const netAssetsTotal = shareHoldersEquity + otherNetAssetsKeys.map(key => fs[key]).reduce((acc, cur) => acc + cur, 0);
  // 負債純資産合計
  const liabilitiesAndNetAssetsTotal = fs.currentLiabilitiesTotal + fs.nonCurrentLiabilitiesTotal + netAssetsTotal;
  // 負債純資産のうち流動負債の割合
  const currentLiabilitiesPercent = (fs.currentLiabilitiesTotal / liabilitiesAndNetAssetsTotal) * 100;
  // 負債純資産のうち固定負債の割合
  const nonCurrentLiabilitiesPercent = (fs.nonCurrentLiabilitiesTotal / liabilitiesAndNetAssetsTotal) * 100;

  // 純資産は負の部分を可視化するために正の値と負の値それぞれについて集計する
  // 純資産の正の値の合計
  const positiveNetAssetsTotal = shareHoldersEquityKeys.concat(otherNetAssetsKeys).map(key => Math.max(0, fs[key])).reduce((acc, cur) => acc + cur, 0);
  // 純資産の負の値の合計
  const negativeNetAssetsTotal = Math.abs(shareHoldersEquityKeys.concat(otherNetAssetsKeys).map(key => Math.min(0, fs[key])).reduce((acc, cur) => acc + cur, 0));

  // 純資産の箱の高さ
  const netAssetHeightPercent = (netAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  const negativeNetAssetHeightPercent = (negativeNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  // const netAssetHeightPercent = (positiveNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  // const negativeNetAssetHeightPercent = (negativeNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;

  return (
    <>
      <section className={style.inputArea}>
        <h2 className={style.header}>BS</h2>
        <div>
          <h3>資産の部</h3>
          <ul>
            {createInputElement('currentAsset', '流動資産合計')}
            {createInputElement('nonCurrentAsset', '固定資産合計')}
            {/* <li>
              <label>
                <span className={style.labelText}>固定資産合計</span>
                <input
                  type="number"
                  value={fs.nonCurrentAsset}
                  onChange={createNumberInputOnChangeCallback('nonCurrentAsset')}
                />
              </label>
            </li> */}
            <li>
              <span className={style.labelText}>資産合計</span>
              {fs.currentAsset + fs.nonCurrentAsset}
            </li>
          </ul>
        </div>
        <div className={style.liabilitiesArea}>
          <h3>負債の部</h3>
          <ul>
            {createInputElement('currentDebt', '短期借入金')}
            {createInputElement('shortTermBonds', '短期社債')}
            {createInputElement('currentLiabilitiesTotal', '流動負債合計')}
            {createInputElement('nonCurrentDebt', '長期借入金')}
            {createInputElement('bonds', '社債')}
            {createInputElement('nonCurrentLiabilitiesTotal', '固定負債合計')}
          </ul>
        </div>
        <div className={style.equityArea}>
          <h3>純資産の部</h3>
          <ul>
            {createInputElement('capitalStock', '資本金')}
            {createInputElement('capitalSurplus', '資本剰余金')}
            {createInputElement('retainedEarnings', '利益剰余金')}
            <li>
              <div>
                <span className={style.labelText}>株主資本合計</span>
                {fs.capitalStock + fs.capitalSurplus + fs.retainedEarnings}
              </div>
            </li>
            {createInputElement('subscriptionRights', '新株予約権')}
            <li>
              <div>
                <span className={style.labelText}>純資産合計</span>
                {fs.capitalStock + fs.capitalSurplus + fs.retainedEarnings + fs.subscriptionRights}
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateAreas: "'bs pl'",
        gridTemplateColumns: 'auto auto',
      }}>
        <div style={{
          height: '200px',
          width: '300px',
          border: '1px solid #223',
          gridArea: 'bs',
          display: 'grid',
          gridTemplateAreas: "'assets liabilitiesAndEquity'",
          gridTemplateColumns: '1fr 1fr',
        }}>
        <div style={{ gridArea: 'assets' }}>
          <div
            style={{
              backgroundColor: '#dd7',
              overflow: 'hidden',
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
              overflow: 'hidden',
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
              overflow: 'hidden',
              height: `${currentLiabilitiesPercent}%`,
              border: '1px solid #226',
              boxSizing: 'border-box',
            }}
          >
            <div>流動負債</div>
            <div>{fs.currentLiabilitiesTotal}</div>
          </div>
          <div
            style={{
              backgroundColor: '#d7d',
              overflow: 'hidden',
              border: '1px solid #226',
              boxSizing: 'border-box',
              height: `${nonCurrentLiabilitiesPercent}%`,
            }}
          >
            <div>固定負債</div>
            <div>{fs.nonCurrentLiabilitiesTotal}</div>
          </div>
          <div
            style={{
              backgroundColor: '#d7d',
              overflow: 'hidden',
              height: `${netAssetHeightPercent}%`,
              border: '1px solid #226',
              boxSizing: 'border-box',
            }}
          >
            <div>純資産</div>
            <div>{netAssetsTotal}</div>
          </div>
          <div
            style={{
              backgroundColor: '#d7d',
              overflow: 'hidden',
              height: `${negativeNetAssetHeightPercent}%`,
            }}
          >
            {/* <div>資産</div>
            <div>{negativeNetAssetsTotal}</div> */}
            </div>
          </div>
        </div>
        <div style={{
          height: '200px',
          width: '200px',
          gridArea: 'pl',
          // border: '1px solid #223',
        }}>
          売上高: {fs.plSales}
        </div>
      </section>
    </>
  );
};
