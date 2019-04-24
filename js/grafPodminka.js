/* eslint-disable react/no-this-in-sfc */
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const GrafPodminka = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      title: {
        text: "Délka podmíněných trestů",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: "Podmínka",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Zkušební doba",
        },
      },
      tooltip: {
        formatter() {
          return `<span style='font-size: 10px'>Podmínka: ${this.x} měsíců</span><br>
            <span style='font-size: 10px'>Zkušební doba: ${this.y} měsíců</span><br>
            <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${data[1][this.point.index]}</b><br>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data[0].map((el, index) => {
          const max = Math.max(...data[1].slice(0, data[1].length - 1));
          return {
            x: el[0],
            y: el[1],
            color: `rgba(74,108,141,
             ${(data[1][index] + max / 2) / max})`,
          };
        }),
      }],
    }}
  />
);

export default GrafPodminka;