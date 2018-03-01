'use strict';

const Vue = require("vue");
const Utils = require("./utils");

module.exports = options => {
  return {
    template: "#template-preference",
    data() {
      return {
        cmd: options.store.iwcmd
      }
    },
    watch: {
      cmd(val) {
        options.store.iwcmd = val;
      }
    }
  };
};
