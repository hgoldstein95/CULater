Events = new Meteor.Collection("Events");

Events.allow({
	'insert': function(doc) {
		return true;
	},
	'remove': function(userId, doc){
		var userId = Meteor.userId();
		if(userId && Events.findOne({_id: eventId}).adminId == userId){
			return true;
		}
	},
	'update': function(userId, doc){
		var userId = Meteor.userId();
		if(userId && Events.findOne({_id: eventId}).adminId == userId){
			return true;
		}
	}
})