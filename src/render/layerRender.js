import { ShaderLoader } from '../shader/shaderLoader';
export class LayerRender {

    constructor(gl, vertexSource, fragmentSource) {
        this._gl = gl;
        this._vertexSource = vertexSource;
        this._fragmentSource = fragmentSource;
        this._shaderProgram = null;
        this._setup();
    }

    _setup() {
        const gl = this._gl;
        const vertexShader = ShaderLoader.loadVertex(gl, this._vertexSource);
        const fragmentShader = ShaderLoader.loadFragment(gl, this._fragmentSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Failed to setup shaders');
        }
        this._shaderProgram = shaderProgram;
    }

    render(objects, camera) {
        const gl = this._gl;
        const program = this._shaderProgram;
        gl.useProgram(program);
        this._uploadModels(camera);

        objects.forEach(object => object.render(gl, program));
        gl.flush();
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
