import type { GraphNode } from '@/types';
import {
  MIN_NODE_WIDTH,
  MAX_NODE_WIDTH,
  CHAR_WIDTH,
  BASE_TEXT_OFFSET,
} from './constants';

export function getFullName(node: GraphNode): string {
  if (node.full_name) return node.full_name;
  return node.last_name
    ? `${node.first_name} ${node.last_name}`
    : node.first_name;
}

export function getBirthYear(node: GraphNode): number | undefined {
  if (node.birth_year) return node.birth_year;
  if (node.birth_date) return new Date(node.birth_date).getFullYear();
  return undefined;
}

export function calculateNodeWidth(node: GraphNode): number {
  const fullName = getFullName(node);
  const textWidth = fullName.length * CHAR_WIDTH + BASE_TEXT_OFFSET + 20;
  return Math.max(MIN_NODE_WIDTH, Math.min(MAX_NODE_WIDTH, textWidth));
}

export function getGenderColors(gender: string | undefined) {
  const strokeColor =
    gender === 'MALE' ? '#3b82f6' : gender === 'FEMALE' ? '#ec4899' : '#94a3b8';

  const fillColor =
    gender === 'MALE' ? '#eff6ff' : gender === 'FEMALE' ? '#fdf2f8' : '#f8fafc';

  const avatarFill =
    gender === 'MALE' ? '#dbeafe' : gender === 'FEMALE' ? '#fce7f3' : '#f1f5f9';

  const textColor =
    gender === 'MALE' ? '#3b82f6' : gender === 'FEMALE' ? '#ec4899' : '#64748b';

  return { strokeColor, fillColor, avatarFill, textColor };
}

export function getStatusText(node: GraphNode): string {
  const birthYear = getBirthYear(node);
  if (birthYear) {
    return node.is_alive ? `${birthYear} - Sekarang` : `${birthYear} - Wafat`;
  }
  return node.is_alive ? 'Hidup' : 'Meninggal';
}
