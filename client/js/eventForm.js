Template.eventForm.events({
  'submit form.add-event': function(evt) {
  	evt.preventDefault();
  	var name = evt.target.eventName.value;
  	if(evt.target.eventDescription){
  		var description = evt.target.eventDescription.value;
  	}
  	var location = evt.target.eventLocation.value;
  	var date = evt.target.eventDate.value;
  	if(evt.target.eventStartTime){
  		var startTime = evt.target.eventStartTime.value;
  	}
  	if(evt.target.eventEndTime){
  		var endTime = evt.target.eventEndTime.value;
  	}
  	var attendees = [];
  	var eventDate = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2], startTime.split(":")[0], startTime.split(":")[1], 0);
  	var endDate = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2], endTime.split(":")[0], endTime.split(":")[1], 0);
  	var currentDate = new Date();
  	if(eventDate < currentDate || endDate <= eventDate || !name || !location || !date){
  		$("#error-messages").show();
  		return;
  	}
    Events.insert({
    	adminId: Meteor.userId(),
    	name: name,
    	description: description,
    	location: location,
    	date: date,
    	startTime: startTime,
    	endTime: endTime,
    	attendees: attendees
    });
    $("#modal-close").click();
    $("form")[0].reset();
  },

  'submit form.edit-event': function(evt) {
  	evt.preventDefault();
  	var eventId = evt.target.eventId.value;
  	var name = evt.target.eventName.value;
  	var description = evt.target.eventDescription.value;
  	var location = evt.target.eventLocation.value;
  	var date = evt.target.eventDate.value;
  	var startTime = evt.target.eventStartTime.value;
  	var endTime = evt.target.eventEndTime.value;
  	var attendees = [];
    Events.update({
            _id: eventId
        }, {
            $set: {
                adminId: Meteor.userId(),
		    	name: name,
		    	description: description,
		    	location: location,
		    	date: date,
		    	startTime: startTime,
		    	endTime: endTime,
		    	attendees: attendees
            }
        });
    $("#modal-close").click();
    $("form")[0].reset();
  }
});


Template.eventForm.helpers({
	'today': function() {
    	var t = new Date();
		var dd = t.getDate();
		var mm = t.getMonth()+1;
		var yyyy = t.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		t = yyyy + "-" + mm+'-'+dd;
		return t;
	}
})