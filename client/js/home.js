var central_campus = {lat: 42.447578, lng: -76.480256};
var events = [];

window.markers = {};

window.addMarker = function (newEvent, open) {
	var color = open ? "green" : "red";
	var marker = new google.maps.Marker({
  		position: {lat: newEvent.latitude, lng: newEvent.longitude},
  		map: window.map.instance,
  		title: newEvent.location,
  		icon: "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png"
  	});
  	marker.addListener('click', function(){
  		$("#link_"+newEvent._id).click();
  	});
  	window.markers[newEvent._id] = marker;
	window.toggleTime();
	events = Session.get("events");//Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
}

window.removeMarker = function (eventId) {
	if(window.markers[eventId]){
		window.markers[eventId].setMap(null);
		google.maps.event.clearInstanceListeners(window.markers[eventId]);
		delete window.markers[eventId];
		events = Session.get("events");//Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
	}
}

window.toggleTime = function() {
	if ($("#time_checkbox")[0].checked){
		$("#time_slider").prop("disabled", false);
		window.sliderMoved($("#time_slider")[0].value);
	} else {
		$("#time_slider").prop("disabled", true);
		$("#slider-val").html("");
		
		// Show all events
		for (var i = 0; i < events.length; i++) {
			if(window.markers[events[i]._id]){
				window.markers[events[i]._id].setVisible(true);
				$("#event-container_"+events[i]._id).css("display", "block");
			}
		}
	}
}

function filterMarkers(val) {
	// Filter out Markers
	events = Session.get("events");//Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
	for (var i = 0; i < events.length; i++) {
		// Check that the date is within 2 hours of the slider time
		var start_time = new Date();
		start_time.setMilliseconds("0");
		start_time.setSeconds("0");
		start_time.setMinutes("0");
		start_time.setHours(start_time.getHours() + parseInt(val));

		var event_time = new Date(events[i].date + "T" + events[i].startTime + ":00Z");
		event_time.setMilliseconds("0");
		event_time.setMinutes(event_time.getMinutes() + event_time.getTimezoneOffset());

		var end_time = new Date();
		end_time.setMilliseconds("0");
		end_time.setSeconds("0");
		end_time.setMinutes("0");
		end_time.setHours(end_time.getHours() + parseInt(val) + 2);
		if(window.markers[events[i]._id]){
			if (event_time >= start_time && event_time < end_time){
				window.markers[events[i]._id].setVisible(true);
				$("#event-container_"+events[i]._id).css("display", "block");
			}else{
				window.markers[events[i]._id].setVisible(false);
				$("#event-container_"+events[i]._id).css("display", "none");
			}
		}
	}
}

Template.home.onCreated(function(){
	// Set up Map
	GoogleMaps.ready('map', function(map){
		// Query Events
		events = Session.get("events");//Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
		window.map = map;

		// Create initial markers
		for (var i = 0; i < events.length; i++) {
			window.addMarker(events[i], false);
		}
	});

	// Function to update Marker colors
	window.updateMarkers = function(obj) {
		var openDivs = $(".collapse.in");

		// Toggle icon of clicked event
		if (window.markers[obj.id].getIcon() == "http://maps.google.com/mapfiles/ms/icons/green-dot.png") {
			window.markers[obj.id].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
		}
		else {
			window.markers[obj.id].setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
		}

		// Revert icon of other opened events
		if (openDivs.length > 0) {
			window.markers[openDivs[0].id].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
		}
	}

	window.sliderMoved = function (val) {
		// Update Slider Label
		var hours = (new Date().getHours()+parseInt(val))%24;
		if (hours == 12)
			$("#slider-val").html(hours+":00 PM");
		else if (hours > 12)
			$("#slider-val").html((hours-12)+":00 PM");
		else
			$("#slider-val").html(hours+":00 AM");

		filterMarkers(val);
	}
});

