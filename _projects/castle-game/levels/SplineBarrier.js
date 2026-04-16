import Barrier from '/assets/js/GameEnginev1.1/essentials/Barrier.js';

class SplineBarrier extends Barrier {
    constructor(data, gameEnv) {
        super(data, gameEnv);
        this.splinePoints = data.splinePoints || [];
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
