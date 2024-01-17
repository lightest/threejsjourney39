uniform float uPixelRatio;
uniform float uFireflySize;
uniform float uTime;

attribute float aScale;

varying float vScale;

void main () {
    vScale = aScale;
    vec3 p = position;
    p.y += sin(uTime + aScale * 100.) * aScale * .5;
    vec4 viewPos = viewMatrix * vec4(p, 1.);
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(p, 1.);
    gl_Position = pos;
    gl_PointSize = uFireflySize * uPixelRatio * aScale;
    gl_PointSize *= -1.0 /viewPos.z;
}
