Meteor.startup(function(){
	Meteor.publish('events', function() {
		return Events.find({});
	});

	Meteor.publish('users', function() {
		return Meteor.users.find({});
	});

	Accounts.loginServiceConfiguration.remove({
   		service: 'google'
	});

	Accounts.loginServiceConfiguration.insert({
		service: 'google',
		clientId: '95561716582-m4gg538tjh2r7dv9mtanqo5ibc3kl2pi.apps.googleusercontent.com',
		secret: 'NTl1jV8XVL3z2Dr_l93Z3P0H'
	});

	Accounts.validateNewUser(function (user) {
    if(user.services.google.email.match(/cornell\.edu$/)) {
        return true;
    }
    throw new Meteor.Error(403, "You must sign in using a cornell.edu account");
});
});

Meteor.methods({ 
	eventsOnHooksInit : function(){} 
});