var cp = require('child_process');

var Client = require('mysql').Client;
var client = new Client();

client.user 	= 'root';
client.password = '';
client.database = 'kaping';
console.log("connecting...");

client.connect(function(err, results) {
    if (err) {
        console.log("ERROR: " + err.message);
        throw err;
    }
    console.log("And we're live!");
	fetchHosts(client)
});

function fetchHosts(client)
{
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
		console.log("URLs: " + servers);
		client.end();
	  }
	);
}

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

function ping(host,num){
	cp.exec("ping -c "+num+" -W 30 "+host, function (error, stdout, stderr){
			var packets = stdout.match(/(\d+)\spackets/);
			var received = stdout.match(/(\d+)\sreceived/);
			var packetloss = stdout.match(/(\d+)%/);

			console.log("Hit " + host + " with " + packets[1] + " packets " + (error ? "timeout" : ""));
			if(error){
				console.log("Timeouts: " + packets + ", " + received + ", " + packetloss);
			}else{
				stdout = stdout.split('rtt min/avg/max/mdev = ');
				stdout = stdout[1].replace(' ms\n','');
				var pingio_stats = stdout.split('/');
				pings.push(new pingreq(host,new Date(),packets[1],received[1],packetloss[1],pingio_stats[0],pingio_stats[1],pingio_stats[2],pingio_stats[3]));
			}
		}
	);
}

setInterval(function () {
		for(var i=0; i<servers.length; i++) {
			ping(servers[i],3);
		}
	}, 1000*15);
	
setInterval(function () {
		console.log("Servers:\t {" + servers.length + " " + servers + "}");
		console.log("Pings:\t\t" + pings.length);
	}, 1000*60);

var servers = new Array();
var pings = new Array();