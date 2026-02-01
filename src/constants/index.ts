export const TREE_LAYOUT = {
  NODE_WIDTH: 180,
  NODE_HEIGHT: 90,
  VERTICAL_GAP: 140,
  HORIZONTAL_GAP: 60,
  SPOUSE_GAP: 20,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/',
  TREE: '/tree',
  PERSONS: '/persons',
  PERSON_NEW: '/persons/new',
  PERSON_DETAIL: '/persons/:id',
  PERSON_EDIT: '/persons/:id/edit',
} as const;

export const DATE_LOCALE = 'id-ID';

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
