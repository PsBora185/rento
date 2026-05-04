import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


// Pages
import AuthPage from "../pages/auth/AuthPage";
import Home from "../pages/home/Home";
import Rooms from "../pages/rooms/Rooms";
import RoomDetails from "../pages/rooms/RoomDetails";
import Profile from "../pages/profile/Profile";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import MyRooms from "../pages/owner/MyRooms";
import AddRoomEnhanced from "../pages/owner/AddRoomEnhanced";
import EditRoomEnhanced from "../pages/owner/EditRoomEnhanced";
import ChatPage from "../pages/ChatPage";
import ChatListPage from "../pages/ChatListPage";
import ChatRequestsPage from "../pages/ChatRequestsPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import UserDashboard from "../pages/UserDashboard";

// Route Guards
import PrivateRoute from "../components/PrivateRoute";
import RoleRoute from "./RoleRoute";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const { isAuthenticated, needsRoleSelection } = useAuth();
  const location = useLocation();



  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            // If the user is authenticated but still needs role selection, route them there
            // otherwise proceed to rooms as usual
            needsRoleSelection ? (
              <Navigate to="/select-role" replace />
            ) : (
              <Navigate to="/rooms" replace />
            )
          ) : (
            <AuthPage />
          )
        }
      />

      {/* ✅ ROLE SELECTION - PUBLIC (After Signup) */}
      <Route path="/select-role" element={<RoleSelectionPage />} />

      {/* Protected Routes - Renter/Common */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Rooms />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <RoomDetails />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Protected Routes - Owner Only */}
      <Route
        path="/owner/dashboard"
        element={
          <RoleRoute allowedRole="OWNER">
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/owner/my-rooms"
        element={
          <RoleRoute allowedRole="OWNER">
            <DashboardLayout>
              <MyRooms />
            </DashboardLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/owner/add-room"
        element={
          <RoleRoute allowedRole="OWNER">
            <DashboardLayout>
              <AddRoomEnhanced />
            </DashboardLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/owner/edit-room/:id"
        element={
          <RoleRoute allowedRole="OWNER">
            <DashboardLayout>
              <EditRoomEnhanced />
            </DashboardLayout>
          </RoleRoute>
        }
      />

      {/* Chat Routes */}
      <Route
        path="/chat-requests"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ChatRequestsPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ChatListPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:conversationId"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ChatPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* 404 - Must be last */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;