export class LineShader {
    static get vertexSource() {
        return `
          attribute vec3 aVertexPosition;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;

          void main() {
            gl_PointSize = 10.0;
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
          } 
        `;
    }

    static get fragmentSource() {
        return `
          precision mediump float;

          uniform vec4 uColor;

          void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          } 
        `;
    }
}
