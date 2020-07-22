let cityinfo = {
		city: '广安',
		province: '四川省'
}

let dateDisplay = ['昨天', '今天', '明天', '后天']

let weatherinfo = {
	temp:'21℃',
	air_direction:'',
	type:'',
	date:'',
	air_strength:'',
	yesterday:{},
	forecast:[],
	//配置地图
	getLBSInfo: function() {
		//百度地图信息获取定位
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function getinfo(position){
		//获取城市得地位
		cityinfo.city = position.address.city.slice(0,-1);
		weatherinfo.getWeatherInfo(cityinfo.city);
		});
		
		
	},
	
	getWeatherInfo:function(city) {
		$.ajax({
			type:'GET',
			url:'http://wthrcdn.etouch.cn/weather_mini?city='+city,
			dateType:'json',
			success:function(data) {
				var json = JSON.parse(data);
				var data = json.data;
				weatherinfo.yesterday = data.yesterday;
				weatherinfo.forecast = data.forecast;
				weatherinfo.temp = data.wendu;
				weatherinfo.yesterday = data.yesterday;
				
				//今日视图部分
				var today = weatherinfo.forecast[0];
				$(".weacityname").html('<span class="mui-icon mui-icon-location"></span>' + city);
				$(".weatemp").text(weatherinfo.temp + '°');
				$(".weatype").text(today.type);				$(".weawind").text(today.fengxiang + ' ' + parseNumber(today.fengli) + '级');
				$(".tip").text(today.ganmao);
				
				//中间展示框
				var tomorrow = weatherinfo.forecast[1];
				$("#today-highlow-temp").text(parseNumber(today.high)+'/'+parseNumber(today.low) + '℃')
				$("#mid-today-icon").attr("src", "image/icon/weather/" + today.type + ".png")
				$("#mid-today-type").text(today.type);
				console.log(today);
				$("#tomorrow-highlow-temp").text(parseNumber(tomorrow.high)+'/'+parseNumber(tomorrow.low) + '℃')
				$("#mid-tomorrow-icon").attr("src", "image/icon/weather/" + tomorrow.type + ".png")
				$("#mid-tomorrow-type").text(tomorrow.type);
				
				//下方预测部分
			
				for(var i = 0; i < 6; i++) {
					
					var divs = $("#f"+(i+1)).find("div");
					
					//时间管理
					let one_day = 24*60*60*1000;
					var day = new Date();
					day.setTime(day.getTime() + (i-1)*one_day);
					var month = day.getMonth() + 1;
					var day = day.getDate();
					
					//规范日期的显示格式
					if(day < 10) {day = '0' + day}
					if(month < 10) {month = '0' + month}
					
					//数据
					var dayData = weatherinfo.yesterday;
					if(i == 0) {
						dayData = weatherinfo.yesterday
					} else {
						dayData = weatherinfo.forecast[i-1];
					}
										
					if(i < 4) {
						divs[0].innerText = dateDisplay[i];
					} else {
						divs[0].innerText = "周" + parseWeekDay(dayData.date);
					}
					divs[1].innerText = month + '/' + day;
					divs[2].innerText = dayData.type;
					$("#i"+ (i+1)).attr("src","image/icon/weather/" + dayData.type + ".png");
				
				}
				
				
				
				
			},
			erro:function(data) {
				console.log("error");
			}
		});
	},
	
	weainit:function(){
		weatherinfo.getLBSInfo();
	}
}

weatherinfo.weainit();

function parseNumber(s) {
	return s.replace(/[^0-9]/ig,"");
}

function parseWeekDay(today) {
	return today.replace(/[0-9]+日星期/g,"")
	
}

$(document).ready(function(){	$("#search_button").click(function(){				var city = document.getElementById("search_input").value;		mui(document.getElementById("search_button")).button('loading');		weatherinfo.getWeatherInfo(city);		setTimeout(function() {			mui(document.getElementById("search_button")).button('reset');		}.bind(this), 500);	});});