class SceneInstructions extends Phaser.Scene {
    constructor() {
        super('SceneInstructions');
    }
    preload()
    {
    	
    }
    create() {
        this.back=this.add.image(0,0,"titleBack");
        this.back.setOrigin(0,0);
        this.aGrid=new AlignGrid({scene:this,rows:11,cols:11})
        this.sampleImage=this.add.image(0,0,"sample");
        Align.scaleToGameW(this.sampleImage,.5);
        this.aGrid.placeAtIndex(27,this.sampleImage);
        this.text1=this.add.text(0,0,"Click the same color block\nas the center block\n before time runs out",{ 
            color:"#000000",
            fontSize:game.config.width/20,
            backgroundColor:"#ffffff"
        });
        this.text1.setOrigin(0.5,0.5);
        this.aGrid.placeAtIndex(71,this.text1);

        this.btnHome=new TextButton({
            scene:this,
            key:"green",
            event:mt.constants.SHOW_TITLE,
            params:this.scene,
            text:"Home",
            scale:.35,
            textScale:25,
            textColor:'#ffffff'
           });
        this.aGrid.placeAtIndex(93,this.btnHome);
    }
    update() {}
}