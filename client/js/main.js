Meteor.startup(function() {
	GoogleMaps.load();

	Meteor.subscribe('users');
	Meteor.subscribe('events');
});
