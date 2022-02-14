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

import { getUserName, getUserTypeId } from "./utils/Common";
import { PrivateRouteUser, PrivateRouteStudent } from "./utils/PrivateRoute";
// ----------------------------------------------------------------------
import ScrollToTop from "./components/ScrollToTop";

const AppWrapper = () => {
  let isUserAuthenticated, authenticatedUserType;
  if (getUserName() != null) {
    isUserAuthenticated = true;
    authenticatedUserType = getUserTypeId() === 3 ? "student" : "user";
  } else {
    isUserAuthenticated = false;
  }

  return useRoutes([
    {
      path: "/",
      element:
        getUserTypeId() === null ? (
          <Navigate replace to="/login" />
          ) : (
            getUserTypeId()===3 ?
          <Navigate replace to="/examPaper" />:
          <Navigate replace to="/dashboard" />
        ),
    },
    {
      path: "/",
      element:
        isUserAuthenticated && authenticatedUserType === "st" ? (
          <Navigate replace to="/dashboard" />
        ) : (
          <Navigate replace to="/login" />
        ),
    },
    {
      path: "/",
      element: (
        <PrivateRouteUser>
          <DashboardLayout />
        </PrivateRouteUser>
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
      element: (
        <PrivateRouteStudent>
          <LogoOnlyLayout />
        </PrivateRouteStudent>
      ),
      children: [
        { path: "examPaper", element: <ExamPaper /> },
        { path: "practiceExamList", element: <ExamPracticeList /> },
        { path: "practiceExamPaper", element: <ExamPaperPractice /> },
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "studentLogin", element: <LoginStudent /> },
        { path: "register", element: <Register /> },
        { path: "404", element: <NotFound /> },
        // { path: "examPaper", element: <ExamPaper /> },
        // { path: "practiceExamList", element: <ExamPracticeList /> },
        // { path: "practiceExamPaper", element: <ExamPaperPractice /> },
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
