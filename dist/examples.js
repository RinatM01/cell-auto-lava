function example_lava() {
	// thanks to TheLastBanana on TIGSource

	world = new CAWorld({
		width: 134*2,
		height: 85*2,
		cellSize: 5,
		wrap: true
	});

	world.palette = [
		'34,10,21,1', '68,17,26,1', '123,16,16,1',
		'190,45,16,1', '244,102,20,1', '254,212,97,1'
	];
	//"rgba(34,10,21,1)"
	//"rgba(68,17,26,1)"
	//"rgba(123,16,16,1)"
	//"rgba(190,45,16,1)"
	//"rgba(244,102,20,1)"
	//"rgba(254,212,97,1)"

	let colors = [];
	let index = 0;
	for (; index < 18; ++index) { colors[index] = 1; }
	for (; index < 22; ++index) { colors[index] = 0; }
	for (; index < 25; ++index) { colors[index] = 1; }
	for (; index < 27; ++index) { colors[index] = 2; }
	for (; index < 29; ++index) { colors[index] = 3; }
	for (; index < 32; ++index) { colors[index] = 2; }
	for (; index < 35; ++index) { colors[index] = 0; }
	for (; index < 36; ++index) { colors[index] = 2; }
	for (; index < 38; ++index) { colors[index] = 4; }
	for (; index < 42; ++index) { colors[index] = 5; }
	for (; index < 44; ++index) { colors[index] = 4; }
	for (; index < 46; ++index) { colors[index] = 2; }
	for (; index < 56; ++index) { colors[index] = 1; }
	for (; index < 64; ++index) { colors[index] = 0; }

	world.registerCellType('lava', {
		getColor: function () {
			let v = this.value + 0.5
				+ Math.sin(this.x / world.width * Math.PI) * 0.04
				+ Math.sin(this.y / world.height * Math.PI) * 0.04
				- 0.05;
			v = Math.min(1.0, Math.max(0.0, v));

			return colors[Math.floor(colors.length * v)];
		},
		process: function (neighbors) {
			if(this.droplet === true) {
				for (let i = 0; i < neighbors.length; i++) {
					if (neighbors[i] !== null && neighbors[i].value) {
						neighbors[i].value = 0.5 *this.value;
						neighbors[i].prev = 0.5 *this.prev;
					}
				}
				this.droplet = false;
				return true;
			}
			let avg = this.getSurroundingCellsAverageValue(neighbors, 'value');
			this.next = 0.98 * (2 * avg - this.prev);

			return true;
		},
		reset: function () {
			if(Math.random() > 0.999993) {
				this.value = -0.25 + 0.3*Math.random();
				this.prev = this.value;
				this.droplet = true;
			} else {
				this.prev = this.value;
				this.value = this.next;
			}
			this.value = Math.min(0.5, Math.max(-0.5, this.value));
			return true;
		}
	}, function () {
		//init
		this.value = 0.0;
		this.prev = this.value;
		this.next = this.value;
	});

	world.initialize([
		{ name: 'lava', distribution: 100 }
	]);

	return world;
};

function example_splashes() {
	// thanks to lithander on TIGSource

	world = new CAWorld({
		width: 124*2,
		height: 85*2,
		cellSize: 5,
	});

	world.palette = [];
	let colors = [];
	let range = 16
	for (let index=0; index<range; index++) {
		world.palette.push('80, 125, 250, ' + index/range);
		colors[index] = range - 1 - index;
	}

	world.registerCellType('water', {
		getColor: function () {
			let v = (Math.max(2 * this.value + 0.02, 0) - 0.02) + 0.5;
			return colors[Math.floor(colors.length * v)];
		},
		process: function (neighbors) {
			if(this.droplet == true) {
				for (let i = 0; i < neighbors.length; i++) {
					if (neighbors[i] !== null && neighbors[i].value) {
						neighbors[i].value = 0.5 *this.value;
						neighbors[i].prev = 0.5 *this.prev;
					}
				}
				this.droplet = false;
				return true;
			}
			let avg = this.getSurroundingCellsAverageValue(neighbors, 'value');
			this.next = 0.95 * (2 * avg - this.prev);
			return true;
		},
		reset: function () {
			if(Math.random() > 0.9999995) {
				this.value = -0.2 + 0.25*Math.random();
				this.prev = this.value;
				this.droplet = true;
			}
			else {
				this.prev = this.value;
				this.value = this.next;
			}
			return true;
		}
	}, function () {
		//init
		this.water = true;
		this.value = 0.0;
		this.prev = this.value;
		this.next = this.value;
	});

	world.initialize([
		{ name: 'water', distribution: 100 }
	]);

	return world;
};