var shipSpeed = 0.1,
    shipMaxSpeed = 650;  // in comparison, earths size in this is "282" units.

/*

	So, if your ship is going at a rate of 282 units, you will 
	be moving the equivallent of the Earths radius per frame. 
	Pretty fast... but yet so slow.
	
	The Mini-Map in the bottom right has the distance between 
	planets to-scale, but the planets themselves have a minimum
	of 1px, or else the majority of them would be too small to 
	dispay.  
	
	Your ship is the red dot origionally orbiting around 
	earth.
	
*/


// I'll go through my code at some point and comment main parts out.

/* 

	For now at least, I have a main physics class called "particle"
	the sun, ship, and commets are all particles which means they 
	recieve velocity, position, and other special data like that.
	
	To start off, I create two canvas's, one for the main show and
	the other for the mini-map. 
	
	Then, I use the particle class to create all of the main bodies 
	in our solar system - assigning attributes to each one to 
	distinguish them and for styling them on draws - for example, 
	earth has the title "earth" and the fill color is blue. I also
	set the mass and size of each one there as well.
	
	On each render cycle, I apply gravity to every particle so that it
	interacts with every other particle in the solar system. Particles
	with more mass result in more of a gravitational pull on other 
	particles, while particles with little to no mass are practically 
	ignored.
	
	I then draw everything based on the attributes the particle was 
	created with, and update the minimap. 

*/


var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    mcanvas = document.createElement('canvas'),
    mcontext = mcanvas.getContext('2d'),
    speedDiv = document.getElementById('speed'),
    speedLight = document.getElementById('speedLight'),
    size = {
	    x: window.innerWidth,
	    y: window.innerHeight
    },
    camera = {
	    x: 0,
	    y: 0
    },
    G = 1,
    uScale = size.x / 178960000*10000,
    stars = [];

var orbitButton = document.getElementById('enterOrbit'),
    nearPlanet = null,
    warpingTo = null;

canvas.width = size.x;
canvas.height = size.y;

var mapSize = 400,
    mapScale = mapSize / ((6906375272*1.5)*uScale);
mcanvas.width = mapSize;
mcanvas.height = mapSize;
mcanvas.classList.add('minimap');
mcontext.translate(mapSize/2,mapSize/2);

context.globalCompositeOperation = "lighter";
context.fillStyle = '#FFF';
context.strokeStyle = '#17024a';

var lastCalledTime = Date.now();
var fps = 0;

var keys = {
	up: false,
	down: false,
	left: false,
	right: false
};

var astroids = [],
    astroid_startingMaxVelocity = 5,
    planets = [],
    ship = null,
    thrust = vector.create(0,0),
    angle = 0;

var planetsBoundingBox = {
	left: 0,
	right: 0,
	top: 0,
	bottom: 0
}

function createAstroids(planet, count, color, dist){
	dist = dist ? dist : 250;
	for(var i = 0; i < count; i++){
		var ar = planet.size + (Math.random() * 250) + dist,
		    av = Math.sqrt((G *planet.mass)/ar),
		    sx = planet.position.getX(),
		    sy = planet.position.getY(),
		    angle = Math.random()*(Math.PI*2),
		    ax = sx + ar * Math.cos(angle),
		    ay = sy + ar * Math.sin(angle);

		var astroid = particle.create(ax, ay, av, -Math.PI/2 + angle);
		astroid.color = color;
		astroid.velocity.addTo(planet.velocity);
		astroids.push(astroid);
	}
}


// I am subtracting 10^20 from each planets mass
// size is m
var sun = particle.create(0, 0, 0,0);
sun.shadowColor = 'rgba(255,255,255,0.8)';
sun.blur = 1000;
sun.fill = '#FFF';
sun.size = Math.floor(695700*uScale);
sun.mass = 19890000000*uScale;
sun.name = 'sun';
planets.push(sun);

