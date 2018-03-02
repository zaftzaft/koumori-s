'use strict';

const d3 = require("d3");


class WifiIcon {
  constructor() {
    this.color = "#90b44b";
    this.paths = [
      ["M105 87c-16 0-31 7-42 17l6 6a51 51 0 0 1 73 0l5-5a59 59 0 0 0-42-18z", "#fff"],
      ["M105 103c-12 0-23 5-31 13l6 5a36 36 0 0 1 50 0l6-5c-8-8-19-13-31-13z", "#fff"],
      ["M105 119c-8 0-14 3-19 8l5 5a20 20 0 0 1 28 1l6-6c-5-5-12-8-20-8z", "#fff"],
      ["M105 139c-4 0-8 3-8 8 0 4 4 8 8 8s8-4 8-8c0-5-4-8-8-8z", "#fff"]
    ];


    this.lock = false;
  }


  appendTo(svg) {
    this.grp = d3.select(svg).append("g");
    this.render();
  }


  start() {
    if(this.lock) {
      return;
    }

    this.lock = true;
    let i = 2;
    this.timer = setInterval(() => {
      if(i < 0) {
        i = 2;
        this.paths[0][1] = "#fff";
        this.paths[1][1] = "#fff";
        this.paths[2][1] = "#fff";
      }
      else {
        this.paths[i][1] = "#90b44b";
        i--;
      }
      this.render();
    }, 300);
  }


  stop() {
    clearInterval(this.timer);
    this.lock = false;
    this.paths.forEach(p => {
      p[1] = "#fff";
    });
    this.render();
  }


  red() {
    this.paths[3][1] = "#f00";
    this.render();

    setTimeout(() => {
      this.paths[3][1] = "#fff";
    }, 500);
  }


  render() {
    let bind = this.grp
      .selectAll("path")
      .data(this.paths, d => d[0]);

    bind
      .enter()
      .append("path")
      .attr("d", d => d[0])
      .attr("fill", d => d[1]);

    bind.exit().remove();

    bind
      .attr("fill", d => d[1]);
  }


}


module.exports = WifiIcon;
