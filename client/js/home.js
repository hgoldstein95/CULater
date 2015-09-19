// Important Variables
var central_campus = {lat: 42.447578, lng: -76.480256};
var map;
var events = [];
var markers = [];
var info;

Meteor.startup(function() {
	GoogleMaps.load();
});

Template.home.helpers({
	tasks: [
	   { text: "This is task 1" },
	   { text: "This is task 2" },
	   { text: "This is task 3" }
	 ],
	 users: [
	   { user: "Helena" },
	   { user: "Crafty Beaver" },
	   { user: "Nom noms" }],
	mapOptions: function() {
		return {center: central_campus, zoom: 15};
	}
});

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