Template.home.rendered = function() {
	setTimeout(function() {
		if(!Meteor.user()) {
			Router.go('/login');
		}
		Session.set('events',Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch())
	}, 500);
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
        //return Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();
        return Session.get("events");
    },
    'myEvent': function(eventId) {
    	if(Events.findOne({_id:eventId})){
    		return Meteor.userId() == Events.findOne({_id: eventId}).adminId;
    	}
    },
    'mine': function(eventId) {
    	if(Events.findOne({_id:eventId})){
	    	if( Meteor.userId() == Events.findOne({_id:eventId}).adminId){
	    		return "mine panel-info";
	    	}
	    }
    	return "notMine panel-default";
    },
    'isNotMine': function(eventId){
    	if(Events.findOne({_id:eventId})){
	    	if( Meteor.userId() == Events.findOne({_id:eventId}).adminId){
	    		return false;
	    	}
	    	return true;
	    }
    },
    'largeEvent': function(eventId){
    	if(Events.findOne({_id:eventId})){
	    	if( !(Meteor.userId() == Events.findOne({_id:eventId}).adminId)){
	    		if(Events.findOne({_id:eventId}).attendees.length>=100){
	    			return "panel-danger";
	    		}
	    	}
	    	return "";
	    }
    },
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
			});
		    
		    /* Remove marker from map */
		    if(window.markers[eventId]){
				window.markers[eventId].setMap(null);
				google.maps.event.clearInstanceListeners(window.markers[eventId]);
				delete window.markers[eventId];
				window.toggleTime();
			}
			
			return false;
		}
		return true;
	},
	mapOptions: function() {
		return {center: central_campus, zoom: 15};
	},
	inEvent: function(eventId) {
		if(Events.findOne({_id:eventId})){
			var attendees = Events.findOne({_id: eventId}).attendees;
			return _.contains(attendees, Meteor.userId());
		}
	},
	getAdmin: function(userId){
		if(Meteor.users.findOne({_id: userId}) && Meteor.users.findOne({_id: userId}).services){
			return Meteor.users.findOne({_id: userId}).services.google.given_name + " " + Meteor.users.findOne({_id: userId}).services.google.family_name;
		}
	},
    getAdminNetId: function(userId) {
    	if(Meteor.users.findOne({_id: userId}) && Meteor.users.findOne({_id: userId}).services){
    		return Meteor.users.findOne({_id: userId}).services.google.email.split("@")[0];
    	}
    },
    datesPresent: function() {
    	console.log("hello");
    	var date1 = $("#date1").value;
		var date2 = $("#date2").value;
		if(date1 && date2){
			return true;
		}
		return false;
    },
    'categoryNames': function() {
		return ["Club Meeting","Study Group","Office Hours","Party","Other"];
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
  	 	$('.notMine').toggle();
  	},
	'click #join-button': function(evt) {
		evt.preventDefault();
		var eventId = $(evt.target).parent().parent().attr('id');
		var attendees = Events.findOne({_id: eventId}).attendees;
		if(!_.contains(attendees, Meteor.userId())) {
			attendees.push(Meteor.userId());
			Events.update({'_id': eventId}, {$set: {'attendees': attendees, 'numAttendees': attendees.length}});
		}
	},
	'click #leave-button': function(evt) {
		evt.preventDefault();
		var eventId = $(evt.target).parent().parent().attr('id');
		var attendees = Events.findOne({_id: eventId}).attendees;
		attendees.splice(attendees.indexOf(Meteor.userId()));
		Events.update({'_id': eventId}, {$set: {'attendees': attendees, 'numAttendees': attendees.length}});
	},
	'change .checkbox': function(evt) {
    	$('.checkbox').not($(evt.target)).prop('checked', false);  
	},
	'change .category-checkbox': function(evt) {
    	$('.category-checkbox').not($(evt.target)).prop('checked', false);  
	},
	'change .filter-field': function(evt) {
		var all = document.getElementById("all").checked;
		var attending = document.getElementById("attending").checked;
		var large = document.getElementById("large").checked;
		var my = document.getElementById("my").checked;
		var date1 = document.getElementById("date1").value;
		var date2 = document.getElementById("date2").value;
		var club = document.getElementById("club").checked;
		var study = document.getElementById("study").checked;
		var office = document.getElementById("office").checked;
		var party = document.getElementById("party").checked;
		var other = document.getElementById("other").checked;
		var category;

		if(club){
			category = "Club Meeting";
		}
		if(study){
			category = "Study Group";
		}
		if(office){
			category = "Office Hours";
		}
		if(party){
			category = "Party";
		}
		if(other){
			category = "Other";
		}

		if(document.getElementById("time1")){
			var time1 = document.getElementById("time1").value;
			var time2 = document.getElementById("time2").value;
		}
		var eventsList = Events.find({},{sort: {"date": 1, "startTime": 1}});
		if(category){
			eventsList = Events.find({category:category},{sort: {"date": 1, "startTime": 1}});
		}
		if(attending && category){
			eventsList = Events.find( { $and: [ {attendees: Meteor.user()},{category:category} ] },{sort: {"date": 1, "startTime": 1}});
		}
		if(large && category){
			eventsList = Events.find( { $and: [ {numAttendees: { $gt: 99} },{category:category} ] },{sort: {"date": 1, "startTime": 1}});
		}
		if(my && category) {
			eventsList = Events.find( { $and: [ {adminId: Meteor.userId()},{category:category} ] },{sort: {"date": 1, "startTime": 1}});
		}
		if(attending && !category){
			eventsList = Events.find( { $and: [ {attendees: Meteor.user()} ] },{sort: {"date": 1, "startTime": 1}});
		}
		if(large && !category){
			eventsList = Events.find( { $and: [ {numAttendees: { $gt: 99} }] },{sort: {"date": 1, "startTime": 1}});
		}
		if(my && !category) {
			eventsList = Events.find( { $and: [ {adminId: Meteor.userId()} ] },{sort: {"date": 1, "startTime": 1}});
		}
		if(date1 && date2){
			$("#times-between").show();
			var newTime1 = time1;
			var newTime2 = time2;
			if(!time1 || !time2){
				newTime1 = "00:00";
				newTime2 = "23:59";
			}
			var minutes1 = (parseInt(newTime1.split(":")[1]) - 1) + "";
			var minutes2 = (parseInt(newTime2.split(":")[1]) + 1) + "";
			var eventDate1 = new Date(date1.split("-")[0],date1.split("-")[1]-1,date1.split("-")[2], newTime1.split(":")[0], minutes1, 0);
			var eventDate2 = new Date(date2.split("-")[0],date2.split("-")[1]-1,date2.split("-")[2], newTime2.split(":")[0], minutes2, 0);

			eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } }] } ,{sort: {"date": 1, "startTime": 1}})
			if(category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{category:category}] } ,{sort: {"date": 1, "startTime": 1}})
			}
			if(attending && category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{ attendees: Meteor.user() },{category:category} ] },{sort: {"date": 1, "startTime": 1}})
			}
			if(large && category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{ numAttendees: { $gt: 99} },{category:category} ] },{sort: {"date": 1, "startTime": 1}})
			}
			if(my && category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{adminId: Meteor.userId()},{category:category} ] },{sort: {"date": 1, "startTime": 1}})
			}
			if(attending && !category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{ attendees: Meteor.user() } ] },{sort: {"date": 1, "startTime": 1}})
			}
			if(large && !category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{ numAttendees: { $gt: 99} } ] },{sort: {"date": 1, "startTime": 1}})
			}
			if(my && !category){
				eventsList = Events.find( { $and: [ { dateObj: { $gt: eventDate1, $lt: eventDate2 } },{adminId: Meteor.userId()} ] },{sort: {"date": 1, "startTime": 1}})
			}
		}
		else{
			$("#times-between").hide();
		}
		eventsList=eventsList.fetch();
		Session.set("events",eventsList);
		
		// Visible events list may have changed so update variable
		events = Session.get("events");//Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch();

		// Hide all the markers
		for (var m in window.markers)
			window.markers[m].setVisible(false);
		// If interval-view is on, filterMarkers on new events list
		if ($("#time_checkbox")[0].checked){
			filterMarkers($("#time_slider")[0].value);
		} else {
			// Otherwise, make all disappear and reappear only the ones on the event list
			for (var i = 0; i < events.length; i++)
				window.markers[events[i]._id].setVisible(true);
		}
	}
});
