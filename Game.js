
/**
 * Beat object
 * Helps convert between seconds and beats
 */
var Beat = function(bpm) {
    this.bpm = bpm;
};

/**
 * Convert time to beatTime
 */
Beat.prototype.toBeatTime = function(t) {
    var pulse;
    return pulse = t * this.bpm / 60.0;
    console.log(pulse);
};

/**
 * Convert time to beat value
 * Beat value is 0 to 1, hits 1 on the beat
 */
Beat.prototype.toBeat = function(t) {
    return 1.0 - Math.abs(Math.sin(this.toBeatTime(t) * 3.14159));
};

/**
 * Game object
 * The highest level object representing entire game
 */
var Game = function() {
};


/**
 * Initialize game state
 */
Game.prototype.init = function() {
    var that = this;
    this.song = 0;
    this.score = 0;
    this.combo = 0;
    this.songName = 0;
    this.beat = new Beat(145);
    
    
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.y = -275;
    this.camera.position.z = 600;
    
    var vertexShaderText = $('#my-vertex-shader').text();
    var fragmentShaderText = $('#my-fragment-shader').text();
    var trippyVertexShaderText = $('#trippy-vertex-shader').text();
    var trippyFragmentShaderText = $('#trippy-fragment-shader').text();
    var blurFragmentShaderText = $('#blur-postprocess-fragment-shader').text();
    var plainVertexShaderText = $('#plain-vertex-shader').text();
    var plainFragmentShaderText = $('#plain-fragment-shader').text();
    
    /*
     * Add the Three.js objects seen in the game
     */
    
    // Initialize the material used for the speakers
    this.speakerMaterial = new THREE.ShaderMaterial({
                                                    uniforms: {
                                                    'uTime': { type: 'f', value: 0.0 },
                                                    'uBeatTime': { type: 'f', value: 0.0 },
                                                    'uBeat': { type: 'f', value: 0.0 }
                                                    },
                                                    vertexShader: vertexShaderText,
                                                    fragmentShader: fragmentShaderText
                                                    });
    this.scene = new THREE.Scene();
    this.speaker1 = new THREE.Mesh(
                                   new THREE.CubeGeometry(100, 200, 100),
                                   this.speakerMaterial);
    this.speaker1.position.x = -300;
    this.speaker1.position.y = -300;
    this.scene.add(this.speaker1);
    
    this.speaker2 = new THREE.Mesh(
                                   new THREE.CubeGeometry(100, 200, 100),
                                   this.speakerMaterial);
    this.speaker2.position.x = 300;
    this.speaker2.position.y = -300;
    this.scene.add(this.speaker2);
    
    // Initialize the material used for the poster
    this.posterMaterial = new THREE.ShaderMaterial({
                                                   uniforms: {
                                                   'uTime': { type: 'f', value: 0.0 },
                                                   },
                                                   vertexShader: trippyVertexShaderText,
                                                   fragmentShader: trippyFragmentShaderText
                                                   });
    this.poster = new THREE.Mesh(
                                 new THREE.PlaneGeometry(600, 600),
                                 this.posterMaterial);
    this.poster.position.y = -110;
    this.poster.position.z = -100;
    this.scene.add(this.poster);
    
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(800, 600),
                                this.posterMaterial);
    this.floor.position.y = -400;
    this.floor.position.x = 0;
    this.floor.rotation.x = 55;
    this.scene.add(this.floor);
    
    // Initialize the material used for the spheres
    this.sphereMaterial = new THREE.ShaderMaterial({
                                                   uniforms: {
                                                   'uTime': { type: 'f', value: 0.0 },
                                                   'uBeatTime': { type: 'f', value: 0.0 },
                                                   'uBeat': { type: 'f', value: 0.0 }
                                                   },
                                                   vertexShader: vertexShaderText,
                                                   fragmentShader: blurFragmentShaderText
                                                   });
    
    /*
     * Add the spheres to the scene, which
     * will serves as lives in the game
     */
    this.sphere = new Array();
    this.sphere.length = 5;
    
    this.sphere[0] = new THREE.Mesh(
                                    new THREE.SphereGeometry(100, 6, 6),
                                    this.speakerMaterial);
    this.sphere[0].position.x = 400;
    this.sphere[0].position.y = 250;
    this.sphere[1] = new THREE.Mesh(
                                    new THREE.SphereGeometry(100, 6, 6),
                                    this.speakerMaterial);
    this.sphere[1].position.x = 200;
    this.sphere[1].position.y = 250;
    this.sphere[2] = new THREE.Mesh(
                                    new THREE.SphereGeometry(100, 6, 6),
                                    this.speakerMaterial);
    this.sphere[2].position.x = 0;
    this.sphere[2].position.y = 250;
    this.sphere[3] = new THREE.Mesh(
                                    new THREE.SphereGeometry(100, 6, 6),
                                    this.speakerMaterial);
    this.sphere[3].position.x = -200;
    this.sphere[3].position.y = 250;
    this.sphere[4] = new THREE.Mesh(
                                    new THREE.SphereGeometry(100, 6, 6),
                                    this.speakerMaterial);
    this.sphere[4].position.x = -400;
    this.sphere[4].position.y = 250;
    this.scene.add(this.sphere[0]);
    this.scene.add(this.sphere[1]);
    this.scene.add(this.sphere[2]);
    this.scene.add(this.sphere[3]);
    this.scene.add(this.sphere[4]);
    
    // Add the model figure
    this.figure = null;
    var jsonLoader = new THREE.JSONLoader();
    
    /*
     * Snow texture taken from OpenGameArt
     * http://opengameart.org/content/snow-texture
     */
    
    var snowTexture = THREE.ImageUtils.loadTexture('textures/snow.png');
    this.snowmanMaterial = new THREE.ShaderMaterial({
                                                    uniforms: {
                                                    'tTexture': { type: 't', value: snowTexture },
                                                    },
                                                    vertexShader: plainVertexShaderText,
                                                    fragmentShader: plainFragmentShaderText
                                                    });
    
    /*
     * Model taken from OpenGameArt
     * http://opengameart.org/content/snowman
     */
    
    jsonLoader.load('models/snowman.js', function(geometry) {
                    that.figure = new THREE.Mesh(geometry, that.snowmanMaterial);
                    that.figure.scale.set(60, 60, 60);
                    that.figure.position.x = 0;
                    that.figure.position.y = -350;
                    that.figure.rotation.y = 55;
                    that.scene.add(that.figure);
                    });
    
    // Add the skybox
    this.skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    this.skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    this.skyBox = new THREE.Mesh( this.skyBoxGeometry, this.skyBoxMaterial );
    this.scene.add(this.skyBox);
    this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
    
    
    
    /*
     * Setup keyboard events
     */
    
    this.keys = {};
    $('body').keydown(function(e) {
                      console.log('keydown ' + e.which);
                      if (e.which) {
                      if (that.keys[e.which] !== 'triggered') {
                      that.keys[e.which] = true;
                      }
                      }
                      console.log(that.keys);
                      });
    $('body').keyup(function(e) {
                    console.log('keyup ' + e.which);
                    if (e.which) {
                    that.keys[e.which] = false;
                    }
                    console.log(that.keys);
                    });
    
    
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    
    var MyEffectShader = {
    uniforms: { 'tDiffuse': { type: 't', value: null }},
    vertexShader: $('#my-postprocess-vertex-shader').text(),
    fragmentShader: $('#my-postprocess-fragment-shader').text()
    };
    var effect = new THREE.ShaderPass(MyEffectShader);
    effect.renderToScreen = true;
    this.composer.addPass(effect);
};

