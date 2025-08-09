import React from 'react';
import { FirebaseAuthProvider, useFirebaseAuth } from './context/FirebaseAuthContext';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import FirebaseMigration from './components/FirebaseMigration';

const AppContent: React.FC = () => {
  const { user, isLoading } = useFirebaseAuth();
  const [showMigration, setShowMigration] = React.useState(false);

  React.useEffect(() => {
    // Check if there's existing local data to migrate
    const localData = localStorage.getItem('isaacLabData');
    if (localData && !user) {
      setShowMigration(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peacock-500"></div>
      </div>
    );
  }

  if (showMigration) {
    return <FirebaseMigration />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      {user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
};

function App() {
  return (
    <FirebaseAuthProvider>
      <AppContent />
    </FirebaseAuthProvider>
  );
}

export default App;