var allText = null;
var cars = [ "N-BOXｽﾗｯｼｭ(92-51)", "N-ONE(7021)", "N-WGN(34-82)", "STEPWGN(No.ﾅｼ)", "ｽﾍﾟｰｼｱ車ｲｽ(6970)", "ﾀﾝﾄｽﾛｰﾊﾟｰ(7010)" ,"FITﾊｲﾌﾞﾘｯﾄﾞ(76-13)","N-BOX Custom(30-89)","N-BOX(30-90)"];
//db1 and db2 dealing seperately as of now
var no_db1_cars = 6;

var no_cars = cars.length;
let cars_dam = new Set();

var car_stats_save = []; 

let today_time = new Date();
jtime(today_time);

//add time from 7 to 22?
t6 = document.getElementsByTagName('tr')[0].children[2].children[0];
for (var i = 0; i<15;i++){ //time adding thing in the heading
	node_now = t6.firstElementChild.cloneNode();
	node_now.style.left = ''+6.25*(i+1)+'%';
	node_now.innerText = ''+(i+7);
	t6.appendChild(node_now);
}

function jtime(a){ //to J time
	a = a.setHours(a.getHours()+9);
}

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
		now_ele.style.width = ''+(0.5+now_numb-Number(now_ele.style.left.replace('%','')))+'%';
	}//there seemed to be a little gap and to cover the gap added 5%
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

for (var i=0;i<no_cars;i++){ //add cars to html
	node = document.getElementsByTagName('tr')[1];
	if (i!=0){
		new_thing = node.cloneNode(true);
		new_thing.children[0].innerText = cars[i];
		node.parentNode.appendChild(new_thing);
	}
	if (i==0) node.children[0].innerText = cars[0];
	cars[i]=cars[i].replace(/[\\()]/g, '');
}

function addReservation(carNo,name,phone,t1,t2){
///reservation start at 6AM and ends at 10PM	
/// time t1 and t2 in the format of 18:54 or 6:32 etc
/// carNo is number in the array above, name is kanji or anything, same goes to phone
	car_line = document.getElementsByTagName('tr')[carNo+1];
	schedules = car_line.children[2].children[0];
	new_sch = document.createElement("div");
	new_sch.className = "time reservs";
	start_num = Number(t1.slice(0,2)*60+Number(t1.slice(3,5)));
	start = Math.min(Math.max(start_num-360,0),16*60)/60*6.25;
	
	end_num = Number(t2.slice(0,2)*60+Number(t2.slice(3,5)));
	end = Math.min(Math.max(end_num-360,0),16*60)/60*6.25 - start;
	written_text = (''+name+'('+phone+')').replace(/[\s]/g,'');
	new_sch.style.left = ''+start+'%';
	new_sch.style.width = ''+end+'%';
	new_sch.innerText = written_text;
	schedules.appendChild(new_sch);	
}

function addStatus(carNo,status_,t1,t2){
//status_ is with a f**ing "_"
///reservation start at 6AM and ends at 10PM	
/// time t1 and t2 in the format of 18:54 or 6:32 etc
/// carNo is number in the array above, status 1 for in 0 for out
	car_line = document.getElementsByTagName('tr')[carNo+1];
	schedules = car_line.children[2].children[1];
	new_sch = document.createElement("div");
	if (status_==0) new_sch.className = "time inUse";
	if (status_==1) new_sch.className = "time doneUse";
	start_num = Number(t1.slice(0,2)*60+Number(t1.slice(3,5)));
	start = Math.min(Math.max(start_num-360,0),16*60)/60*6.25;
	
	end_num = Number(t2.slice(0,2)*60+Number(t2.slice(3,5)));
	end = Math.min(Math.max(end_num-360,0),16*60)/60*6.25 - start;
	if (status_==0) written_text = '使用中';
	if (status_==1) written_text = '終了' ;
	new_sch.style.left = ''+start+'%';
	new_sch.style.width = ''+end+'%';
	new_sch.innerText = written_text;
	schedules.appendChild(new_sch);	
}

function readfile1(){ //read file 1 (db1)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			file1Text = this.responseText;
			file1Text = file1Text.split('\n');
			
			all_tr = document.getElementsByTagName('tr');
			for (var i=0;i<no_db1_cars;i++){
				in_node = all_tr[i+1].children[2].children[0];
				while (in_node.firstElementChild){
					in_node.removeChild(in_node.firstElementChild);
				}
			}
			
			checkint = 0
			car_keys_here = new Set();
			
			today = today_time.toISOString().substring(0,10);
			for (var i = 0; i<file1Text.length; i++){
				line = file1Text[i];
				line = line.replace('\r','');
				
				if (checkint==0){
					if (line.search('備品名:')==0){  
						car_name = line.split(' ')[2];
						var got = false;
						car_name_temp = car_name.replace(/[\\()]/g, '');
						var present_car = -1;
						for (var cN= 0; cN<no_cars; cN++){
							if(car_name_temp.search(cars[cN])>-1){
								got = true;
								present_car = cN;
							}
						}		
						checkint=1;
					}
					/// write some shit over here so that the program adds a car 
				}
				if (checkint==1){
					if (line.search('作成者名')==0){
						var user = line.split(':')[1];
						checkint=2;
					}
				}
				if (checkint==2){
					if (line.search('内線:')==0){
						var phone = line.split(':')[1];
						checkint=3;
					}
				}
					
				if (checkint==3){
					if (line.search('開始時間:')==0){
						arr = line.split(' ');
						var start = arr[arr.length-1];
						checkint=4;
					}
				}
					
				if (checkint==4){
					if (line.search('終了時間:')==0){
						arr = line.split(' ')
						var end = arr[arr.length-1];
						checkint=5;
					}
				} 
					
				if (checkint==5){
					if (line.search('日付:')==0){
						var day = line.split(' ')[2];
						day = day.replace('/','-').replace('/','-')
						if (day.substring(0,10) == today) {
							addReservation(present_car,user,phone,start,end);
						}
						checkint = 0;
					}
				}

			  
			}	 	  
		}
	};
	xhttp.open("GET", "file1.txt", true);
	xhttp.send();
}


