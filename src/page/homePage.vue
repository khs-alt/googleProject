<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/label/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/label/signup/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Sign Up</button>
                    </a>
                    <a href="/label/admin/">
                        <button class="signup-btn-style">Admin</button>
                    </a>
                </div>
            </div>
        </div>
        <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0;">
            <h2 style="margin-bottom: 40px">Video Scoring & Patch Labeling System</h2>
            <div style="padding-top: 10px; border: 0.5px; border-color: white;">
                <div style="margin-top: 1px;"></div>
                <div>
                    <!-- <div style="margin-bottom: 25px;">
                        <h3>Mode</h3>
                        <button
                            :class="{ 'clicked-btn-style': activeButtonIndex === 'scoring', 'btn-style': activeButtonIndex !== 'scoring' || hoveredButton }"
                            @click="clickMenuBtn('scoring')" @mouseover="onMouseOverButton"
                            @mouseout="onMouseOutButton">
                            Scoring
                        </button>
                        <button
                            :class="{ 'clicked-btn-style': activeButtonIndex === 'labeling', 'btn-style': activeButtonIndex !== 'labeling' || hoveredButton }"
                            @click="clickMenuBtn('labeling')" @mouseover="onMouseOverButton"
                            @mouseout="onMouseOutButton">
                            Labeling
                        </button>
                    </div> -->

                    <div class="id-password-testcode-style">
                        <div style="margin-bottom: 50px;">
                            <h4 class="home-h2-font">ID</h4>
                            <input class="home-input-style" v-model="userId" placeholder="your id">
                        </div>
                        <div style="margin-bottom: 50px;">
                            <h4 class="home-h2-font">Password</h4>
                            <input class="home-input-style" v-model="password" type="password" placeholder="your password">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <h4 class="home-h2-font">Testcode</h4>
                            <input class="home-input-style" v-model="testcode" placeholder="your testcode">
                        </div>
                        <button @click="submitLoginAction" class="btn-style login-btn-style">Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer">
        <p>Copyright © 2023 Pi:Lab, SMU. All rights reserved.</p>
        <p>help@pilab.smu.ac.kr</p>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'homePage',
    data() {
        return {
            currentUser: '',
            // currentMode: 'Nothing',
            userScoring: [],
            scoreNum: [1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false, false],
            menuBar: ['Home'],
            lastPage: false,
            videoButtonText: "Play Video",
            baseUrl: process.env.BASE_URL + "api/",
            userId: '',
            password: '',
            currentPage: 0,
            testcode: '',
            activeButtonIndex: null,
            clickedButton: null,
            // temp: "http://34.64.195.7:8000/serveImage",
            hoveredButton: false,
        }
    },
    created() { },
    mounted() {
        window.addEventListener("keydown", this.keydown);
    },
    unmounted() {
        window.removeEventListener("keydown", this.keydown);
    },
    methods: {
        keydown(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                this.submitLoginAction();
            }
        },
        clickMenuBtn(index) {
            if (this.activeButtonIndex === index) {
                this.activeButtonIndex = null;
                this.clickedButton = null;
            } else {
                this.activeButtonIndex = index;
                this.clickedButton = index;
            }
        },
        onMouseOverButton() {
            this.hoveredButton = true;
        },
        onMouseOutButton() {
            this.hoveredButton = false;
        },
        goToPage(currentMode) {
            if (currentMode == 'scoring') {
                this.$router.push({
                    path: 'scoring',
                    query: {
                        userName: this.userId,
                        currentPage: this.currentPage,
                        testcode: this.testcode
                    }
                });
            }
            if (currentMode == 'labeling') {
                this.$router.push({
                    path: 'label',
                    query: {
                        userName: this.userId,
                        currentPage: this.currentPage,
                        testcode: this.testcode
                    }
                });
            }
        },
        submitLoginAction() {
            // 아이디와 비밀번호, testcode가 입력되었는지 확인
            if (this.userId && this.password && this.testcode) {
                console.log("userId: " + this.userId);
                console.log("password: " + this.password);
                console.log("testcode: " + this.testcode);
                axios
                    .post(this.baseUrl + "login", {
                        // current_mode: this.currentMode,
                        user_id: this.userId,
                        user_password: this.password,
                        test_code: this.testcode,
                    })
                    .then(res => {
                        if (res.data.path == "scoring") {
                            this.currentUser = this.userId
                            this.currentPage = parseInt(res.data.lastPage);
                            console.log("lastPage: " + this.currentPage)
                            this.goToPage(res.data.path);
                        } else if (res.data.path == "labeling") {
                            this.currentUser = this.userId;
                            this.currentPage = parseInt(res.data.lastPage);
                            console.log("lastPage: " + this.currentPage)
                            this.goToPage(res.data.path);
                        } else {
                            alert(res.data.path)
                        }
                        //after post we have to init data form userScoring and currentPage
                    })
                    .catch(error => {
                        console.error(error);
                    })
            } else {
                alert('Please enter your ID and Password');
            }
        },
        navigateTo(item) {
            if (item == 'Home') {
                this.$router.push('/');
            } else {
                alert(item)
            }
        },
    }
}
</script>

<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
