import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home"
import Properties from "./pages/Properties"
import InvestorDashboard from "./pages/InvestorDashboard"
import {SignupForm} from "./pages/SignupForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import {VerifyEmail} from "./pages/VerifyEmail";
import ChangePassword from "./pages/ChangePassword";
import {LoginForm} from "./pages/LoginForm";
import DashboardLayout from "./layout/DashboardLayout"
import Interest from "./pages/dashboard/Interest";
import UploadProperties from "./pages/dashboard/UploadProperties";
import UserManagement from "./pages/dashboard/UserManagement";
import AdminProperties from "./pages/dashboard/AdminProperties";
import {InterestPage} from './pages/InterestPage'
import {ProtectedRoutes} from '../src/util/ProtectedRoutes'
import { DashboardProvider } from "./context/dashboard.context";
import PropertyInterest from "./pages/PropertyInterest"
import InterestSuccess from "./pages/InterestSuccess"
import ComingSoonPage from "./pages/ComingSoonPage"
import UserProfilePage from "./pages/user/UserProfilePage"
import PropertyDetails from "./pages/PropertyDetails"
import Updates from "./pages/Updates"
import UpdateDetail from "./pages/UpdateDetail"
import AdminUpdates from "./pages/dashboard/AdminUpdates"
import AssignInvestment from "./pages/dashboard/AssignInvestment"
import UserDetails from "./pages/dashboard/UserDetails"


function App() {
// const {user} = useAuth();
// const allowedrole = user?.role;
// console.log(allowedrole);

  const router = createBrowserRouter([
  // 🌍 PUBLIC ROUTES
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/properties/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/properties/:id/interest",
    element: <PropertyInterest />, // guarded internally
  },
  {
    path: "/updates",
    element: <Updates />,
  },
  {
    path: "/updates/:id",
    element: <UpdateDetail />,
  },
  {
    path: "/partnership",
    element: <ComingSoonPage />,
  },
  {
    path: "/interest-success",
    element: <InterestSuccess />, // guarded by navigation state
  },

 


  // 🔐 AUTH ROUTES
  { path: "/signup", element: <SignupForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/verify_email", element: <VerifyEmail /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/changepassword", element: <ChangePassword /> },


  // 👤 INVESTOR ROUTES
  {
    element: <ProtectedRoutes allowedRole="INVESTOR" />,
    children: [
      { path: "/investor/dashboard", element: <InvestorDashboard /> },
      { path: "/investor/interest", element: <InterestPage /> },
      { path: "/portfolio", element: <InvestorDashboard /> },
    ],
  },

  // 👤 AUTHENTICATED USER ROUTES
  {
    element: <ProtectedRoutes />,
    children: [
      { path: "/profile", element: <UserProfilePage /> },
    ],
  },

  // 🛠 ADMIN ROUTES
  {
    element: <ProtectedRoutes allowedRole="ADMIN" />,
    children: [
      {
        path: "/admindashboard",
        element: (
          <DashboardProvider>
            <DashboardLayout />
          </DashboardProvider>
        ),
        children: [
          { index: true, element: <Interest /> },
          { path: "uploadproperties", element: <UploadProperties /> },
          { path: "properties", element: <AdminProperties /> },
          { path: "updates", element: <AdminUpdates /> },
          { path: "user_management", element: <UserManagement /> },
          { path: "assign-investment", element: <AssignInvestment /> },
          { path: "users/:id", element: <UserDetails /> },

        ],
      },
    ],
  },


]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
