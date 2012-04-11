var cp = require('child_process');
var Common = require('./../common.js');
var datastore = Common.datastore;

var modulename = 'WEBUP';

var urls = datastore.fetchUrlHosts();

function makehttprequest(host){
  cp.exec("curl --user-agent 'kaPingBot' -I "+host, function (error, stdout, stderr){
    // error is null if no errors exists
    if(error === null)
    {
      var errorcode = stdout.match(/\w+\/\d+.\d+ (\d+)/);
      datastore.addUrlReq(host,new Date(),errorcode[1],'');
    }
    else
    {
      datastore.addUrlReq(host,new Date(),0,stderr);
    }
  });
}



// Every 15 seconds, initiate fetching
setInterval(function () {
  for(var i=0; i<urls.length; i++) {
    makehttprequest(urls[i]);
  }
}, 1000*15);

// Every 10 minutes throw the urlstats into our datastore!
setInterval(function () {
  datastore.saveUrlReqs();
}, 1000*60*10);
  
// Every 1 hour, re-fetch the hosts. Somebody could have added hosts to the db
setInterval(function () {
  console.log("["+modulename+"] " + 'fetching new urls');
  urls = datastore.fetchUrlHosts();
}, 1000*60*60);