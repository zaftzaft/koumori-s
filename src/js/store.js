'use strict';

const EventEmitter = require('events');
const Utils        = require("./utils");

class Store extends EventEmitter {
  constructor() {
    super();
    this.series = [];
    this.dataset = [];

    this.seekMax = 0;
    this.seek = 0;
    this.time = 0;

    this.queryFilter = null;
    this.signalFilter = -100;

    this.iwcmd = "iw";
    this.device = null;
  }


  setSeek(seek) {
    this.seek = seek;
    this.updateDataset();
  }


  setQueryFilter(query) {
    this.queryFilter = query;
    this.updateDataset();
  }


  setSignalFilter(signal) {
    this.signalFilter = signal;
    this.updateDataset();
  }


  updateDataset() {
    //let dataset = this.series[this.seek].dataset;
    //this.time = this.series[this.seek].time;

    let dataset = this.dataset.filter(d => {
      if(this.queryFilter && !this.queryFilter.test(d.ssid)) {
        return false;
      }

      if(this.signalFilter > d.signal) {
        return false;
      }

      return true;
    }).map(d => {
      d.color = Utils.getColorByHash(d.mac);
      return d;
    });



    //this.dataset = dataset;
    this.emit("update-dataset", dataset, this.time);
  }


  setDataset(d) {
    this.dataset = d;
    this.updateDataset();
  }


  setDevice(device) {
    this.device = device;
    this.emit("update-device", this.device);
  }

}


module.exports = Store;
