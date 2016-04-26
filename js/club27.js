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

	document.querySelectorAll('.me')[0].innerHTML = 'Hi! I <a href="https://twitter.com/adrpz" target="_blank">am</a> 27 years old and ' +  a.diff(b, 'days') + ' days, check who I have surpassed in life and my next goals... unless &#9760;';

	/* 
	* 365 - 100
	* diff - x
	*/
	lifeBar.style.height = (a.diff(b, 'days'))*100 / 365 + '%' ;

	for (var i = 0; i < dates_total; i ++) {
		var span = document.createElement('span');
		span.className = 'person';
		span.id = 'd'+ data[i]['days'];
		span.dataset.name = data[i]['TEXT CONTENT'][0].text;
		span.dataset.job = data[i]['TD CONTENT'][0].text;
		span.dataset.cause = data[i]['VALUE 1'][0].text;
		span.dataset.date = data[i]['DATE'][0].text;
		span.dataset.days = data[i]['days'];
		span.style.top = (data[i]['days'] * 100) / 365 + '%';
		span.addEventListener('mouseenter',function(ev) {
			displayPerson(ev.target.id);
		});
		main.appendChild(span);
	}
}
var displayPerson = function(idEl) {
	var data = document.getElementById(idEl),
		target = document.getElementById('grave');
	target.querySelectorAll('.gr-name')[0].innerHTML = data.dataset.name;
	target.querySelectorAll('.gr-days')[0].innerHTML = '27 YO ' + data.dataset.days + ' days';
	target.querySelectorAll('.gr-job')[0].innerHTML = data.dataset.job;
	target.querySelectorAll('.gr-cause')[0].innerHTML = data.dataset.cause;
	target.querySelectorAll('.gr-date')[0].innerHTML = data.dataset.date;
}
var header = document.getElementsByTagName('header')[0];
var people = header.querySelectorAll('span');
for (var i = 0; i < people.length; i++) {
	people[i].addEventListener('mouseenter', function(ev){
		displayPerson(ev.target.dataset.elid);
	});
}