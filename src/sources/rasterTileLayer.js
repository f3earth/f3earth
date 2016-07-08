import glMatrix from 'gl-matrix';

import {
  ShaderLoader
}
from '../shaders/shaderLoader';
import {
  RasterTileShader
}
from '../shaders/rasterTileShader';
import {
  RasterTile
}
from './rasterTile';

export class RasterTileLayer {
  constructor(layer) {}

  render(glContext) {
    this._gl = glContext;
    this.setupShaders();
    this.draw();
  }

  setupShaders() {
    let vertexShader = ShaderLoader.loadVertex(this._gl, RasterTileShader.vertexSource);
    let fragmentShader = ShaderLoader.loadFragment(this._gl, RasterTileShader.fragmentSource);

    this._shaderProgram = this._gl.createProgram();
    this._gl.attachShader(this._shaderProgram, vertexShader);
    this._gl.attachShader(this._shaderProgram, fragmentShader);
    this._gl.linkProgram(this._shaderProgram);

    if (!this._gl.getProgramParameter(this._shaderProgram, this._gl.LINK_STATUS)) {
      console.error("Failed to setup shaders");
    }
    this._gl.useProgram(this._shaderProgram);
  }

  draw() {
    this._gl.viewport(0, 0, this._gl.viewportWidth, this._gl.viewportHeight);
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this._gl.enable(this._gl.CULL_FACE);

    this.pwgl = {};
    this.pwgl.uniformMVMatrixLoc = this._gl.getUniformLocation(this._shaderProgram, "uMVMatrix");
    this.pwgl.uniformProjMatrixLoc = this._gl.getUniformLocation(this._shaderProgram, "uPMatrix");
    this.pwgl.modelViewMatrix = glMatrix.mat4.create();
    this.pwgl.projectionMatrix = glMatrix.mat4.create();
    
    glMatrix.mat4.perspective(this.pwgl.projectionMatrix, 60 * Math.PI / 180, this._gl.viewportWidth / this._gl.viewportHeight,
      0.001, 18 * 6378137.0);

    glMatrix.mat4.identity(this.pwgl.modelViewMatrix);
    let eye = glMatrix.vec3.fromValues(0, 0, 3 * 6378137);
    glMatrix.mat4.lookAt(this.pwgl.modelViewMatrix, eye, [0, 0, 0], [0, 1, 0]);

    this._gl.uniformMatrix4fv(
      this.pwgl.uniformMVMatrixLoc,
      false,
      this.pwgl.modelViewMatrix);
    this._gl.uniformMatrix4fv(
      this.pwgl.uniformProjMatrixLoc,
      false,
      this.pwgl.projectionMatrix);

    let self = this;
    let allImagePromise = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let promise = new Promise(function (resolve) {
          let image = new Image();
          image.crossOrigin = "Anonymous";
          image.onload = function () {
            image.col = col;
            image.row = row;
            resolve(image);
          };
          image.src = "http://mt3.google.cn/vt/lyrs=s@138&hl=zh-CN&gl=CN&src=app&x=" + col + "&y=" + row + "&z=3&s=Galil";
        });
        allImagePromise.push(promise);
      }
    }

    this._tiles = [];
    Promise.all(allImagePromise).then(function (images) {
      self._gl.clear(self._gl.COLOR_BUFFER_BIT | self._gl.DEPTH_BUFFER_BIT);
      images.forEach(function (image) {
        let tile = new RasterTile(3, image.row, image.col, image);
        tile.render(self._gl, self._shaderProgram);
        self._tiles.push(tile);
      });
    });
  }

  rotate(x, y) {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.perspective(this.pwgl.projectionMatrix, 60 * Math.PI / 180, this._gl.viewportWidth / this._gl.viewportHeight,
      0.001, 18 * 6378137.0);

    glMatrix.mat4.identity(this.pwgl.modelViewMatrix);
    let eye = glMatrix.vec3.fromValues(0, 0, 3 * 6378137);
    x = x % 360;
    y = y % 360;
    glMatrix.vec3.rotateX(eye, eye, [0, 0, 0], x * Math.PI / 180);
    glMatrix.vec3.rotateY(eye, eye, [0, 0, 0], y * Math.PI / 180);
    glMatrix.mat4.lookAt(this.pwgl.modelViewMatrix, eye, [0, 0, 0], [0, 1, 0]);

    this._gl.uniformMatrix4fv(
      this.pwgl.uniformMVMatrixLoc,
      false,
      this.pwgl.modelViewMatrix);
    this._gl.uniformMatrix4fv(
      this.pwgl.uniformProjMatrixLoc,
      false,
      this.pwgl.projectionMatrix);

    this._tiles.forEach(function (tile) {
      tile.redraw();
    });
  }
}