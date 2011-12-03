var cp = require('child_process');
var mysqlstore = require('./mysql/mysqlstore');

console.log("connecting...");

var servers = mysqlstore.fetchHosts();

function ping(host,num){
	cp.exec("ping -c "+num+" -W 30 "+host, function (error, stdout, stderr){
			var packets = stdout.match(/(\d+)\spackets/);
			var received = stdout.match(/(\d+)\sreceived/);
			var packetloss = stdout.match(/(\d+)%/);

			//console.log("Hit " + host + " with " + packets[1] + " packets " + (error ? "timeout" : ""));
			if(error){
				//console.log("Timeouts: " + packets + ", " + received + ", " + packetloss);
			}else{
				stdout = stdout.split('rtt min/avg/max/mdev = ');
				stdout = stdout[1].replace(' ms\n','');
				var pingio_stats = stdout.split('/');
				mysqlstore.addPing(host,new Date(),packets[1],received[1],packetloss[1],pingio_stats[0],pingio_stats[1],pingio_stats[2],pingio_stats[3]);
			}
		}
	);
}

// Every 15 seconds, initiate pinging
setInterval(function () {
		for(var i=0; i<servers.length; i++) {
			ping(servers[i],3);
		}
	}, 1000*15);

// Every minute give us stats
setInterval(function () {
		console.log("Servers:\t {" + servers + "}");
		console.log("Pings:\t\t" + mysqlstore.getPings());
	}, 1000*60);
	
// Every 10 minutes throw the pingstats into our datastore!
setInterval(function () {
		mysqlstore.savePings();
	}, 1000*60*10);
	
// Every 1 hour, re-fetch the hosts. Somebody could have added hosts to the db
// Every 10 minutes throw the pingstats into our datastore!
setInterval(function () {
		mysqlstore.fetchHosts(servers);
	}, 1000*60*5);