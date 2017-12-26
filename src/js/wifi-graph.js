'use strict';
const d3 = require("d3");
//const ouiLookup = require("./oui-lookup.js");

const ouiLookup = () => "";

class WifiGraph {

  constructor(options) {
    options = options || {};


    this.channel = options.channel;
    this.freq = options.freq;

    this.channelOffset = options.channelOffset;
    this.channelStep = options.channelStep;

    this.margin = options.margin || {};

    //this.maxSignal = 0;
    this.maxSignal = options.maxSignal || -30;
    this.minSignal = options.minSignal || -100;


    this.dataset = null;

  }


  update(options) {
    this.channel = options.channel;
    this.freq = options.freq;

    this.channelOffset = options.channelOffset;
    this.channelStep = options.channelStep;

    //this.margin = options.margin || {};

    //this.maxSignal = 0;
    //this.maxSignal = options.maxSignal || -30;
    //this.minSignal = options.minSignal || -100;

    this.resize();
  }


  defineScale(options) {
    options = options || {};
    options.margin = options.margin || {};

    this.freqScale = d3.scaleLinear()
      .domain([this.freq.begin, this.freq.end])
      .range([
        options.margin.left || 50,
        options.width - (options.margin.right || 50)
      ]);

    this.signalScale = d3.scaleLinear()
      //.domain([-100, 0])
      .domain([this.minSignal, this.maxSignal])
      .range([
        options.height - (options.margin.bottom || 50),
        options.margin.top || 50
      ]);
  }


  data(dataset) {
    this.dataset = dataset;
    this.attach();
  }


  attach() {
    if(!this.dataset){
      return;
    }

    this.render(
      this.$graph.selectAll("g"),
      this.dataset
    );
  }


  appendTo(element) {
    this.element = d3.select(element);


    const width = this.element.node().clientWidth;
    const height = this.element.node().clientHeight - 3;
    //const height = 800;

    this.$tooltip = this.element
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.svg = this.element
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.defineScale({
      width: width,
      height: height,
      margin: this.margin
    });

    this.drawAxis();
    this.updateAxis();

    this.drawChannelLine();
    this.updateChannelLine();

    this.drawGraph();
  }


  resize() {
    const width = this.element.node().clientWidth;
    const height = this.element.node().clientHeight - 3;
    this.svg
      .attr("width", width)
      .attr("height", height);

    this.defineScale({
      width: width,
      height: height,
      margin: this.margin
    });

    this.updateAxis();

    this.updateChannelLine();

    this.attach();
  }


  drawAxis() {
    this.$freqAxis = this.svg.append("g");
    this.$signalAxis = this.svg.append("g");
  }


  updateAxis(){
    const freqAxis = d3.axisBottom(this.freqScale).tickValues([].concat(
      this.freq.begin,
      this.channel,
      this.freq.end
    ));
    const signalAxis = d3.axisRight(this.signalScale).ticks(5);

    this.$freqAxis
      .attr("transform", `translate(0, ${this.signalScale(this.minSignal)})`)
      .call(freqAxis);
    this.$signalAxis
      .attr("transform", `translate(10, 0)`)
      .call(signalAxis);
  }


  drawChannelLine() {
    this.$channelText = this.svg.append("g");

    this.$channelLine = this.svg.append("g");
  }


  updateChannelLine() {


    this.$channelText
      .selectAll("text")
      .data([])
      .exit().remove();

    this.$channelLine
      .selectAll("polyline")
      .data([])
      .exit().remove();


    this.$channelText
      .selectAll("text")
      .data(this.channel)
      .enter()
      .append("text")
      .text((d, i) => `${this.channelOffset + (this.channelStep * i)}`)
      .attr("text-anchor", "middle")
      .attr("fill", "#aaa");



    this.$channelLine
      .selectAll("polyline")
      .data(this.channel)
      .enter()
      .append("polyline")
      .attr("stroke-dasharray", "3,5")
      .attr("stroke", "#ddd");


    this.$channelText
      .selectAll("text")
      .attr("x", d => this.freqScale(d))
      .attr("y", this.signalScale(this.maxSignal));

    this.$channelLine
      .selectAll("polyline")
      .attr("points", d => {
        return `
          ${this.freqScale(d)},${this.signalScale(this.maxSignal)}
          ${this.freqScale(d)},${this.signalScale(this.minSignal)}
        `;
      });
  }


  drawGraph() {
    this.$graph = this.svg.append("g");
  }


  render(target, dataset){
    let bind = target.data(dataset, d => `${d.ssid}:${d.freq}`);

    //bind.enter().each(d => {
    //  d.color = this.getColor();
    //});

    let group = bind
      .enter()
      .append("g");

    group
      .append("polyline")
      .attr("fill", "none")
      .attr("stroke", d => d.color)
      .attr("points", d => {
        return `
          ${this.freqScale(+d.freq - 10)},${this.signalScale(this.minSignal)}
          ${this.freqScale(+d.freq - 10 + 3)},${this.signalScale(d.signal)}
          ${this.freqScale(+d.freq - 13 + 20)},${this.signalScale(d.signal)}
          ${this.freqScale(+d.freq - 10 + 20)},${this.signalScale(this.minSignal)}
        `;
      });

    // SSID
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", (d, i) => d.color)
      .text(d => d.ssid)
      .attr("x", d => this.freqScale(d.freq))
      .attr("y", d => this.signalScale(d.signal) - 5)
      .each(function(d){
        let bbox = this.getBBox();
        d.x = bbox.x;
        d.y = bbox.y;
        d.height = bbox.height;
        d.width = bbox.width;
      });

    let that = this;
    group
      .append("circle")
      .attr("cx", d => this.freqScale(d.freq))
      .attr("cy", d => this.signalScale(d.signal))
      .attr("r", 5)
      .attr("fill", d => d.color)
      .on("mouseover", function(d){
        d3.select(this).attr("r", 10);
        d3.select(this.parentNode).select("polyline").attr("stroke-width", 2);

        //${oui(d.source)}<br>
        that.$tooltip.html(`
          ${d.ssid}<br>
          ${d.mac} ${ouiLookup(d.mac)}<br>
          ${d.signal} dB
          `);
        that.$tooltip.style("visibility", "visible");

      })
      .on("mousemove", function(){
        that.$tooltip
          .style("top", `${d3.event.pageY }px`)
          .style("left", `${d3.event.pageX }px`);

      })
      .on("mouseout", function(){
        d3.select(this).attr("r", 5);
        d3.select(this.parentNode).select("polyline").attr("stroke-width", 1);

        that.$tooltip.style("visibility", "hidden");
      });



    bind.exit().remove();

    bind
      .select("polyline")
      .transition().duration(300)
      .attr("points", d => {
        return `
          ${this.freqScale(+d.freq - 10)},${this.signalScale(this.minSignal)}
          ${this.freqScale(+d.freq - 10 + 3)},${this.signalScale(d.signal)}
          ${this.freqScale(+d.freq - 13 + 20)},${this.signalScale(d.signal)}
          ${this.freqScale(+d.freq - 10 + 20)},${this.signalScale(this.minSignal)}
        `;
      });

    // SSID
    bind
      .select("text")
      .attr("x", d => this.freqScale(d.freq))
      .attr("y", d => this.signalScale(d.signal) - 5)
      .text(d => d.ssid)

    bind
      .select("circle")
      .transition().duration(300)
      .attr("cx", d => this.freqScale(d.freq))
      .attr("cy", d => this.signalScale(d.signal))
      .attr("r", 5);
  }


  showSSID() {}
  hideSSID() {}

}

module.exports = WifiGraph;

