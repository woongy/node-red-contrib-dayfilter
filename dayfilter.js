module.exports = function(RED) {
  "use strict";
  var CronJob = require("cron").CronJob;

  function DayfilterNode(config) {
    RED.nodes.createNode(this, config);
    this.sun = config.sun;
    this.mon = config.mon;
    this.tue = config.tue;
    this.wed = config.wed;
    this.thu = config.thu;
    this.fri = config.fri;
    this.sat = config.sat;
    this.cronjob = null;

    var node = this;

    node.cronjob = new CronJob({
      cronTime: "0 0 * * *",
      onTick: function() {
        if (shouldCall()) {
          node.status({ fill: "green", shape: "dot", text: "on" });
        } else {
          node.status({ fill: "grey", shape: "dot", text: "off" });
        }
      },
    });

    node.on("input", function(msg) {
      if (shouldCall()) { node.send(msg); }
    });

    node.on("close", function() {
      node.cronjob.stop();
      delete node.cronjob;
    });

    if (shouldCall()) {
      node.status({ fill: "green", shape: "dot", text: "on" });
    } else {
      node.status({ fill: "grey", shape: "dot", text: "off" });
    }

    function shouldCall() {
      var now = new Date();
      switch (now.getDay()) {
        case 0:
          return node.sun;
        case 1:
          return node.mon;
        case 2:
          return node.tue;
        case 3:
          return node.wed;
        case 4:
          return node.thu;
        case 5:
          return node.fri;
        case 6:
          return node.sat;
      }
    }
  }

  RED.nodes.registerType("dayfilter", DayfilterNode);
}
