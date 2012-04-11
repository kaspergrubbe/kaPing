var cp = require('child_process');
var Common = require('./../common.js');
var datastore = Common.datastore;

var modulename = 'PING';

console.log("["+modulename+"] " + "Connecting to datastore...");

var servers = datastore.fetchHosts();

function ping(host,num){
	cp.exec("ping -c "+num+" -W 30 "+host, function (error, stdout, stderr){
		var packets = stdout.match(/(\d+)\spackets/);
		var received = stdout.match(/(\d+)\s(received|packets received)/);
		var packetloss = stdout.match(/(\d+.\d+)%/);
		var pingio_stats = stdout.match(/(\d+.\d+)\/(\d+.\d+)\/(\d+.\d+)\/(\d+.\d+)\sms/);

		//console.log("Hit " + host + " with " + packets[1] + " packets " + (error ? "timeout" : ""));
		if(error && pingio_stats !== null){
			// If timeouts and not a single ping went through
			datastore.addPing(host,new Date(),packets[1],received[1],packetloss[1],0,0,0,0);
		}else{
			datastore.addPing(host,new Date(),packets[1],received[1],packetloss[1],pingio_stats[1],pingio_stats[2],pingio_stats[3],pingio_stats[4]);
		}
	});
}

// Every 15 seconds, initiate pinging
setInterval(function () {
	for(var i=0; i<servers.length; i++) {
		ping(servers[i],3);
	}
}, 1000*15);

// Every hour give us stats
setInterval(function () {
	console.log("["+modulename+"] " + "servers:\t {" + servers + "}");
	console.log("["+modulename+"] " + "pings:\t\t" + datastore.getPings());
}, 1000*60*60);
	
// Every 10 minutes throw the pingstats into our datastore!
setInterval(function () {
	datastore.savePings();
}, 1000*60*10);
	
// Every 1 hour, re-fetch the hosts. Somebody could have added hosts to the db
setInterval(function () {
	console.log("["+modulename+"] " + 'fetching new hosts');
	datastore.fetchHosts(servers);
}, 1000*60*60);