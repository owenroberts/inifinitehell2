// loading animation pre lines render
const title = document.getElementById('title');
function loadingAnimation() {
	let t = '~' + title.textContent + '~';
	title.textContent = t;
}
let loadingInterval = setInterval(loadingAnimation, 1000 / 12);

const isMobile = Cool.mobilecheck();
if (isMobile) document.body.classList.add('mobile');

/* this is the game part */
const gme = new Game({
	dps: 24,
	lineWidth: 1,
	// zoom: isMobile ? 1 : 1.5,
	zoom: 1,
	width: window.innerWidth,
	height: window.innerHeight,
	multiColor: true,
	checkRetina: true,
	// debug: true,
	// stats: true,
	suspend: true,
	events: isMobile ? ['touch'] : ['keyboard', 'mouse'],
	scenes: ['game', 'splash', 'loading', 'scenery'],
	bounds: {
		left: -1024,
		top: 1024,
		right: 1024,
		bottom: 1024,
	}
});

gme.load({ 
	// scenery: 'data/scenery.json',
	// textures: 'data/textures.json',
	sprites: 'data/sprites.json',
	// ui: 'data/ui.json',
}, false);

const { Engine, Bodies, Body, Composite, Runner, Events } = Matter;
let player;
gme.levels = [];
let scenery = new Scenery();
let camera = new Camera();
let physics = new Physics();

gme.start = function() {
	document.getElementById('splash').remove();

	player = new Player(256 + 128, 0, gme.anims.sprites.player)
	gme.scenes.game.addSprite(player);
	
	const w = gme.view.halfWidth, h = gme.view.halfHeight;

	gme.levels = [];
	gme.currentLevel = [0, 0];
	let firstLevel = new Level([0,0], 0, 0, 3, '000000111');
	
	scenery.setup();
	gme.scenes.current = 'game';
	Runner.run(physics.engine); // start physics
};
// update by matter ...

gme.draw = function() {
	gme.ctx.save();
	gme.ctx.clearRect(0, 0, gme.view.width, gme.view.height);

	// "parrallaxx bg"
	gme.ctx.save();
	gme.ctx.translate(player.x / 50, player.y / 50);
	gme.scenes.scenery.display();
	gme.ctx.restore();
	
	camera.update();
	physics.render();
	gme.scenes.current.display(camera.view);
	gme.ctx.restore();
};

/* events */
gme.keyDown = function(key) {
	switch (key) {
		case 'a':
		case 'left':
			player.inputKey('left', true);
			break;
		case 'w':
		case 'up':
		case 'x':
		case 'space':
			player.inputKey('jump', true);
			break;
		case 'd':
		case 'right':
			player.inputKey('right', true);
			break;
		// case 's':
		// case 'down':
		// 	player.inputKey('down', true);
		// 	break;
		case 'g':
			// if (!userStarted) userStart();
		break;
		case 'h':
			// if (!userStarted) loadSound();
		break;
		case 't':
			physics.display = !physics.display;
			console.log('show physies', physics.display);
		break;

	}
};

gme.keyUp = function(key) {
	switch (key) {
		case 'a':
		case 'left':
			player.inputKey('left', false);
			break;
		case 'w':
		case 'up':
		case 'x':
		case 'space':
			player.inputKey('jump', false);
			break;
		case 'd':
		case 'right':
			player.inputKey('right', false);
			break;
		case 's':
		case 'down':
			player.inputKey('down', false);
			break;
	}
};
