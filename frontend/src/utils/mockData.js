export const kpis = [
  { label: 'Active Projects', value: '18', trend: '+12%' },
  { label: 'Tasks Completed', value: '264', trend: '+8%' },
  { label: 'Team Velocity', value: '91', trend: '+5%' },
  { label: 'On-time Delivery', value: '97%', trend: '+2%' },
];

export const chartPoints = [52, 67, 59, 73, 80, 74, 90];

export const tasks = [
  { id: 'TK-122', title: 'Refine sprint roadmap', status: 'In Progress', priority: 'High', assignee: 'Ava' },
  { id: 'TK-143', title: 'Audit payment workflow', status: 'Review', priority: 'Medium', assignee: 'Ethan' },
  { id: 'TK-156', title: 'Accessibility improvements', status: 'Todo', priority: 'Low', assignee: 'Liam' },
];

export const kanbanColumns = {
  todo: [
    { id: '1', title: 'Define API schema' },
    { id: '2', title: 'Draft admin reports' },
  ],
  progress: [
    { id: '3', title: 'Create onboarding flow' },
  ],
  done: [
    { id: '4', title: 'Ship profile page v2' },
  ],
};
