import { MagicMissile, Fireball, IceSpike, ChainLightning, Meteor } from './skills.js';

export class ProjectileFactory {
    static create(type) {
        switch (type) {
            case 'magicMissile':
                return new MagicMissile();
            case 'fireball':
                return new Fireball();
            case 'iceSpike':
                return new IceSpike();
            case 'chainLightning':
                return new ChainLightning();
            case 'meteor':
                return new Meteor();
            default:
                throw new Error(`Unknown projectile type: ${type}`);
        }
    }

    static getTypes() {
        return ['magicMissile', 'fireball', 'iceSpike', 'chainLightning', 'meteor'];
    }
}