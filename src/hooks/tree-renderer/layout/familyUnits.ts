import type { GraphNode } from '@/types';
import type { FamilyUnit } from './types';

export function buildFamilyUnits(
  nodes: GraphNode[],
  nodeMap: Map<string, GraphNode>,
  childToParents: Map<string, string[]>,
  parentToChildren: Map<string, string[]>,
  childOrderMap: Map<string, number>,
  spouseOrderMap: Map<string, number>,
): FamilyUnit[] {
  const familyUnits: FamilyUnit[] = [];
  const processedChildSets = new Set<string>();
  const allParentIds = new Set<string>();

  nodes.forEach((node) => {
    const children = parentToChildren.get(node.id);
    if (children && children.length > 0) {
      allParentIds.add(node.id);
    }
  });

  allParentIds.forEach((parentId) => {
    const children = parentToChildren.get(parentId) || [];

    children.forEach((childId) => {
      const childParents = childToParents.get(childId) || [];
      const sortedParents = [...childParents].sort();
      const parentSetKey = sortedParents.join('-');

      if (processedChildSets.has(`${childId}-${parentSetKey}`)) return;

      const siblingsWithSameParents: string[] = [];

      children.forEach((sibId) => {
        const sibParents = childToParents.get(sibId) || [];
        const sibParentKey = [...sibParents].sort().join('-');
        if (sibParentKey === parentSetKey) {
          if (!siblingsWithSameParents.includes(sibId)) {
            siblingsWithSameParents.push(sibId);
            processedChildSets.add(`${sibId}-${parentSetKey}`);
          }
        }
      });

      if (childParents.length > 1) {
        childParents.forEach((pId) => {
          const pChildren = parentToChildren.get(pId) || [];
          pChildren.forEach((sibId) => {
            const sibParents = childToParents.get(sibId) || [];
            const sibParentKey = [...sibParents].sort().join('-');
            if (sibParentKey === parentSetKey) {
              if (!siblingsWithSameParents.includes(sibId)) {
                siblingsWithSameParents.push(sibId);
                processedChildSets.add(`${sibId}-${parentSetKey}`);
              }
            }
          });
        });
      }

      siblingsWithSameParents.sort((a, b) => {
        const orderA = childOrderMap.get(a) ?? 999;
        const orderB = childOrderMap.get(b) ?? 999;
        return orderA - orderB;
      });

      let spouseOrder = 1;
      if (childParents.length === 2) {
        const key = [...childParents].sort().join('-');
        spouseOrder = spouseOrderMap.get(key) ?? 1;
      }

      const sortedParentIds = [...childParents].sort((a, b) => {
        const nodeA = nodeMap.get(a);
        const nodeB = nodeMap.get(b);
        if (nodeA?.gender === 'MALE' && nodeB?.gender !== 'MALE') return -1;
        if (nodeA?.gender !== 'MALE' && nodeB?.gender === 'MALE') return 1;
        return 0;
      });

      familyUnits.push({
        id: `family-${parentSetKey}`,
        parents: sortedParentIds,
        children: siblingsWithSameParents,
        spouseOrder,
      });
    });
  });

  familyUnits.sort((a, b) => a.spouseOrder - b.spouseOrder);

  return familyUnits;
}
