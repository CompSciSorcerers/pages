import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';
import PlatformerPlayer from './custom/PlatformerPlayer.js';

class GameLevelMario {
	static displayName = 'Basic Mario Platformer';

	constructor(gameEnv) {
		const path = gameEnv.path;
		const width = gameEnv.innerWidth;
		const height = gameEnv.innerHeight;

		const image_src_bg = path + "/images/projects/platformer-gravity-sorcerers/mariobg.png";
		const image_data_bg = {
			id: 'MarioBG',
			src: image_src_bg,
			pixels: {height: 745, width: 980}
		};


		const floorData = {
			id: 'mario-floor',
			x: 0,
			y: 0.75,
			width: 1,
			height: 0.1,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: false,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const spriteSrc = path + '/images/projects/platformer-gravity-sorcerers/mario.png';
		const playerData = {
			id: 'Mario',
			greeting: 'Let\'s-a go!',
			src: spriteSrc,
			SCALE_FACTOR: 10,
			STEP_FACTOR: 1600,
			ANIMATION_RATE: 20,
			INIT_POSITION: {
				x: width * 0.1,
				y: height * 0.3,
			},
			pixels: { height: 384, width: 288 },
			orientation: { rows: 2, columns: 3 },
			down: { row: 0, start: 0, columns: 3 },
			downRight: { row: 0, start: 0, columns: 3 },
			downLeft: { row: 1, start: 0, columns: 3 },
			left: { row: 1, start: 0, columns: 3 },
			right: { row: 0, start: 0, columns: 3 },
			up: { row: 0, start: 0, columns: 3 },
			upLeft: { row: 1, start: 0, columns: 3 },
			upRight: { row: 0, start: 0, columns: 3 },
			hitbox: { widthPercentage: 0.1, heightPercentage: 0.15 },
			keypress: { up: 87, left: 65, down: 83, right: 68 },
			jumpVelocity: 8,
			gravityAcceleration: 0.35,
		};

		this.classes = [
			{ class: GameEnvBackground, data: image_data_bg },
			{ class: Barrier, data: floorData },
			{ class: PlatformerPlayer, data: playerData },
		];
	}
}

export default GameLevelMario;
