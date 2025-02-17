import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import FirstRow from './components/FirstRow';
import RunningTimeChart from './components/RunningTimeChart';
import Availability from './components/Availability';
import Quality from './components/Quality';
import QualityForm from './components/QualityForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="h-screen bg-white">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              
                <div>
                  <Header />
                  <div className="min-h-[calc(100vh-64px)] p-2">
                    <FirstRow />
                    <div className="mt-2">
                      <RunningTimeChart />
                    </div>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;