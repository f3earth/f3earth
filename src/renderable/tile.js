export class Tile {
    constructor(options) {
        this._mesh = options.mesh;
        this._material = options.material;
    }

    render(gl, shaderProgram) {
        this._mesh.setup(gl);
        this._material.setup(gl);

        const program = shaderProgram;
        const pwgl = {};
        pwgl.vertexPositionAttributeLoc = gl.getAttribLocation(program, 'aVertexPosition');
        pwgl.vertexTextureAttributeLoc = gl.getAttribLocation(program, 'aTextureCoordinates');
        pwgl.uniformSamplerLoc = gl.getUniformLocation(program, 'uSampler');

        gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
        gl.enableVertexAttribArray(pwgl.vertexTextureAttributeLoc);

        this._mesh.bindPoint(gl, pwgl.vertexPositionAttributeLoc);
        this._mesh.bindTexture(gl, pwgl.vertexTextureAttributeLoc);
        this._mesh.bindIndex(gl);

        gl.uniform1i(pwgl.uniformSamplerLoc, 0);
        this._material.bind(gl, gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, this._mesh.triangleCount,
            gl.UNSIGNED_SHORT, 0);
        this._material.unBind(gl);
    }
}
