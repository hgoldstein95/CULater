Meteor.startup(function() {
	GoogleMaps.load();

	Session.setDefault('names', []);

	Buildings = new Meteor.Collection('buildings');

	Meteor.subscribe('users');
	Meteor.subscribe('events');
	Meteor.subscribe('buildings');
});
