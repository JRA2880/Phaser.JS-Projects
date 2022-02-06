var game = new Phaser.Game(600,400, Phaser.AUTO);
game.state.add('State1',demo.State1);
game.state.add('State2',demo.State2);
game.state.start('State1');