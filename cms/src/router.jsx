import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import ServicesPage from "./pages/services/ServicesPage";
import ServiceCreatePage from "./pages/services/ServiceCreatePage";
import ServiceViewPage from "./pages/services/ServiceViewPage";
import ServiceEditPage from "./pages/services/ServiceEditPage";
import TreatmentsPage from "./pages/treament/TreatmentsPage";
import FAQPage from "./pages/faq/FAQPage";
import FAQCreatePage from "./pages/faq/FAQCreatePage";
import FAQViewPage from "./pages/faq/FAQViewPage";
import FAQEditPage from "./pages/faq/FAQEditPage";
import GalleryPage from "./pages/gallery/GalleryPage";
import GalleryCreatePage from "./pages/gallery/GalleryCreatePage";
import GalleryViewPage from "./pages/gallery/GalleryViewPage";
import GalleryEditPage from "./pages/gallery/GalleryEditPage";
import MessagesPage from "./pages/messages/MessagesPage";
import MessageViewPage from "./pages/messages/MessageViewPage";

function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

// Placeholder pages for sidebar routes
function DoctorsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">اطلاعات پزشکان</h1>
      <p className="text-gray-500 mt-2">مدیریت اطلاعات پزشکان</p>
    </div>
  );
}
function CommentsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">نظرات بیماران</h1>
      <p className="text-gray-500 mt-2">مدیریت نظرات بیماران</p>
    </div>
  );
}
function ContactPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">اطلاعات تماس کلینیک</h1>
      <p className="text-gray-500 mt-2">مدیریت اطلاعات تماس</p>
    </div>
  );
}
function PatientsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">لیست بیماران</h1>
      <p className="text-gray-500 mt-2">مدیریت لیست بیماران</p>
    </div>
  );
}
function SchedulingPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">نوبت‌دهی</h1>
      <p className="text-gray-500 mt-2">مدیریت نوبت‌دهی</p>
    </div>
  );
}
function ProfilePage() {
  return (
    <div>
      <h1 className="text-xl font-bold">پروفایل</h1>
      <p className="text-gray-500 mt-2">مدیریت پروفایل کاربری</p>
    </div>
  );
}
function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">تنظیمات حساب</h1>
      <p className="text-gray-500 mt-2">تنظیمات حساب کاربری</p>
    </div>
  );
}

export default function AppRouter() {
  const { token, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token && user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="gallery/create" element={<GalleryCreatePage />} />
        <Route path="gallery/:id" element={<GalleryViewPage />} />
        <Route path="gallery/:id/edit" element={<GalleryEditPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/create" element={<ServiceCreatePage />} />
        <Route path="services/:id" element={<ServiceViewPage />} />
        <Route path="services/:id/edit" element={<ServiceEditPage />} />
        <Route path="treatments" element={<TreatmentsPage />} />
        <Route path="comments" element={<CommentsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:id" element={<MessageViewPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="faq/create" element={<FAQCreatePage />} />
        <Route path="faq/:id" element={<FAQViewPage />} />
        <Route path="faq/:id/edit" element={<FAQEditPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="scheduling" element={<SchedulingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
