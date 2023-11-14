import { createWebHistory, createRouter } from "vue-router";
import homePage from "../page/homePage";
import ScoringPage from "../page/scoringPage";
import Label from "../page/labelPage";
import signUp from "../page/signUpPage"
import admin from "../page/adminPage"
import adminUploadPage from "../page/uploadPage"
import testcodePage from "../page/testcodePage"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "homePage", component: homePage },
        { path: "/scoring", name: "scoring", component: ScoringPage },
        { path: "/label", name: "label", component: Label },
        { path: "/signUp", name: "signUp", component: signUp },
        { path: "/admin", name: "admin", component: admin },
        { path: "/admin/upload", name: "adminUploadPage", component: adminUploadPage },
        { path: "/admin/testcode", name: "testcodePage", component: testcodePage },
    ]
});

export default router;