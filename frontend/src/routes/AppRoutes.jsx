import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { USER_ROLES } from '../utils/constants';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import MemberDashboardPage from '../pages/MemberDashboardPage';
import ProjectsPage from '../pages/ProjectsPage';
import TasksPage from '../pages/TasksPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />

    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MEMBER]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.MEMBER]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="/member" element={<MemberDashboardPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
