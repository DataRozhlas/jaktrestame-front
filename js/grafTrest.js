import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { trestyCiselnik } from "./trestyCiselnik";

export const GrafTrest = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "percent",
        },
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
          text: "Odsouzených (%)",
        },
        reversedStacks: false,
      },
      title: {
        text: "Hlavní trest",
      },
      tooltip: {
        pointFormat: "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f} %)<br/>",
        shared: true,
      },
      series: data[0]
        .map((entry, index) => ({ name: trestyCiselnik[entry], data: [data[1][index]] }))
        .sort((a, b) => b.data[0] - a.data[0]),
    }}
  />
);

export default GrafTrest;