var mercuryOrbital = orbitCalc(sun, 57910000*uScale, true);
var mercury = particle.create(mercuryOrbital.x, mercuryOrbital.y, mercuryOrbital.v, -Math.PI/2);
mercury.shadowColor = 'rgba(90,90,90,0.3)';
mercury.blur = 500;
mercury.fill = '#666';
mercury.size = Math.floor(2440*uScale);
mercury.mass = 3285*uScale;
mercury.name = 'mercury';
planets.push(mercury);

var venusOrbital = orbitCalc(sun, 108200000*uScale, true);
var venus = particle.create(venusOrbital.x, venusOrbital.y, venusOrbital.v, -Math.PI/2);
venus.shadowColor = 'rgba(176,159,130,0.3)';
venus.blur = 500;
venus.fill = '#b09f82';
venus.size = Math.floor(6052*uScale);
venus.mass = 48670*uScale;
venus.name = 'venus';
planets.push(venus);

var earthOrbital = orbitCalc(sun, 149600000*uScale, true);
var earth = particle.create(earthOrbital.x, earthOrbital.y, earthOrbital.v, -Math.PI/2);
earth.shadowColor = 'rgba(120,180,255,0.8)';
earth.blur = 500;
earth.fill = '#0163d2';
earth.size = Math.floor(6371*uScale);
earth.mass = 59720*uScale;
earth.name = 'earth';
planets.push(earth);
createAstroids(earth, 200, earth.shadowColor);

var marsOrbital = orbitCalc(sun, 227900000*uScale, true);
var mars = particle.create(marsOrbital.x, marsOrbital.y, marsOrbital.v, -Math.PI/2);
mars.shadowColor = 'rgba(173,103,20,0.3)';
mars.blur = 500;
mars.fill = '#d27555';
mars.size = Math.floor(3390*uScale);
mars.mass = 6390*uScale;
mars.name = 'mars';
planets.push(mars);
createAstroids(mars, 120, mars.shadowColor);

var jupiterOrbital = orbitCalc(sun, 778500000*uScale, true);
var jupiter = particle.create(jupiterOrbital.x, jupiterOrbital.y, jupiterOrbital.v, -Math.PI/2);
jupiter.shadowColor = 'rgba(173,103,20,0.3)';
jupiter.blur = 500;
jupiter.fill = '#d27555';
jupiter.size = Math.floor(69911*uScale);
jupiter.mass = 18980000*uScale;
jupiter.name = 'jupiter';
planets.push(jupiter);
createAstroids(jupiter, 120, jupiter.fill);

var saturnOrbital = orbitCalc(sun, 1429000000*uScale, true);
var saturn = particle.create(saturnOrbital.x, saturnOrbital.y, saturnOrbital.v, -Math.PI/2);
saturn.shadowColor = 'rgba(228,190,127,0.3)';
saturn.blur = 500;
saturn.fill = '#e4be7f';
saturn.size = Math.floor(69911*uScale);
saturn.mass = 18980000*uScale;
saturn.name = 'saturn';
planets.push(saturn);
createAstroids(saturn, 1800, saturn.fill, 500);
createAstroids(saturn, 1600, saturn.fill, 900);

var uranusOrbital = orbitCalc(sun, 2871069696*uScale, true);
var uranus = particle.create(uranusOrbital.x, uranusOrbital.y, uranusOrbital.v, -Math.PI/2);
uranus.shadowColor = 'rgba(80,212,235,0.3)';
uranus.blur = 500;
uranus.fill = '#50d4eb';
uranus.size = Math.floor(25361*uScale);
uranus.mass = 868100*uScale;
uranus.name = 'uranus';
planets.push(uranus);

