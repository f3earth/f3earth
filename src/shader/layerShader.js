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
          attribute vec2 aVertexPosition;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;
          uniform float uPointSize;
          uniform float uEarthRadius;

          vec3 convertPosition(vec2 lonLat, float earthRadius) {
            float PI = 3.1415926;
            float lonRadians = lonLat[0] / 180.0 * PI;
            float latRadians = lonLat[1] / 180.0 * PI;

            float radCosLat = earthRadius * cos(latRadians);

            float pointX = radCosLat * cos(lonRadians);
            float pointY = radCosLat * sin(lonRadians);
            float pointZ = earthRadius * sin(latRadians);
            return vec3(pointX, pointY, pointZ);
          }

          void main() {
            gl_PointSize = uPointSize;
            vec3 pos = convertPosition(aVertexPosition, uEarthRadius);
            gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
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

    static get imageVertexSource() {
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

    static get imageFragmentSource() {
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
