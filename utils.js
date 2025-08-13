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
}