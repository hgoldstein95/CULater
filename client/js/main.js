Meteor.startup(function() {
	GoogleMaps.load();

	Buildings = new Meteor.Collection('buildings')

	Meteor.subscribe('users');
	Meteor.subscribe('events');
	Meteor.subscribe('buildings');
});
