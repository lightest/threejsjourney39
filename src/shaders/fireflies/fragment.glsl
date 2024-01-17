uniform float uPixelRatio;

varying float vScale;

void main () {
    float d = distance(gl_PointCoord, vec2(.5));
    float s = .05 / d - .05 * 2.;
    vec4 c = vec4(1., 1., 1., s);
    gl_FragColor = c;
}
