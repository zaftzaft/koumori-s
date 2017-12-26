'use strict';

const {exec} = require("child-process-promise");


module.exports = () => {
  return exec("iwconfig")
  .then(res => {
    return res.stdout.split("\n").reduce((a, s) => {
      if(/^\w+/.test(s)) {
        a.push(s.split(" ")[0]);
      }
      return a;
    }, []);

  });
};

