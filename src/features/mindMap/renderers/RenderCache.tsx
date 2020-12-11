import React from 'react';
import * as THREE from 'three';
import { NodeObject, LinkObject, PreRendered } from '../types';
import { MindMapData } from '../../../data';
import { MindMapNode } from '../components';
import renderToSprite from './renderToSprite';
import { colorsByLevel } from '../config';

export default class RenderCache {
  preRendered: Map<
    string | number | NodeObject | undefined,
    PreRendered
  > = new Map();

  preRender(data: MindMapData) {
    return Promise.all(
      data.nodes.map(({ name, val, id }) =>
        renderToSprite(<MindMapNode label={name} level={val} />, {
          width: 128,
          height: 64
        }).then((sprite) => {
          sprite.renderOrder = 999;
          sprite.onBeforeRender = (renderer: THREE.WebGLRenderer) =>
            renderer.clearDepth();
          const linkMaterial = new THREE.MeshBasicMaterial({
            color: colorsByLevel[val]
          });
          this.preRendered.set(id, { sprite, linkMaterial });
        })
      )
    );
  }

  createNodeThreeObjectCallback() {
    return ({ id }: NodeObject) => {
      const sprite = this.preRendered.get(id)?.sprite;
      if (!sprite) {
        // if this happens, then there is a problem in the program code
        // leaving this check in (rather than using ! instead of ? above)
        // because caching can get complicated
        console.error(`Error – no pre-rendered mind map node for ID ${id}`);
        return new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
      }
      return sprite;
    };
  }

  createLinkMaterialCallback() {
    return ({ source }: LinkObject) => {
      const linkMaterial = this.preRendered.get(source)?.linkMaterial;
      if (!linkMaterial) {
        // if this happens, then there is a problem in the program code
        // leaving this check in (rather than using ! instead of ? above)
        // because caching can get complicated
        console.error(
          `Error – no pre-rendered link material for source ID ${source}`
        );
        return new THREE.MeshBasicMaterial({ color: 0xffffff });
      }
      return linkMaterial;
    };
  }

  static async fromData(data: MindMapData) {
    const renderCache = new RenderCache();
    await renderCache.preRender(data);
    return renderCache;
  }
}
