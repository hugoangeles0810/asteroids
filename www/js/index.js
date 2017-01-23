
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
            weapon = game.add.weapon(30, 'bullet');
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weapon.bulletSpeed = BULLET_SPEED;
            weapon.fireRate = BULLET_RATE;

            weapon.trackSprite(ship, SHIP_SIZE / 2, 0, true);
            /* End Bullet */

            /* Asteroids */
            emitter = game.add.emitter(game.world.centerX, 0, 1);
            emitter.width = game.world.width;
            emitter.makeParticles('asteroid');

            emitter.setYSpeed(100, 300);
            emitter.setXSpeed(-15, 15);

            emitter.minRotation = 0;
            emitter.maxRotation = 0

            emitter.minParticleScale = 1;
            emitter.maxParticleScale = 1.5;


            emitter.start(false, 1600, 5, 0);
            /* End Asteroids */
        }

        function update () {
            app.moveShip();        
            weapon.fire();    
        }

        var states = { preload: preload, create: create, update: update };
        game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'phaser', states);
    }
};
