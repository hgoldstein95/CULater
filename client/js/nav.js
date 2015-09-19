Template.nav.events({
    'click a#login': function(evt) {
    	Meteor.loginWithGoogle({
    	}, function (err) {
        	if(err) {
            	$('#login-failure').show();
        	} else {
                Router.go('/')
        	}
    	});
    },
    'click a#logout': function(evt) {
    	Meteor.logout();
    }
})

Template.nav.helpers({
    'user': function() {
        return Meteor.user();
    },
    'netId': function() {
        return Meteor.user().services.google.email.split("@")[0];
    }
})