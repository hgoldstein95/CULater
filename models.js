Events = new Meteor.Collection("Events");

Events.allow({
	'insert': function(doc) {
		return true;
	},
	'remove': function(userId, doc){
		return true;
	},
	'update': function(userId, doc){
		return true;
	}
})