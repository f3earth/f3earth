import { VectorSource } from './vectorSource';
import { Polygon as RenderablePolygon } from '../renderable/polygon';
import { PolygonMesh } from '../mesh/polygonMesh';
export class PolygonSource extends VectorSource {
    buildRenderObjects() {
        const renderList = [];
        this.getFeatures().forEach(line => {
            const renderablePolygon = new RenderablePolygon({
                mesh: new PolygonMesh(line),
                material: undefined
            });
            renderList.push(renderablePolygon);
        });
        return renderList;
    }
}