/**
 * Render game view for time t
 */
Game.prototype.render = function(t) {
    this.speakerMaterial.uniforms['uTime'].value = t;
    this.speakerMaterial.uniforms['uBeatTime'].value = this.beat.toBeatTime(t);
    this.speakerMaterial.uniforms['uBeat'].value = this.beat.toBeat(t);
    this.posterMaterial.uniforms['uTime'].value = t;
    /*
     this.sphere[0].rotation.x += 0.01;
     this.sphere[0].rotation.y += 0.007;
     this.sphere[1].rotation.x += 0.01;
     this.sphere[1].rotation.y += 0.007;
     this.sphere[2].rotation.x += 0.01;
     this.sphere[2].rotation.y += 0.007;
     this.sphere[3].rotation.x += 0.01;
     this.sphere[3].rotation.y += 0.007;
     this.sphere[4].rotation.x += 0.01;
     this.sphere[4].rotation.y += 0.007;
     */
    this.camera.lookAt(this.scene.position);
    this.composer.render();
};

Game.prototype.handleInput = function() {
    
    /*
     * Song selection buttons
     */
    
    if (this.keys[49]){
        // "The Modern Age" by the Strokes
        this.song = $('#song1')[0];
        this.songName = "The Modern Age";
        this.text3.innerHTML = "Song name: " + this.songName;
        this.song.play();
        this.beat = new Beat(146);
    }
    if (this.keys[50]){
        console.log("Helicopter");
        this.song = $('#song2')[0];
        this.songName = "Helicopter";
        this.text3.innerHTML = "Song name: " + this.songName;
        this.song.play();
        this.beat = new Beat(85);
    }
    if(this.keys[51]){
        console.log("Start Me Up");
        this.song = $('#song3')[0];
        this.songName = "Start Me Up";
        this.text3.innerHTML = "Song name: " + this.songName;
        this.song.play();
        this.beat = new Beat(122);
    }
    if(this.keys[52]){
        console.log("Take Me Out");
        this.song = $('#song4')[0];
        this.songName = "Take Me Out";
        this.text3.innerHTML = "Song name: " + this.songName;
        this.song.play();
        this.beat = new Beat(105);
    }
    if(this.keys[53]){
        console.log("I Bet You Look Good on the Dancefloor");
        this.song = $('#song5')[0];
        this.songName = "I Bet You Look Good on the Dancefloor";
        this.text3.innerHTML = "Song name: " + this.songName;
        this.song.play();
        this.beat = new Beat(103);
    }
    if(this.keys[27]){
        this.song.pause();
        this.beat = new Beat(0);
        this.text5.innerHTML = "Final score for " + this.songName + " is: " + this.score;
    }
    
    if (this.keys[32] === true) {
        this.keys[32] = 'triggered';
        var pulse = this.speakerMaterial.uniforms['uBeat'].value;
        this.text2.innerHTML = "Score = " + this.score;
        this.text4.innerHTML = "Combo = " + this.combo;
        
        /**
         * Score threshold
         */
        
        this.missCount;
        
        // Marvelous!
        if (pulse >= 0.951 && pulse <= 0.9999999){
            this.combo += 1;
            this.score += 5;
            if (this.combo >= 5) {
                this.score += 10;
            }
            this.text5.innerHTML = "MARVELOUS!";
        }
        // Perfect
        else if (pulse >= 0.901 && pulse <= 0.95) {
            this.combo += 1;
            this.score += 4;
            if (this.combo >= 5) {
                this.score += 8;
            }
            this.text5.innerHTML = "PERFECT!";
        }
        // Good
        else if (pulse >= 0.701 && pulse <= .90){
            this.combo += 1;
            this.score += 2;
            if (this.combo >= 5) {
                this.score += 4;
            }
            this.text5.innerHTML = "GOOD!";
        }
        // O.K
        else if (pulse >= 0.601 && pulse <= .70){
            this.combo += 1;
            this.score += 1;
            if (this.combo >= 5) {
                this.score += 2;
            }
            this.text5.innerHTML = "O.K!";
        }
        // MISS
        else if (pulse <= .60){
            this.combo = 0;
            this.score += 0;
            this.text5.innerHTML = "MISS";
            this.missCount++;
            this.sphere.length--;
            if(this.missCount === 5){
                this.beat = new Beat(0);
                this.text5.innerHTML = "Final score for " + this.songName + " is: " + this.score;
            }
        }
    }
}

/**
 * Start main game loop
 */
Game.prototype.start = function() {
    var that = this;
    var time0 = new Date().getTime(); // milliseconds since 1970
    this.beat = new Beat(0);
    var loop = function() {
        var time = new Date().getTime();
        that.render((time - time0) * 0.001);
        requestAnimationFrame(loop, that.renderer.domElement);
        // Respond to user input
        that.handleInput();
    };
    loop();
};

////

var game = new Game();
game.init();
game.start();