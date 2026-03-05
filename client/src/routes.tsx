import { Navigate } from "react-router-dom";
import CreatePostPage from "./pages/CreatePostPage";
import PostsPage from "./pages/PostsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPostPage from "./pages/EditPostPage";

const routes = [
  { index: true, element: <Navigate to="/signin" replace /> },
  { path: "/posts", element: <PostsPage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "posts/new", element: <CreatePostPage /> },
      { path: "posts/:id/edit", element: <EditPostPage /> },
    ],
  },
];

export default routes;
