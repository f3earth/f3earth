export class Point {
    constructor(options) {
        this._mesh = options.mesh;
        this._material = options.material;
    }

    get mesh() {
        return this._mesh;
    }

    render(gl, shaderProgram, camera) {
        this._mesh.setup(gl);
        this._material.setup(gl);

        const program = shaderProgram;
        const pwgl = {};
        pwgl.vertexPositionAttributeLoc = gl.getAttribLocation(program, 'aVertexPosition');
        gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
        this._mesh.bindPoint(gl, pwgl.vertexPositionAttributeLoc);

        const earthRadiusLoc = gl.getUniformLocation(program, 'uEarthRadius');
        gl.uniform1f(earthRadiusLoc, this._mesh.radius);

        if (this._mesh.type && this._mesh.type() === 'ImagePointMesh') {
            pwgl.vertexTextureAttributeLoc = gl.getAttribLocation(program, 'aTextureCoordinates');
            pwgl.uniformSamplerLoc = gl.getUniformLocation(program, 'uSampler');

            gl.enableVertexAttribArray(pwgl.vertexTextureAttributeLoc);
            this._mesh.bindTexture(gl, pwgl.vertexTextureAttributeLoc);

            gl.uniform1i(pwgl.uniformSamplerLoc, 0);
            this._material.bindTexture(gl, gl.TEXTURE0);

            let imgWidth = 32;
            let imgHeight = 32;
            if (this._material.style && this._material.style.size) {
                imgWidth = this._material.style.size[0];
                imgHeight = this._material.style.size[1];
            }

            const widthLoc = gl.getUniformLocation(program, 'uWidth');
            gl.uniform1f(widthLoc, imgWidth);
            const heightLoc = gl.getUniformLocation(program, 'uHeight');
            gl.uniform1f(heightLoc, imgHeight);

            if (this._material.style && this._material.style.rotate) {
                const rotateLoc = gl.getUniformLocation(program, 'uRotate');
                gl.uniform1f(rotateLoc, this._material.style.rotate * Math.PI / 180);
            }

            let offsetWidth = 0;
            let offsetHeight = 0;
            if (this._material.style && this._material.style.offset) {
                offsetWidth = this._material.style.offset[0];
                offsetHeight = -this._material.style.offset[1];
            }

            const offsetWidthLoc = gl.getUniformLocation(program, 'uOffsetWidth');
            gl.uniform1f(offsetWidthLoc, offsetWidth);
            const offsetHeightLoc = gl.getUniformLocation(program, 'uOffsetHeight');
            gl.uniform1f(offsetHeightLoc, offsetHeight);

            const viewWidthLoc = gl.getUniformLocation(program, 'uViewWidth');
            gl.uniform1f(viewWidthLoc, camera.viewWidth);
            const viewHeightLoc = gl.getUniformLocation(program, 'uViewHeight');
            gl.uniform1f(viewHeightLoc, camera.viewHeight);

            let count = this._mesh.triangleCount;
            count = count / 4;
            for (let index = 0; index < count; index++) {
                this._mesh.bindPoint(gl, pwgl.vertexPositionAttributeLoc, index * 4 * 3 * 4);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        } else {
            const colorLoc = gl.getUniformLocation(program, 'uColor');
            gl.uniform4f(colorLoc, this._material.color.R,
                this._material.color.G,
                this._material.color.B,
                this._material.color.A);
            const pointSizeLoc = gl.getUniformLocation(program, 'uPointSize');
            gl.uniform1f(pointSizeLoc, this._material.size);
            gl.drawArrays(gl.POINTS, 0, this._mesh.count);
        }
    }
}
