/* eslint-disable react/no-this-in-sfc */
/** @jsx h */
import { h } from "preact";
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
        tickInterval: 12,
        title: {
          text: "měsíců",
        },
      },
      yAxis: {
        tickInterval: 12,
        min: 0,
        title: {
          text: "Zkušební doba",
        },
      },
      tooltip: {
        formatter() {
          const value = data.filter((el) => el[0] === this.x && el[1] === this.y)[0][2];
          return `<span style='font-size: 10px'>Podmínka: ${this.x} měsíců</span><br>
            <span style='font-size: 10px'>Zkušební doba: ${this.y} měsíců</span><br>
            <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${value}</b><br>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data.map((el) => {
          const max = Math.max(...data[1].slice(0, data[1].length - 1));
          return {
            x: el[0], // + Math.random() - 0.5, //random jitter 0.5 v obou směrech
            y: el[1], // + Math.random() - 0.5,
            color: `rgba(74,108,141,
             ${((el[2] + max / 2) / max) * 0.7})`, // jemnejsi barvy
          };
        }),
      }],
    }}
  />
);

export default GrafPodminka;
