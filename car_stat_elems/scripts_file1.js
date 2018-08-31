var cars = [ "N-BOXｽﾗｯｼｭ(92-51)", "N-ONE(7021)", "N-WGN(34-82)", "STEPWGN(No.ﾅｼ)", "ｽﾍﾟｰｼｱ車ｲｽ(6970)", "ﾀﾝﾄｽﾛｰﾊﾟｰ(7010)" ,"FITﾊｲﾌﾞﾘｯﾄﾞ(76-13)","N-BOX Custom(30-89)","N-BOX(30-90)"];
//db1 and db2 dealing seperately as of now
var no_db1_cars = 6;

var no_cars = 9;

function readfile1(){ //read file 1 (db1)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			file1Text = this.responseText;
			file1Text = file1Text.split('\n');
			
			//because
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

readfile1();
var myVar = setInterval(function() {readfile1()},1*60*1000);