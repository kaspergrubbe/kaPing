var modulename = "DEVNULLSTORE";

var pings   = [];
var urlreqs = [];

console.log("["+modulename+"] " + " Using devnullstore as datastore");

// Ping-request
function pingreq(siteurl,datetime,packets,received,loss,min,avg,max,mdev){
  this.siteurl=siteurl;
  this.datetime=datetime;
  this.packets=packets;
  this.received=received;
  this.loss=loss;
  this.min=min;
  this.avg=avg;
  this.max=max;
  this.mdev=mdev;
}

function urlreq(url,datetime,statuscode,errortext) {
  this.url=siteurl;
  this.datetime=datetime;
  this.statuscode=statuscode;
  this.errortext=errortext;
}

function fetchPingHosts(){
  // clear the array, we will fetch the new ones ourselves again
  servers = ['lol.dk','benjamin.dk','amino.dk'];
  return servers;
}

function fetchUrlHosts() {
  // clear the array, we will fetch the new ones ourselves again
  servers = ['http://woman.dk','http://THISADDRESSDOESNOTEXISTSATALLASKDAJSDAKJSD.com','http://woman.dk/deliberate404error'];
  return servers;
}

function addUrlReq(url,datetime,statuscode,errortext){
  urlreqs.push(new pingreq(url,datetime,statuscode,errortext));
}

function addPing(siteurl,datetime,packets,received,loss,min,avg,max,mdev){
  pings.push(new pingreq(siteurl,datetime,packets,received,loss,min,avg,max,mdev));
}

function saveUrlReqs() {
  urlreqs = [];
}

function savePings() {
  pings = [];
}

function getUrlReqs()
{
  return urlreqs.length;
}

function getPings()
{
  return pings.length;
}

// Ping-related
exports.fetchPingHosts = fetchPingHosts;
exports.addPing = addPing;
exports.savePings = savePings;
exports.getPings = getPings;
// HTTP-related
exports.fetchUrlHosts = fetchUrlHosts;
exports.addUrlReq = addUrlReq;
exports.saveUrlReqs = saveUrlReqs;
exports.getUrlReqs = getUrlReqs;