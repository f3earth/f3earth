import glMatrix from 'gl-matrix';
import {
  ShaderLoader
}
from '../shader/shaderLoader';
import {
  RasterTileShader
}
from '../shader/rasterTileShader';

const EARTH_RADIUS = 6378137;

export class RasterTileLayerRenderer {
  constructor() {}

  static render(layer, gl, camera) {
    this._setupGl(layer, gl);
    gl.useProgram(layer.glProgram);
    this._draw(layer, gl, camera);
  }

  static _setupGl(layer, gl) {
    if (!layer.isGLReady()) {
      this._setupShaders(layer, gl);
    }
  }

  static _setupShaders(layer, gl) {
    let vertexShader = ShaderLoader.loadVertex(gl, RasterTileShader.vertexSource);
    let fragmentShader = ShaderLoader.loadFragment(gl, RasterTileShader.fragmentSource);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Failed to setup shaders");
    }
    layer.setGlProgram(shaderProgram);
  }

  static _draw(layer, gl, camera) {

    layer.getRenderTiles(function (tiles) {

      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.CULL_FACE);

      let uniformMVMatrixLoc = gl.getUniformLocation(layer.glProgram, "uMVMatrix");
      let uniformProjMatrixLoc = gl.getUniformLocation(layer.glProgram, "uPMatrix");
      let modelViewMatrix = glMatrix.mat4.create();
      let projectionMatrix = glMatrix.mat4.create();

      glMatrix.mat4.perspective(projectionMatrix, 60 * Math.PI / 180, gl.viewportWidth / gl.viewportHeight,
        0.001, 18 * EARTH_RADIUS);

      glMatrix.mat4.identity(modelViewMatrix);
      glMatrix.mat4.lookAt(modelViewMatrix, camera.eye, camera.center, camera.up);

      gl.uniformMatrix4fv(
        uniformMVMatrixLoc,
        false,
        modelViewMatrix);
      gl.uniformMatrix4fv(
        uniformProjMatrixLoc,
        false,
        projectionMatrix);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      tiles.forEach(function (tile) {
        tile.render(gl, layer.glProgram);
      });
    });
  }
}