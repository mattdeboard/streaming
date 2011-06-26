/*
  HTML5 <audio> streamer by:
    Todd Baker <toddlbaker@gmail.com>
    http://www.madtimber.com
*/

document.getElementById("play").addEventListener('click', function(e) {	
	newPlayer.playPause();		
}, false);

document.getElementById("restart").addEventListener('click', function(e) {		
	newPlayer.restart();
}, false);


function HTML5Player(obj) {
	
	var currentTime;
	var duration;
	var durationEl = null;
	var timer = null;
	var progIndicatorHolderEl = null;
	var progIndicatorEl = null;
	var percentEl = null;
	var timerEl = null;
	var player;
    
	if(obj && typeof(obj) === 'object') {
		
		// TODO: add some armor for required items not passed in
		player = document.getElementById(obj['player_id']);
		timerEl = document.getElementById(obj['timer_el_id']);
		durationEl = document.getElementById(obj['duration_el_id']);
		progIndicatorHolder = document.getElementById(obj['prog_indicator_holder_id']);
		progIndicator = document.getElementById(obj['indicator_id']);
		percentEl = document.getElementById(obj['percent_el_id']);
		setProgressIndicator();
	} else {
		console.log("Player was not initialized properly.");
	}
	
	
	function secondsToTime(n) {
		var minutes = Math.floor(n / 60);
		var secs = n % 60;
        
		if (secs < 10) {
			secs = "0"+secs;
		}
        
		var obj = {
			"m" : minutes,
			"s" : secs
		};
        
		return obj;
	}
	
	function setProgressIndicator() {
		var holderWidth = progIndicatorHolder.clientWidth;
		var percent = (player.duration == 0) ? 0 : (player.currentTime/player.duration);
        
		progIndicator.style.width = Math.floor(holderWidth*percent)+"px";
		percentEl.innerHTML = Math.round(percent*100)+"%";
	}
	
	return {
		playPause: function() {
			if(player.paused) {
				player.play();
			} else {
				player.pause();
			}
		},
		restart:  function() {
			player.currentTime = 0;
			
			if(progIndicator) {
				setProgressIndicator();
			}
		},
		setTimer:  function(sec) {
			var currentTime = secondsToTime(Math.round(sec));
			timerEl.innerHTML = currentTime.m + ":" + currentTime.s;
		},
		setDuration: function() {
			var dsec = secondsToTime(Math.round(this.duration));
			durationEl.innerHTML = dsec.m + ":" + dsec.s;
		},
		onTimeUpdate: function(func) {
			var that = this;
			
			// TODO: fix for IE later
			player.addEventListener('timeupdate', function(e) {
				that.duration = this.duration;
				that.currentTime = this.currentTime;
				setProgressIndicator(); 		
				func.call(that, e);
			}, false);
		}
	};
}

var newPlayer = HTML5Player({
	player_id: "audio1",
	timer_el_id: "timer",
	duration_el_id: "duration",
	prog_indicator_holder_id: "prog-indicator",
	indicator_id: "indicator",
	percent_el_id: "percent"
});
newPlayer.onTimeUpdate(function(e) {
	
	// this stuff really seems like it should be abstracted away
	this.setTimer(this.currentTime);						
	this.setDuration();
})
