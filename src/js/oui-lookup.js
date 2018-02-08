'use strict';

const oui = require("../json/oui.json");

module.exports = mac => {
  const prefix = mac.replace(/:|-/g, "").toUpperCase();

  return oui[prefix.slice(0, 6)] ||
    oui[prefix.slice(0, 7)] ||
    oui[prefix.slice(0, 9)];
};
