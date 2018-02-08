'use strict';

const fs = require("fs");
const execSync = require("child_process").execSync;
const readline = require("readline");

const { spawn } = require("child-process-promise");

const channelMap = {
  2412: 1, 2417: 2, 2422: 3, 2427: 4, 2432: 5,
  2437: 6, 2442: 7, 2447: 8, 2452: 9, 2457:10,
  2462: 11, 2467: 12, 2472: 13, 2484: 14,

  5180: 36, 5200: 40, 5220: 44, 5240: 48,
  5260: 52, 5280: 56, 5300: 60, 5320: 64,

  5500: 100,
  5520: 104, 5540: 108, 5560: 112, 5580: 116, 5600: 120,
  5620: 124, 5640: 128, 5660: 132, 5680: 136, 5700: 140,

  5745: 149, 5765: 153, 5785: 157, 5805: 161
};



module.exports = (iwscanStream) => {
  return new Promise((resolv, reject) => {
    const rl = readline.createInterface(iwscanStream, {});

    let obj = null;
    let results = [];

    rl.on("line", line => {
      line = line.trim();

      if(/^BSS/.test(line)) {
        if(obj) {
          results.push(Object.assign({}, obj));
        }
        obj = {};
        obj.mac = line.split(" ")[1].split("(")[0];
      }
      else if(/^SSID/.test(line)) {
        let ssid = line.split("SSID:")[1].replace(/\"/g, "");
        ssid = ssid.replace(/\\x/g, ".x");
        obj.ssid = ssid;
      }
      else if(/^freq/.test(line)) {
        const freq = parseInt(line.split("freq:")[1], 10);
        obj.freq = freq;
        obj.channel = channelMap[freq];
      }
      else if(/^signal/.test(line)) {
        obj.signal = parseInt(line.split("signal:")[1]);
      }

    });

    rl.on("close", () => {
      resolv(results);
    });

  });
};



