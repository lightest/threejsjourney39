uniform float uPixelRatio;
uniform float uFireflySize;
uniform float uTime;

attribute float aScale;

varying float vScale;
varying vec2 vUv;

void main () {
	vScale = aScale;
	vec3 p = position;
	vec4 pos = projectionMatrix * modelViewMatrix * vec4(p, 1.);
	vUv = uv;
	gl_Position = pos;
}
