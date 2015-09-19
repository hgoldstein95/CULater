Template.home.helpers({
   tasks: [
     { text: "This is task 1" },
     { text: "This is task 2" },
     { text: "This is task 3" }
   ],
   event_info: {
     time: '10:00 AM - 5:00PM',
     place: 'Duffield Hall',
     description: 'Come one, come all! Play Smash Bros.HULK SMASH! HULK SMASH! HULK SMASH!Lorem ipsum dolor sit amet, vocibus lucilius comprehensam duo cu, his modo enim graeci an. Nobis soleat mel ut. Cu quod veritus detracto eam, ea inimicus expetendis neglegentur has. Ne oratio principes mei, cu tollit reprimique usu.',
     users_count: 3
   },
	mapOptions: function() {
		return {center: central_campus, zoom: 15};
	}
});

var central_campus = {lat: 42.447578, lng: -76.480256};
var map;
var events = [];
var markers = [];
var info;
Template.home.onCreated(function(){
	GoogleMaps.ready('map', function(map){
		// Query Events
		events = [{name: "Study group", lat: 42.4446657, lng: -76.4825664, time: "9:00PM", count: 4},
				  {name: "Guest Lecture", lat: 42.4472546, lng: -76.4822503, time: "9:00PM", count: 147}];

		// Create generic InfoWindow
		info = new google.maps.InfoWindow();

		// Create Markers
		for (var i = 0; i < events.length; i++){
			(function (){
				var marker = new google.maps.Marker({
			  		position: {lat: events[i].lat, lng: events[i].lng},
			  		map: map.instance,
			  		title: events[i].name + " at " + events[i].time
			  		//, icon: images/img.png
			  	});
			  	marker.addListener('click', function(){
			  		info.setContent(marker.title);
			  		info.open(map.instance, marker)});
				markers.push(marker);
			}())
		}
	});
});
