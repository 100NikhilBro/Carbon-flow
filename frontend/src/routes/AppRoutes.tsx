import {

  Routes,
  Route,

} from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/Login";

import DashPage from "../pages/DashPage";

import RecordPage from "../pages/RecordPage";

import UploadPage from "../pages/UploadPage";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route

        path="/dashboard"

        element={

          <ProtectedRoute>

            <DashPage />

          </ProtectedRoute>
        }
      />

      <Route

        path="/records"

        element={

          <ProtectedRoute>

            <RecordPage />

          </ProtectedRoute>
        }
      />

      <Route

        path="/upload"

        element={

          <ProtectedRoute>

            <UploadPage />

          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;