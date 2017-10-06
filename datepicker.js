var DatePicker = function(input){
	this.input = input;

	this.minYear = DatePicker.defaultMinYear;
	this.maxYear = DatePicker.defaultMaxYear;
	this.selected = this.getValue();
	this.current = (this.selected == null)? Jalali.today() : this.selected;
	this.applyEvents();
}

DatePicker.defaultFont = 'IRANSans';
DatePicker.defaultMinYear = 1370;
DatePicker.defaultMaxYear = 1450;

DatePicker.prototype.applyEvents = function() {
	this.input.clickE(function(){
		this.launch();
	}.bind(this));
};

DatePicker.prototype.getValue = function() {
	if(this.input.value == '')
		return null;
	else
		//TODO: correct this
		try{
			return Jalali.parseDate(this.input.value);
		}catch(exception){
			if(this.input.attr('oninvalid') != null)
				eval.call(this.input, this.input.attr('oninvalid'));
			return null;
		}
};

DatePicker.prototype.launch = function(){
	this.makeDialog();
	this.launchEvents();
	this.datepicker.findM('.datepicker-background').clickE(function (evt) {
		this.unlaunch();
	}.bind(this));
	this.datepicker.findS('.datepicker-box__navigation__previous').clickE(function (evt) {
		this.previous();
	}.bind(this));
	this.datepicker.findS('.datepicker-box__navigation__next').clickE(function (evt) {
		this.next();
	}.bind(this));
	this.datepicker.findS('.datepicker-box__navigation__year').changeE(function (evt) {
		this.changeYear(evt.target.value);
	}.bind(this));
	this.datepicker.findS('.datepicker-box__actions__cancel').clickE(function (evt) {
		this.unlaunch();
	}.bind(this));
	this.datepicker.findS('.datepicker-box__actions__today').clickE(function (evt) {
		this.current = Jalali.now();
		this.selected = this.current;
		this.update();
	}.bind(this));
	this.datepicker.findS('.datepicker-box__actions__save').clickE(function (evt) {
		if(this.selected == null){
			alert('تاریخ مورد نظر را انتخاب کنید');
			return false;	
		}
		this.push();
		this.unlaunch();
	}.bind(this));
};

DatePicker.prototype.unlaunch = function() {
	this.datepicker.remove();
};

DatePicker.prototype.update = function() {
	this.datepicker.findM('.datepicker-box__navigation__year option').removeAttr('selected');
	this.datepicker.findS('.datepicker-box__navigation__year option[value="'+this.current.year+'"]').attr('selected','selected');
	this.datepicker.findS('.datepicker-box__navigation__month').innerText = this.current.getMonthName();
	this.datepicker.findS('.datepicker-box__header__month').innerText = this.current.getMonthName();
	this.datepicker.findS('.datepicker-box__header__day').innerText = this.current.day.toPersian();
	this.datepicker.findS('.datepicker-box__header__year').innerText = this.current.year.toPersian();
	this.datepicker.findS('.datepicker-box__calender').innerHTML = this.makeTable();
	this.launchEvents();
};

DatePicker.prototype.launchEvents = function() {
	this.datepicker.findM('.datepicker-box__calender button').clickE(function (evt) {
		this.select(evt.target);
	}.bind(this));
};

DatePicker.prototype.select = function(button) {
	this.datepicker.findM('.selected').removeClass('selected');
	button.addClass('selected');
	this.current.day = button.innerText.toEnglish();
	this.selected = this.current;
	this.update();
	};

DatePicker.prototype.makeDialog = function(){
	var table = this.makeTable();
	var datepicker = `<div class="datepicker-container"><div class="datepicker-background"></div><div class="datepicker-box" style="font-family: '${DatePicker.defaultFont}';">
	<div class="datepicker-box__header">
	<table>
		<tr><td class="datepicker-box__header__month">${this.current.getMonthName()}</td></tr>
		<tr><td class="datepicker-box__header__day">${this.current.day.toPersian()}</td></tr>
		<tr><td class="datepicker-box__header__year">${this.current.year.toPersian()}</td></tr>
	</table>
	</div><div class="datepicker-box__body">
	<div class="datepicker-box__navigation">
		<button class="datepicker-box__navigation__previous">&#9205;</button>
		<span class="datepicker-box__navigation__month">${this.current.getMonthName()}</span>
		<select class="datepicker-box__navigation__year" style="font-family: '${DatePicker.defaultFont}';">${this.yearOptions()}</select>
		<button class="datepicker-box__navigation__next">&#9204;</button>
	</div>
	<div class="datepicker-box__calender">
	${this.makeTable()}
	</div>
	<div class="datepicker-box__actions">
		<button class="datepicker-box__actions__cancel" style="font-family: '${DatePicker.defaultFont}';">لغو</button>
		<button class="datepicker-box__actions__save" style="font-family: '${DatePicker.defaultFont}';">تایید</button>
		<button class="datepicker-box__actions__today" style="font-family: '${DatePicker.defaultFont}';">امروز</button>
	</div>
	</div>
	</div>
	</div>`;
	this.datepicker = document.body.append(datepicker);
}

DatePicker.prototype.makeTable = function() {
	var startDay = this.current.monthStartDay();
	var table = '<table>';
	table += '<tr><th>ش</th><th>ی</th><th>د</th><th>س</th><th>چ</th><th>پ</th><th>ج</th></tr>';
	for (var i = 0; i < 6; i++) {
		table += '<tr>';
		for (var j = 0; j < 7; j++) {
			var day = 7 * i + j - startDay + 1;
			table += '<td>';

			var selected = '';
			if (this.selected != null && 
				this.selected.year.valueOf() == this.current.year.valueOf() &&
				this.selected.month.valueOf() == this.current.month.valueOf() &&
				this.selected.day == day)
				selected = ' class="selected"';
			if(day > 0 && day < this.current.monthDays() + 1)
				table += '<button'+selected+` style="font-family: '${DatePicker.defaultFont}';">` + (new Number(day)).toPersian() + '</button>';
			table += '</td>'
		}
		table += '</tr>';
	}
	table += '</table>';
	return table;
};

DatePicker.prototype.yearOptions = function() {
	var options = '';
	for (var i = new Number(this.minYear); i <= this.maxYear; i++) {
		options += `<option value="${i}"${(this.current.year == i)? ' selected':''}>${i.toPersian()}</option>`;
	}
	options += '</select>';
	return options;
};

DatePicker.prototype.push = function() {
	this.input.value = this.selected.toString();
};

DatePicker.prototype.previous = function(){
	this.current = this.current.previousMonth();
	this.update();
};

DatePicker.prototype.next = function(){
	this.current = this.current.nextMonth();
	this.update();
};

DatePicker.prototype.changeYear = function(year) {
	this.current.year = year;
	if(this.current.month == 12 && this.current.day == 30 && !this.current.isLeap())
		this.current.day = 29;
	this.update();
};

DatePicker.apply = function (elements){
	if(!elements.hasOwnProperty('length')){
		return new DatePicker(elements);
	}else{
		for (var i = 0; i < elements.length; i++) {
			new DatePicker(elements[i]);
		}
	}
};

DatePicker.autoInit = function(){
var elements = M('.datepicker');
	for (var i = elements.length - 1, element; element = elements[i]; i--) {
		new DatePicker(element);
	}
};

function log(message){
	console.log(message);
}

DatePicker.autoInit();