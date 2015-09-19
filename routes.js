Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/modal', function() {
	this.render('modal');
});

Router.route('/login', function() {
	this.render('login');
});
