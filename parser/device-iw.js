'use strict';

const fs = require("fs");
//const execSync = require("child_process").execSync;
const readline = require("readline");

const { spawn } = require("child-process-promise");

const iw = spawn("iw", ["dev"]);
//console.log(iw);
//iw.stderr.on("line", e => console.error(e));
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
    //obj.mac = line.split(" ")[1].split("(")[0];
  }
  else if(/^addr/.test(line)) {
    obj.addr = line.split(" ")[1];
  }
  else if(/^type/.test(line)) {
    obj.type = line.split(" ")[1];
  }
  else if(/^txpower/.test(line)) {
    obj.txpower = line.split(" ")[1];
  }
  else if(/^channel/.test(line)) {
    obj.channel = line.split(" ")[1];
  }
});

rl.on("close", () => {
  obj && results.push(Object.assign({}, obj));
  console.log(results);
});
