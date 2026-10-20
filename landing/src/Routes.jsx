import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProblemAccess from "./pages/problems/ProblemAccess";
import ProblemAffordability from "./pages/problems/ProblemAffordability";
import ProblemAwareness from "./pages/problems/ProblemAwareness";
import PartnersPage from "./pages/partners/Partners";
import AllPartnersPage from "./pages/partners/all/AllPartners";
import SlotsPage from "./pages/Slots";
import NotFound from "./pages/NotFound";

import { Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminApp from "./pages/admin/AdminApp";
import QuestionnairesView from "./pages/admin/Questionaires";
import WaitlistView from "./pages/admin/Waitlist";
import QuestionnaireDetail from "./pages/admin/QuestionnaireDetail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        index: true,
    },
    {
        path: "partners",
        element: <PartnersPage />,
    },
    {
        path: "partners/all",
        element: <AllPartnersPage />,
    },
    {
        path: "problem/access",
        element: <ProblemAccess />,
    },
    {
        path: "problem/affordability",
        element: <ProblemAffordability />,
    },
    {
        path: "problem/awareness",
        element: <ProblemAwareness />,
    },
    {
        path: "slots",
        element: <SlotsPage />,
    },
    {
        path: "admin/login",
        element: <AdminLogin />,
    },
    {
        path: "admin",
        element: <AdminApp />,
        children: [
            { index: true, element: <Navigate to="waitlist" replace /> },
            { path: "waitlist", element: <WaitlistView /> },
            { path: "questionnaires", element: <QuestionnairesView /> },
            { path: "questionnaires/:id", element: <QuestionnaireDetail /> },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
