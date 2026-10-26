(function () {
  "use strict";

  var hour = new Date().getHours();
  if (hour >= 6 && hour < 21) {
    document.body.classList.add("daytime");
    lightenBackgrounds(document.body);
  }

  function lightenBackgrounds(root) {
    var nodes = [root].concat(Array.prototype.slice.call(root.querySelectorAll("*")));
    nodes.forEach(function (el) {
      if (el.closest(".falling-toys")) {
        return;
      }
      var style = window.getComputedStyle(el);
      var bg = style.backgroundColor;
      var mixed = mixWithWhite(bg, 0.4);
      if (mixed) {
        el.style.backgroundColor = mixed;
      }
    });
  }

  function mixWithWhite(color, amount) {
    var match = String(color).match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([0-9.]+))?\)/i);
    if (!match) {
      return null;
    }
    var alpha = match[4] === undefined ? 1 : Number(match[4]);
    if (!alpha) {
      return null;
    }
    var r = Number(match[1]);
    var g = Number(match[2]);
    var b = Number(match[3]);
    if (r === 0 && g === 0 && b === 0 && alpha < 0.08) {
      return null;
    }
    return "rgba(" +
      Math.round(r + (255 - r) * amount) + ", " +
      Math.round(g + (255 - g) * amount) + ", " +
      Math.round(b + (255 - b) * amount) + ", " +
      alpha + ")";
  }
})();
