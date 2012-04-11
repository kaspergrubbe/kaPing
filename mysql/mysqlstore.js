var mysqlclient = require('mysql');
var modulename = 'MYSQLSTORE';

var pings = [];
var urlreqs = [];

var mysql = require('./secret');
var client = mysqlclient.createClient({
  host: mysql.mysqlhost,
  user: mysql.mysqluser,
  password: mysql.mysqlpass,
  database: mysql.mysqldb
});

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

// -------------- PING RELATED
function fetchPingHosts(){
	client.query(
		'SELECT * FROM pinghosts',
		function selectCb(err, results, fields) {
		if (err) {
			throw err;
		}
	
		for(var i=0; i<results.length; i++) {
			var value = results[i];
			servers.push(value.url);
		}
		console.log("URLs re-loaded: " + servers);
	}
	);
	return servers;
}

function addPing(siteurl,datetime,packets,received,loss,min,avg,max,mdev){
	pings.push(new pingreq(siteurl,datetime,packets,received,loss,min,avg,max,mdev));
}

function savePings() {
	for (var ping in pings) {
		var p = pings[ping];
		client.query(
			'INSERT INTO pings '+
			'SET host = ?, date = ?, sent = ?, received = ?, loss = ?, min = ?, avg = ?, max = ?, mdev = ?',
			[p.siteurl, p.datetime, p.packets, p.received, p.loss, p.min, p.avg, p.max, p.mdev]
		);
	}
	pings = [];
}

function getPings()
{
	return pings.length;
}

// -------------- URL RELATED
function fetchUrlHosts() {
  // clear the array, we will fetch the new ones ourselves again
  urls = ['http://woman.dk','http://THISADDRESSDOESNOTEXISTSATALLASKDAJSDAKJSD.com','http://woman.dk/deliberate404error'];
  return urls;
}
function addUrlReq(url,datetime,statuscode,errortext){
  urlreqs.push(new pingreq(url,datetime,statuscode,errortext));
}
function saveUrlReqs() {
  urlreqs = [];
}
function getUrlReqs()
{
  return urlreqs.length;
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