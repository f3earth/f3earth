import { ShaderLoader } from '../shader/shaderLoader';
import { RasterTileShader } from '../shader/rasterTileShader';

export class RasterTileLayerRender {
    constructor(gl) {
        this._gl = gl;
        this._shaderProgram = null;
        this._setup();
    }

    _setup() {
        const gl = this._gl;
        const vertexShader = ShaderLoader.loadVertex(gl, RasterTileShader.vertexSource);
        const fragmentShader = ShaderLoader.loadFragment(gl, RasterTileShader.fragmentSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Failed to setup shaders');
        }
        this._shaderProgram = shaderProgram;
    }

    render(tiles, camera) {
        const gl = this._gl;
        const program = this._shaderProgram;
        gl.useProgram(program);

        this._uploadModels(camera);
        tiles.forEach(tile => tile.render(gl, program));
    }

    _uploadModels(camera) {
        const gl = this._gl;
        const program = this._shaderProgram;

        const uniformMVMatrixLoc = gl.getUniformLocation(program, 'uMVMatrix');
        const uniformProjMatrixLoc = gl.getUniformLocation(program, 'uPMatrix');

        gl.uniformMatrix4fv(
            uniformMVMatrixLoc,
            false,
            camera.modelViewMatrix);
        gl.uniformMatrix4fv(
            uniformProjMatrixLoc,
            false,
            camera.projectionMatrix);
    }
}
