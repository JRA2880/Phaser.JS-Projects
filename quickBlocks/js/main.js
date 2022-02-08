var game;
var mt;
window.onload=function()
{   
    var isMobile = navigator.userAgent.indexOf("Mobile");
    if (isMobile == -1) {
        isMobile = navigator.userAgent.indexOf("Tablet");
    }
    var w=480;
    var h=640;
    
    if(isMobile!=-1)
    {
         w=window.innerWidth;
         h=window.innerHeight;
    }
        var config = {
            type: Phaser.AUTO,
            width: w,
            height: h,
            parent: 'phaser-game',
            scene: [SceneLoad,SceneTitle,SceneInstructions,SceneSettings,SceneMain,SceneOver]
        }; 
        mt={};
        mt.model = new Model();
        game = new Phaser.Game(config);
        mt.game = game;
        mt.constants=new Constants();;
}