import { createWebHistory, createRouter } from "vue-router";
import homePage from "../page/homePage";
import ScoringPage from "../page/scoringPage";
import Label from "../page/labelPage";
import signUp from "../page/signUpPage"
import admin from "../page/adminPage"
import adminUploadPage from "../page/uploadPage"
import adminImageUploadPage from "../page/uploadImagePage"
import testcodePage from "../page/testcodePage"
import imagetestcodePage from "../page/imagetestcodePage"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/label/", name: "homePage", component: homePage },
        { path: "/label/scoring", name: "scoring", component: ScoringPage },
        { path: "/label/label", name: "label", component: Label },
        { path: "/label/signUp", name: "signUp", component: signUp },
        { path: "/label/admin", name: "admin", component: admin },
        { path: "/label/admin/upload", name: "adminUploadPage", component: adminUploadPage },
        { path: "/label/admin/imageupload", name: "adminImageUploadPage", component: adminImageUploadPage },
        { path: "/label/admin/testcode", name: "testcodePage", component: testcodePage },
        { path: "/label/admin/imagetestcode", name: "imagetestcodePage", component: imagetestcodePage },
    ]
});

export default router;
