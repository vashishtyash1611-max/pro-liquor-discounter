/* ============================================================
   PRO LIQUOR DISCOUNTER — js/locations.js
   Store data + any location-page interactions.
   Edit addresses / maps links here if they change.
   ============================================================ */

var PLD_STORES = [
  {
    id: "whitecourt",
    name: "Alps Liquor Whitecourt",
    address: "3732 Kepler Street, Whitecourt, AB T7S 0A2, Canada",
    mapsUrl: "https://maps.app.goo.gl/HTo6Ryaa71NJxgZj7",
    embedUrl: "https://www.google.com/maps?q=3732+Kepler+Street,+Whitecourt,+AB+T7S+0A2,+Canada&output=embed"
  },
  {
    id: "vegreville",
    name: "Pro Liquor Discounter Vegreville",
    address: "#1, 6805 Hwy 16A, Vegreville, AB T9C 0A4, Canada",
    mapsUrl: "https://maps.app.goo.gl/hwuQT73NcyMQTsY18",
    embedUrl: "https://www.google.com/maps?q=6805+Hwy+16A,+Vegreville,+AB+T9C+0A4,+Canada&output=embed"
  }
];

(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // Iframes are already embedded in HTML; this keeps data in one place
    // and wires any [data-directions] buttons dynamically if needed.
    var buttons = document.querySelectorAll('[data-directions]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-directions');
        var store = (window.PLD_STORES || []).find(function (s) { return s.id === id; });
        if (store && store.mapsUrl) window.open(store.mapsUrl, '_blank', 'noopener');
      });
    });
  });
})();
