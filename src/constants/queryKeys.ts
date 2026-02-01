export const QUERY_KEYS = {
  USER_PROFILE: ['user-profile'],
  PERSONS: {
    LIST: (page: number, pageSize: number) => ['persons', 'list', { page, pageSize }],
    SEARCH: (query: string) => ['persons', 'search', query],
    DETAIL: (id: string) => ['person', id],
  },
  GRAPH: ['graph'],
  USERS: ['users'],
  RELATIONSHIPS: {
    DETAIL: (id: string) => ['relationship', id],
  },
  MEDIA: {
    LIST: (personId?: string) => ['media', personId ? { person_id: personId } : 'all'],
  },
  COMMENTS: {
    LIST: (personId: string) => ['comments', personId],
  },
  CHANGE_REQUESTS: {
    LIST: (status?: string) => ['change-requests', status ? { status } : 'all'],
    DETAIL: (id: string) => ['change-request', id],
  },
} as const;