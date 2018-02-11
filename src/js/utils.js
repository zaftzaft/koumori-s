'use strict';

const d3 = require("d3");
const nipponcolors = require("./nipponcolors");


const freqMap = {
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

const channelMap = Object.keys(freqMap).reduce((o, freq) => {
  o[freqMap[freq]] = +freq;
  return o;
}, {});


const channels = {
  w24: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
  w52: [36,40,44,48,52,56,60,64],
  w56: [100,104,108,112,116,120,124,128,132,136,140],
  w57: [149,153,157,161]
};



const bandFreq = Object.keys(channels).reduce((o, band) => {
  o[band] = channels[band].map(ch => {
    return channelMap[ch];
  });

  return o;
}, {});

const channelToFreq = ch => {
  return channelMap[+ch];
};

const freqToChannel = freq => {
  return freqMap[freq];
};


const to3339 = t => {
  return (t / 1000).toFixed(3);
};





const getColor = (function(){
  let colors = [].concat(
    nipponcolors,
    d3.schemeCategory20,
    d3.schemeCategory20b,
    d3.schemeCategory20c
  );
  let index = 0;

  // shuffle
  for(let i = colors.length - 1; i > 0; i--){
    let r = Math.floor(Math.random() * (i + 1));
    let tmp = colors[i];
    colors[i] = colors[r];
    colors[r] = tmp;
  }

  return () => {
    index >= colors.length && (index = 0);
    return colors[index++];
  };
})();


const getColorByHash = (function() {
  let obj = {};

  return hash => {
    if(!obj[hash]) {
      obj[hash] = getColor();
    }

    return obj[hash];
  };

})();





module.exports = {
  to3339,
  channelToFreq,
  freqToChannel,
  getColor,
  getColorByHash,
  bandFreq
}

