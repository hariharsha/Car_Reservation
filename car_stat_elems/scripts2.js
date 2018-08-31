var no_cars = cars.length;
let cars_dam = new Set();

var car_stats_save = [2,2,2,2,2,2,2,2,2];

function timeline(){ //move time line and other lines
	line_ = document.getElementById('TimeLine');
	time_ = new Date();
	jtime(time_);
	time_ = time_.toISOString().slice(11,19).split(':');
	time_ = (Number(time_[0])*60 + Number(time_[1]))*60 + Number(time_[2]);
	now_numb = ((Math.min(Math.max(time_-6*60*60,0),16*60*60)/(60*60))*6.25);
	line_.style.left=''+(now_numb*.75+25)+'%';
	inUses = document.getElementsByClassName('inUse');
	for (var i=0;i<inUses.length;i++){
		now_ele = inUses[i];
		now_ele.style.width = ''+(now_numb-Number(now_ele.style.left.replace('%','')))+'%';
	}//there seemed to be a little gap and to cover the gap added 5%
}

function status_updates(){	
	reservs = document.getElementsByClassName('reservs');
	for (var i=0;i<reservs.length;i++){ //i is not the car number
		start_here = Number(reservs[i].style.left.replace('%',''));
		width_here = Number(reservs[i].style.width.replace('%',''));
		allow_here = (0.5)*6.25;
		total_start = start_here+allow_here;
		total_end = start_here+width_here;
		if (total_start<now_numb && now_numb<total_end){	
			if (reservs[i].parentElement.parentElement.getElementsByClassName('inUse').length==0){
				reservs[i].classList.replace('reservs','temp_reservs')
			}
			
		}
	}
	temp_reservs = document.getElementsByClassName('reservs');
	for (var i=0;i<reservs.length;i++){ //i is not the car number
		start_here = Number(reservs[i].style.left.replace('%',''));
		width_here = Number(reservs[i].style.width.replace('%',''));
		allow_here = (0.5)*6.25;
		total_start = start_here+allow_here;
		total_end = start_here+width_here;
		if (total_start<now_numb && now_numb<total_end){
		}
		else {
			if (reservs[i].parentElement.parentElement.getElementsByClassName('inUse').length==0){
			}
			else {
				reservs[i].classList.replace('temp_reservs','reservs')
			}	
		}
	}
}


var car_stat;
function readTextFile(){ //reading the text file
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			allText = this.responseText;
			today_time = new Date();
			jtime(today_time);
			today_time_str = today_time.toISOString().slice(11,19);
			allText=allText.replace(/[\r]/g,''); //remove useless things
			var split_text = allText.split('\n'); //each car as 1 entity in the array
			car_stat = split_text[split_text.length-1].split(','); //last entity in line to car status array
			for (var i=0;i<car_stat.length;i++) { car_stat[i]=Number(car_stat[i]);} //make string an integer
			var all_car_stat_entities = document.getElementsByTagName('tr'); //
			//the only one line way to compare two arrays
			if (!car_stats_save.every(function(v,i) { return v === car_stat[i]})){ //if saved entity is same, don't do anything
				for (var i=0;i<cars.length;i++){ //looping cars
					if (car_stats_save[i]!=car_stat[i]){ //even if one car has same status as before do nothing
						time_arr_ = split_text[i].split(','); //the nfc reader times to array
						node_pr = all_car_stat_entities[i+1].children[2].children[1];
						while (node_pr.firstChild){node_pr.removeChild(node_pr.firstChild);}
						if(!time_arr_[0]=="" && time_arr_.length>0){
						for (var j = 0 ; j<Math.floor(time_arr_.length/3);j++){
							addStatus(i,1,time_arr_[j*3],time_arr_[j*3+1]);
						}
						if (car_stat[i]==0){ // if status is in, make any inUse to doneUse
							addStatus(i,0,time_arr_[time_arr_.length-1],today_time_str);
						}
						}
						all_car_stat_entities[i+1].children[0].className = car_stat[i]?"in":"out";
						all_car_stat_entities[i+1].children[1].innerText = car_stat[i]?"未使用":"使用中";
						all_car_stat_entities[i+1].children[1].className = car_stat[i]?"in1":"out1";
					}
				}
				car_stats_save = car_stat.slice();
			}
		}
	};
	today_date_str = today_time.toISOString().slice(0,10);
	xhttp.open("GET", "car_live"+today_date_str+".txt", true);
	xhttp.send();
}

timeline();
var myVar = setTimeout(function() {timeline()},2*1000);
var myVar = setInterval(function() {timeline()},1*60*1000); //move time line indef ly

var myVar = setTimeout(function() {readTextFile()},1000);
var myVar = setInterval(function() {readTextFile()},4*1000);	

