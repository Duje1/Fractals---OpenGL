#version 330 core
#define MAX_ITERATIONS 128.0f

in vec4 fragCoord;
 
out vec4 frag_color;

uniform float zoom;
uniform float center_x;
uniform float center_y;

vec2 f(vec2 z, vec2 c){
    return vec2(z.x*z.x - z.y*z.y, 2.*z.x* z.y) + c;

}

vec3 hash13(float m){
    float x = fract(sin(m) * 5625.246);
    float y= fract(sin(m + x) * 2216.486);
    float z = fract(sin(x + y) * 8276.352);
    return vec3(x,y,z);
}

void main()
{
    vec2 iResolution = vec2(1.0f, 1.0f);
    
    float real = ((gl_FragCoord.x / 1080.0f - 0.5f) * zoom + center_x) * 4.0f;
    float imag = ((gl_FragCoord.y / 1080.0f - 0.5f) * zoom + center_y) * 4.0f;
    vec2 uv = vec2(real,imag);
      
    vec2 c = uv * 4.; 
    vec2 z = vec2(0.);
    float iter = 0.;
    for(iter = 0; iter < MAX_ITERATIONS; iter++) {
    	z = f(z, c);            
        if(length(z) > 4.0) break;

    }

    float f = iter/150.0f;
    vec3 col = vec3(f);
    col += hash13(f);
    //gamma
    //col = pow(col, vec3(.46));

    if(iter == MAX_ITERATIONS) frag_color = vec4(0.,0.,0.,1.);
    else  frag_color = vec4(col, 1.0);
}