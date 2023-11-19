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
        { path: "/dev/", name: "homePage", component: homePage },
        { path: "/dev/scoring", name: "scoring", component: ScoringPage },
        { path: "/dev/label", name: "label", component: Label },
        { path: "/dev/signUp", name: "signUp", component: signUp },
        { path: "/dev/admin", name: "admin", component: admin },
        { path: "/dev/admin/upload", name: "adminUploadPage", component: adminUploadPage },
        { path: "/dev/admin/testcode", name: "testcodePage", component: testcodePage },
    ]
});

export default router;