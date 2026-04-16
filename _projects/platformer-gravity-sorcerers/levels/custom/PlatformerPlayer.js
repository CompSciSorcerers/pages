import Player from '/assets/js/GameEnginev1.1/essentials/Player.js';
import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';

class PlatformerPlayer extends Player {
	constructor(data = null, gameEnv = null) {
		super(data, gameEnv);

		this.verticalVelocity = 0;
		this.gravityAcceleration = data?.gravityAcceleration ?? 0.6;
		this.jumpVelocity = data?.jumpVelocity ?? Math.max(8, this.yVelocity * 1.5);

		this.isGrounded = false;
		this._groundedThisFrame = false;
		this._skipGravityThisFrame = false;
		this._jumpPressedLatch = false;
	}

	updateVelocity() {
		this.velocity.x = 0;
		this.moved = false;

		if (this.pressedKeys[this.keypress.right]) {
			this.velocity.x = this.xVelocity;
			this.moved = true;
		} else if (this.pressedKeys[this.keypress.left]) {
			this.velocity.x = -this.xVelocity;
			this.moved = true;
		}

		const upPressed = Boolean(this.pressedKeys[this.keypress.up]);
		if (upPressed && this.isGrounded && !this._jumpPressedLatch) {
			this.verticalVelocity = this.jumpVelocity;
			this.isGrounded = false;
			this._groundedThisFrame = false;
			this._skipGravityThisFrame = false;
			this._jumpPressedLatch = true;
			this.moved = true;
		}

		if (!upPressed) {
			this._jumpPressedLatch = false;
		}
	}

	updateDirection() {
		if (this.pressedKeys[this.keypress.right]) {
			this.direction = 'right';
		} else if (this.pressedKeys[this.keypress.left]) {
			this.direction = 'left';
		}
	}

	update() {
		if (!this._skipGravityThisFrame) {
			this.verticalVelocity -= this.gravityAcceleration;
		}

		this._groundedThisFrame = false;
		this._skipGravityThisFrame = false;

		// positive verticalVelocity means upward movement in world coordinates
		this.velocity.y = -this.verticalVelocity;

		super.move();
		super.draw();
		super.collisionChecks();
		this.setupCanvas();

		this.isGrounded = this._groundedThisFrame;
		this.velocity.y = -this.verticalVelocity;
	}

	_resolveOtherObject() {
		const otherId = this.collisionData?.touchPoints?.other?.id;
		if (!otherId || !this.gameEnv?.gameObjects) return null;
		return this.gameEnv.gameObjects.find((obj) => obj?.canvas?.id === otherId) || null;
	}

	handleCollisionState() {
		const touchPoints = this.collisionData?.touchPoints?.this;
		const otherObject = this._resolveOtherObject();

		if (!touchPoints) {
			return;
		}

		if (!(otherObject instanceof Barrier)) {
			super.handleCollisionState();
			return;
		}

		if (touchPoints.left || touchPoints.right) {
			this.velocity.x = 0;
		}

		// Standing on the top of a barrier: stop falling and skip gravity for this frame.
		// Do not apply this while moving upward, or the jump gets canceled on the takeoff frame.
		if (touchPoints.top && this.verticalVelocity <= 0) {
			this.position.y = otherObject.y - this.height;
			this.verticalVelocity = 0;
			this.velocity.y = 0;
			this.isGrounded = true;
			this._groundedThisFrame = true;
			this._skipGravityThisFrame = true;
		}

		// Hitting the underside of a barrier while jumping: stop upward motion.
		if (touchPoints.bottom) {
			this.position.y = otherObject.y + otherObject.height;
			this.verticalVelocity = 0;
			this.velocity.y = 0;
		}

		if (touchPoints.left) {
			this.position.x = otherObject.x - this.width;
		}

		if (touchPoints.right) {
			this.position.x = otherObject.x + otherObject.width;
		}
	}

	handleCollisionReaction(other) {
		const otherObject = this._resolveOtherObject();
		if (otherObject instanceof Barrier) {
			return;
		}
		super.handleCollisionReaction(other);
	}
}

export default PlatformerPlayer;


