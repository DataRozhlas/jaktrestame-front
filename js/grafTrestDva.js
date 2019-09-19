/* eslint-disable react/no-this-in-sfc */
/** @jsx h */
import { h } from "preact";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { trestyCiselnik } from "./trestyCiselnik";

export const GrafTrestDva = ({ data }) => {
  function toObj(arr) {
    return arr[0].reduce((acc, el, idx) => {
      if (!acc[el]) return ({ ...acc, [el]: arr[1][idx] });
      return ({ ...acc, [el]: acc[el] + arr[1][idx] });
    }, {});
  }
  const tresty = ["trest2", "trest3", "trest4", "trest5"];
  const trestySum = [
    [].concat(...tresty.map((trest) => data[trest][0])),
    [].concat(...tresty.map((trest) => data[trest][1])),
  ];
  const trestyObj = toObj(trestySum);

  // beztrest jen z trest2
  trestyObj[13] = data.trest2[1][data.trest2[0].indexOf(13)];

  const processedData = Object.entries(trestyObj)
    .map((entry) => ({ name: trestyCiselnik[entry[0]], data: [entry[1]] }))
    .sort((a, b) => b.data[0] - a.data[0]);

  const percentageData = processedData.map((el) => el.data[0] * 100 / data.trest1[1][0]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          type: "column",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: [""],
        },
        yAxis: {
          min: 0,
          title: {
            text: "Odsouzených",
          },
        },
        title: {
          text: "Vedlejší tresty",
        },
        tooltip: {
          pointFormatter() {
            return `<span style='color:${this.color}'>${this.series.name}</span>:
              <b>${String(Math.round(100 * percentageData[this.colorIndex]) / 100).replace(".", ",")} %</b> (${this.y})<br/>`;
          },
          shared: true,
        },
        series: processedData,
      }}
    />
  );
};

export default GrafTrestDva;
