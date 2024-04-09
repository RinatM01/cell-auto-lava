let g_nextExample = '';
let g_currentExample = '';
window.onload = function () {
	$('#btnReloadExample').on('click', function (evt) {
		loadExample(g_currentExample);
	});
	$('#numFrames').on('change', function (evt) {
		changeStepFrames();
	});

	loadExample('lava');
	//loadExample('splashes');

	let myCanvas, ctx, renderer, stage, meter, textures, pixels;

	let frames = 0;
	let world;
	function loop() {
	if (g_nextExample !== null) {
		try {
			world = window[g_nextExample]();
			myCanvas = document.getElementById('myCanvas');
			myCanvas.width = world.cellSize * world.width;
			myCanvas.height = world.cellSize * world.height;

			//renderer = PIXI.autoDetectRenderer(myCanvas.width, myCanvas.height, { view: myCanvas });
			//renderer = renderer || new PIXI.autoDetectRenderer(myCanvas.width, myCanvas.height, myCanvas, null, true);
			renderer =
				renderer ||
				new PIXI.CanvasRenderer(
					myCanvas.width,
					myCanvas.height,
					myCanvas,
					null,
					true
				);

			// create the root of the scene graph
			//stage = new PIXI.Container();
			stage = stage || new PIXI.Stage(0xffffff);

			textures = [];
			pixels = [];

			var textureCanvas = document.createElement('canvas');
			textureCanvas.width =
				world.cellSize * world.palette.length;
			textureCanvas.height = world.cellSize;
			var textureCtx = textureCanvas.getContext('2d');
			for (var i = 0; i < world.palette.length; i++) {
				textureCtx.fillStyle =
					'rgba(' + world.palette[i] + ')';
				textureCtx.fillRect(
					i * world.cellSize,
					0,
					world.cellSize,
					world.cellSize
				);
			}
			var baseTexture = new PIXI.BaseTexture.fromCanvas(
				textureCanvas
			);
			for (var i = 0; i < world.palette.length; i++) {
				textures.push(
					new PIXI.Texture(
						baseTexture,
						new PIXI.Rectangle(
							i * world.cellSize,
							0,
							world.cellSize,
							world.cellSize
						)
					)
				);
			}

			drawGrid(pixels, world, stage, textures);

			$('#btnApplyChanges').removeClass('btn-danger');
			$('#btnApplyChanges').addClass('btn-success');
		} catch (ex) {
			console.log(ex);
			$('#btnApplyChanges').removeClass('btn-success');
			$('#btnApplyChanges').addClass('btn-danger');
		}
			g_nextExample = null;
		}
		// limit speed of simulation
		if (frames % g_stepFrames === 0) {
			world.step();
			updateGrid(pixels, world, textures);
			renderer.render(stage);
		}

		requestAnimationFrame(loop);

		frames++;
	}

	changeStepFrames();
	requestAnimationFrame(loop);
};

var g_stepFrames = 1;
function changeStepFrames() {
	g_stepFrames = parseInt($('#numFrames').val(), 10);
}

function loadExample(example) {
	g_currentExample = example;
	g_nextExample = 'example_' + example;
}

function updateGrid(pixels, world, textures) {
	for (var y = 0; y < world.height; y++) {
		for (var x = 0; x < world.width; x++) {
			var newColor = world.grid[y][x].getColor();
			if (newColor !== world.grid[y][x].oldColor) {
				//pixels[x + y*world.width].setTexture(textures[newColor]);
				pixels[x + y * world.width].texture =
					textures[newColor];
				world.grid[y][x].oldColor = newColor;
			}
		}
	}
}

function drawGrid(pixels, world, stage, textures) {
	try {
		stage.removeChildren();
	} catch (ex) {
		console.log(ex);
	}
	for (var y = 0; y < world.height; y++) {
		for (var x = 0; x < world.width; x++) {
			var sprite = new PIXI.Sprite(textures[0]);
			pixels[x + y * world.width] = sprite;
			sprite.x = x * world.cellSize;
			sprite.y = y * world.cellSize;
			stage.addChild(sprite);
		}
	}
}