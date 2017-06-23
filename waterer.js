var WATER = D1;
var FEED = D2;
var TIME_WATERING = 60; // in seconds
var TIME_FEEDING = 5; // in seconds
var AVERAGE_READINGS = 6; // readings per entry in our history arrays
var hadWater = false;

var tempHistory = new Int8Array(100);
var lightHistory = new Uint8Array(100);
var tempAverage = 0;
var lightAverage = 0;
var readingCount = 0;

function waterPlants(feedAsWell) {
  console.log("Watering plants");
  WATER.set();
  setTimeout(function() {
    WATER.reset();
  }, TIME_WATERING*1000);
  
  if (feedAsWell) {
    FEED.set();
    setTimeout(function() {
      FEED.reset();
    }, TIME_FEEDING*1000);
  }
}

             
function onTick() {
  // take readings and store them in a history array
  tempAverage += E.getTemperature();
  lightAverage += Puck.light()*100;
  readingCount++;
  if (readingCount>=AVERAGE_READINGS) {
    for (var i=0;i<tempHistory.length-1;i++)
      tempHistory[i]=tempHistory[i+1];
    tempHistory[tempHistory.length-1] = tempAverage / readingCount;
    tempAverage = 0;
    for (i=0;i<lightHistory.length-1;i++)
      lightHistory[i]=lightHistory[i+1];
    lightHistory[tempHistory.length-1] = lightAverage / readingCount;
    lightAverage = 0;
    readingCount = 0;
  }
  // check about our plant watering
  var now = new Date(); 
  var h = now.getHours();
  var day = now.getDay(); // day of week
  var isMorning = h==8;
  var isEvening = h==19;
  if (isMorning || isEvening) {
    // feed in the morning on mon, weds, fri
    var doFeed = isMorning && (day==1 || day==3 || day==5);
    if (!hadWater) waterPlants(doFeed);
    hadWater = true;
  } else {
    hadWater = false;
  }
}

/* In 1v93 and later you can use this to set your timezone
so the time matches where you are. For 1v92 you'll have to
change the hours in 'onTick' manually */
// E.setTimeZone(-8 /* PST */);

// Change the name that appears when you connect
NRF.setAdvertising({
}, {name:"Puck.js Waterer"});

// Check watering every 10 minutes
setInterval(onTick, 10*60000);