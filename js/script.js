import { h, render, Component } from "preact";
/** @jsx h */

const ParaDetails = ({ para, info }) => (
  <div>{Object.keys(info.odst).map(odstavec => info.odst[odstavec].text)}</div>
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p128",
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
          <select className="select-box" onChange={this.handleChange}>
            {Object.keys(paraData).map(entry => (
              <option value={entry} selected={para === entry ? "selected" : ""}>{`${paraData[entry].par} ${paraData[entry].nazev}`}</option>
            ))}
          </select>
          <ParaDetails para={para} info={paraData[para]} />
        </div>
      )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
