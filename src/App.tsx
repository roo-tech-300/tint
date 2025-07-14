import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import PostDetailPage from './pages/PostDetailPage'
import ProfilePage from './pages/ProfilePage'
import NotFound from './pages/NotFound'
import CreateCommunityPost from './pages/CreateCommunityPost'

import PrivateRoute from './components/common/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'
import OnboardingPage from './pages/OnboardingPage'
import CommunityPage from './pages/CommunityPage'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />

          {/* 🔐 Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} index />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/create" element={<CreateCommunityPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/communities/create/post" element={<CreateCommunityPost />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
