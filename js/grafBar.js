/* eslint-disable react/no-this-in-sfc */
/** @jsx h */
import { h } from "preact";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const GrafBar = ({ data, title, unit }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "column",
      },
      title: {
        text: title,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false,
        },
      },
      xAxis: {
        categories: data[0].map(num => Math.round(num)),
        title: {
          text: unit,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených",
        },
      },
      tooltip: {
        formatter() {
          return `<span style='font-size: 10px'>${this.x}-${Math.round(this.x + data[0][1] - data[0][0])} ${unit}</span><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data[1],
        pointPlacement: "between",
      }],
    }}
  />
);


export default GrafBar;