var neptuneOrbital = orbitCalc(sun, 4498116480*uScale, true);
var neptune = particle.create(neptuneOrbital.x, neptuneOrbital.y, neptuneOrbital.v, -Math.PI/2);
neptune.shadowColor = 'rgba(56,81,202,0.3)';
neptune.blur = 500;
neptune.fill = '#3851ca';
neptune.size = Math.floor(24621*uScale);
neptune.mass = 1024000*uScale;
neptune.name = 'neptune';
planets.push(neptune);

var plutoOrbital = orbitCalc(sun, 5906376272*uScale, true);
var pluto = particle.create(plutoOrbital.x, plutoOrbital.y, plutoOrbital.v, -Math.PI/2);
pluto.shadowColor = 'rgba(70, 22, 18, 0.9)';
pluto.blur = 500;
pluto.fill = '#b1b3b2';
pluto.size = Math.floor(1187*uScale);
pluto.mass = 130.9*uScale;
pluto.name = 'pluto';
planets.push(pluto);


var OrbitAround = earth;
var shipOrbital = orbitCalc(OrbitAround, 250 );
var ship = particle.create(shipOrbital.x, shipOrbital.y, shipOrbital.v, -Math.PI/2);
ship.speed = shipSpeed;
ship.maxSpeed = shipMaxSpeed;
ship.mass = 0.0001*uScale;
ship.velocity.addTo(OrbitAround.velocity);

function drawShip(){
	nearPlanet = null;
	for(var p = 0; p < planets.length; p++){
		ship.gravitateTo(planets[p], planets[p].mass, ship.mass);
		if(ship.position.distanceTo(planets[p].position) <= planets[p].size && warpingTo == null){
			var shipOrbital = orbitCalc(OrbitAround, 250);
			
			ship.position.setX(shipOrbital.x);
			ship.position.setY(shipOrbital.y);
			ship.velocity = vector.create(0, 0);
			ship.velocity.setLength(shipOrbital.v);
			ship.velocity.setAngle(-Math.PI/2);
			ship.velocity.addTo(OrbitAround.velocity);
		} else if(ship.position.distanceTo(planets[p].position) <= planets[p].size + 600){
			nearPlanet = planets[p];
			orbitButton.classList.add('visible');
		} else {
			if(!nearPlanet){
				orbitButton.classList.remove('visible');
			}
		}
	}
	
	ship.update();
	ship.velocity.maxSpeed(ship.maxSpeed);

	var p = ship,
	    x = camera.x + size.x/2,
	    y = camera.y + size.y/2;

	context.save();
	context.translate(x,y);
	context.rotate(angle);
	context.fillStyle = '#FFF';
	
	context.beginPath();
	context.lineTo(-8, -6);
	context.lineTo(-8, 6);
	context.lineTo(10, 0);
	context.fill();

	context.restore();
}

function moveCamera(){
	camera.x = Math.floor(ship.position.getX() - size.x/2);
	camera.y = Math.floor(ship.position.getY() - size.y/2);

	context.setTransform(1,0,0,1,-camera.x,-camera.y);
}

