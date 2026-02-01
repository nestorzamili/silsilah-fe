export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  person_id?: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  display_name?: string;
  profile_picture_url?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AssignRoleInput {
  user_id: string;
  role: string;
}

export type UserRole = 'member' | 'editor' | 'developer';

export interface RoleUsers {
  member: User[];
  editor: User[];
  developer: User[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'CHANGE_REQUEST' | 'CHANGE_APPROVED' | 'CHANGE_REJECTED' | 'NEW_COMMENT' | 'PERSON_ADDED' | 'RELATIONSHIP_ADDED';
  title: string;
  message: string;
  data?: {
    change_request_id?: string;
    entity_type?: 'PERSON' | 'RELATIONSHIP' | 'MEDIA';
    entity_id?: string;
    comment_id?: string;
    person_id?: string;
    relationship_id?: string;
  };
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  display_name?: string;
  role?: string;
}

export interface UpdateUserInput {
  full_name?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
  person_id?: string | null;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface Person {
  id: string;
  first_name: string;
  last_name?: string;
  nickname?: string;
  gender: Gender;
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  bio?: string;
  avatar_url?: string;
  occupation?: string;
  religion?: string;
  nationality?: string;
  education?: string;
  phone?: string;
  email?: string;
  address?: string;
  is_alive: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  profile_picture_url?: string;
}

export type ParentRole = 'FATHER' | 'MOTHER';

export interface ParentInfo {
  person: Person;
  role: ParentRole | string;
}

export interface SpouseInfo {
  person: Person;
  is_consanguineous: boolean;
  marriage_date?: string;
}

export type SiblingType = 'FULL' | 'HALF';

export interface SiblingInfo {
  person: Person;
  sibling_type: SiblingType;
}

export interface RelationshipInfo {
  id: string;
  type: string;
  role?: string;
  related_person?: Person;
  metadata?: Record<string, unknown>;
}

export interface PersonWithRelationships extends Person {
  parents: ParentInfo[];
  spouses: SpouseInfo[];
  children: Person[];
  siblings: SiblingInfo[];
  relationships?: RelationshipInfo[];
}

export interface CreatePersonInput {
  first_name: string;
  last_name?: string;
  nickname?: string;
  gender?: Gender;
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  bio?: string;
  avatar_url?: string;
  occupation?: string;
  religion?: string;
  nationality?: string;
  education?: string;
  phone?: string;
  email?: string;
  address?: string;
  is_alive?: boolean;
}

export interface UpdatePersonInput {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  gender?: Gender;
  birth_date?: string;
  birth_place?: string;
  death_date?: string;
  death_place?: string;
  bio?: string;
  avatar_url?: string;
  occupation?: string;
  religion?: string;
  nationality?: string;
  education?: string;
  phone?: string;
  email?: string;
  address?: string;
  is_alive?: boolean;
}

export type RelationshipType = 'PARENT' | 'SPOUSE';

export interface ParentMetadata {
  role: ParentRole;
}

export interface SpouseMetadata {
  marriage_date?: string;
  marriage_place?: string;
  divorce_date?: string;
  is_consanguineous?: boolean;
  consanguinity_degree?: number;
  common_ancestors?: string[];
}

export type RelationshipMetadata = ParentMetadata | SpouseMetadata;

export interface Relationship {
  id: string;
  person_a: string;
  person_b: string;
  type: RelationshipType;
  metadata?: RelationshipMetadata;
  spouse_order?: number;
  child_order?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  person_a_data?: Person;
  person_b_data?: Person;
}

export interface CreateRelationshipInput {
  person_a: string;
  person_b: string;
  type: RelationshipType;
  metadata?: RelationshipMetadata;
  spouse_order?: number;
  child_order?: number;
}

export interface UpdateRelationshipInput {
  metadata?: RelationshipMetadata;
  spouse_order?: number;
  child_order?: number;
}

export interface GraphNode {
  id: string;
  first_name: string;
  last_name?: string;
  gender: Gender;
  avatar_url?: string;
  is_alive: boolean;
  birth_date?: string;
  death_date?: string;
  birth_year?: number;
  death_year?: number;
  generation?: number;
  x?: number;
  y?: number;
  full_name?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  is_consanguineous?: boolean;
  spouse_order?: number;
  child_order?: number;
  metadata?: SpouseMetadata;
}

export interface GraphStats {
  total_persons: number;
  total_relationships: number;
  max_generation: number;
  living_persons: number;
  deceased_persons: number;
}

export interface FamilyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats?: GraphStats;
}

export interface AncestorTree {
  root_person: string;
  ancestors: GraphNode[];
  edges: GraphEdge[];
  max_depth: number;
}

export interface SplitAncestorTree {
  paternal?: AncestorTree;
  maternal?: AncestorTree;
}

export interface DescendantTree {
  root_person: string;
  descendants: GraphNode[];
  edges: GraphEdge[];
  max_depth: number;
}

export interface RelationshipPath {
  from_person: string;
  to_person: string;
  path: string[];
  relationship: string;
  description: string;
  degree: number;
}

export interface Media {
  id: string;
  person_id?: string;
  uploaded_by: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  url: string;
  caption?: string;
  created_at: string;
}

export interface UploadMediaInput {
  person_id?: string;
  caption?: string;
  file: File;
}

export interface CommentUser {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface Comment {
  id: string;
  person_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: CommentUser;
}

export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ChangeAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'PERSON' | 'RELATIONSHIP' | 'MEDIA';

export interface ChangeRequest {
  id: string;
  requested_by: string;
  entity_type: EntityType;
  entity_id?: string;
  action: ChangeAction;
  payload: Record<string, unknown>;
  requester_note?: string;
  status: RequestStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
  created_at: string;
  requester?: User;
  reviewer?: User;
}

export interface CreateChangeRequestInput {
  entity_type: EntityType;
  entity_id?: string;
  action: ChangeAction;
  payload: Record<string, unknown>;
  requester_note?: string;
}

export interface ReviewChangeRequestInput {
  note?: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  pagination?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  trace_id?: string;
}

export interface SelectedRelationship {
  person: Person;
  type: RelationshipType;
  parentRole?: 'FATHER' | 'MOTHER';
  marriageDate?: string;
  marriagePlace?: string;
  spouseOrder?: number;
  childOrder?: number;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface AssignRoleInput {
  user_id: string;
  role: string;
}

export interface RoleUsers {
  member: User[];
  editor: User[];
  developer: User[];
}
