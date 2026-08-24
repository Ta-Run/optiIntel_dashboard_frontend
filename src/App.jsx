import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
