/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { Component } from "react";
import { render } from "react-dom";
import { trestyCiselnik } from "./trestyCiselnik";
import { GrafGender } from "./grafGender";
import { GrafTrest } from "./grafTrest";
import { GrafTrestDva } from "./grafTrestDva";
import { GrafVek } from "./grafVek";
import { GrafNepodminene } from "./grafNepodminene";
import { GrafPodminka } from "./grafPodminka";

const ParaDetails = ({ info }) => (
  <div id="para-details">
    {Object.keys(info.odst).map(odstavec => (
      <div key={odstavec}>
        <div dangerouslySetInnerHTML={{ __html: info.odst[odstavec].text }} />
        {Object.keys(info.odst[odstavec].pism).map(pismeno => (
          <div
            key={pismeno}
            dangerouslySetInnerHTML={{ __html: info.odst[odstavec].pism[pismeno].text }}
          />
        ))}
      </div>
    ))}
  </div>
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p173",
      odst: ["1", "2", "3", "4"],
      year: ["2016", "2017", "2018"],
      drivods: ["0", "1-2", "3-5", "6-10", ">10"],
      soubeh: ["T"],
      pohlavi: ["muz", "zena"],
      trest1: "all",
      paraData: {},
      odstData: {},
      data: {},
      secondaryData: [[]],
    };
  }

  componentDidMount() {
    this.initLoad();
  }

  // loading the paragraph list
  initLoad() {
    const xhr = new XMLHttpRequest();
    const paraUrl = "https://data.irozhlas.cz/jaktrestame-front/data/paragrafy.json";
    xhr.open("get", paraUrl, true);
    xhr.onload = () => {
      this.setState({ paraData: JSON.parse(xhr.responseText) });
    };
    xhr.send();
    const xhr2 = new XMLHttpRequest();
    const odstUrl = "https://data.irozhlas.cz/jaktrestame-front/data/odstavce.json";
    xhr2.open("get", odstUrl, true);
    xhr2.onload = () => {
      this.setState({ odstData: JSON.parse(xhr2.responseText) }, () => this.loadData());
    };
    xhr2.send();
  }

  // loading the paragraph data
  loadData(secondary = false) {
    const {
      para, year, odst, drivods, soubeh, pohlavi, trest1,
    } = this.state;
    // the request object:
    // {"paragraf": "'196'"}
    // rok_rozhodnuti: "2015" (16, 17)
    // odstavec_nej: odstavce.json
    // drivods_kat: '1-2'...
    // jeden_tc: T/F (souběh)
    // 'novela'
    // pohlavi
    const requestObject = {
      paragraf: `${para.substring(1)}`,
    };
    requestObject.rok_rozhodnuti = year;
    requestObject.odstavec_nej = odst;
    requestObject.drivods_kat = drivods;
    requestObject.jeden_tc = soubeh;
    requestObject.pohlavi = pohlavi;
    if (trest1 !== "all") requestObject.trest1 = `${trest1}`;
    console.log(requestObject, btoa(JSON.stringify(requestObject)));
    const xhr = new XMLHttpRequest();
    const url = `https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=${btoa(JSON.stringify(requestObject))}`;
    xhr.open("get", url, true);
    xhr.onload = () => {
      if (!secondary) this.setState({ data: JSON.parse(xhr.responseText) });
      else {
        // sekundarni tresty: null z trest2, ostatní součet trest2...5
        const data = JSON.parse(xhr.responseText);
        const secondarySum = {};
        data.trest2[0].forEach((el, index) => {
          secondarySum[el] = data.trest2[1][index];
        });

        [data.trest3, data.trest4, data.trest5].forEach(trest => trest[0].forEach((el, index) => {
          if (el !== null) {
            secondarySum[el]
              ? secondarySum[el] += trest[1][index]
              : secondarySum[el] = trest[1][index];
          }
        }));
        this.setState({ secondaryData: secondarySum });
      }
      console.log(this.state);
    };
    xhr.send();
  }

  handleParaSelect(changeEvent) {
    const newOdst = this.state.odstData[changeEvent.target.value.substring(1)].sort().map(el => String(el));
    this.setState({
      para: changeEvent.target.value,
      odst: newOdst,
      year: ["2016", "2017", "2018"],
      drivods: ["0", "1-2", "3-5", "6-10", ">10"],
      soubeh: ["T"],
      pohlavi: ["muz", "zena"],
      trest1: "all",
      secondaryData: [[]],
    }, () => this.loadData());
  }

  handleCheckboxSelect(id, changeEvent) {
    // eslint-disable-next-line prefer-destructuring
    const state = this.state;

    if (id === "para") {
      this.setState({
        odst: "all",
        para: ["1", "2", "3", "4", "5"],
        year: ["2016", "2017", "2018"],
        drivods: ["0", "1-2", "3-5", "6-10", ">10"],
        soubeh: ["T"],
        pohlavi: ["muz", "zena"],
        trest1: "all",
      });
    }

    const stateChange = {};
    stateChange[id] = state[id].includes(changeEvent.target.value)
      ? state[id].filter(el => el !== changeEvent.target.value)
      : [...state[id], changeEvent.target.value];
    if (stateChange[id].length !== 0) {
      stateChange.trest1 = "all";
      stateChange.secondaryData = [[]];
      this.setState(stateChange, () => this.loadData());
    }
  }

  handleSecondarySelect(changeEvent) {
    this.setState({ trest1: changeEvent.target.value }, () => {
      this.loadData(true);
    });
  }

  render() {
    const {
      para, data, paraData, odstData, odst, year, drivods, soubeh, pohlavi, trest1, secondaryData,
    } = this.state;
    return (
      Object.keys(paraData).length === 0
        || Object.keys(data).length === 0
        || Object.keys(odstData).length === 0
        ? <div>Načítám...</div>
        : (
          <div>
            <select className="select-box" defaultValue={para} onChange={e => this.handleParaSelect(e)}>
              {Object.keys(paraData).map(entry => (
                <option key={entry} value={entry}>{`${paraData[entry].par} ${paraData[entry].nazev}`}</option>
              ))}
            </select>

            <form id="year-select">
              <b>Rok: </b>
              <label htmlFor="year-2016">
                <input type="checkbox" name="year" value="2016" id="year-2016" onChange={e => this.handleCheckboxSelect("year", e)} checked={year.includes("2016")} />
                {" 2016 "}
              </label>
              <label htmlFor="year-2017">
                <input type="checkbox" name="year" value="2017" id="year-2017" onChange={e => this.handleCheckboxSelect("year", e)} checked={year.includes("2017")} />
                {" 2017 "}
              </label>
              <label htmlFor="year-2018">
                <input type="checkbox" name="year" value="2018" id="year-2018" onChange={e => this.handleCheckboxSelect("year", e)} checked={year.includes("2018")} />
                {" 2018 "}
              </label>
            </form>

            <form id="odst-select">
              <b>Odstavec: </b>
              {odstData[para.substring(1)].sort().map(entry => (
                <span key={entry}>
                  <input type="checkbox" name="odst" value={entry} onChange={e => this.handleCheckboxSelect("odst", e)} checked={odst.includes(String(entry))} />
                  {` ${entry} `}
                </span>
              ))}
            </form>

            <form id="drivods-select">
              <b>Počet předchozích odsouzení: </b>
              {["0", "1-2", "3-5", "6-10", ">10"].map(entry => (
                <span key={entry}>
                  <input type="checkbox" name="drivods" value={entry} onChange={e => this.handleCheckboxSelect("drivods", e)} checked={drivods.includes(entry)} />
                  {` ${entry} `}
                </span>
              ))}
            </form>

            <form id="soubeh-select">
              <b>Souběh s jiným odsouzením: </b>
              <input type="checkbox" name="soubeh" value="F" onChange={e => this.handleCheckboxSelect("soubeh", e)} checked={soubeh.includes("F")} />
              {" Ano "}
              <input type="checkbox" name="soubeh" value="T" onChange={e => this.handleCheckboxSelect("soubeh", e)} checked={soubeh.includes("T")} />
              {" Ne "}
            </form>

            <form id="pohlavi-select">
              <b>Pohlaví: </b>
              <input type="checkbox" name="pohlavi" value="muz" onChange={e => this.handleCheckboxSelect("pohlavi", e)} checked={pohlavi.includes("muz")} />
              {" Muži "}
              <input type="checkbox" name="pohlavi" value="zena" onChange={e => this.handleCheckboxSelect("pohlavi", e)} checked={pohlavi.includes("zena")} />
              {" Ženy "}
            </form>
            <div><b>Znění zákona:</b></div>
            <ParaDetails para={para} info={paraData[para]} />
            <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>

            {data.len >= 5 ? (
              <div>
                <GrafTrest data={data.trest1} />

                {data.trest1[1].some(el => el >= 5) && (
                  <form id="trest-select">
                    <b>Hlavní trest:</b>
                    <br />
                    {data.trest1[0].filter((el, index) => data.trest1[1][index] > 5).map(el => (
                      <span key={el}>
                        <input type="radio" name="trest" value={el} onChange={e => this.handleSecondarySelect(e)} checked={trest1 === String(el)} />
                        {` ${trestyCiselnik[el]} (${data.trest1[1].filter((_, index) => data.trest1[0][index] === el)[0]}) `}
                        <br />
                      </span>
                    ))}
                  </form>
                )}

                {Object.keys(secondaryData).length > 1 && (
                  <GrafTrestDva data={secondaryData} />
                )}

                <GrafNepodminene data={data.delka_nepo} />
                <GrafPodminka data={data.podminky} />
                <GrafVek data={data.vek} />
                {pohlavi.length === 2 && <GrafGender data={data.pohlavi} />}
              </div>
            ) : (
              <div>
                <p><i>Odsouzených je příliš málo na zobrazení podrobnějších dat.</i></p>
              </div>
            )}
          </div>
        )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
