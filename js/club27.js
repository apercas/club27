var dates_total = 0,
	orig_date = new Date('1988-09-30'),
	final_date = new Date('2016-09-30'),
	last_bday = new Date('2015-09-30'),
	today = new Date();

var club27 = function() {
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

/*
* Convert to array => order array
*/
orderDates = function(dates) {
	var dates_ar = new Array(dates_total);
	dates_ar =  Object.keys(dates).map(function(k) { return dates[k] });
	dates_ar.sort(function(a, b) {
	    return parseFloat(a.days) - parseFloat(b.days);
	});
	print(dates_ar);
}

print = function(data) {
	var main = document.getElementById('main'),
	a = moment(today),
	b = moment(last_bday),
	lifeBar = document.getElementById('life');

	main.querySelectorAll('span')[0].innerHTML = 'I am 27 years old and ' +  a.diff(b, 'days') + ' days';

	/* 
	* 365 - 100
	* diff - x
	*/
	lifeBar.style.height = (a.diff(b, 'days'))*100 / 365 + '%' ;

	for (var i = 0; i < dates_total; i ++) {
		var span = document.createElement('span');
		span.className = 'person';
		span.style.top = (data[i]['days'] * 100) / 365 + '%';
		span.innerHTML = "<span class='name'>" + data[i]['TEXT CONTENT'][0].text + "</span>";
		span.innerHTML += "<span class='job'>" + data[i]['TD CONTENT'][0].text + "</span>";
		span.innerHTML += "<span class='cause'>" + data[i]['VALUE 1'][0].text + "</span>";
		span.innerHTML += "<span class='date'>" + data[i]['DATE'][0].text + "</span>";
		span.innerHTML += "<span class='days'>" + data[i]['days'] + "</span>";
		span.addEventListener('mouseenter',function(ev) {
			console.log(ev);
		});
		main.appendChild(span);
	}
}

