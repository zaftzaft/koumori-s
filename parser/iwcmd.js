#!/bin/env node
'use strict';

const readline = require("readline");
const {spawn} = require("child_process");

const iwlistParser = require("./iwlist-parser");
const iwscanParser = require("./iwscan-parser");

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout
});

rl.on("line", line => {
  const o = line.split("/");
  const cmd = o[0];
  if(cmd === "iwlist") {
    const iwlistStream = spawn("iwlist", [o[1], "scanning"]);
    iwlistParser(iwlistStream.stdout).then(res => {
      console.log(JSON.stringify(res));
    });

//    iwlistStream.on("error", e => {
//      console.error(e.stack);
//    });

//    iwlistStream.stderr.on("data", d => {
//      console.error(""+d);
//    });

//    iwlistStream.on("close", () => {
//      console.log("close");
//    });

//    iwlistStream.on("exit", () => {
//      console.log("exit");
//    });


  }
  else if(cmd === "iwscan") {
    const iwscanStream = spawn("iw", ["dev", o[1], "scan"]);
    iwscanParser(iwscanStream.stdout).then(res => {
      console.log(JSON.stringify(res));
    });
  }

});

