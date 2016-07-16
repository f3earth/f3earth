const SHADER_TYPE = {
    FRAGMENT: Symbol(),
    VERTEX: Symbol()
};

export class ShaderLoader {
    static loadVertex(glContext, Source) {
        return this.load(glContext, Source, SHADER_TYPE.VERTEX);
    }

    static loadFragment(glContext, Source) {
        return this.load(glContext, Source, SHADER_TYPE.FRAGMENT);
    }

    static load(glContext, source, type) {
        let shader = null;
        if (type === SHADER_TYPE.FRAGMENT) {
            shader = glContext.createShader(glContext.FRAGMENT_SHADER);
        } else if (type === SHADER_TYPE.VERTEX) {
            shader = glContext.createShader(glContext.VERTEX_SHADER);
        } else {
            console.error(`invalid shader type: ${type}`);
            return null;
        }

        glContext.shaderSource(shader, source);
        glContext.compileShader(shader);

        if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
            console.error(glContext.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}