function miniMap(){
	mcontext.clearRect(-mapSize/2,-mapSize/2,mapSize,mapSize);
	
	for(var i = 0; i < planets.length; i++){
		var s = planets[i].size*mapScale;
		s = s >= 1 ? s : 1;
		
		var yoff = 20; textOff = 5; t = 20; t2 = 5; align = 'left';
		
		var x = planets[i].position.getX()*mapScale,
		    y = planets[i].position.getY()*mapScale;
		
		if(x < 0){
			yoff = -20; textOff = -5; t = -20; t2 = -5; align = 'right';
		}
		
		mcontext.fillStyle = planets[i].fill;
		mcontext.beginPath();
		mcontext.arc(x,y,s,0,2*Math.PI);
		mcontext.fill();
		
		mcontext.strokeStyle = '#FFF';
		mcontext.beginPath();
		mcontext.moveTo(x+t2, y);
		mcontext.lineTo(x+yoff, y);
		mcontext.stroke();
		
		mcontext.save();
		mcontext.translate(x+textOff,y);
		
		mcontext.font="10px Arial";
		mcontext.textAlign = align;
		mcontext.fillText(planets[i].name.toUpperCase(),t,3.5);
		
		mcontext.restore();
	}
	
	mcontext.fillStyle = '#F00';
	mcontext.fillRect(ship.position.getX() * mapScale, ship.position.getY() * mapScale, 1.5, 1.5);
}
var speedM;
function render(){
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	context.clearRect(camera.x - 50,camera.y - 50,size.x + 100,size.y + 100);
	
	
	if(keys.up){
		thrust.setLength(ship.speed);
	} else{
		thrust.setLength(0);
	}
	if(keys.left){
		angle -= 0.05;
	} 
	if(keys.right){
		angle += 0.05;
	}
	thrust.setAngle(angle);
	ship.accelerate(thrust);

	for(var i = 0; i < planets.length; i++){
		if(planets[i].position.distanceTo(ship.position) < planets[i].size + (size.x >= size.y ? size.x : size.y)){
			context.shadowBlur = planets[i].blur;
			context.shadowColor = planets[i].shadowColor;
			context.fillStyle = planets[i].fill;
			context.beginPath();
	context.arc(planets[i].position.getX(),planets[i].position.getY(),planets[i].size,0,2*Math.PI);
			context.fill();
			context.shadowBlur = 0;
			context.fillStyle = "#FFF";
		}
		
		for(var p = 0; p < planets.length; p++){
			if(planets[p] != planets[i]){
				planets[i].gravitateTo(planets[p]);
			}
		}
		planets[i].update();
	}
	
	for(var i = 0; i < astroids.length; i++){
		var a = astroids[i];

		if(a){
			for(var p = 0; p < planets.length; p++){
				a.gravitateTo(planets[p], planets[p].mass, a.mass);
				if(a.position.distanceTo(planets[p].position) <= planets[p].size){
					//astroids[i] = particle.create(
					//	random(planets[0].size * 4) - (planets[0].size * 2), 
					//	random(planets[0].size * 4) - (planets[0].size * 2),
					//	random(astroid_startingMaxVelocity), -Math.PI / 2 * Math.random());
				}
			}
			a.update();

			context.beginPath();
			context.fillStyle = a.color;
			context.fillRect(a.position.getX(),a.position.getY(),2,2);
		}
	}
	
	drawShip();
	
	handleWarp();
	moveCamera();
	
	speedM = Math.floor(ship.velocity.getLength() / uScale * 1000);
	speedDiv.innerHTML = Math.round(speedM/fps);
	speedLight.innerHTML = Math.round((speedM / (299792458 / fps)) * 100) / 100;
	
	miniMap();
	requestFrame(render);
}

function random(n){
	return Math.floor(Math.random() * n);
}

window.requestFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

document.body.appendChild(canvas);
document.getElementById('minimap').appendChild(mcanvas);
render();

document.body.addEventListener("keydown", function(e){
	if(e.which == 38){ // up
		keys.up = true;
	} else if(e.which == 40){
		keys.down = true;
	} else if(e.which == 37){
		keys.left = true;
	} else if(e.which == 39){
		keys.right = true;
	}
});

document.body.addEventListener("keyup", function(e){
	if(e.which == 38){
		keys.up = false;
	} else if(e.which == 40){
		keys.down = false;
	} else if(e.which == 37){
		keys.left = false;
	} else if(e.which == 39){
		keys.right = false;
	} else if(e.which == 32){ // space to skip warp
		OrbitAround = warpingTo;
		var shipOrbital = orbitCalc(OrbitAround, 250);
		ship.speed = shipSpeed;
		ship.maxSpeed = shipMaxSpeed;
		ship.position.setX(shipOrbital.x);
		ship.position.setY(shipOrbital.y);
		ship.velocity = vector.create(0, 0);
		ship.velocity.setLength(shipOrbital.v);
		ship.velocity.setAngle(-Math.PI/2);
		ship.velocity.addTo(OrbitAround.velocity);
		UI.welcome(warpingTo.name);
		warpingTo = null;
	}
});

