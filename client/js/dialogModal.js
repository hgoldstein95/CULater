Template.dialogModal.events({
  'click .btn-primary': function(evt) {
    var eventId = $('#dialogModal').data('eventid');
    if(Meteor.userId() == Events.findOne({_id: eventId}).adminId) {
      Events.remove({
        _id: eventId
      });
    }
  }
});
