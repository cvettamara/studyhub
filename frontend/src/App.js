"import \"@/App.css\";
import { BrowserRouter, Routes, Route, Navigate } from \"react-router-dom\";
import { Toaster } from \"sonner\";
import { AuthProvider } from \"./context/AuthContext\";
import ProtectedRoute from \"./components/ProtectedRoute\";
import Navbar from \"./components/Navbar\";
import Login from \"./pages/Login\";
import Register from \"./pages/Register\";
import Map from \"./pages/Map\";
import Marketplace from \"./pages/Marketplace\";
import Forum from \"./pages/Forum\";
import Events from \"./pages/Events\";

function App() {
  return (
    <AuthProvider>
      <div className=\"App min-h-screen bg-slate-50\">
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path=\"/login\" element={<Login />} />
            <Route path=\"/register\" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path=\"/map\"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />
            <Route
              path=\"/marketplace\"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path=\"/forum\"
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              }
            />
            <Route
              path=\"/events\"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path=\"/\" element={<Navigate to=\"/map\" replace />} />
            <Route path=\"*\" element={<Navigate to=\"/map\" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position=\"top-right\" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              borderRadius: '16px',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
"