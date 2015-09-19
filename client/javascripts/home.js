Meteor.startup(function() {

	Meteor.subscribe('users');
	Meteor.subscribe('events');

});

Template.home.events({
    'click a#login': function(evt) {
    	Meteor.loginWithGoogle({
    	}, function (err) {
        	if(err) {
            	//error handling
            	alert('error : '+err.message);
        	} else {

        	}
    	});
    	if(Meteor.user()){
    		$("a#login").html(Meteor.userId());
    	}
    	else{
    		$("a#login").html("Login");
    	}
    },
    'click a#logout': function(evt) {
    	Meteor.logout();
    }
})