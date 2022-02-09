// import { Navigate, useRoutes } from 'react-router-dom';
import { BrowserRouter as Router, useRoutes, Navigate } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardApp from "./pages/DashboardApp";
import User from "./pages/User";
import Student from "./pages/Student";
import StudentForm from "./masters/student/StudentForm";
import Exam from "./pages/Exam";
import ExamPaper from "./pages/ExamPaper";
import ExamResult from "./pages/ExamResult";
import Question from "./pages/Question";
import ExamAccess from "./pages/ExamAccess";
import ExamPracticeList from "./pages/ExamPracticeList";
import ExamPaperPractice from "./pages/ExamPaperPractice";
import Subject from "./pages/Subject";
import Course from "./pages/Course";

import LoginStudent from "./pages/LoginStudent";
import NotFound from "./pages/Page404";

import { getUserName } from "./utils/Common";
import PrivateRoute from "./utils/PrivateRoute";
// ----------------------------------------------------------------------
import ScrollToTop from "./components/ScrollToTop";

const AppWrapper = () => {
  let isUserAuthenticated = !!getUserName() ? true : false;
  return useRoutes([
    {
      path: "/",
      element: isUserAuthenticated ? (
        <Navigate replace to="/dashboard" />
      ) : (
        <Navigate replace to="/login" />
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: <DashboardApp /> },
        { path: "user", element: <User /> },
        { path: "student", element: <Student /> },
        { path: "student/form", element: <StudentForm /> },
        { path: "exam", element: <Exam /> },
        { path: "exam/questions", element: <Question /> },
        { path: "exam/access", element: <ExamAccess /> },
        { path: "exam/result", element: <ExamResult /> },
        { path: "subject", element: <Subject /> },
        { path: "course", element: <Course /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "studentLogin", element: <LoginStudent /> },
        { path: "examPaper", element: <ExamPaper /> },
        { path: "practiceExamList", element: <ExamPracticeList /> },
        { path: "practiceExamPaper", element: <ExamPaperPractice /> },
        { path: "register", element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
};

export default function Routes() {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
}
