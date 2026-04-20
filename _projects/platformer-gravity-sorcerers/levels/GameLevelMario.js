import GameEnvBackground from '/assets/js/GameEnginev1.1/essentials/GameEnvBackground.js';
import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';
import PlatformerPlayer from './custom/PlatformerPlayer.js';

class GameLevelMario {
	static displayName = 'Mario Platformer';

	constructor(gameEnv) {
		const path = gameEnv.path;
		const width = gameEnv.innerWidth;
		const height = gameEnv.innerHeight;
		console.log('Initializing GameLevelMario with path:', path, 'width:', width, 'height:', height);

		const image_src_bg = path + "/images/projects/platformer-gravity-sorcerers/oldmariobg.png";
		const image_data_bg = {
			id: 'MarioBG',
			src: image_src_bg,
			pixels: {height: 670, width: 1192}
		};

		const floorData = {
			id: 'mario-floor',
			x: 0,
			y: 0.88,
			width: 1,
			height: 0.1,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform1Data = {
			id: 'mario-platform-1',
			x: 75/1118,
			y: 491/760,
			width: 39/1118,
			height: 49/760,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform2Data = {
			id: 'mario-platform-2',
			x: 887/1110,
			y: 622/757,
			width: 150/1110,
			height: 45/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform3Data = {
			id: 'mario-platform-3',
			x: 922/1110,
			y: 575/757,
			width: 114/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform4Data = {
			id: 'mario-platform-4',
			x: 958/1110,
			y: 531/757,
			width: 76/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform5Data = {
			id: 'mario-platform-5',
			x: 998/1110,
			y: 489/757,
			width: 37/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform6Data = {
			id: 'mario-platform-6',
			x: 297/1110,
			y: 492/757,
			width: 40/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		}; 

		const platform7Data = {
			id: 'mario-platform-7',
			x: 702/1110,
			y: 490/757,
			width: 76/1110,
			height: 48/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		};

		const platform8Data = {
			id: 'mario-platform-8',
			x: 404/1110,
			y: 309/757,
			width: 113/1110,
			height: 47/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
			hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 },
		}; 

		const platform9Data = {
			id: 'mario-platform-9',
			x: 664/1110,
			y: 310/757,
			width: 151/1110,
			height: 46/757,
			color: 'rgba(133, 94, 66, 0.95)',
			visible: true,
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
			hitbox: { widthPercentage: 0.2, heightPercentage: 0.2 },
			debugHitbox: false,
			debugHitboxColor: 'rgba(57, 255, 20, 0.95)',
			keypress: { up: 87, left: 65, down: 83, right: 68 },
			jumpVelocity: 7,
			gravityAcceleration: 0.1,
		};

		this.classes = [
			{ class: GameEnvBackground, data: image_data_bg },
			{ class: Barrier, data: floorData },
			{ class: PlatformerPlayer, data: playerData },
			{ class: Barrier, data: platform1Data },
			{ class: Barrier, data: platform2Data },
			{ class: Barrier, data: platform3Data },
			{ class: Barrier, data: platform4Data },
			{ class: Barrier, data: platform5Data },
			{ class: Barrier, data: platform6Data },
			{ class: Barrier, data: platform7Data },
			{ class: Barrier, data: platform8Data },
			{ class: Barrier, data: platform9Data }
		];
	}
}

export default GameLevelMario;
