'use strict';

const Vue = require("vue");
const Utils = require("./utils");

module.exports = options => {
  const filterbox = {
    //el: "#filterbox",
    template: "#template-filterbox",
    data() {
      return {
        dataset: [],
        band: "w24",
        signalFilter: -100,
        signals: [ -100, -90, -80, -70, -60, -50 ],
        query: "",
        count: {
          w24: 0, w52: 0, w56: 0
        }
      }
    },
    methods: {
      f2c(f) {
        return Utils.freqToChannel(f);
      },

      updateDataset(dataset) {
        let counter = [0, 0, 0]; // 2.4 5.2 5.6
        dataset.forEach(d => {
          const f = d.freq;
          if(2412 <=  f && f <= 2484) {
            counter[0]++;
          }
          else if(5180 <= f && f <= 5320) {
            counter[1]++;
          }
          else {
            counter[2]++;
          }
        });
        this.count.w24 = counter[0];
        this.count.w52 = counter[1];
        this.count.w56 = counter[2];
        this.dataset = dataset;

      }
    },
    created() {
      options.store.on("update-dataset", this.updateDataset);

      this.$watch("query", function() {
        options.store.setQueryFilter(this.query ? new RegExp(`.*${this.query}.*`) : null);
      });

      this.$watch("signalFilter", function() {
        options.store.setSignalFilter(this.signalFilter);
      });

      this.$watch("band", v => {
        options.wifiGraph.update(options.WifiDefine[v]);
      });

      options.store.updateDataset();

    },
    beforeDestroy() {
      options.store.removeListener("update-dataset", this.updateDataset);
    }

  };


  return filterbox;
};
