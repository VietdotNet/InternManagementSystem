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

import { InternLayout } from "@/shared/components/InternLayout";
import {InternDashboardPage} from "@/features/interns/dashboard/pages/InternDashboardPage";
import { RoadmapPage } from "@/features/interns/roadmap/pages/RoadmapPage";
import { ReviewsPage } from "@/features/interns/reviews/pages/ReviewsPage";
import { ReviewDetailPage } from "@/features/interns/review-detail/pages/ReviewDetailPage";

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
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/reviews" component={ReviewsPage} />
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

      <Route path="/dashboard" component={AdminRoutes} />
      <Route path="/programs" component={AdminRoutes} />
      <Route path="/programs/create" component={AdminRoutes} />
      <Route path="/users" component={AdminRoutes} />
      <Route path="/users/create" component={AdminRoutes} />
      <Route path="/statistics" component={AdminRoutes} />

      {/* <Route path="/" component={InternRoutes} /> */}
      <Route path="/roadmap" component={InternRoutes} />
      <Route path="/reviews" component={InternRoutes} />
      <Route path="/review/:id" component={InternRoutes} />

      {/* Default fallback */}
      <Route component={LoginPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;