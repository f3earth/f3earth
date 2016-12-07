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

    static get imagePointVertexSource() {
        return `
          attribute vec3 aVertexPosition;
          attribute vec2 aTextureCoordinates;

          uniform mat4 uMVMatrix;
          uniform mat4 uPMatrix;
          uniform float uWidth;
          uniform float uHeight;
          uniform float uOffsetWidth;
          uniform float uOffsetHeight;
          uniform float uRotate;
          uniform float uViewWidth;
          uniform float uViewHeight;
          uniform float uEarthRadius;

          varying vec2 vTextureCoordinates;

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
            vec3 pos = convertPosition(vec2(aVertexPosition[0], aVertexPosition[1]), uEarthRadius);
            gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

            float sinV = sin(uRotate);
            float cosV = cos(uRotate);

            float offsetWidth = uOffsetWidth * gl_Position[3] / (uViewWidth / 2.0);
            float offsetHeight = uOffsetHeight * gl_Position[3] / (uViewHeight / 2.0);
            int type = int(aVertexPosition[2]);

            float halfWidth = 0.0;
            float halfHeight = 0.0;
            // left top
            if (type == -1) {
              halfWidth = -uWidth * cosV + (-uHeight) * sinV;
              halfHeight = -uWidth * (-sinV) + (-uHeight) * cosV;
              halfWidth = halfWidth / 2.0 * gl_Position[3] / (uViewWidth / 2.0);
              halfHeight = halfHeight / 2.0 * gl_Position[3] / (uViewHeight / 2.0);
            } else if (type == 1) { 
              // right top
              halfWidth = uWidth * cosV + (-uHeight) * sinV;
              halfHeight = uWidth * (-sinV) + (-uHeight) * cosV;
              halfWidth = halfWidth / 2.0 * gl_Position[3] / (uViewWidth / 2.0);
              halfHeight = halfHeight / 2.0 * gl_Position[3] / (uViewHeight / 2.0);
            } else if (type == -2) {
              // left bottom
              halfWidth = -uWidth * cosV + (uHeight) * sinV;
              halfHeight = -uWidth * (-sinV) + (uHeight) * cosV;
              halfWidth = halfWidth / 2.0 * gl_Position[3] / (uViewWidth / 2.0);
              halfHeight = halfHeight / 2.0 * gl_Position[3] / (uViewHeight / 2.0);
            } else if (type == 2) {
              // right bottom
              halfWidth = uWidth * cosV + (uHeight) * sinV;
              halfHeight = uWidth * (-sinV) + (uHeight) * cosV;
              halfWidth = halfWidth / 2.0 * gl_Position[3] / (uViewWidth / 2.0);
              halfHeight = halfHeight / 2.0 * gl_Position[3] / (uViewHeight / 2.0);
            }
            gl_Position[0] = gl_Position[0] + halfWidth;
            gl_Position[1] = gl_Position[1] + halfHeight;

            gl_Position[0] = gl_Position[0] + offsetWidth;
            gl_Position[1] = gl_Position[1] + offsetHeight;
            vTextureCoordinates = aTextureCoordinates;
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

          uniform sampler2D uSampler;

          varying vec2 vTextureCoordinates;
          
          void main() {
            gl_FragColor = texture2D(uSampler, vTextureCoordinates);
          } 
        `;
    }
}
