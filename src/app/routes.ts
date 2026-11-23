import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Debate } from "./pages/Debate";
import { CreateDebate } from "./pages/CreateDebate";
import { Profile } from "./pages/Profile";
import { Ranking } from "./pages/Ranking";
import { SignIn } from "./pages/SignIn";
import { Admin } from "./pages/Admin";
import { Terms } from "./pages/Terms";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "debate/:id", Component: Debate },
      { path: "create", Component: CreateDebate },
      { path: "profile", Component: Profile },
      { path: "ranking", Component: Ranking },
      { path: "signin", Component: SignIn },
      { path: "admin", Component: Admin },
      { path: "terms", Component: Terms },
    ],
  },
]);