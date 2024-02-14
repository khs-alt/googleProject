import { createWebHistory, createRouter } from "vue-router";
import homePage from "../page/homePage";
import ScoringPage from "../page/scoringPage";
import Label from "../page/labelPage";
import signUp from "../page/signUpPage";
import admin from "../page/adminLoginPage";
import adminUploadPage from "../page/uploadPage";
import adminImageUploadPage from "../page/uploadImagePage";
import testcodePage from "../page/testcodePage";
import imagetestcodePage from "../page/imagetestcodePage";
import frameSelectionPage from "../page/frameSelectionPage";
import inputTestcodePage from "../page/inputTestcodePage";
import adminMainPage from "../page/adminMainPage";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "homePage", component: homePage },
    { path: "/scoring", name: "scoring", component: ScoringPage },
    { path: "/label", name: "label", component: Label },
    { path: "/signUp", name: "signUp", component: signUp },
    { path: "/admin", name: "admin", component: admin },
    {
      path: "/admin/upload",
      name: "adminUploadPage",
      component: adminUploadPage,
    },
    {
      path: "/admin/imageupload",
      name: "adminImageUploadPage",
      component: adminImageUploadPage,
    },
    {
      path: "/admin/testcode",
      name: "testcodePage",
      component: testcodePage,
    },
    {
      path: "/admin/imagetestcode",
      name: "imagetestcodePage",
      component: imagetestcodePage,
    },
    {
      path: "/admin/frameselection",
      name: "frameSelectionPage",
      component: frameSelectionPage,
      // props: true,
    },
    {
      path: "/admin/inputtestcode",
      name: "inputTestcodePage",
      component: inputTestcodePage,
    },
    {
      path: "/admin/main",
      name: "adminMainPage",
      component: adminMainPage,
    },
  ],
});

export default router;
