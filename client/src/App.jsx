import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/auth/index';
import RouteGuard from './components/route-guard/index';
import { useContext } from 'react';
import StudentHomePage from './pages/student/home/index';
import { AuthContext } from './context/auth-context'; 
import InstructorDashboardpage from './pages/instructor/index';
import StudentViewCommonLayout from './components/student-view/common-layout';

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticated} // Ensure consistency
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticated} // Corrected here
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticated} // Corrected here
            user={auth?.user}
          />
        }
      />
      <Route path="" element={<StudentHomePage />} />
      <Route path="home" element={<StudentHomePage />} />
    </Routes>
  );
}

export default App;
