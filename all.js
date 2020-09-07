window.onload = function(){
	xhrFu();
	// 取得年、月、日以及身分證末碼
	function getDate(){
		let jsDate = document.getElementById('jsDate');
		let jsWeek = document.getElementById('jsWeek');
		let jsIdCard =document.getElementById('jsIdCard');
		let str = '';
		let timestamp = moment().valueOf();
		let date = moment(timestamp).format('YYYY-MM-DD');
		let day = moment(timestamp).format('dddd');
		jsDate.textContent = date;
		switch (day) {
			case 'Monday':
				jsWeek.textContent = '星期一';
				str+=`身分證末碼為<span>1,3,5,7,9</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Tuesday':
				jsWeek.textContent = '星期二';
				str+=`身分證末碼為<span>2,4,6,8,0</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Wednesday':
				jsWeek.textContent = '星期三';
				str+=`身分證末碼為<span>1,3,5,7,9</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Thursday':
				jsWeek.textContent = '星期四';
				str+=`身分證末碼為<span>2,4,6,8,0</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Friday':
				jsWeek.textContent = '星期五';
				str+=`身分證末碼為<span>1,3,5,7,9</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Saturday':
				jsWeek.textContent = '星期六';
				str+=`身分證末碼為<span>2,4,6,8,0</span>可購買`;
				jsIdCard.innerHTML = str;
				break;
			case 'Sunday':
				jsWeek.textContent = '星期日';
				str+=`星期日未限制，民眾皆可購買`;
				jsIdCard.innerHTML = str;
				break;
		};
	}
	getDate(); 
};
// 全台藥局資料
let data;
function xhrFu(){
	let xhr = new XMLHttpRequest();
	xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true);
	xhr.send(null);
	xhr.onload = function(){
		data = JSON.parse(xhr.responseText).features;
		// 取得使用者經緯度
		if (navigator.geolocation){
			// 允許後執行getUserPosition函式，取得使用者位置
			navigator.geolocation.getCurrentPosition(getUserPosition);
		} else {
			console.log('您的瀏覽器不支援顯示地理位置API，請使用其它瀏覽器開啟這個網址');
			return;
		};
	};
};
// 取得使用者經緯度後定位使用者
function getUserPosition(position){
	setUserPosition((position.coords).latitude, (position.coords).longitude);
}

// 設定使用者經緯度，地圖自動定位到使用者
let map;
let userposition = [];
function setUserPosition(lat, lng){
	let loadingarea = document.querySelector('.loadingarea');
	loadingarea.style.display = 'none';
	map = L.map('map', {
		    center: [lat, lng],
		    zoom: 16
		});
	userposition.push(lng, lat);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	L.marker([lat, lng],{icon:blueIcon}).addTo(map);
	showPharmacyOnMap();

	// 列出使用者所在城市的藥局
	let dataLat;
	let dataLng;
	let area;
	for (let i = 0; i < data.length; i++) {
		dataLat = data[i].geometry.coordinates[1].toFixed(1);
		dataLng = data[i].geometry.coordinates[0].toFixed(1);
		if (dataLat===lat.toFixed(1) && dataLng===lng.toFixed(1)) {
			area = data[i].properties.county;
			break;
		}
	}
	showPharmacyList(area);
};

// 自動定位到切換城市的藥局或者切換到區、鄉、鎮的藥局
function setPharmacyPosition(PharmacyPosition){
	let pharmacylat = PharmacyPosition[0].geometry.coordinates[1];
	let pharmacylng = PharmacyPosition[0].geometry.coordinates[0]
	map.remove();
	map = L.map('map', {
		    center: [pharmacylat, pharmacylng],
		    zoom: 16
		});
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	L.marker([userposition[1], userposition[0]],{icon:blueIcon}).addTo(map);
	showPharmacyOnMap();
}


// 口罩剩餘數量的標號，使用者標號
let greenIcon = new L.Icon({
  	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  	iconSize: [25, 41],
  	iconAnchor: [12, 41],
  	popupAnchor: [1, -34],
  	shadowSize: [41, 41]
});
let orangeIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  	iconSize: [25, 41],
  	iconAnchor: [12, 41],
  	popupAnchor: [1, -34],
  	shadowSize: [41, 41]
});
let redIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  	iconSize: [25, 41],
  	iconAnchor: [12, 41],
  	popupAnchor: [1, -34],
  	shadowSize: [41, 41]
});
let blueIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  	iconSize: [25, 41],
  	iconAnchor: [12, 41],
  	popupAnchor: [1, -34],
  	shadowSize: [41, 41]
});

// 在地圖上顯示藥局Marker
function showPharmacyOnMap(){
	// 新增一圖層優化效能，藥局標上marker，自動群組化
	let markers = new L.MarkerClusterGroup().addTo(map);
    for(let i=0; i<data.length; i++) {
    	let mask;
    	if (data[i].properties.mask_adult == 0 || data[i].properties.mask_child == 0) {
    		mask = redIcon;
    	}else if (data[i].properties.mask_adult < 100 || data[i].properties.mask_child < 100) {
    		mask = orangeIcon;
    	}else{
    		mask = greenIcon;
    	}
    	markers.addLayer(L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]],{icon:mask})
    	.bindPopup(`<h2>${data[i].properties.name}</h2>
    				<p>${data[i].properties.address}</p>
    				<p>${data[i].properties.phone}</p>
    				<p>${data[i].properties.note}</p>
    				<div class="map_mask"><p class="map_mask_adult">成人口罩：${data[i].properties.mask_adult}</p>
    				<p class="map_mask_child">兒童口罩：${data[i].properties.mask_child}</p></div>`));
    }
    // map.addLayer(markers);
}




let jsCountry = document.getElementById('jsCountry');
jsCountry.addEventListener('change', filterCity, false);
// 從data裡撈資料整合成同一個城市的陣列cityArry
let cityArry = [];
function filterCity(e){
	if (e.target.value === '選擇縣市') {return;}
	if (e.target.name === '城市') {
		cityArry = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].properties.county === e.target.value) {
				cityArry.push({
					geometry:{
						coordinates: [data[i].geometry.coordinates[0], data[i].geometry.coordinates[1]]
					},
					properties:{
						town: data[i].properties.town,
					}
				})
			}
		}
		showTown(e.target.value);
		setPharmacyPosition(cityArry);
		let area = e.target.value;
		showPharmacyList(area);	
	// 從cityArry撈資料整合成同一個區、鄉、鎮的陣列townArry
	}else if (e.target.name === '區域') {
		let townArry = [];
		for (let i = 0; i < cityArry.length; i++) {
			if (cityArry[i].properties.town === e.target.value) {
				townArry.push({
					geometry:{
						coordinates: [cityArry[i].geometry.coordinates[0], cityArry[i].geometry.coordinates[1]]
					}
				})
				break;
			}
		}
		setPharmacyPosition(townArry);
		let area =e.target.value
		showPharmacyList(area);
	};
};



// 區、鄉、鎮切換後地圖自動定位
let jsTown = document.getElementById('jsTown');
jsTown.addEventListener('change', filterCity, false);
// 顯示城市的區、鄉、鎮
function showTown(city){
	let townarray = [];
	let str = '';
	for (let i = 0; i < data.length; i++) {
		if (data[i].properties.county === city) {
			townarray.push(data[i].properties.town);
		}
	}
	// 過濾重複的區、鄉、鎮
	// element陣列元素的值; index陣列元素所在的位置; arr經過filter處理的陣列
	let result = townarray.filter(function(element,index,arr) {
		return arr.indexOf(element) === index;
	});
	for (let i = 0; i < result.length; i++) {
		str += `<option value="${result[i]}">${result[i]}</option>`
	}
	jsTown.innerHTML = str;
}
// 顯示藥局列表
function showPharmacyList(CityOrTown) {
	let jsPharmacyList = document.getElementById('jsPharmacyList');
	let str = '';
	let datalen = data.length;
	let opt = document.getElementById('jsCountry').value;
	for (let i = 0; i < datalen; i++) {
		if (CityOrTown===data[i].properties.county || (CityOrTown===data[i].properties.town
			&& opt===data[i].properties.county)) {
			str+=`<li>
				<h2>${data[i].properties.name}</h2>
				<p>${data[i].properties.address}</p>
				<p>${data[i].properties.phone}</p>
				<p>${data[i].properties.note}</p>
				<div class="pharmacy_mask">
					<p class="list_mask_adult">成人口罩：${data[i].properties.mask_adult}</p>
					<p class="list_mask_child">兒童口罩：${data[i].properties.mask_child}</p>
				</div>
			</li>`
		}
	}
	jsPharmacyList.innerHTML = str;
}

