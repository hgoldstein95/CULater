Template.eventForm.events({
  'submit form': function(evt) {
  	evt.preventDefault();
  	var name = evt.target.eventName.value;
  	var description = evt.target.eventDescription.value;
  	var location = evt.target.eventLocation.value;
  	var time = evt.target.eventTime.value;
  	var attendees = [];
    Events.insert({
    	adminId: Meteor.userId(),
    	name: name,
    	description: description,
    	location: location,
    	time: time,
    	attendees: attendees
    });
    $("#modal-close").click();
    $("form")[0].reset();
  }
});
