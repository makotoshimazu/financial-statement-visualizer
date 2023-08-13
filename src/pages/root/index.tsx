import { useId, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./style.module.scss";
import useLocalStorage from "../../lib/storage";
import NumberText from "../../components/number_text";
import { routes } from "../../lib/routes";

type FinancialStatement = {
  // 流動資産
  currentAsset: number;
  // 固定資産
  nonCurrentAsset: number;
  // 流動負債合計
  currentLiabilitiesTotal: number;
  // 短期借入金
  currentDebt: number;
  // 短期社債
  shortTermBonds: number;
  // 固定負債合計
  nonCurrentLiabilitiesTotal: number;
  // 長期借入金
  nonCurrentDebt: number;
  // 社債
  bonds: number;
  // 資本金
  capitalStock: number;
  // 資本剰余金
  capitalSurplus: number;
  // 利益剰余金
  retainedEarnings: number;
  // 新株予約権
  subscriptionRights: number;
  // 純資産合計
  // netAssetsTotal: number,

  // PL
  // 売上高
  plSales: number;
  // 売上原価
  plCostOfSales: number;
  // 販管費
  plSalesAndAdministrativeExpenses: number;
  // 営業外収益
  plNonOperatingIncome: number;
  // 営業外費用
  plNonOperatingExpenses: number;
  // 特別損失
  plSpecialLoss: number;
  // // 税引前当期純利益
  // plProfitBeforeTax: number;
  // 法人税等
  plCorporateTax: number;
};

export default function Root() {
  const { companyId = "default" } = useParams();
  const navigate = useNavigate();

  const [fs, setFS, copyFS] = useLocalStorage<FinancialStatement>(
    `fs/${companyId}`,
    {
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
      plSpecialLoss: 0,
      plCorporateTax: 0,
    },
  );

  const [copyToKey, setCopyToKey] = useState(companyId);

  const createInputElement = (key: keyof FinancialStatement, label: string) => {
    const labelId = useId();
    return (
      <li>
        <label htmlFor={labelId}>
          <span className={style.labelText}>{label}</span>
          <input
            id={labelId}
            type="number"
            value={fs[key]}
            onChange={(e) => {
              const n = Number(e.currentTarget.value);
              if (Number.isNaN(n)) return;
              setFS({
                ...fs,
                [key]: n,
              });
            }}
          />
        </label>
      </li>
    );
  };

  // 資産合計
  const assetTotal = fs.currentAsset + fs.nonCurrentAsset;

  // 株主資本合計
  const shareHoldersEquityKeys: Array<keyof FinancialStatement> = [
    "capitalStock",
    "capitalSurplus",
    "retainedEarnings",
  ];
  const shareHoldersEquity = shareHoldersEquityKeys
    .map((key) => fs[key])
    .reduce((acc, cur) => acc + cur, 0);
  // 純資産合計
  const otherNetAssetsKeys: Array<keyof FinancialStatement> = [
    "subscriptionRights",
  ];
  const netAssetsTotal =
    shareHoldersEquity +
    otherNetAssetsKeys.map((key) => fs[key]).reduce((acc, cur) => acc + cur, 0);
  // 負債純資産合計
  const liabilitiesAndNetAssetsTotal =
    fs.currentLiabilitiesTotal + fs.nonCurrentLiabilitiesTotal + netAssetsTotal;
  // 負債純資産のうち流動負債の割合
  const currentLiabilitiesPercent =
    (fs.currentLiabilitiesTotal / liabilitiesAndNetAssetsTotal) * 100;
  // 負債純資産のうち固定負債の割合
  const nonCurrentLiabilitiesPercent =
    (fs.nonCurrentLiabilitiesTotal / liabilitiesAndNetAssetsTotal) * 100;

  // 純資産は負の部分を可視化するために正の値と負の値それぞれについて集計する
  // 純資産の正の値の合計
  // const positiveNetAssetsTotal = shareHoldersEquityKeys
  //   .concat(otherNetAssetsKeys)
  //   .map((key) => Math.max(0, fs[key]))
  //   .reduce((acc, cur) => acc + cur, 0);
  // 純資産の負の値の合計
  const negativeNetAssetsTotal = Math.abs(
    shareHoldersEquityKeys
      .concat(otherNetAssetsKeys)
      .map((key) => Math.min(0, fs[key]))
      .reduce((acc, cur) => acc + cur, 0),
  );

  // 純資産の箱の高さ
  const netAssetHeightPercent =
    (netAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  const negativeNetAssetHeightPercent =
    (negativeNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  // const netAssetHeightPercent = (positiveNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;
  // const negativeNetAssetHeightPercent = (negativeNetAssetsTotal / liabilitiesAndNetAssetsTotal) * 100;

  // 売上総利益
  const plGrossProfit = fs.plSales - fs.plCostOfSales;
  // 営業利益
  const plOperatingProfit = plGrossProfit - fs.plSalesAndAdministrativeExpenses;
  // 営業外利益
  const plNonOperatingProfit =
    fs.plNonOperatingIncome - fs.plNonOperatingExpenses;
  // 経常利益
  const plOrdinaryProfit = plOperatingProfit + plNonOperatingProfit;
  // 税引前当期純利益
  const plProfitBeforeTax = plOrdinaryProfit - fs.plSpecialLoss;
  // 当期純利益
  const plProfitTotal = plProfitBeforeTax - fs.plCorporateTax;

  // 総資本回転率
  const totalCapitalTurnoverRatio = fs.plSales / assetTotal;

  return (
    <>
      <section className={[style.inputArea, style.bs].join(" ")}>
        <h2 className={style.header}>BS</h2>
        <div>
          <h3>資産の部</h3>
          <ul>
            {createInputElement("currentAsset", "流動資産合計")}
            {createInputElement("nonCurrentAsset", "固定資産合計")}
            <li>
              <span className={style.labelText}>資産合計</span>
              <NumberText value={assetTotal} />
            </li>
          </ul>
        </div>
        <div className={style.liabilitiesArea}>
          <h3>負債の部</h3>
          <ul>
            {createInputElement("currentDebt", "短期借入金")}
            {createInputElement("shortTermBonds", "短期社債")}
            {createInputElement("currentLiabilitiesTotal", "流動負債合計")}
            {createInputElement("nonCurrentDebt", "長期借入金")}
            {createInputElement("bonds", "社債")}
            {createInputElement("nonCurrentLiabilitiesTotal", "固定負債合計")}
          </ul>
        </div>
        <div className={style.equityArea}>
          <h3>純資産の部</h3>
          <ul>
            {createInputElement("capitalStock", "資本金")}
            {createInputElement("capitalSurplus", "資本剰余金")}
            {createInputElement("retainedEarnings", "利益剰余金")}
            <li>
              <div>
                <span className={style.labelText}>株主資本合計</span>
                <NumberText value={shareHoldersEquity} />
              </div>
            </li>
            {createInputElement("subscriptionRights", "新株予約権")}
            <li>
              <div>
                <span className={style.labelText}>純資産合計</span>
                <NumberText value={netAssetsTotal} />
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className={style.inputArea}>
        <h2>PL</h2>
        <ul>
          {createInputElement("plSales", "売上高")}
          {createInputElement("plCostOfSales", "売上原価")}
          <li>
            <span className={style.labelText}>売上総利益: </span>
            <NumberText value={plGrossProfit} />
          </li>
          {createInputElement("plSalesAndAdministrativeExpenses", "販管費")}
          <li>
            <span className={style.labelText}>営業利益: </span>
            <NumberText value={plOperatingProfit} />
          </li>
          {createInputElement("plNonOperatingIncome", "営業外収益")}
          {createInputElement("plNonOperatingExpenses", "営業外費用")}
          <li>
            <span className={style.labelText}>経常利益: </span>
            <NumberText value={plOrdinaryProfit} />
          </li>
          {createInputElement("plSpecialLoss", "特別損失")}
          {/* {createInputElement("plProfitBeforeTax", "税引前当期純利益")} */}
          <li>
            <span className={style.labelText}>税引前当期純利益: </span>
            <NumberText value={plProfitBeforeTax} />
          </li>
          {createInputElement("plCorporateTax", "法人税等")}
          <li>
            <span className={style.labelText}>当期純利益: </span>
            <NumberText value={plProfitTotal} />
          </li>
        </ul>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateAreas: "'bs pl'",
          gridTemplateColumns: "auto auto",
        }}
      >
        <div
          style={{
            height: "200px",
            width: "300px",
            border: "1px solid #223",
            gridArea: "bs",
            display: "grid",
            gridTemplateAreas: "'assets liabilitiesAndEquity'",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div style={{ gridArea: "assets" }}>
            <div
              style={{
                backgroundColor: "#dd7",
                overflow: "hidden",
                height: `${
                  (fs.currentAsset / (fs.currentAsset + fs.nonCurrentAsset)) *
                  100
                }%`,
              }}
            >
              <div>流動資産</div>
              <div>
                <NumberText value={fs.currentAsset} />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#7dd",
                overflow: "hidden",
                height: `${
                  (fs.nonCurrentAsset /
                    (fs.currentAsset + fs.nonCurrentAsset)) *
                  100
                }%`,
              }}
            >
              <div>固定資産</div>
              <div>
                <NumberText value={fs.nonCurrentAsset} />
              </div>
            </div>
          </div>
          <div style={{ gridArea: "liabilitiesAndEquity" }}>
            <div
              style={{
                backgroundColor: "#d7d",
                overflow: "hidden",
                height: `${currentLiabilitiesPercent}%`,
                border: "1px solid #226",
                boxSizing: "border-box",
              }}
            >
              <div>流動負債</div>
              <div>
                <NumberText value={fs.currentLiabilitiesTotal} />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#d7d",
                overflow: "hidden",
                border: "1px solid #226",
                boxSizing: "border-box",
                height: `${nonCurrentLiabilitiesPercent}%`,
              }}
            >
              <div>固定負債</div>
              <div>
                <NumberText value={fs.nonCurrentLiabilitiesTotal} />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#d7d",
                overflow: "hidden",
                height: `${netAssetHeightPercent}%`,
                border: "1px solid #226",
                boxSizing: "border-box",
              }}
            >
              <div>純資産</div>
              <div>
                <NumberText value={netAssetsTotal} />
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#d7d",
                overflow: "hidden",
                height: `${negativeNetAssetHeightPercent}%`,
              }}
            >
              {/* <div>資産</div>
            <div>{negativeNetAssetsTotal}</div> */}
            </div>
          </div>
        </div>
        <div
          style={{
            height: "200px",
            width: "200px",
            gridArea: "pl",
            // border: '1px solid #223',
          }}
        >
          売上高: <NumberText value={fs.plSales} />
        </div>
      </section>
      <section>
        <input
          type="text"
          value={copyToKey}
          onChange={(e) => setCopyToKey(e.target.value)}
          placeholder="保存するIDを入れてください"
        />
        <button
          type="button"
          onClick={() => {
            copyFS(`fs/${copyToKey}`);
            navigate(routes.finantialStatement(copyToKey));
          }}
        >
          保存
        </button>
      </section>
    </>
  );
}
