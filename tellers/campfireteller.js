var warnings = {};

// TODO actually talk with campfire :-)

// datatype
function warning(date,host,message) {
  this.date = date;
  this.host = host;
  this.message = message;
}

// public methods
function sendMessage(message)
{
  console.log("Campfire: "+message);
}

function addWarning(host, message) {
  var w = new warning(new Date(), host, message);
  console.log(w);
  // if not already in warnings, then we haven't warned the user yet
  if(warnings[hash(w)] === undefined)
  {
    console.log('did add');
    // not in the dictionary
    warnings[hash(w)] = w;

    sendMessage(message);
  }
}

// internal / private:
setInterval(function () {
  console.log('Cleaning up in old warnings... '+ numberofwarnings());

  for(var warning in warnings) {
    console.log(((new Date()).getTime() - warnings[warning].date.getTime())+">"+(60*60*1000));
    if(((new Date()).getTime() - warnings[warning].date.getTime()) > 60 * 60 * 1000){
      delete warnings[warning];
    }
  }
  console.log('Cleaned up'+ numberofwarnings());
}, 1000*60*1); // every 10 minutes


function numberofwarnings() {
  return Object.keys(warnings).length;
}

var hash = function(obj){
  // some cool hashing
  return obj.host + obj.message;
};

exports.sendMessage = sendMessage;
exports.addWarning = addWarning;