function readfile2(){ //read file 2 (db2)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			file2Text = this.responseText;
			file2Text = file2Text.split('\n');
			checkint = 0
			
			all_tr = document.getElementsByTagName('tr');
			for (var i=no_db1_cars;i<no_cars;i++){
				in_node = all_tr[i+1].children[2].children[0];
				while (in_node.firstElementChild){
					in_node.removeChild(in_node.firstElementChild);
				}
			}
			
			today = today_time.toISOString().substring(0,10);
			for (var i = 0; i<file2Text.length; i++){
				line = file2Text[i]
				line = line.replace('\r','');
				if (checkint==0){
					if (line.search('CarType')==0){  
						car_name = line.split(':')[1];
						var got = false;
						car_name_temp = car_name.replace(/[\\()]/g, '');
						var present_car = -1;
						for (var cN= 0; cN<no_cars; cN++){
							if(car_name_temp.search(cars[cN])>-1){
								got = true;
								present_car = cN;
								checkint=1;
							}
						}	
					}
					/// write some shit over here so that the program adds a car 
				}
				if (checkint==1){
					if (line.search('Days:')==0){
						var day = line.split(' ')[2];
						day = day.replace('/','-').replace('/','-')
						checkint=2;
					}
				}
				if (checkint==2){
					if (line.search('User:')==0){
						var user = line.split(':')[1];
						checkint=3;
					}
				}
					
				if (checkint==3){
					if (line.search('User_tel:')==0){
						var phone = line.split(' ')[2];
						checkint=4;
					}
				} 
					
				if (checkint==4){
					if (line.search('Times:')==0){
						var times = line.split(' ')[2].split(',');
						if (day.substring(0,10) == today) {
							addReservation(present_car,user,phone,times[0],times[times.length-1]);
						}
						checkint = 0;
					}
				} 
			}	 	  
		}
	};
	xhttp.open("GET", "file2.txt", true);
	xhttp.send();
}


function getData(){ //just get the python 2.7 nfc text file
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  allText = this.responseText;
		}
	};
	today_date_str = today_time.toISOString().slice(0,10);
	xhttp.open("GET", "car_live"+today_date_str+".txt", true);
	xhttp.send();
}

getData()
var car_stat;
function readTextFile(){ //reading the text file
	getData();
	today_time = new Date();
	jtime(today_time);
	today_time_str = today_time.toISOString().slice(11,19);
	allText=allText.replace(/[\r]/g,''); //remove useless things
	var split_text = allText.split('\n'); //each car as 1 entity in the array
	car_stat = split_text[split_text.length-1].split(','); //last entity in line to car status array
	for (var i=0;i<car_stat.length;i++) { car_stat[i]=Number(car_stat[i]);} //make string an integer
	var all_car_stat_entities = document.getElementsByTagName('tr'); //
	if (car_stats_save != car_stat){ //if saved entity is same, don't do anything
		for (var i=0;i<cars.length;i++){ //looping cars
			if (car_stats_save[i]!=car_stat[i]){ //even if one car has same status as before do nothing
				time_arr_ = split_text[i].split(','); //the nfc reader times to array
				if (car_stat[i]==0){ //if status is out, add a new status entity
					addStatus(i,car_stat[i],time_arr_[time_arr_.length-1],today_time_str);
				}
				else{ // if status is in, make any inUse to doneUse
					now_ = all_car_stat_entities[i+1].children[2].children[1];
					if (now_.getElementsByClassName('inUse').length>0){
						now_green_bar = now_.getElementsByClassName('inUse')[0].classList.replace('inUse','doneUse');
					}
				}
				if (time_arr_.length>2){ //to add the shit from the previous part of the day
					for (var j=0;j<time_arr_.length/3;j++){
						addStatus(i,1,time_arr_[3*j],time_arr_[3*j+1]);
					}
				}
				all_car_stat_entities[i+1].children[0].className = car_stat[i]?"in":"out";
				all_car_stat_entities[i+1].children[1].innerText = car_stat[i]?"未使用":"使用中";
				all_car_stat_entities[i+1].children[1].className = car_stat[i]?"in1":"out1";
			}
		}
		car_stats_save = car_stat;
	}
}
timeline();
var myVar = setTimeout(function() {timeline()},2*1000);
var myVar = setInterval(function() {timeline()},1*60*1000); //move time line indef ly

readfile1(); //read file1 indefely and 1st time asap
//var myVar = setInterval(function() {readfile1()},1*60*1000);

readfile2(); //read file2 indef ly and 1st time asap
//var myVar = setInterval(function() {readfile2()},1*60*1000);

var myVar = setTimeout(function() {readTextFile()},1000);	
var myVar = setInterval(function() {readTextFile()},4*1000);	


