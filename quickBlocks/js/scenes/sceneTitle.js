class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    } 
    preload()
    {

    } 
    create()
    {    
         this.back=this.add.image(0,0,"titleBack");
         this.back.setOrigin(0,0);
         this.back.displayWidth=game.config.width;
         this.back.displayHeight=game.config.height;
         this.aGrid=new AlignGrid({scene:this,rows:11,cols:11});
         this.titleText=this.add.text(0,0,"QUICK\nBLOCKS",{fontSize:game.config.width/5,color:"#ff0000"});

         this.btnStart=new TextButton({
             scene:this,
             key:"green",
             event:mt.constants.START_GAME,
             params:this.scene,
             text:"Start Game",
             scale:.35,
             textScale:30,
             textColor:'#000000'
            });
         Align.center(this.btnStart);

         this.btnInstr=new TextButton({
             scene:this,
             key:"blue",
             event:mt.constants.SHOW_INSTRUCTIONS,
             params:this.scene,
             text:"How to Play",
             scale:.35,
             textScale:30,
             textColor:'#000000'
            });
            this.aGrid.placeAtIndex(35,this.btnInstr);

         this.btnSettings=new TextButton({
             scene:this,
             key:"orange",
             event:mt.constants.SHOW_SETTINGS,
             params:this.scene,
             text:"Settings",
             scale:.35,
             textScale:30,
             textColor:'#000000'
            });
         this.aGrid.placeAtIndex(85,this.btnSettings);
    } 
}