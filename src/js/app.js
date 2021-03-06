'use strict';
const d3 = require("d3");
const Vue = require("vue");

const WifiGraph = require("./wifi-graph");
const WifiDefine = require("./wifi-define");
const WifiIcon = require("./wifi-icon");
const WifiScan = require("./wifi-scan");
const Store = require("./store");
//const iwlist = require("./parser/iwlist");
const store = new Store();
const ouiLookup = require("./oui-lookup");


const wifiGraph = new WifiGraph(Object.assign({
  maxSignal: -20,
  margin: {
    top: 20
  },
  ouiLookup
}, WifiDefine.w24));


wifiGraph.appendTo("#graph");

const filterbox = require("./filterbox")({
  store,
  wifiGraph,
  WifiDefine
});

const preference = require("./preference")({
  store
});


store.on("update-dataset", dataset => {
  wifiGraph.data(dataset);
});

const wifiIcon = new WifiIcon();
const wifiScan = new WifiScan();





const sidebar = new Vue({
  el: "#sidebar",
  data() {
    return {
      mode: "filterbox",
      device: null
    };
  },
  components: {
    filterbox,
    preference
  },
  mounted() {
    wifiIcon.appendTo(this.$refs.svg);
  },
  methods: {
    scan() {
      let cmd;

      if(!store.device) {
        wifiIcon.red();
        return;
      }

      if(store.iwcmd === "iw") {
        cmd = "iwscan";
      }
      else if(store.iwcmd === "wireless") {
        cmd = "iwlist";
      }

      if(wifiScan.lock) {
        wifiIcon.red();
        return;
      }

      wifiIcon.start();
      wifiScan.scan(cmd, store.device)
      .then(res => {
        console.log(res);
        store.setDataset(res);
        wifiIcon.stop();
      })
      .catch(e => {
        wifiIcon.stop();
      });

    },
    toggleMode() {
      this.mode = this.mode === "preference" ? "filterbox" : "preference";
    }

  }

});


store.on("update-device", device => {
  sidebar.device = device;
});


window.onresize = () => {
  wifiGraph.resize();
};

