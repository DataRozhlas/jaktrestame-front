/* eslint-disable react/no-this-in-sfc */
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { trestyCiselnik } from "./trestyCiselnik";

export const GrafTrestDva = ({ data }) => {
  const processedData = Object.keys(data)
    .map(entry => ({ name: trestyCiselnik[entry], data: [data[entry]] }))
    .sort((a, b) => b.data[0] - a.data[0]);
  /* na procenta se neprevadi kvuli souctu trest2, trest3...
  const percentageData = processedData.map(el => el.data[0] * 100 / processedData
    .map(n => n.data[0])
    .reduce((acc, val) => val + acc, 0));
  */
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
          /*
          pointFormatter() {
             return `<span style='color:${this.color}'>${this.series.name}</span>:
              <b>${String(Math.round(100 * percentageData[this.colorIndex]) / 100).replace(".", ",")} %</b> (${this.y})<br/>`;
          },
          */
          shared: true,
        },
        series: processedData,
      }}
    />
  );
};

export default GrafTrestDva;
