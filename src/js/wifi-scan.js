'use strict';

const {spawn} = require("child_process");
const readline = require("readline");
const path = require("path");

class WifiScan {

  constructor() {
    this.proc = null;
    this.lock = false;
  }


  scan(cmd, dev) {
    return new Promise((resolv, reject) => {
      if(this.lock) {
        return reject();
      }

      if(!this.proc) {
        this.proc = spawn("pkexec", ["node", path.resolve("parser/iwcmd.js")]);
        this.proc.on("exit", () => {
          console.log("exit");
          this.proc = null;
          this.lock = false;
        });
        //this.proc.on("error", e => {
        //  console.log(e.stack);
        //});
      }

      this.lock = true;

      this.proc.stdin.write(`${cmd}/${dev}\n`);
      this.proc.stdout.once("data", d => {
        console.log(""+d);
        this.lock = false;
        resolv(JSON.parse(""+d));
      });
    });


  }



}


module.exports = WifiScan;
