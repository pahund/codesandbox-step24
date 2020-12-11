import ThreeForceGraph from 'three-forcegraph';
import updateLinkPosition from './updateLinkPosition';
import RenderCache from '../RenderCache';
import { MindMapData } from '../../../../data';

export default function initializeGraph(
  renderCache: RenderCache,
  data: MindMapData
) {
  const graph = new ThreeForceGraph().graphData(data);
  graph.nodeThreeObject(renderCache.createNodeThreeObjectCallback());
  graph.linkMaterial(renderCache.createLinkMaterialCallback());
  graph.linkPositionUpdate(updateLinkPosition);
  graph.numDimensions(2);
  graph.linkWidth(1);
  graph.scale.set(0.005, 0.005, 0.005);
  return graph;
}
