import { VectorSource } from './vectorSource';
import { Line as RenderableLine } from '../renderable/line';
import { LineMesh } from '../mesh/lineMesh';
export class LineSource extends VectorSource {
    buildRenderObjects() {
        const renderList = [];
        this.getFeatures().forEach(line => {
            const renderableLine = new RenderableLine({
                mesh: new LineMesh(line),
                material: undefined
            });
            renderList.push(renderableLine);
        });
        return renderList;
    }
}
