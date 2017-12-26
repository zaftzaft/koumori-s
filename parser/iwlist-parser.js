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

const freqMap = {
  1: 2412, 2: 2417, 3: 2422, 4: 2427, 5: 2432,
  6: 2437, 7: 2442, 8: 2447, 9: 2452, 10: 2457,
  11: 2462, 12: 2467, 13: 2472, 14: 2484,

  36: 5180, 40: 5200, 44: 5220, 48: 5240,
  52: 5260, 56: 5280, 60: 5300, 64: 5320,
  100: 5500,
  104: 5520, 108: 5540, 112: 5560, 116: 5580, 120: 5600,
  124: 5620, 128: 5640, 132: 5660, 136: 5680, 140: 5700,

  149: 5745, 153: 5765, 157: 5785, 161: 5805
}




module.exports = iwlistStream => {
  return new Promise((resolv, reject) => {
    let data = "";
    let results = [];
    let obj = null;
    //const iwlist = spawn("gksudo", ["iwlist", dev, "scanning"]);

    const rl = readline.createInterface(iwlistStream, {});
    rl.on("line", line => {
      line = line.trim();
      if(/^Cell/.test(line)) {
        if(obj) {
          results.push(Object.assign({}, obj));
        }
        obj = {};

        obj.mac = line.split("Address: ")[1];
      }
      else if(/^ESSID/.test(line)) {
        let ssid = line.split("SSID:")[1].replace(/\"/g, "");
        ssid = ssid.replace(/\\x/g, ".x");
        obj.ssid = ssid;
      }
      else if(/^Frequency/.test(line)) {
        let ch = line.match(/Channel (\d+)/);
        if(ch && ch[1]) {
          obj.freq = freqMap[parseInt(ch[1], 10)];
          obj.channel = parseInt(ch[1], 10);
        }
        else {
          let freq = line.match(/:([\.\d]+) /);
          obj.channel = channelMap[+freq[1] * 1000];
          obj.freq = +freq[1] * 1000;
        }
      }
      else if(/^Quality/.test(line)) {
        obj.signal = -parseInt(line.match(/Signal level=-(\d+)/)[1], 10);
      }
    });

    rl.on("close", () => {
      resolv(results);
    });

    //return iwlist.then(() => {
    //  return results;
    //});

  });
};
