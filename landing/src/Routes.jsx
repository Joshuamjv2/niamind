import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import ProblemAccess from "./pages/problems/ProblemAccess";
import ProblemAffordability from "./pages/problems/ProblemAffordability";
import ProblemAwareness from "./pages/problems/ProblemAwareness";
import PartnersPage from "./pages/partners/Partners";
import AllPartnersPage from "./pages/partners/all/AllPartners";
import SlotsPage from "./pages/Slots";
import NotFound from "./pages/NotFound";

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
        path: "*",
        element: <NotFound />,
    },
]);
