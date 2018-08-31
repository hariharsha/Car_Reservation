
//add time from 6 to 21
t6 = document.getElementsByTagName('tr')[0].children[2].children[0];
for (var i = 0; i<15;i++){ //time adding thing in the heading
	node_now = t6.firstElementChild.cloneNode();
	node_now.style.left = ''+6.25*(i+1)+'%';
	node_now.innerText = ''+(i+7);
	t6.appendChild(node_now);
}

//add car names and shit
var cars = [ "N-BOXｽﾗｯｼｭ(92-51)", "N-ONE(70-21)", "N-WGN(34-82)", "STEPWGN(No.ﾅｼ)", "ｽﾍﾟｰｼｱ車ｲｽ(69-70)", "ﾀﾝﾄｽﾛｰﾊﾟｰ(70-10)" ,"FITﾊｲﾌﾞﾘｯﾄﾞ(76-13)","N-BOX Custom(30-89)","N-BOX(30-90)"];
var no_cars = cars.length;
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

//functions and variables to be used by other js 
var no_db1_cars = 6; //need this because for updating the deleted stats

function jtime(a){ //to J time
	a = a.setHours(a.getHours()+9);}
var today_time = new Date();
jtime(today_time);
function update_time(){
	today_time = new Date();
	jtime(today_time);}
var myVar = setTimeout(function() {update_time()},30*60*1000);


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

function reload_page(){
	location.reload();}
var myVar = setInterval(function() {reload_page()},30*60*1000);