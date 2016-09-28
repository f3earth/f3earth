export class Line {
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
        const oldLineWidth = gl.getParameter(gl.LINE_WIDTH);
        gl.lineWidth(this._material.size);
        gl.uniform4f(colorLoc, color.R, color.G, color.B, color.A);
        // this._material.bindTexture(gl, gl.TEXTURE0);
        gl.drawArrays(gl.LINE_STRIP, 0, this._mesh.count);
        gl.lineWidth(oldLineWidth);
//        this._material.unBind(gl);
    }
}
