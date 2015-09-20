var central_campus = {lat: 42.447578, lng: -76.480256};
var map;
var events = [];
var markers = {};

Template.home.onCreated(function(){
	// Set up Map
	GoogleMaps.ready('map', function(map){
		// Query Events
		events = Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();

		// Make the map reactive
		Events.find().observe({
			added: function (newEvent) {
				var marker = new google.maps.Marker({
			  		position: {lat: newEvent.latitude, lng: newEvent.longitude},
			  		map: map.instance,
			  		title: newEvent.name + " at " + newEvent.startTime,
			  		icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
			  	});
			  	marker.addListener('click', function(){
			  		$("#link_"+newEvent._id).click();
			  	});
			  	markers[newEvent._id] = marker;
			},
			removed: function (oldEvent) {
				markers[oldEvent._id].setMap(null);
				google.maps.event.clearInstanceListeners(markers[oldEvent._id]);
				delete markers[oldEvent._id];
			},
			changed: function (newEvent, oldEvent) {
				// Remove old Marker
				markers[oldEvent._id].setMap(null);
				google.maps.event.clearInstanceListeners(markers[oldEvent._id]);
				delete markers[oldEvent._id];

				// Create new Marker
				var marker = new google.maps.Marker({
			  		position: {lat: newEvent.latitude, lng: newEvent.longitude},
			  		map: map.instance,
			  		title: newEvent.name + " at " + newEvent.startTime,
			  		icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
			  	});
			  	marker.addListener('click', function(){
			  		$("#link_"+newEvent._id).click();
			  	});
			  	markers[newEvent._id] = marker;
			}
		});
	});

	// Function to update Marker colors
	window.updateMarkers = function(obj) {
		var openDivs = $(".collapse.in");

		// Toggle icon of clicked event
		if (markers[obj.id].getIcon() == "http://maps.google.com/mapfiles/ms/icons/green-dot.png")
			markers[obj.id].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
		else
			markers[obj.id].setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");

		// Revert icon of other opened events
		if (openDivs.length > 0)
			markers[openDivs[0].id].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
	}
});

Template.home.rendered = function() {
	setTimeout(function() {
		if(!Meteor.user()) {
			Router.go('/login');
		}
	}, 250);
	$("[name='my-checkbox']").bootstrapSwitch();
	$(".bootstrap-switch-handle-on").html("All");
	$(".bootstrap-switch-handle-off").html("My");
};

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

Template.home.helpers({
	'events': function() {
        return Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
    },
    'myEvent': function(eventId) {
    	return Meteor.userId() == Events.findOne({_id: eventId}).adminId;
    },
    'mine': function(eventId) {
    	if( Meteor.userId() == Events.findOne({_id:eventId}).adminId){
    		return "mine panel-info";
    	}
    	return "notMine panel-default";
    },
    'largeEvent': function(eventId){
    	if( !(Meteor.userId() == Events.findOne({_id:eventId}).adminId)){
    		if(Events.findOne({_id:eventId})){
    			return true;
    		}
    	}
    	return false;
    }
    'getDate': function(date) {
    	date = date.split('-');
    	var formatDate = new Date(date);
    	return formatDate.getMonth()+1 + "/" + formatDate.getDate() + "/" + date[0]
    },
    'getTime': function(time) {
    	return tConvert(time);
    },
    'getTimeToEvent': function(time) {
    	var hours = parseInt(time.split(":")[0]);
    	var minutes = parseInt(time.split(":")[1]);
    	var totalMinutes = 60*hours + minutes
    	var d = new Date();
    	var tM = 60*d.getHours() + d.getMinutes();
    	var diff = totalMinutes - tM
  		if(diff<0){
  			return 0;
  		}
  		if( Math.floor(diff/60) == 0){
  			return "<1";
  		}
  		return Math.floor(diff/60);
    },
    'pluralize': function(time) {
    	var hours = parseInt(time.split(":")[0]);
    	var minutes = parseInt(time.split(":")[1]);
    	var totalMinutes = 60*hours + minutes
    	var d = new Date();
    	var tM = 60*d.getHours() + d.getMinutes();
    	var diff = totalMinutes - tM
  		if( Math.floor(diff/60) <= 1){
  			return "hour";
  		}
    	return "hours";
    },
    'sameDay':function(date) {
		var inputDate = new Date(date);
		var todaysDate = new Date();
		if(inputDate.getFullYear() == todaysDate.getFullYear() && inputDate.getMonth() == todaysDate.getMonth() && inputDate.getDate()+1 == todaysDate.getDate())
		{
    		return true;
		}
		return false;
    },
    'notAlreadyHappened':function(Event){
    	date=Event.date;
    	startTime=Event.startTime;
    	endTime=Event.endTime;
    	var eventDate = new Date(date.split("-")[0],date.split("-")[1]-1,date.split("-")[2], startTime.split(":")[0], startTime.split(":")[1], 0);
		var endDate = new Date(date.split("-")[0],date.split("-")[1]-1,date.split("-")[2], endTime.split(":")[0], endTime.split(":")[1], 0);
		var currentDate = new Date();
		if(endDate <= currentDate){
			Events.remove({
				_id: Event._id
			})
			return false;
		}
		return true;
	},
	mapOptions: function() {
		return {center: central_campus, zoom: 15};
	},
	inEvent: function(eventId) {
		var attendees = Events.findOne({_id: eventId}).attendees;
		return _.contains(attendees, Meteor.userId());
	},
	numAttending: function(attendees) {
		return attendees.length;
	}
})


Template.home.events({

	'click #new-event': function(evt) {
		$("#myModalLabel").html("New Event");
		$("form.edit-event").attr("class","add-event");
		$("form.add-event")[0].reset();
    },
	'click a#edit-event': function(evt) {
		$("#myModalLabel").html("Edit Event");
		var eventId = $(evt.target).data("eventid");
		$("form.add-event").attr("class","edit-event");
		$("#eventId").val(eventId);
		var myEvent = Events.findOne({_id: eventId});
		if(Meteor.userId() == myEvent.adminId) {
	    	$("#eventName").val(myEvent.name);
	    	$("#eventDescription").val(myEvent.description);
	    	$("#eventLocation").val(myEvent.location);
	    	$("#eventDate").val(myEvent.date);
	    	$("#eventStartTime").val(myEvent.startTime);
	    	$("#eventEndTime").val(myEvent.endTime);
    	}
    },

	'click a#delete-event': function(evt) {
    $('#dialogModal').data('eventid', $(evt.target).data('eventid'));
    $('#dialogModal').modal();
  	},

  	'click #label-switch': function(evt) {
  	 	$('.notMine#event-container').toggle();
  	},
	'click #join-button': function(evt) {
		evt.preventDefault();
		var eventId = $(evt.target).parent().parent().attr('id');
		var attendees = Events.findOne({_id: eventId}).attendees;
		if(!_.contains(attendees, Meteor.userId())) {
			attendees.push(Meteor.userId());
			Events.update({'_id': eventId}, {$set: {'attendees': attendees}});
		}
	},
	'click #leave-button': function(evt) {
		evt.preventDefault();
		var eventId = $(evt.target).parent().parent().attr('id');
		var attendees = Events.findOne({_id: eventId}).attendees;
		attendees.splice(attendees.indexOf(Meteor.userId()));
		Events.update({'_id': eventId}, {$set: {'attendees': attendees}});
	}
});
