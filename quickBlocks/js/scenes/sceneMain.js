class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
    	//load our images or sounds 
        this.load.spritesheet("blocks","images/blocks.png",
        { 
            frameWidth:64,
            frameHeight:84
        }
        ); 
        this.load.image("btnPlayAgain","images/btnPlayAgain.png");

    }
    create() {
       //define our objects
       mt.mediaManager.setBackground("background");
       this.blockGroup=this.add.group();
       this.clickLock = false;
       this.colorArray=[];
       this.centerBlock = null;
       for(var i=0; i <25; i++){
          var color=Phaser.Math.Between(0,mt.model.numberOfColors);
          this.colorArray.push(color);   
       }
       var xx=0;
       var yy=0;
       var k=0;
       for(var i = 0; i < 5; i++)
       {
           for(var j = 0; j < 5; j++)
           {
            var block = this.add.image(0,0,"blocks");
            this.blockGroup.add(block);
            block.displayWidth=game.config.width/5;
            block.displayHeight=game.config.height/5;
            block.setFrame(this.colorArray[k]);
            block.x=xx+block.displayWidth/2;
            block.y=yy+block.displayHeight/2;
            if(i == 2 && j == 2)
            {
                this.centerBlock = block;
            }
            else
            {
                block.setInteractive();
            }
            xx+=block.displayWidth;
            k++;
           }
           xx=0;
           yy+=block.displayHeight;
       } 
       this.colorArray[12]=-1;
       this.pickColor();
       this.input.on("gameobjectdown",this.selectBlock,this);
       this.timer=new CircleTimer({scene:this});
       this.timer.x=this.centerBlock.x;
       this.timer.y=this.centerBlock.y;
       this.timer.setCallback(this.timeUp,this);
       this.timer.start(); 
       this.scoreText=this.add.text(0,0,"0",{fontSize:game.config.width/10,color:'#000000'});
       this.scoreText.setOrigin(0.5,0.5);
       Align.center(this.scoreText);
    } 
    timeUp()
    {
        this.doGameOver();
    }
    selectBlock(pointer,block)
    {    
         if(this.clickLock == true)
         {   
             return; 
         } 
         if(block.frame.name==this.centerBlock.frame.name)
         {
             block.removeInteractive();
             this.fall(block);
             this.pickColor();
             mt.model.score++;
             mt.mediaManager.playSound("right");
             this.scoreText.setText(mt.model.score);
         }
         else
         {   
             mt.mediaManager.playSound("wrong");
             this.doGameOver();
             return; 
         } 
         this.timer.reset();
    } 
    fall(block)
    {
       this.tweens.add({
           targets:block,
           duration:1000,
           scaleX:0,
           scaleY:0
        });
    }
    pickColor()
    {   
        if(this.colorArray.length == 0)
        {
            //next level
            mt.mediaManager.playSound("levelUp");
            mt.model.numberOfColors++;
            if(mt.model.numberOfColors > 7 )
            {
                mt.model.numberOfColors = 7;
            }
            mt.mediaManager.stopMusic();
            this.scene.restart();
            return;
        }
        var index=Phaser.Math.Between(0,this.colorArray.length-1);
        var color=this.colorArray.splice(index,1);
        var color=color[0];
        if(color == -1)
        {
            this.pickColor();
            return;
        }
        this.centerBlock.setFrame(color);
    } 
    doGameOver()
    {
        mt.mediaManager.stopMusic();
        this.clickLock=true;
         this.timer.stop();
         this.time.visible=false;
         this.blockGroup.children.iterate(function(child){
             this.fall(child);
         }.bind(this));
        this.time.addEvent({
            delay: 1200,
            callback:this.doGameOver2,
            callbackScope: this,
            loop: false
        });     
    } 
    doGameOver2()
    {
        this.scene.start("SceneOver");
    }
    update() {
        //constant running loop
    }

}