Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/login', function() {
	this.render('login');
});
