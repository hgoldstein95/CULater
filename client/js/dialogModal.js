Template.dialogModal.events({
  'click .btn-primary': function(evt) {
    var eventId = $('#dialogModal').data('eventid');

    Meteor.call('sendEmail',
            'cdc99@cornell.edu',
            'cdc99@cornell.edu',
            'Hello from Meteor!',
            'This is a test of Email.send.');

    if(Meteor.userId() == Events.findOne({_id: eventId}).adminId) {
      Events.remove({
        _id: eventId
      });

    /* Remove marker from map */
	  window.removeMarker(eventId);
    }
    Session.set('events',Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch())
  }
});
