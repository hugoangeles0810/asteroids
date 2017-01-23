
var app = {
    initialize: function() {

        WORLD_BACKGROUND = '#000000';

        HEIGHT  = document.documentElement.clientHeight;
        WIDTH = document.documentElement.clientWidth;

        this.bindEvents();
    },
    bindEvents: function() {
        if ('addEventListener' in document) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
    },
    onDeviceReady: function() {
        app.startGame();
    },
    startGame: function () {
        function preload() {
            game.stage.backgroundColor = WORLD_BACKGROUND;
        }

        function create () {

        }

        function update () {

        }

        var states = { preload: preload, create: create, update: update };
        game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'phaser', states);
    }
};
