'use strict';

const fs = require("fs");
const readline = require("readline");
const { spawn } = require("child-process-promise");

module.exports = () => {
  return new Promise((resolv, reject) => {
    const iw = spawn("iw", ["dev"]);
    const rl = readline.createInterface(iw.childProcess.stdout, {});

    let obj = null;
    let results = [];

    rl.on("line", line => {
      line = line.trim();

      if(/^Interface/.test(line)) {
        if(obj) {
          results.push(Object.assign({}, obj));
        }
        obj = {};
        obj.name = line.split(" ")[1];
      }
      else if(/^addr/.test(line)) {
        obj.addr = line.split(" ")[1];
      }
      else if(/^type/.test(line)) {
        obj.type = line.split(" ")[1];
      }
      else if(/^txpower/.test(line)) {
        obj.txpower = parseInt(line.split(" ")[1], 10);
      }
      else if(/^channel/.test(line)) {
        obj.channel = line.split(" ")[1];
      }
    });

    rl.on("close", () => {
      obj && results.push(Object.assign({}, obj));
      resolv(results);
    });

  });
};
