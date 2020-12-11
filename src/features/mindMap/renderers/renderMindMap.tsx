import { MindMapData } from '../../../data';
import RenderCache from './RenderCache';
import { animate, initializeGraph, initializeScene } from './utils';

export default async function renderMindMap(
  div: HTMLDivElement,
  data: MindMapData
) {
  const { scene, renderer, camera, controls } = initializeScene(div);
  const renderCache = await RenderCache.fromData(data);
  const graph = initializeGraph(renderCache, data);
  scene.add(graph);
  camera.lookAt(graph.position);
  animate(() => {
    graph.tickFrame();
    controls.update();
    renderer.render(scene, camera);
  });
}
