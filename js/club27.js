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

/*
* loop through the dates, look for how many days the musician lived
* (format: `"27 years, 98 days"`) and store the amount as an 'integer'
* Then clean the fields we don't use and ask to order the dates
*/
parseDates = function(dates) {
	"use asm";
	dates_total = dates.length;

	for (var i = 0; i < dates_total; i++) {
		dates[i]['days'] = ~~(dates[i]['VALUE 2'][0].text.split(',')[1].replace( /\D+/g, ''));
		delete dates[i]['LINK 1'];
		delete dates[i]['LINK 2'];
		delete dates[i]['REFERENCE NUMBERS'];
		delete dates[i]['SORTKEY NUMBER'];
		delete dates[i]['SORTKEY VALUE 1'];
		delete dates[i]['SORTKEY VALUE 2'];
		delete dates[i]['VALUE 2'];
	}
	orderDates(dates);
}

