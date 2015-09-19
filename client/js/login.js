Template.login.events({
    'click a#login': function(evt) {
    	Meteor.loginWithGoogle({
    	}, function (err) {
        	if(err) {
            	//error handling
            	$('#login-failure').show();
        	} else {
                Router.go('/');
        	}
    	});
    }
})