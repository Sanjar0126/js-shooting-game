export class GameMath {
    static getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static findNearestEnemy(maxRange, playerX, playerY) {
        const nearbyEnemies = window.game.spatialGrid.getObjectsInRange(
            playerX, playerY,
            maxRange
        );

        let nearestEnemy = null;
        let nearestDistance = maxRange;

        nearbyEnemies.forEach(enemy => {
            const dx = enemy.x - playerX;
            const dy = enemy.y - playerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });

        return nearestEnemy;
    }

    isInCone(px, py, tx, ty, coneAngle, coneWidthDeg, coneRange) {
        const dx = tx - px;
        const dy = ty - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > coneRange) return false;

        const angleToTarget = Math.atan2(dy, dx);
        let diff = angleToTarget - coneAngle;

        diff = (diff + Math.PI) % (2 * Math.PI) - Math.PI;

        return Math.abs(diff) <= (coneWidthDeg / 2) * Math.PI / 180;
    }

}