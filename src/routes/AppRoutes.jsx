import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Files from '../pages/Files/Files';
import FileUploadPage from '../pages/Files/FileUploadPage';
import FileDetails from '../pages/FileDetails/FileDetails';
import Incidents from '../pages/Incidents/Incidents';
import IncidentDetails from '../pages/IncidentDetails/IncidentDetails';
import ProcessingJobs from '../pages/ProcessingJobs/ProcessingJobs';
import Operations from '../pages/Operations/Operations';
import DeadLetterQueue from '../pages/DeadLetterQueue/DeadLetterQueue';
import AuditLogs from '../pages/AuditLogs/AuditLogs';
import Reports from '../pages/Reports/Reports';
import Settings from '../pages/Settings/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="files" element={<Files />} />
        <Route path="files/upload" element={<FileUploadPage />} />
        <Route path="files/:id" element={<FileDetails />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="incidents/:id" element={<IncidentDetails />} />
        <Route path="jobs" element={<ProcessingJobs />} />
        <Route path="operations" element={<Operations />} />
        <Route path="dlq" element={<DeadLetterQueue />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
