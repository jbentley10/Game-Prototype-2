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
    return t * this.bpm / 60.0;
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
    this.beat = new Beat(120.0);
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.y = -200;
    this.camera.position.z = 500;
    
    var vertexShaderText = $('#my-vertex-shader').text();
    var fragmentShaderText = $('#my-fragment-shader').text();
    
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
    this.speaker1.position.y = -100;
    this.scene.add(this.speaker1);
    
    this.speaker2 = new THREE.Mesh(
                                   new THREE.CubeGeometry(100, 200, 100),
                                   this.speakerMaterial);
    this.speaker2.position.x = 300;
    this.speaker2.position.y = -100;
    this.scene.add(this.speaker2);
    
    this.posterMaterial = new THREE.ShaderMaterial({
                                                   uniforms: {
                                                   'uTime': { type: 'f', value: 0.0 },
                                                   },
                                                   vertexShader: vertexShaderText,
                                                   fragmentShader: fragmentShaderText
                                                   });
    this.poster = new THREE.Mesh(
                                 new THREE.PlaneGeometry(600, 600),
                                 this.posterMaterial);
    this.poster.position.y = 110;
    this.poster.position.z = -100;
    this.scene.add(this.poster);
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(800, 600);
    this.renderer.setClearColor(0xeeeeee, 1.0);
    document.body.appendChild(this.renderer.domElement);
    
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
    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.007;
    this.camera.lookAt(this.scene.position);
    this.composer.render();
};

/**
 * Start main game loop
 */
Game.prototype.start = function() {
    var that = this;
    var time0 = new Date().getTime(); // milliseconds since 1970
    var loop = function() {
        var time = new Date().getTime();
        that.render((time - time0) * 0.001);
        requestAnimationFrame(loop, that.renderer.domElement);
    };
    loop();
};

////

var game = new Game();
game.init();
game.start();

