// import { createBrowserRouter } from "react-router";
// import Login from "./features/auth/pages/Login";
// import Register from "./features/auth/pages/Register";
// import Protected from "./features/auth/components/Protected";
// import Home from "./features/interview/pages/Home";
// import Interview from "./features/interview/pages/Interview";

// export const router = createBrowserRouter([
//     {
//         path: "/login",
//         element: <Login />
//     },
//     {
//         path: "/register",
//         element: <Register />
//     },
//     {
//         path: "/",
//         element: <Protected><Home /></Protected>
//     },
//     {
//         path:"/interview/:interviewId",
//         element: <Protected><Interview /></Protected>
//     }
// ])

import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";

import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import MyPlans from "./pages/MyPlans";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/app",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/settings",
    element: (
      <Protected>
        <Settings />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
  {
    path: "/plans",
    element: (
      <Protected>
        <MyPlans />
      </Protected>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
