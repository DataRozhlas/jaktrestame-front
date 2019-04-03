/* eslint-disable react/no-danger */
import React, { Component } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ParaDetails = ({ info }) => (
  <div id="para-details">
    {Object.keys(info.odst).map(odstavec => (
      <div key={odstavec}>
        <div dangerouslySetInnerHTML={{ __html: info.odst[odstavec].text }} />
        {Object.keys(info.odst[odstavec].pism).map(pismeno => (
          <div key={pismeno} dangerouslySetInnerHTML={{ __html: info.odst[odstavec].pism[pismeno].text }} />
        ))}
      </div>
    ))}
  </div>
);

const GenderRatio = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "normal",
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
          text: 'Odsouzených',
        },
      },
      title: {
        text: "Pohlaví",
      },
      tooltip: {
        shared: true,
      },
      series: [{
        name: "Muži",
        data: [data.pohlavi["muž"]],
      }, {
        name: "Ženy",
        data: [data.pohlavi["žena"]],
      }],
    }}
  />
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p378",
      paraData: {},
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.initLoad();
    this.loadData();
  }

  // loading the paragraph list
  initLoad() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.irozhlas.cz/jaktrestame-front/data/paragrafy.json";
    xhr.open("get", url, true);
    xhr.onload = () => {
      this.setState({ paraData: JSON.parse(xhr.responseText) });
    };
    xhr.send();
  }

  // loading the paragraph data
  loadData() {
    const xhr = new XMLHttpRequest();
    // demo data for now
    const url = "https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=eyJyb2tfcm96aG9kbnV0aSI6ICInMjAxNSciLCAicGFyYWdyYWYiOiAiJzE5NiciLCAiamVkZW5fdGMiOiAiVHJ1ZSJ9";
    xhr.open("get", url, true);
    xhr.onload = () => {
      this.setState({ data: JSON.parse(xhr.responseText) });
    };
    xhr.send();
  }

  handleChange() {
    this.setState({ para: event.target.value });
    this.loadData();
  }

  render() {
    const { para, data, paraData } = this.state;
    console.log(data, paraData);
    return (
      Object.keys(paraData).length === 0 || Object.keys(data).length === 0 ? <div>Načítám...</div> : (
        <div>
          <select className="select-box" defaultValue={para} onChange={this.handleChange}>
            {Object.keys(paraData).map(entry => (
              <option key={entry} value={entry}>{`${paraData[entry].par} ${paraData[entry].nazev}`}</option>
            ))}
          </select>
          <ParaDetails para={para} info={paraData[para]} />
          <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>
          <GenderRatio data={data} />
        </div>
      )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
