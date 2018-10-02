"use strict";

// Initialize
let playing = true;

// Enemies our player must avoid
class Enemy {
    constructor(x, y, speed) {
        this.sprite = 'images/enemy-bug.png';

        this.x = x;
        this.y = y;
        this.speed = speed;

        this.spriteLeftBound = this.x;
        this.spriteRightBound = this.x + 101;
        this.spriteUpperBound = this.y + 78;
        this.spriteLowerBound = this.y + 143;
    }

    // Update the enemy's position
    // Parameter: dt, a time delta between ticks
    update(dt) {
        switch (true) {
            case (this.x > 505):
                this.x = -101;
            default:
                this.x += this.speed * dt;
                this.spriteLeftBound = this.x;
                this.spriteRightBound = this.x + 101;
        }
    }

    // Change speeds with every replay
    updateSpeed(i) {
        this.speed = Math.random() * i + 100;
    }

    // Draw the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// The playable character for this game
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';

        // Set default position to the bottom center tile

        // sprite width * # of columns from first to center column
        //     101      *                    2
        this.xDefault = 202;

        // canvas height - empty space below - sprite height - sprite offset
        //      606      -        20         -      171      -      11
        this.yDefault = 404;

        this.x = this.xDefault;
        this.y = this.yDefault;

        this.spriteLeftBound = this.x + 18;
        this.spriteRightBound = this.x + 84;
        this.spriteUpperBound = this.y + 64;
        this.spriteLowerBound = this.y + 139;
    }

    // Update the playable character's position
    update(dt) {
        this.spriteLeftBound = this.x + 18;
        this.spriteRightBound = this.x + 84;
        this.spriteUpperBound = this.y + 64;
        this.spriteLowerBound = this.y + 139;

        if (playing === true) {
            // Detect collisions
            for (const enemy of allEnemies) {
                if ((enemy.spriteUpperBound > this.spriteUpperBound)
                    && (enemy.spriteLowerBound < this.spriteLowerBound)
                    && (enemy.spriteRightBound > this.spriteLeftBound)
                    && (enemy.spriteLeftBound < this.spriteRightBound)) {
                        this.x = this.xDefault;
                        this.y = this.yDefault;
                }
            }
        }

        if (this.y === 72 && playing === true) {
            modal.classList.toggle('modal--hide');

            playing = false;
        }
    }

    // Draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Move the chracter according to keypress
    handleInput(keypress) {
        if (keypress === 'left' && this.x - 101 >= 0) {
            this.x -= 101;
        } else if (keypress === 'right' && this.x + 101 <= 404) {
            this.x += 101;
        } else if (keypress === 'up' && this.y - 83 >= 72) {
            this.y -= 83;
        } else if (keypress === 'down' && this.y + 83 <= 404) {
            this.y += 83;
        }
    }
}

// Instantiate objects
const allEnemies = [
    new Enemy(202, 312, 150),
    new Enemy(202, 146, Math.random() * 300 + 100),
    new Enemy(0, 63, Math.random() * 500 + 100),
    new Enemy(0, 229, 100),
    new Enemy(303, 229, 100)
];

const player = new Player();

// Listen for key presses and sends the keys to the
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        68: 'right',
        83: 'down',
        87: 'up'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listen for click on the replay button
const modal = document.getElementsByClassName('modal')[0];

document.getElementsByClassName('replay')[0].addEventListener('click', function(e) {
    modal.classList.toggle('modal--hide');

    playing = true;

    player.x = player.xDefault;
    player.y = player.yDefault;

    for (let i = 0; i < 3; i++) {
        allEnemies[i].updateSpeed(200 * i + 100);
    }
});
