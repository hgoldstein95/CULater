Template.home.helpers({
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

Template.home.helpers({
	 'events': function() {
        return Events.find({});
    },
    'myEvent': function(eventId) {
    	return Meteor.userId() == Events.findOne({_id: eventId}).adminId;
    }
})

Template.home.events({
	'click a#edit-event': function(evt) {
		var eventId = $(evt.target).data("eventid");
		if(Meteor.userId() == Events.findOne({_id: eventId}).adminId) {
    	Events.remove({
    		_id: eventId
    	});
  	}
  },
	'click a#delete-event': function(evt) {
    $('#dialogModal').data('eventid', $(evt.target).data('eventid'));
    $('#dialogModal').modal();
  }
});
