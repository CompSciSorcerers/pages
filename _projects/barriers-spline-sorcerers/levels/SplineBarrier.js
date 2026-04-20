import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';

class SplineBarrier extends Barrier {
    constructor(data, gameEnv) {
        // Safety check: ensure splinePoints is a valid array
        let splinePoints;
        if (data && data.splinePoints && Array.isArray(data.splinePoints)) {
            splinePoints = data.splinePoints;
        } else {
            console.warn('SplineBarrier: No valid splinePoints provided, using default curve');
            // Provide a default simple curve as fallback
            splinePoints = [
                { x: 100, y: 200 },
                { x: 300, y: 100 },
                { x: 500, y: 300 }
            ];
        }
        
        // Calculate canvas bounds from spline points
        const bounds = SplineBarrier.calculateBounds(splinePoints);
        
        // Set width/height in data based on spline bounds
        data.width = bounds.width + 40; // Add padding
        data.height = bounds.height + 40; // Add padding
        data.x = bounds.minX - 20; // Position canvas to contain the curve
        data.y = bounds.minY - 20;
        
        // Set visibility option (default to true)
        data.visible = data.visible !== undefined ? data.visible : true;
        
        super(data, gameEnv);
        
        // Now safe to access 'this'
        this.splinePoints = splinePoints;
        
        // Store visual properties for drawing the spline
        this.barrierColor = data.color || '#8B4513';
        this.lineWidth = data.lineWidth || 5;
    }

    draw() {
        // Clear then draw spline curve on its own canvas
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.visible) return;
        
        // Get curve points
        const curvePoints = SplineBarrier.getCurvePoints(this.splinePoints);
        if (curvePoints.length === 0) return;
        
        // Draw the spline curve
        this.ctx.strokeStyle = this.barrierColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(curvePoints[0].x - this.x, curvePoints[0].y - this.y);
        
        for (let i = 1; i < curvePoints.length; i++) {
            this.ctx.lineTo(curvePoints[i].x - this.x, curvePoints[i].y - this.y);
        }
        
        this.ctx.stroke();
    }

    update() {
        super.update();

        // Get curve points for collision detection
        const curvePoints = SplineBarrier.getCurvePoints(this.splinePoints);
        
        // Find player
        const player = this.gameEnv?.gameObjects?.find(obj => obj.constructor?.name === 'Player');
        if (!player || !player.canvas || !this.canvas) return;

        // Check collision with curve points
        const collisionPoint = this.getCollisionPoint(player, curvePoints);
        const isColliding = collisionPoint !== null;
        
        if (isColliding) {
            // Set touchPoints structure expected by GameObject.handleCollisionState
            const playerCenter = player.getCenter();
            this.collisionData.hit = true;
            this.collisionData.touchPoints = {
                this: {
                    top: playerCenter.y < collisionPoint.y,
                    bottom: playerCenter.y > collisionPoint.y,
                    left: playerCenter.x < collisionPoint.x,
                    right: playerCenter.x > collisionPoint.x
                },
                other: player
            };
            this.handleCollisionEvent();
        } else {
            // Reset collision data when not colliding
            this.collisionData.hit = false;
            // Clear collision events to allow re-triggering
            if (this.state && this.state.collisionEvents) {
                this.state.collisionEvents = [];
            }
        }
    }

    static calculateBounds(splinePoints) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const point of splinePoints) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }
        return {
            minX, minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    getCollisionPoint(player, curvePoints) {
        const playerCenter = player.getCenter();
        const collisionDistance = 20; // pixels
        
        // Check if player is close to any curve point
        for (const point of curvePoints) {
            const distance = Math.hypot(point.x - playerCenter.x, point.y - playerCenter.y);
            if (distance < collisionDistance) {
                return point;
            }
        }
        return null;
    }

    checkCurveCollision(player, curvePoints) {
        const playerCenter = player.getCenter();
        const collisionDistance = 20; // pixels
        
        // Check if player is close to any curve point
        for (const point of curvePoints) {
            const distance = Math.hypot(point.x - playerCenter.x, point.y - playerCenter.y);
            if (distance < collisionDistance) {
                return true;
            }
        }
        return false;
    }

    // Interpolates between point P1 and P2, using P0 and P3 as control points
    static catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;

        return 0.5 * (
            2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
    }

    // Generate curve positions
    static getCurvePoints(splinePoints, segments = 50) {
        const curvePoints = [];
        
        // Safety check: if splinePoints is undefined or not an array, return empty array
        if (!splinePoints || !Array.isArray(splinePoints) || splinePoints.length < 2) {
            console.warn('SplineBarrier: Invalid splinePoints array', splinePoints);
            return curvePoints;
        }
        
        for (let i = 0; i < splinePoints.length - 1; i++) {
            const p0 = splinePoints[i - 1] || splinePoints[i];
            const p1 = splinePoints[i];
            const p2 = splinePoints[i + 1];
            const p3 = splinePoints[i + 2] || splinePoints[i + 1];
            
            for (let j = 0; j < segments; j++) {
                const t = j / segments;
                const x = this.catmullRom(p0.x, p1.x, p2.x, p3.x, t);
                const y = this.catmullRom(p0.y, p1.y, p2.y, p3.y, t);
                curvePoints.push({x, y});
            }
        }
        return curvePoints;
    }
}

export default SplineBarrier;
