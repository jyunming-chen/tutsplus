#version 120   // must add for array constructors
#define KERNEL_SIZE 9

// Gaussian kernel
// 1 2 1
// 2 4 2
// 1 2 1
// Laplacian kernel
// 0 -1 0
// -1 4 -1
// 0 -1 0

uniform sampler2D colorMap;
uniform float width;   // size of image
uniform float height;

float step_w = 1.0/width;
float step_h = 1.0/height;

float kernel[KERNEL_SIZE], kernelx[KERNEL_SIZE],kernely[KERNEL_SIZE];
vec2 offset[KERNEL_SIZE];

#if 0
// for all other filters
void init_kernel()
{
	kernel = float[] (
				0.0/1.0, -1.0/1.0, 0.0/1.0,
				-1.0/1.0, 4.0/1.0, -1.0/1.0,
				0.0/1.0, -1.0/1.0, 0.0/1.0);
	offset = vec2[] ( vec2(-step_w, -step_h), vec2(0.0, -step_h), vec2(step_w, -step_h), 
				vec2(-step_w, 0.0), vec2(0.0, 0.0), vec2(step_w, 0.0), 
				vec2(-step_w, step_h), vec2(0.0, step_h), vec2(step_w, step_h) );
}
void main(void)
{
   int i = 0;
   vec4 sum = vec4(0.0);
   
   init_kernel();
   
   if(gl_TexCoord[0].s < 0.49) {
       for( i=0; i<KERNEL_SIZE; i++ )  {
	       vec4 tmp = texture2D(colorMap, gl_TexCoord[0].st + offset[i]);
	       sum += tmp * kernel[i];
	   }
   } else if( gl_TexCoord[0].s > 0.51 ) {
	   sum = texture2D(colorMap, gl_TexCoord[0].st);
   } else {
	   sum = vec4(1.0,0.0,0.0,1.0);
   }

   gl_FragColor = sum;
}

#else
// only for Sobel filter
void init_kernel()
{
	kernelx = float[] (
				-1, 0, 1,
				-2, 0, 2,
				-1, 0, 1);
	kernely = float[] (
				1, 2, 1,
				0, 0, 0,
				-1, -2, -1);
	offset = vec2[] ( vec2(-step_w, -step_h), vec2(0.0, -step_h), vec2(step_w, -step_h), 
				vec2(-step_w, 0.0), vec2(0.0, 0.0), vec2(step_w, 0.0), 
				vec2(-step_w, step_h), vec2(0.0, step_h), vec2(step_w, step_h) );
}
void main(void)
{
   int i = 0;
   vec4 sum;

   init_kernel();
   
   if(gl_TexCoord[0].s < 0.49) {
        vec3 normal, delx, dely;
		
		sum = vec4(0.0);
        for( i=0; i<KERNEL_SIZE; i++ )  {
			vec4 tmp = texture2D(colorMap, gl_TexCoord[0].st + offset[i]);
			sum += tmp * kernelx[i];
	    }
		delx = vec3 (1.0, 0.0, sum.r);
    	
		sum = vec4(0.0);
        for( i=0; i<KERNEL_SIZE; i++ )  {
			vec4 tmp = texture2D(colorMap, gl_TexCoord[0].st + offset[i]);
			sum += tmp * kernely[i];
		}
	
		dely  = vec3 (0.0, 1.0, sum.r);
		normal = normalize (cross (delx, dely));
		// scale and bias to [0,1]^4
		sum.xyz = (normal + vec3(1,1,1))/2;	sum.w = 1.0;
	    
		
   } else if( gl_TexCoord[0].s > 0.51 ) {
	sum = texture2D(colorMap, gl_TexCoord[0].st);
   } else {
	sum = vec4(1.0,0.0,0.0,1.0);
   }

   gl_FragColor = sum;
}
#endif

