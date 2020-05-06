const SignUp = () => import("../views/auth-views/signup.vue");
const ActivateUser = () => import("../views/auth-views/activate-user.vue");
const Login = () => import("../views/auth-views/login.vue");
const ForgotPassword = () => import("../views/auth-views/forgot-password.vue");
const ChangePassword = () => import("../views/auth-views/change-password.vue");

const guestRoutes = [
  {
    path: "/",
    redirect: "/signup"
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
    meta: { guest: true }
  },
  {
    path: "/activate-user/:token",
    name: "activate-user",
    component: ActivateUser,
    meta: { guest: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guest: true }
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: { guest: true }
  },
  {
    path: "/change-password/:token",
    name: "change-password",
    component: ChangePassword,
    meta: { guest: true }
  }
];

export default guestRoutes;