function orbitCalc(planet, dist, orbit){
	var r = planet.size + dist,
	    v = Math.sqrt((G *planet.mass)/r);

	if(!orbit && planet != sun){
		return { v: v, x: planet.position.getX() + r, y: planet.position.getY() };
	} else if(!orbit && planet == sun){
		var r = planet.size + dist*2,
	   		v = Math.sqrt((G *planet.mass)/r);
		return { v: v, x: planet.position.getX() + r, y: planet.position.getY() };
	} else {
		var ar = dist,
		    av = Math.sqrt((G *planet.mass)/ar),
		    sx = planet.position.getX(),
		    sy = planet.position.getY(),
		    angle = Math.random()*(Math.PI*2),
		    ax = sx + ar * Math.cos(angle),
		    ay = sy + ar * Math.sin(angle);
		return { x: ax, y: ay, v: av, angle: -Math.PI/2 + angle };
	}
}

orbitButton.addEventListener('mouseup',function(){
	var shipOrbital = orbitCalc(nearPlanet, 250);
	ship.position.setX(shipOrbital.x);
	ship.position.setY(shipOrbital.y);
	ship.velocity = vector.create(0, 0);
	ship.velocity.setLength(shipOrbital.v);
	ship.velocity.setAngle(-Math.PI/2);
	ship.velocity.addTo(earth.velocity);
});

function handleWarp(){
	if(warpingTo != null){
		angle = ship.angleTo(warpingTo);
		
		if(warpingTo.position.distanceTo(ship.position) > warpingTo.size + 278204){
			ship.maxSpeed = 50000;
			ship.speed = 10;
			thrust.setLength(ship.speed);
			thrust.setAngle(angle);
			ship.accelerate(thrust);
		} else if(warpingTo.position.distanceTo(ship.position) > warpingTo.size + 5000){
			ship.maxSpeed = 500;
			ship.speed = 10;
			thrust.setLength(ship.speed);
			thrust.setAngle(angle);
			ship.accelerate(thrust);
		} else if(warpingTo.position.distanceTo(ship.position) > warpingTo.size + 1000){
			ship.maxSpeed = 100;
			ship.speed = 5;
			thrust.setLength(ship.speed);
			thrust.setAngle(angle);
			ship.accelerate(thrust);
		} else if(warpingTo.position.distanceTo(ship.position) > warpingTo.size + 500){
			ship.maxSpeed = shipSpeed*2;
			ship.speed = shipMaxSpeed*2;
			thrust.setLength(ship.speed);
			thrust.setAngle(angle);
			ship.accelerate(thrust);
		} else {
			OrbitAround = warpingTo;
			ship.speed = shipSpeed;
			ship.maxSpeed = shipMaxSpeed;
			ship.velocity = vector.create(0, 0);
			ship.velocity.addTo(warpingTo.velocity);
			UI.welcome(warpingTo.name);
			warpingTo = null;
		}
	}
}

function warpTo(planet){
	warpingTo = planet;
}

var warpDivs = document.getElementById('warp').childNodes;
for(var i = 1; i < warpDivs.length; i+=2){
	if(warpDivs[i]){
		warpDivs[i].childNodes[0].addEventListener('mouseup',function(){
			for(var p = 0; p < planets.length; p++){
				if(planets[p].name == this.title){
					warpTo(planets[p]);
				}
			}
		});
	}
}

var welcomeDiv = document.getElementById('welcome');
var UI = {
	welcome: function(name){
		welcomeDiv.childNodes[3].innerHTML = name;
		welcomeDiv.classList.add('open');
		
		setTimeout(function(){
			welcomeDiv.classList.remove('open');
		}, 5000);
	}
}
UI.welcome(OrbitAround.name);