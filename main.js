class Breakout extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'breakout' });

        this.bricks;
        this.paddle;
        this.balls = [];
    }

    preload ()
    {
        this.load.setBaseURL('/');
        this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
    }

    create ()
    {
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        //  Create the bricks in a 10x6 grid
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'red1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
        });

        for (let i = 0; i < 500; i++) {
         this.balls[i] = this.physics.add.image(380, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.balls[i].setData('onPaddle', true);
        }
    

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        for (let i = 0; i < this.balls.length; i++) {
            this.physics.add.collider(this.balls[i], this.bricks, this.hitBrick, null, this);
            this.physics.add.collider(this.balls[i], this.paddle, this.hitPaddle, null, this);
        }

        //  Input events
        this.input.on('pointermove', function (pointer)
        {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i].getData('onPaddle'))
                {
                    this.balls[i].x = this.paddle.x + Math.random() *20 - 5;
                }
            }

        }, this);

        this.input.on('pointerup', function (pointer)
        {

            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i].getData('onPaddle'))
                {
                    this.balls[i].setVelocity(-75, -300);
                    this.balls[i].setData('onPaddle', false);
                }
            }

        }, this);
    }

    hitBrick (ball, brick)
    {
        brick.disableBody(true, true);

        if (this.bricks.countActive() === 0)
        {
            this.resetLevel();
        }
    }

    resetBall ()
    {
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setVelocity(0);
            this.balls[i].setPosition(this.paddle.x, 500);
            this.balls[i].setData('onPaddle', true);
        }
    
    }

    resetLevel ()
    {
        this.resetBall();

        this.bricks.children.each(brick =>
        {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitPaddle (ball, paddle)
    {
        let diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }

    update ()
    {
        let reset = true;
        for (let i = 0; i < this.balls.length; i++) {
            if (this.balls[i].y <= 600) {
                reset = false;
            }
        }

        if (reset)
        {
            this.resetBall();
        }
       
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor:'#f76cb8',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);