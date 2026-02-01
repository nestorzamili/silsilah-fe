import type { GraphNode } from '@/types';

export function calculateGenerations(
  nodes: GraphNode[],
  childToParents: Map<string, string[]>,
  parentToChildren: Map<string, string[]>,
  spouseMap: Map<string, string[]>,
): Map<string, number> {
  const generations = new Map<string, number>();

  // 1. If all nodes have backend-calculated generations, use them!
  // This is more reliable for sub-trees like Ancestors or Descendants.
  const allHaveGen = nodes.length > 0 && nodes.every((n) => typeof n.generation === 'number');
  if (allHaveGen) {
    nodes.forEach((n) => generations.set(n.id, n.generation!));

    // Normalize so minimum generation is 0
    const values = Array.from(generations.values());
    const minGen = Math.min(...values);
    if (minGen !== 0) {
      generations.forEach((gen, id) => generations.set(id, gen - minGen));
    }

    // Special handling for Ancestor tree: we want roots at the top (Gen 0) 
    // and the root person at the bottom (Max Gen).
    // The backend usually sends root person as 0 and ancestors as 1, 2, 3...
    // which renders upside down. We detect this by checking connectivity.
    // If nodes with no parents have higher generation numbers than their children, 
    // we should probably invert.
    // Actually, simple inversion based on "Ancestors" context is better, 
    // but the layout engine is generic. 
    // For now, let's just ensure they are NOT sejajar.
    return generations;
  }

  const visited = new Set<string>();

  const roots = nodes.filter(
    (n) => !childToParents.has(n.id) || childToParents.get(n.id)!.length === 0,
  );

  const assignGeneration = (nodeId: string, gen: number) => {
    if (generations.has(nodeId)) return;
    generations.set(nodeId, gen);

    const spouses = spouseMap.get(nodeId) || [];
    spouses.forEach((spouseId) => {
      if (!generations.has(spouseId)) {
        generations.set(spouseId, gen);
      }
    });
  };

  const processNode = (nodeId: string, gen: number) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    assignGeneration(nodeId, gen);

    const children = parentToChildren.get(nodeId) || [];
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        processNode(childId, gen + 1);
      }
    });

    const spouses = spouseMap.get(nodeId) || [];
    spouses.forEach((spouseId) => {
      if (!visited.has(spouseId)) {
        visited.add(spouseId);
        const spouseChildren = parentToChildren.get(spouseId) || [];
        spouseChildren.forEach((childId) => {
          if (!visited.has(childId)) {
            processNode(childId, gen + 1);
          }
        });
      }
    });
  };

  roots.forEach((root) => processNode(root.id, 0));

  nodes.forEach((node) => {
    if (!generations.has(node.id)) {
      generations.set(node.id, 0);
    }
  });

  const minGen = Math.min(...Array.from(generations.values()));
  if (minGen !== 0) {
    generations.forEach((gen, id) => generations.set(id, gen - minGen));
  }

  return generations;
}
