// routes

import Routes from "./routes";
// theme
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
// components
import { BaseOptionChartStyle } from "./components/charts/BaseOptionChart";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Routes />
    </ThemeConfig>
  );
}

// import { BrowserRouter as Router, useRoutes } from "react-router-dom";
// import "./App.css";
// import Examination from "./masters/exam/examination";

// import StudentRegistration from "./masters/student/register";
// const AppWrapper = () => {
//   let routes = useRoutes([
//     { path: "/register", element: <StudentRegistration /> },
//     { path: "/examination", element: <Examination /> },
//   ]);
//   return routes;
// };
// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <AppWrapper />
//       </Router>
//     </div>
//   );
// }

// export default App;
