import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { UserLayout } from "@/components/layout/UserLayout";
import { ROUTERS } from "@/constant";
import AdminDashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home as VocabularyHome } from "@/pages/vocabulary/Home";
import { DayView } from "@/pages/vocabulary/DayView";
import { Review } from "@/pages/vocabulary/Review";
import { Quiz } from "@/pages/vocabulary/Quiz";
import { QuizSetup } from "@/pages/vocabulary/QuizSetup";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useUserStore();
  const user = true;
  return user ? <>{children}</> : <Navigate to={ROUTERS.LOGIN} />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useUserStore();
  const user = { role: "ADMIN" };
  return user?.role === "ADMIN" ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTERS.HOME} />
  );
};

const Router = () => {
  return (
    <Routes>
      {/* Default routes */}
      <Route element={<DefaultLayout />}>
        <Route path={ROUTERS.HOME} element={<Home />} />

        {/* Vocabulary routes */}
        <Route path="/vocabulary" element={<VocabularyHome />} />
        <Route path="/vocabulary/day/:day" element={<DayView />} />
        <Route path="/vocabulary/review" element={<Review />} />
        <Route path="/vocabulary/flashcard" element={<VocabularyHome />} />
        <Route path="/vocabulary/quiz" element={<Quiz />} />
        <Route path="/vocabulary/quiz-setup" element={<QuizSetup />} />
        <Route path="/vocabulary/quiz/:day" element={<VocabularyHome />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTERS.LOGIN} element={<Login />} />
        <Route path={ROUTERS.REGISTER} element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </PrivateRoute>
        }
      >
        <Route path={ROUTERS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
      </Route>

      {/* User routes */}
      <Route element={<UserLayout />}>
        {/* Public route */}

        {/* Protected user routes */}
        <Route
          element={
            <PrivateRoute>
              <Route path={ROUTERS.USER_PROFILE} element={<Home />} />
              <Route path={ROUTERS.USER_SETTINGS} element={<Home />} />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Redirect to home if route not found */}
      <Route path="*" element={<Navigate to={ROUTERS.HOME} />} />
    </Routes>
  );
};

export default Router;
