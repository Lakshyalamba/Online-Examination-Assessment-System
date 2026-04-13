export const routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  adminDashboard: "/dashboard/admin",
  examinerDashboard: "/dashboard/examiner",
  studentDashboard: "/dashboard/student",
} as const;

export const publicRoutes = [routes.home, routes.login] as const;
