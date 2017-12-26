'use strict';

const Utils = require("./utils");

module.exports = {
  w24: {
    channelOffset: 1,
    channelStep: 1,
    channel: Utils.bandFreq["w24"],
    freq: {
      begin: 2400,
      end: 2500
    }
  },

  w52: {
    channelOffset: 36,
    channelStep: 4,
    channel: Utils.bandFreq["w52"],
    freq: {
      begin: 5170,
      end: 5330
    }
  },

  w56: {
    channelOffset: 100,
    channelStep: 4,
    channel: Utils.bandFreq["w56"],
    freq: {
      begin: 5490,
      end: 5710
    }

  }
};
