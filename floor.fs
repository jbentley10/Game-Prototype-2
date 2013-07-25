varying vec3 vNormal;
uniform float uTime;
uniform float uBeatTime;
uniform float uBeat;
varying vec2 vUv;

void main() {
  float time = uBeat;
  float tileX = floor(vUv.x*10.0)+1.0;
  float tileY = floor(vUv.y*10.0)+1.0;
  if(uTime>=30.85&&uTime<86.0)
	{
	gl_FragColor = vec4((sin((tileX*tileY)*uBeat)),(acos((tileX*tileY*17.0)*uBeat)),(tan((tileX*tileY)*uBeat)),1.0);
	}
  else if(uTime>=87.0&&uTime<150.8){
	gl_FragColor = vec4(sin((tileX*tileY)*uTime),(acos(tileX*tileY*17.0)*uBeatTime),(tan(tileX*tileY)*uTime),1.0);
  }
  else if(uTime>=150.8&&uTime<221.5){
	gl_FragColor = vec4((sin((tileX*tileY)*uBeat)),(acos((tileX*tileY*17.0)*uBeat)),(tan((tileX*tileY)*uBeat)),1.0);
  }
  else{
	gl_FragColor = vec4(sin((tileX*tileY)*uTime),(acos(tileX*tileY*17.0)*uBeatTime),(tan(tileX*tileY)*uTime),1.0);
  }
}