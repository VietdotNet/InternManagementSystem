import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import LoginPage from "@/features/auth/pages/LoginPage";
import AdminLayout from "@/shared/components/AdminLayout";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import TrainingProgramsPage from "@/features/training-programs/pages/TrainingProgramsPage";
import CreateProgramPage from "@/features/training-programs/pages/CreateProgramPage";
import UsersPage from "@/features/users/pages/UsersPage";
import CreateUserPage from "@/features/users/pages/CreateUserPage";
import StatisticsPage from "@/features/statistics/pages/StatisticsPage";

import  InternLayout  from "@/shared/components/InternLayout";
import InternDashboardPage from "@/features/interns/dashboard/pages/InternDashboardPage";
import  RoadmapPage  from "@/features/interns/roadmap/pages/RoadmapPage";
import  ReviewDetailPage  from "@/features/interns/review-detail/pages/ReviewDetailPage";

import MentorLayout from '@/shared/components/MentorLayout';
import ProgramsListPage from '@/features/mentor/programs/pages/ProgramsListPage';
import ProgramDetailPage from '@/features/mentor/program-detail/pages/ProgramDetailPage';

import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { AuthProvider } from "@/shared/context/AuthContext";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const queryClient = new QueryClient();

function AppRouter() {
 return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute roles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/programs" element={<TrainingProgramsPage />} />
        <Route path="/programs/create" element={<CreateProgramPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/create" element={<CreateUserPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Route>

       {/* Mentor */}
      <Route
        element={
          <ProtectedRoute roles={["Mentor"]}>
            <MentorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/mentor/programs" element={<ProgramsListPage />} />
        <Route path="/mentor/programs/:id" element={<ProgramDetailPage />} />
      </Route>

      {/* Intern */}
      <Route
        element={
          <ProtectedRoute roles={["Intern"]}>
            <InternLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/intern" element={<InternDashboardPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/reviews" element={<ReviewDetailPage />} />
        <Route path="/review/:id" element={<ProgramDetailPage />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
             <Toaster
              position="top-right"
              containerStyle={{ zIndex: 9999 }}
            />
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;