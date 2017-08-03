// Very short plant waterer software for Make: article

E.setTimeZone(-8 /* PST */);
var hadWater = false;

function waterPlants(water, feed) {
  digitalPulse(D1, 1, water*1000);
  if (feed)
    digitalPulse(D2, 1, feed*1000);
}

// Check watering every 10 minutes
function onTick() {
  var now = new Date();
  var h = now.getHours();
  var day = now.getDay(); // day of week
  if (h==8 || h==19) {
    // feed in the morning on mon, weds, fri
    var doFeed = h==8 && (day==1 || day==3 || day==5);
    if (!hadWater) waterPlants(300, doFeed?30:0);
    hadWater = true;
  } else {
    hadWater = false;
  }
}
setInterval(onTick, 10*60000);

// When a button is pressed, water for 30 sec
setWatch(function() {
  waterPlants(30,0);
}, BTN, {edge:"rising",debounce:50,repeat:true});
