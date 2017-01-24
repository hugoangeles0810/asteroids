
var app = {
    initialize: function() {

        WORLD_BACKGROUND = '#000000';

        HEIGHT  = document.documentElement.clientHeight;
        WIDTH = document.documentElement.clientWidth;

        LEFT = 1;
        RIGHT = -1;
        NO_DIRECTION = 0;

        SHIP_SPEED = 250;
        SHIP_SIZE = 28;

        BULLET_SPEED = 800
        BULLET_RATE = 400;

        direction = 0;
        enableAccelerometer = false;

        puntuacion = 0;

        this.bindEvents();
    },
    bindEvents: function() {
        if ('addEventListener' in document) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
    },
    bindAccelerometer: function () {
        function onError() {
            console.log('onError!');
        }

        function onSuccess(data) {
            app.saveDirection(data);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 100 });
    },
    onDeviceReady: function() {
        app.bindAccelerometer();
        app.startGame();
    },
    saveDirection: function (data) {
        if (data.x < 0) {
            direction = LEFT;
        } else if (data.x > 0 ) {
            direction = RIGHT;
        } else {
            direction = NO_DIRECTION;
        }
    },
    moveShip: function () {
        ship.body.velocity.x = direction * SHIP_SPEED;
    },
    destroyAsteroid: function (asteroid, bullet) {
        emitter.remove(asteroid);
        weapon.bullets.remove(bullet);
        puntuacion = puntuacion + 1;
        scoreText.text = puntuacion;
    },
    startGame: function () {
        function preload() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = WORLD_BACKGROUND;
            game.load.image('bullet', 'assets/sprites/bullet.png');
            game.load.image('ship', 'assets/sprites/ship.png');
            game.load.image('background', 'assets/misc/starfield.jpg');
            game.load.image('asteroid', 'assets/sprites/asteroid.png');
        }

        function create () {
            /* Background */
            background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
            /* End Backgrund */

            /* Ship */
            ship = game.add.sprite(WIDTH/2, HEIGHT-SHIP_SIZE, 'ship');
            ship.anchor.set(0.5);
            ship.angle = -90;

            game.physics.arcade.enable(ship);
            ship.body.collideWorldBounds = true;
            /* End Ship */

            /* Bullet */
            weapon = game.add.weapon(300, 'bullet');
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weapon.bulletSpeed = BULLET_SPEED;
            weapon.fireRate = BULLET_RATE;

            weapon.trackSprite(ship, SHIP_SIZE / 2, 0, true);
            /* End Bullet */

            /* Asteroids */
            emitter = game.add.emitter(game.world.centerX, 0, 10);
            emitter.makeParticles('asteroid', 0, 200, true, false);
            emitter.width = game.world.width;
            emitter.minParticleScale = 1;
            emitter.maxParticleScale = 1.7;

            emitter.setYSpeed(200, 300);
            emitter.setXSpeed(-5, 5);

            emitter.minRotation = 0;
            emitter.maxRotation = 0;


            emitter.start(false, 0, 400);
            /* End Asteroids */

            cursors = game.input.keyboard.createCursorKeys();
            scoreText = game.add.text(WIDTH - 16, 16, 0, { fontSize: '32px', fill: '#757676' });
            scoreText.anchor.set(1, 0);
        }

        function update () {
            app.moveShip();
            game.physics.arcade.collide(emitter, weapon.bullets, app.destroyAsteroid, null, this);
            weapon.fire();    
        }

        var states = { preload: preload, create: create, update: update };
        game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'phaser', states);
    }
};
