import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import FirstRow from './components/FirstRow';
import RunningTimeChart from './components/RunningTimeChart';
import Availability from './components/Availability';
import Quality from './components/Quality';
import QualityForm from './components/QualityForm';
import ReportDownloadPage from './components/Reports'; // Fixed import name and path
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F7F9FC]">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            <Route path="/dashboard" element={
              <Layout>
                <FirstRow />
                <div className="mt-2">
                  <RunningTimeChart />
                </div>
              </Layout>
            } />
            
            {/* Protected Routes */}
            <Route path="/reports" element={
              <Layout>
                <ReportDownloadPage />
              </Layout>
            } />
            
            <Route path="/availability" element={
              <ProtectedRoute>
                <Layout>
                  <Availability />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/quality" element={
              <ProtectedRoute>
                <Layout>
                  <Quality />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/form" element={
              <ProtectedRoute>
                <Layout>
                  <QualityForm />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;