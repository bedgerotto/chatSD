$(document).ready(function(){
	var socket = io.connect("http://192.168.0.103:3000");
	var ready = false;
	$('#submit').submit(function(e){
		e.preventDefault();
		$('.nickname_container').fadeOut();
		$('#chat').fadeIn();

		var name = $('#nickname').val();
		var time = new Date();

		if (name) {
			$('#name').text(name);
			$('#time').text('Login: ' + time.getHours() + ':' + time.getMinutes());

			ready = true;
			socket.emit("join", name);
			$('#textarea').focus();
		}
	});

	$('#textarea').keypress(function(e){
		if (e.which == 13) {
			var text = $('#textarea').val();
			if (text) {
				$('#textarea').val('');
				var time = new Date();
				$('.chat').append('<div class="col s7 green msg right card-panel"><h6>' + $('#nickname').val() + ': </h6> <p class="flow-text">' + text + '</p><div class="right"><p>' + time.getHours() + ':' + time.getMinutes() + '</p></div></div>');
				socket.emit('send', text);
				scrolPage();
			}
		}
	});

	socket.on('update', function(msg){
		if (ready) {
			$('.chat').append('<div class="col s12 card-panel blue lighten-4"><p>' + msg + '</p></div>');
			scrolPage();
		}
	});

	socket.on('chat', function(client, msg){
		if (ready) {
			var time = new Date();
			$('.chat').append('<div class="col s7 blue msg left card-panel"><h6>' + client + ': </h6> <p class="flow-text">' + msg + '</p><div class="right"><p>' + time.getHours() + ':' + time.getMinutes() + '</p></div></div>');
			scrolPage();
		}
	})
});

function scrolPage(){
	$(".chat").animate({ scrollTop: $('.chat').prop('scrollHeight') }, 10);
}
