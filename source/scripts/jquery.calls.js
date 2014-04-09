$(document).ready(function() {
	NProgress.start();
});

$(window).load(function() {
	NProgress.done();
	$('#content').delay(600).fadeIn('normal');
});

// $(window).resize(function() {});

// $(window).scroll(function() {});
