export class Fill {
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
        gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
        this._mesh.bindPoint(gl, pwgl.vertexPositionAttributeLoc);
        const colorLoc = gl.getUniformLocation(program, 'uColor');
        const color = this._material.color;
        gl.uniform4f(colorLoc, color.R, color.G, color.B, color.A);
        gl.drawArrays(gl.TRIANGLES, 0, this._mesh.count);
//        this._material.unBind(gl);
    }
}
