var cp = require('child_process');
var Common = require('./../common.js');
var datastore = Common.datastore;
var teller = Common.teller;

var modulename = 'WEBUP';

console.log("["+modulename+"] " + "Web request server activated...");

var urls = datastore.fetchUrlHosts();

function makehttprequest(host){
  cp.exec("curl --user-agent 'kaPingBot' -I -w 'time_total:%{time_total}\nhttp_code:%{http_code}\ncontent_type:%{content_type}\n' "+host, function (error, stdout, stderr){
    // error is null if no errors exists
    var timetaken    = stdout.match(/time_total:(\S+)/),
        http_code    = stdout.match(/http_code:(\S+)/),
        content_type = stdout.match(/content_type:(.+)/);
    
    if(http_code[1]!=='200' && http_code[1]!=='301' && http_code[1]!=='302' && http_code[1]!=='000')
    {
      teller.addWarning(host,"Error occoured: "+http_code[1]+" @ "+host);
    }

    if(error === null)
    {
      datastore.addUrlReq(host,new Date(),http_code[1],timetaken[1],content_type[1],'');
    }
    else
    {
      datastore.addUrlReq(host,new Date(),0,timetaken[1],'',stderr);
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
  console.log('Saving');
  datastore.saveUrlReqs();
}, 1000*60*10);
  
// Every 1 hour, re-fetch the hosts. Somebody could have added hosts to the db
setInterval(function () {
  console.log("["+modulename+"] " + 'fetching new urls');
  urls = datastore.fetchUrlHosts();
}, 1000*60*60);