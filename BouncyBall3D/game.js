let game;
let gameOptions = {

    // ball gravity
    ballGravity: 1200,

    // bounce velocity when the ball hits a platform
    bounceVelocity: 800,

    // ball start x position, 0 = left; 1 = right
    ballStartXPosition: 0.2,

    // amount of platforms to be created and recycled
    platformAmount: 10,

    // platform speed, in pixels per second
    platformSpeed: 650,

    // min and max distance range between platforms
    platformDistanceRange: [250, 450],

    // min and max platform height, , 0 = top of the screen; 1 = bottom of the screen
    platformHeightRange: [0.5, 0.8],

    // min and max platform length
    platformLengthRange: [40, 160],

    // local storage name where to save best scores
    localStorageName: "bestballscore3d",

    // game scale between 2D and 3D
    gameScale: 0.1
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor:0x87ceeb,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 750,
            height: 500
        },
        physics: {
            default: "arcade"
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.image("ground", "ground.png");
        this.load.image("ball", "ball.png");
    }
    create() {

        // method to create the 3D world
        this.create3DWorld();

        // method to add the 2D ball
        this.add2DBall();

        // method to add the 3D ball
        this.add3DBall();

        // method to add platforms
        this.addPlatforms();

        // method to add score
        this.addScore();

        // method to add game listeners
        this.addListeners();
    }

    // method to create the 3D world
    create3DWorld(){

        // 3D world creation
        this.phaser3D = new Phaser3D(this, {

            // camera fov, learn more at https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
            fov: 25,

            // camera x, y and z position
            x: 50,
            y: 110,
            z: 110
        });

        // point the camera at a x, y, z coordinate
        this.phaser3D.camera.lookAt(50, 20, 0);

        // enable shadows
        this.phaser3D.enableShadows();

        // enable gamma correction, learn more at https://en.wikipedia.org/wiki/Gamma_correction
        this.phaser3D.enableGamma();

        // add a soft, white ambient light
        this.phaser3D.add.ambientLight({
            color: 0xffffff,
            intensity: 0.4
        });

        // add a bright, white spotlight, learn more at https://threejs.org/docs/#api/en/lights/SpotLight
        let spotlight = this.phaser3D.add.spotLight({
            color: 0xffffff,
            intensity: 1,
            angle: 0.4,
            decay: 0.1,
            x: 0,
            y: 250,
            z: 80
        });

        // enable the spotlight to cast shadow
        this.phaser3D.setShadow(spotlight);
    }

    // method to create the 2D ball
    add2DBall(){

        // this is just the good old Arcade physics body creation
        this.ball = this.physics.add.sprite(game.config.width * gameOptions.ballStartXPosition, 0, "ball");

        // set ball gravity
        this.ball.body.gravity.y = gameOptions.ballGravity;

        // we are only checking for collisions on the bottom of the ball
        this.ball.body.checkCollision.down = true;
        this.ball.body.checkCollision.up = false;
        this.ball.body.checkCollision.left = false;
        this.ball.body.checkCollision.right = false;

        // modify a bit the collision shape to make the game more kind with players
        this.ball.setSize(30, 50, true);
    }

    // method to create the 3D ball
    add3DBall(){

        // create a red sphere
        this.ball3D = this.phaser3D.add.sphere({
            radius: this.ball.displayWidth / 2 * gameOptions.gameScale,
            widthSegments: 64,
            heightSegments: 64,
            color: 0xff0000,
            x: 0,
            y: 0,
            z: 0
        });

        // set the ball to cast a shadow
        this.phaser3D.castShadow(this.ball3D);
    }

    // method to add platforms
    addPlatforms(){

        // creation of a physics group containing all platforms
        this.platformGroup = this.physics.add.group();

        // let's proceed with the creation
        for(let i = 0; i < gameOptions.platformAmount; i++){

            this.add2DPlatform();
        }
    }

    // method to set a random platform X position
    setPlatformX(){
        return this.getRightmostPlatform() + Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]);
    }

    // method to set a random platform Y position
    setPlatformY(){
        return Phaser.Math.Between(game.config.height * gameOptions.platformHeightRange[0], game.config.height * gameOptions.platformHeightRange[1]);
    }

    add2DPlatform(){

        // st platform X position
        let platformX = (this.getRightmostPlatform() == 0) ? this.ball.x : this.setPlatformX();

        // create 2D platform
        let platform = this.platformGroup.create(platformX, this.setPlatformY(), "ground");

        // set platform registration point
        platform.setOrigin(0.5, 1);

        // platform won't move no matter how many hits it gets
        platform.setImmovable(true);

        // set a random platform width
        platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0], gameOptions.platformLengthRange[1]);

        // add 3D platform as a 2D platform property
        platform.platform3D = this.add3DPlatform(platform);
    }

    // method to add a 3D platform, the argument is the 2D platform
    add3DPlatform(platform2D){

        // create a green box
        let platform3D = this.phaser3D.add.box({
            width: 1,
            height: 50,
            depth: 20,
            color: 0x40ff80,
            x: 0,
            y: (game.config.height - platform2D.y) * gameOptions.gameScale - 25,
            z: 0
        });

        // platform will receive shadows
        this.phaser3D.receiveShadow(platform3D);

        // scale the 3D platform to make it match 2D platform size
        platform3D.scale.x = platform2D.displayWidth * gameOptions.gameScale;

        return platform3D;
    }

    // method to add the score, just a dynamic text
    addScore(){
        this.score = 0;
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(10, 10, 0);
    }

    // method to update the score
    updateScore(inc){
        this.score += inc;
        this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
    }

    // listeners to make platforms move and stop
    addListeners(){
        this.input.on("pointerdown", function(){
            this.platformGroup.setVelocityX(-gameOptions.platformSpeed);
        }, this);
        this.input.on("pointerup", function(){
            this.platformGroup.setVelocityX(0);
        }, this);
    }

    // method to get the rightmost platform
    getRightmostPlatform(){
        let rightmostPlatform = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            rightmostPlatform = Math.max(rightmostPlatform, platform.x);
        });
        return rightmostPlatform;
    }

    // method to be executed at each frame
    update(){

        // collision management ball Vs platforms
        this.physics.world.collide(this.platformGroup, this.ball, function(){

            // bounce back the ball
            this.ball.body.velocity.y = -gameOptions.bounceVelocity;
        }, null, this);

        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform){

            // if the platform leaves the screen to the left...
            if(platform.getBounds().right < -100){

                // increase the score
                this.updateScore(1);

                // recycle the platform moving it to a new position
                platform.x = this.setPlatformX();
                platform.y = this.setPlatformY();

                // set new platform width
                platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0], gameOptions.platformLengthRange[1]);

                // adjust 3D platform scale and y position
                platform.platform3D.scale.x = platform.displayWidth * gameOptions.gameScale;
                platform.platform3D.position.y = (game.config.height - platform.y) * gameOptions.gameScale - 25;
            }

            // adjust 3D platform x position
            platform.platform3D.position.x = platform.x * gameOptions.gameScale;
        }, this);

        // if 2D ball falls down the screen...
        if(this.ball.y > game.config.height){

            // manage best score
            localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));

            // restart the game
            this.scene.start("PlayGame");
        }

        // adjust 3D ball position
        this.ball3D.position.y = (game.config.height - this.ball.y) * gameOptions.gameScale;
        this.ball3D.position.x = this.ball.x * gameOptions.gameScale;

    }
}
