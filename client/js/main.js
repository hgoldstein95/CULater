Meteor.startup(function() {
	GoogleMaps.load();

	Session.setDefault('events',Events.find({},{sort: {"date": 1, "startTime": 1}}).fetch())
	Session.setDefault('names', []);

	Buildings = new Meteor.Collection('buildings');

	Meteor.subscribe('users');
	Meteor.subscribe('events');
	Meteor.subscribe('buildings');
});
