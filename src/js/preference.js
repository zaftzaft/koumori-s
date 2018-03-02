'use strict';

const Vue = require("vue");
const Utils = require("./utils");
const deviceIw = require("../../parser/device-iw");

module.exports = options => {
  return {
    template: "#template-preference",
    data() {
      return {
        cmd: options.store.iwcmd,
        devices: []
      }
    },
    watch: {
      cmd(val) {
        options.store.iwcmd = val;
      }
    },
    created() {
      deviceIw().then(devices => {
        this.devices = devices;
      });
    },
    methods: {
      setDevice(device) {
        options.store.setDevice(device);
      }
    }
  };
};
