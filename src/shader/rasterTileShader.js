export class RasterTileShader {
    static get vertexSource() {
        return `
          attribute vec3 aVertexPosition;
          attribute vec2 aTextureCoordinates;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;

          varying vec2 vTextureCoordinates;

          void main() {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            vTextureCoordinates = aTextureCoordinates;  
          } 
        `;
    }

    static get fragmentSource() {
        return `
          precision mediump float;

          varying vec2 vTextureCoordinates;
          uniform sampler2D uSampler;
          void main() {
            gl_FragColor = texture2D(uSampler, vTextureCoordinates);
          } 
        `;
    }
}
