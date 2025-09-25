import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import FirstRow from './components/FirstRow';
import RunningTimeChart from './components/RunningTimeChart';
import Availability from './components/Availability';
import Quality from './components/Quality';
import QualityForm from './components/QualityForm';
import ReportDownloadPage from './components/Reports'; // Fixed import name and path
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
        <Router>
          <div className="h-screen bg-white">
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
            <Route path="/dashboard" element={
              <div>
                <Header />
                <div className="min-h-[calc(100vh-64px)] p-2">
                  <FirstRow />
                  <div className="mt-2">
                    <RunningTimeChart />
                  </div>
                </div>
              </div>
            }  />
            
            <Route path="/" element={<LoginPage />}/>
            
            {/* Protected Routes */}
            <Route path="/reports" element={
              
                <div>
                  <Header />
                  <div className="min-h-[calc(100vh-64px)] p-2">
                    <ReportDownloadPage />
                  </div>
                </div>
             
            } />
            
            <Route path="/availability" element={
              <ProtectedRoute>
                <div>
                  <Header />
                  <div className="min-h-[calc(100vh-64px)] p-2">
                    <Availability />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/quality" element={
              <ProtectedRoute>
                <div>
                  <Header />
                  <div className="min-h-[calc(100vh-64px)] p-2">
                    <Quality />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/form" element={
              <ProtectedRoute>
                <div>
                  <Header />
                  <div className="min-h-[calc(100vh-64px)] p-2">
                    <QualityForm />
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;