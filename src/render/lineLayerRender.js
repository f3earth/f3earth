
import glMatrix from 'gl-matrix';
import { Const } from '../const';

import { ShaderLoader } from '../shader/shaderLoader';
import { LineShader } from '../shader/lineShader';

export class LineLayerRender {

    constructor(gl) {
        this._gl = gl;
        this._shaderProgram = null;
        this._setup();
    }

    _setup() {
        const gl = this._gl;
        const vertexShader = ShaderLoader.loadVertex(gl, LineShader.vertexSource);
        const fragmentShader = ShaderLoader.loadFragment(gl, LineShader.fragmentSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Failed to setup shaders');
        }
        this._shaderProgram = shaderProgram;
        // gl.useProgram(this._shaderProgram);
    }

    render(Objects, camera) {
        const gl = this._gl;
        const program = this._shaderProgram;
        gl.useProgram(program);
        this._uploadModels(camera);

        Objects.forEach(object => object.render(gl, program));
        gl.flush();
    }

    _uploadModels(camera) {
        const gl = this._gl;
        const program = this._shaderProgram;

        const uniformMVMatrixLoc = gl.getUniformLocation(program, 'uMVMatrix');
        const uniformProjMatrixLoc = gl.getUniformLocation(program, 'uPMatrix');
        const modelViewMatrix = glMatrix.mat4.create();
        const projectionMatrix = glMatrix.mat4.create();

        glMatrix.mat4.perspective(
            projectionMatrix,
            60 * Math.PI / 180,
            gl.viewportWidth / gl.viewportHeight,
            0.001, 18 * Const.EARTH_RADIUS);

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
    }
}
