import apiClient from './api';
import type {
  FamilyGraph,
  AncestorTree,
  SplitAncestorTree,
  DescendantTree,
  RelationshipPath,
} from '@/types';

export const graphService = {
  async getFullGraph(): Promise<FamilyGraph> {
    const { data } = await apiClient.get<FamilyGraph>('/graph');
    return data;
  },

  async getAncestors(personId: string, maxDepth = 10): Promise<AncestorTree> {
    const { data } = await apiClient.get<AncestorTree>(
      `/graph/ancestors/${personId}`,
      { params: { max_depth: maxDepth } },
    );
    return data;
  },

  async getSplitAncestors(
    personId: string,
    maxDepth = 10,
  ): Promise<SplitAncestorTree> {
    const { data } = await apiClient.get<SplitAncestorTree>(
      `/graph/ancestors/${personId}/split`,
      { params: { max_depth: maxDepth } },
    );
    return data;
  },

  async getDescendants(
    personId: string,
    maxDepth = 10,
  ): Promise<DescendantTree> {
    const { data } = await apiClient.get<DescendantTree>(
      `/graph/descendants/${personId}`,
      { params: { max_depth: maxDepth } },
    );
    return data;
  },

  async findPath(fromId: string, toId: string): Promise<RelationshipPath> {
    const { data } = await apiClient.get<RelationshipPath>('/graph/path', {
      params: { from: fromId, to: toId },
    });
    return data;
  },
};
