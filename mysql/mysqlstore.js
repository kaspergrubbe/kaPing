var mysqlclient = require('mysql');

var mysql = require('./secret');

var client = mysqlclient.createClient({
  host: mysql.mysqlhost,
  user: mysql.mysqluser,
  password: mysql.mysqlpass,
  database: mysql.mysqldb,
});

function fetchHosts(servers)
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
	  }
	);
}

exports.fetchHosts = fetchHosts;