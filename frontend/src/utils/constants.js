export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

export const APP_NAME = 'FlowForge';

export const NAV_LINKS = [
  { label: 'Admin Dashboard', path: '/admin', roles: [USER_ROLES.ADMIN] },
  { label: 'Member Dashboard', path: '/member', roles: [USER_ROLES.MEMBER] },
  { label: 'Projects', path: '/projects', roles: [USER_ROLES.ADMIN, USER_ROLES.MEMBER] },
  { label: 'Tasks', path: '/tasks', roles: [USER_ROLES.ADMIN, USER_ROLES.MEMBER] },
  { label: 'Profile', path: '/profile', roles: [USER_ROLES.ADMIN, USER_ROLES.MEMBER] },
  { label: 'Settings', path: '/settings', roles: [USER_ROLES.ADMIN, USER_ROLES.MEMBER] },
];

export const ROLE_WORKFLOWS = {
  [USER_ROLES.ADMIN]: [
    'Manage all projects and tasks',
    'Assign work to members',
    'Review analytics and team health',
    'Access every dashboard route',
  ],
  [USER_ROLES.MEMBER]: [
    'Open the member dashboard',
    'See assigned projects and tasks',
    'Update task status only on owned tasks',
    'Manage profile and settings',
  ],
};
