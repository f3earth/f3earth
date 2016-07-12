import {
  Proj
}
from '../util/proj';

const PIXELS_PER_TILE = 256;
const SEGMENT_COUNT = 16;

export class RasterTile {

  constructor(zoom, row, col, image, radius) {
    this._zoom = zoom;
    this._image = image;

    this._row = row;
    this._col = col;
    this._radius = 6378137;
    this._bound = {
      N: 0,
      W: 0,
      E: 0,
      S: 0
    };
    this._latLng = {
      lat: 0,
      lng: 0
    };

    this._vertices = [];
    this._uvs = [];
    this.calcMercatorBound();
    this.createMesh();
  }

  getMetersPerPixel(zoom) {
    return this._radius * 2.0 * Math.PI / (Math.pow(2, zoom) * PIXELS_PER_TILE);
  }

  calcMercatorBound() {
    // get tile's topleft coordinate in mercator projection
    let metersPerPixel = this.getMetersPerPixel(this._zoom);
    let totalTilesPerEdge = Math.pow(2, this._zoom);
    let totalMeters = totalTilesPerEdge * PIXELS_PER_TILE * metersPerPixel;
    let halfMeters = totalMeters / 2;

    this._bound.N = this._row * (PIXELS_PER_TILE * metersPerPixel);
    this._bound.W = this._col * (PIXELS_PER_TILE * metersPerPixel);

    // get tile's bound
    this._bound.N = halfMeters - this._bound.N;
    this._bound.W = this._bound.W - halfMeters;
    this._bound.E = this._bound.W + (PIXELS_PER_TILE * metersPerPixel);
    this._bound.S = this._bound.N - (PIXELS_PER_TILE * metersPerPixel);
  }

  /* 
   * @description get coordinate in wgs84
   * @param {Number} x mecator's x
   * @param {Number} y mecator's y
   * @param {Boolean} isFirstRow, true if the point is on the most north edge
   * @param {Boolean} isLastRow, true if the point is on the most south edge
   */
  calcLatLng(x, y, isFirstRow, isLastRow) {

    this._latLng = Proj.mercator2Wgs84(x, y);

    /*
     * we must process the most north edge and south edge, because the mercator's latitude range is (-85, 85), which is * smaller than earth's latitude range  (-90, 90).
     */
    if (isFirstRow) {
      this._latLng.lat = 90;
    } else if (isLastRow) {
      this._latLng.lat = -90;
    }
  }

  createMesh() {

    // make SEGMENT_COUNT*SEGMENT_COUNT square mesh
    var intervalMeters = Math.abs(this._bound.E - this._bound.W) / SEGMENT_COUNT;
    var maxRow = Math.pow(2, this._zoom) - 1;
    this._vertices = [];
    this._uvs = [];

    let verticeIndexes = [];
    for (let y = 0; y <= SEGMENT_COUNT; y++) {
      let verticeIndex = [];

      for (let x = 0; x <= SEGMENT_COUNT; x++) {
        var pointN = this._bound.N - y * intervalMeters;
        var pointW = this._bound.W + x * intervalMeters;
        this.calcLatLng(pointW, pointN, this._row === 0 && y === 0, this._row === maxRow && y === SEGMENT_COUNT);

        let pointX = this._radius * Math.sin(this._latLng.lng * Math.PI / 180) * Math.cos(this._latLng.lat * Math.PI / 180);
        let pointY = this._radius * Math.sin(this._latLng.lat * Math.PI / 180);
        let pointZ = this._radius * Math.cos(this._latLng.lng * Math.PI / 180) * Math.cos(this._latLng.lat * Math.PI / 180);
        this._vertices.push(pointX, pointY, pointZ);
        verticeIndex.push(this._vertices.length / 3 - 1);

        var u = x / SEGMENT_COUNT;
        var v = y / SEGMENT_COUNT;
        this._uvs.push(u, 1 - v);
      }

      verticeIndexes.push(verticeIndex);
    }

    // make element index
    let elementIndexes = [];
    for (var y = 0; y < SEGMENT_COUNT; y++) {

      let startIndex = y * SEGMENT_COUNT;
      for (var x = 0; x < SEGMENT_COUNT; x++) {
        elementIndexes.push(verticeIndexes[y][x + 1], verticeIndexes[y][x], verticeIndexes[y + 1][x]);
        elementIndexes.push(verticeIndexes[y][x + 1], verticeIndexes[y + 1][x], verticeIndexes[y + 1][x + 1]);
      }
    }
    this.elementIndexes = elementIndexes;
  }

  render(gl, shaderProgram) {
    if (!this._gl) {
      this._gl = gl;
      this._shaderProgram = shaderProgram;
      this._setupBuffers();

      this._texture = gl.createTexture();
      this._textureFinishedLoading(this._image, this._texture);
    }
    
    this._draw();
  }

  _setupBuffers() {
    this.vertexPosBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertexPosBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._vertices),
      this._gl.STATIC_DRAW);
    this.VERTEX_POS_BUF_ITEM_SIZE = 3;

    this.vertexTextureCoordinateBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._uvs),
      this._gl.STATIC_DRAW);
    this.VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;

    this.vertexIndexBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elementIndexes),
      this._gl.STATIC_DRAW);

    this.VERTEX_INDEX_BUF_ITEM_SIZE = 1;
    this.VERTEX_INDEX_BUF_NUM_ITEMS = this.elementIndexes.length;
  }

  _textureFinishedLoading(image, texture) {
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
    this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);

    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);

    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);

    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
  }

  _draw() {
    let program = this._shaderProgram;
    let pwgl = {};
    pwgl.vertexPositionAttributeLoc = this._gl.getAttribLocation(program, "aVertexPosition");
    pwgl.vertexTextureAttributeLoc = this._gl.getAttribLocation(program, "aTextureCoordinates");
    pwgl.uniformSamplerLoc = this._gl.getUniformLocation(program, "uSampler");

    this._gl.uniform1i(pwgl.uniformSamplerLoc, 0);

    this._gl.enableVertexAttribArray(pwgl.vertexPositionAttributeLoc);
    this._gl.enableVertexAttribArray(pwgl.vertexTextureAttributeLoc);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertexPosBuffer);
    this._gl.vertexAttribPointer(pwgl.vertexPositionAttributeLoc,
      this.VERTEX_POS_BUF_ITEM_SIZE,
      this._gl.FLOAT, false, 0, 0);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
    this._gl.vertexAttribPointer(pwgl.vertexTextureAttributeLoc,
      this.VERTEX_TEX_COORD_BUF_ITEM_SIZE,
      this._gl.FLOAT, false, 0, 0);

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);

    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    this._gl.drawElements(this._gl.TRIANGLES, this.VERTEX_INDEX_BUF_NUM_ITEMS,
      this._gl.UNSIGNED_SHORT, 0);
  }

}