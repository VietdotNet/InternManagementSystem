import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/components/ui/toaster";
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

import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { AuthProvider } from "@/shared/context/AuthContext";

const queryClient = new QueryClient();

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/programs/create" component={CreateProgramPage} />
        <Route path="/programs" component={TrainingProgramsPage} />
        <Route path="/users/create" component={CreateUserPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/statistics" component={StatisticsPage} />
      </Switch>
    </AdminLayout>
  );
}

function InternRoutes() {
  return (
    <InternLayout>
      <Switch>
        <Route path="/intern" component={InternDashboardPage} />
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/reviews" component={ReviewDetailPage} />
        <Route path="/review/:id" component={ReviewDetailPage} />

        <Route component={InternDashboardPage} />
      </Switch>
    </InternLayout>
  );
}

function Router() {
  return (
     <Switch>
      <Route path="/login" component={LoginPage} />

       {/* Admin */}
      <ProtectedRoute path="/dashboard" component={AdminRoutes} roles={["Admin"]} />
      <ProtectedRoute path="/programs" component={AdminRoutes} roles={["Admin"]} />
      <ProtectedRoute path="/programs/create" component={AdminRoutes} roles={["Admin"]} />
      <ProtectedRoute path="/users" component={AdminRoutes} roles={["Admin"]} />
      <ProtectedRoute path="/users/create" component={AdminRoutes} roles={["Admin"]} />
      <ProtectedRoute path="/statistics" component={AdminRoutes} roles={["Admin"]}/>

      <ProtectedRoute path="/intern" component={InternRoutes} roles={["Intern"]} />
      <ProtectedRoute path="/roadmap" component={InternRoutes} roles={["Intern"]} />
      <ProtectedRoute path="/reviews" component={InternRoutes} roles={["Intern"]} />
      <ProtectedRoute path="/review/:id" component={InternRoutes} roles={["Intern"]}/>

      {/* Default fallback */}
      <Route path="/" component={LoginPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;