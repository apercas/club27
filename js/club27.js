var club27 = function() {
	var dates_total = 0,
		orig_date = new Date('1988-09-30'),
		final_date = new Date('2016-09-30'),
		today = new Date();
	retrieveData();
};

retrieveData = function() {
	function get(url) {
	  return new Promise(function(resolve, reject) {
	    var req = new XMLHttpRequest();
	    req.open('GET', url);
	    req.onload = function() {
	      if (req.status == 200) {
	        resolve(req.response);
	      }
	      else {
	        reject(Error(req.statusText));
	      }
	    };
	    req.onerror = function() {
	      reject(Error("Network Error"));
	    };
	    req.send();
	  });
	}
	get('resources/27club.json').then(function(data) {
	  parseDates(JSON.parse(data).result.extractorData.data[0].group);
	}, function(error) {
	  console.error("json with dates not retrieved", error);
	});
}
