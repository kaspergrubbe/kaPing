var mysqlclient = require('mysql');
var modulename = 'MYSQLSTORE';

var pings = [];
var urlreqs = [];

var mysql = require('./../configs/mysql');
var client = mysqlclient.createClient({
  host: mysql.mysqlhost,
  user: mysql.mysqluser,
  password: mysql.mysqlpass,
  database: mysql.mysqldb
});

console.log("["+modulename+"] " + " Using mysqlstore as datastore");

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

function urlreq(url,datetime,statuscode,timetaken,contenttype,errortext) {
  this.url=url;
  this.datetime=datetime;
  this.statuscode=statuscode;
  this.timetaken=timetaken;
  this.errortext=errortext;
  this.contenttype=contenttype;
}

// -------------- PING RELATED
function fetchPingHosts(){
	var servers = [];
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
  var servers = [];
	client.query(
		'SELECT * FROM urlhosts',
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
function addUrlReq(url,datetime,statuscode,timetaken,contenttype,errortext){
  urlreqs.push(new urlreq(url,datetime,statuscode,timetaken,contenttype,errortext));
}
function saveUrlReqs() {
	for (var urlreq in urlreqs) {
		var u = urlreqs[urlreq];
		client.query(
			'INSERT INTO urlrequests '+
			'SET url = ?, datetime = ?, statuscode = ?, timetaken = ?, contenttype = ?, errortext = ?',
			[u.url, u.datetime, u.statuscode, u.timetaken, u.contenttype, u.errortext]
		);
	}
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