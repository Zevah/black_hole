var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var w = window.innerWidth - 50 || document.documentElement.clientWidth - 50 || document.body.clientWidth - 50;
var h = window.innerHeight - 50 || document.documentElement.clientHeight - 50 || document.body.clientHeight - 50;
canvas.width = w;
canvas.height = h;
canvas.style.left = (window.innerWidth - w)/2+'px';

if(window.innerHeight>h){
	canvas.style.top = (window.innerHeight - h)/2+'px';
}

canvas.style.position = "absolute";

var particles = [];
var rows = 40;
var columns = 50;
var xSpacing = w/columns;
var ySpacing = h/rows;
var xMargin = xSpacing/2;
var yMargin = ySpacing/2;
var particlesNum = rows * columns;
var mx;
var my;
var pulse = [];
var DRAG = 0.95;
var EASE = 0.05;
var THICKNESS = Math.pow( 20, 1.8 );

// Event listener to get the mouse position
window.addEventListener( 'mousemove', function(e) {
	var bounds = canvas.getBoundingClientRect();
	mx = e.clientX - bounds.left;
	my = e.clientY - bounds.top;
});

// Event listener add a pulse
window.addEventListener( 'mousedown', function(e) {
	pulse.push({x: mx, y: my, t: 0, r: 0});
});

// Event listener add a pulse
window.addEventListener( 'touchstart', function(e) {
	var touchobj = e.changedTouches[0];
	pulse.push({x: parseInt(touchobj.clientX), y: parseInt(touchobj.clientY), t: 0, r: 0});
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
		if(i%2 == 0){
			color += letters[Math.floor(Math.random() * 15)];
		}else{
			color += letters[Math.floor(Math.random() * 16)];
		}
    }
    return color;
}

// This creates particles with randomized values for x & y coordinates, radius size, color, and how fast
function Factory(i){  
	this.x = xMargin + xSpacing * ( i % columns );
	this.y = yMargin + ySpacing * Math.floor( i / columns );
	this.xOrigin = this.x
	this.yOrigin = this.y
	this.rad = 3;//Math.round( Math.random() * 5) + 1;
	this.rgba = getRandomColor();//'#333333';
	this.vx = 0;
	this.vy = 0;
}

function draw(){
	ctx.clearRect(0, 0, w, h);
	
	for(var j=0;j<pulse.length;j++){
		pulse[j].t++;
		pulse[j].r = pulse[j].t/10;
	}
	
	// loop through all the particles
	for(var i = 0;i < particlesNum; i++){
		var temp = particles[i];
		
		// Defines the color for filling and drawing lines.
		ctx.fillStyle = temp.rgba;
		ctx.strokeStyle = temp.rgba;
		
		if(my != null && mx != null){
			var dx = mx - temp.x;
			var dy = my - temp.y
			var d = dx * dx + dy * dy;
			
			var f = THICKNESS / Math.pow(d,9/10);
			if(f > 3){
				f = 3;
			}
			var t = Math.atan2( dy, dx );
			temp.vx += f * Math.cos(t);
			temp.vy += f * Math.sin(t);
			
			for(var j=0;j<pulse.length;j++){
				var r = pulse[j].r;
				
				if(r > 20){
					pulse.splice(j,1);
					j--;
				}else{
					dx = pulse[j].x - temp.xOrigin;
					dy = pulse[j].y - temp.yOrigin;
					d = dx * dx + dy * dy;
					var ratio = r/20;
					
					if(r * ratio <= 0.00001 * d && r * ratio >= 0.000009 * d){
						t = Math.atan2( dy, dx );
						
						temp.vx -= 1.2 * Math.cos(t);
						temp.vy -= 1.2 * Math.sin(t);
					}
				}
			}

			temp.vx *= DRAG;
			temp.vy *= DRAG;
			
			temp.x += temp.vx + (temp.xOrigin - temp.x) * EASE;
			temp.y += temp.vy + (temp.yOrigin - temp.y) * EASE;
		}
		
		
		// This is what draws the particle
		ctx.beginPath();	// Start drawing
		ctx.arc(temp.x, temp.y, temp.rad, 0, 2*Math.PI, true); 	
		ctx.fill();	// fills the arc
		ctx.closePath(); // stop drawing
		
		// Defines the color for filling and drawing lines.
		ctx.fillStyle = '#1111ee';
		ctx.strokeStyle = '#1111ee';
	}
	
	// Defines the color for filling and drawing lines.
	ctx.fillStyle = '#1111ee';
	ctx.strokeStyle = '#1111ee';
		
	if(my != null && mx != null){
		ctx.beginPath();	// Start drawing
		ctx.arc(mx, my, 3, 0, 2*Math.PI, true); 	
		ctx.fill();	// fills the arc
		ctx.closePath(); // stop drawing
	}
}

// An api for doing recusive animation loops. Basically it optimizes things when it can
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

// Create particles
(function init(){
	for(var i = 0; i < particlesNum; i++){
		particles.push(new Factory(i));
	}
})();

// The animation loop
(function loop(){
	draw();
	requestAnimFrame(loop);
})();