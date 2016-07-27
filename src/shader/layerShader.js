export class LayerShader {
    static get lineVertexSource() {
        return `
          attribute vec3 aVertexPosition;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;

          void main() {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
          } 
        `;
    }

    static get lineFragmentSource() {
        return `
          precision mediump float;

          uniform vec4 uColor;

          void main() {
            gl_FragColor = uColor;
          }
        `;
    }
    static get fillVertexSource() {
        return `
          attribute vec3 aVertexPosition;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;

          void main() {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
          } 
        `;
    }

    static get fillFragmentSource() {
        return `
          precision mediump float;

          uniform vec4 uColor;

          void main() {
            gl_FragColor = uColor;
          } 
        `;
    }
    static get pointVertexSource() {
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

    static get pointFragmentSource() {
        return `
          precision mediump float;

          uniform vec4 uColor;

          void main() {
            gl_FragColor = uColor;
          } 
        `;
    }
}
