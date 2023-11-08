<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <!-- <div>
                <img :src="temp" style="max-width:100%; height: 50px; margin-right: auto; margin-left: 10px; float: left; margin-top: 8px;" />
            </div> -->
                <div class="menu-content">
                    <a href="/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/signup" style="margin-right: 10px;">
                        <button class="signup-btn-style">Sign Up</button>
                    </a>
                    <a href="/admin">
                        <button class="signup-btn-style">Admin</button>
                    </a>
                </div>
            </div>
        </div>
        <!-- TODO: 우리 시스템 이름 넣기 -->
        <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0;">
            <h2>Scoring / Labeling System</h2>
            <div style="padding-top: 10px; border: 0.5px; border-color: white;">
                <div style="margin-top: 1px;"></div>
                <div>
                    <div>
                        <!-- <button :class="{'clicked-btn-style': activeButtonIndex === 'scoring', 'btn-style': activeButtonIndex !== index}" @click="clickMenuBtn('scoring'), changeCurrentMode('Scoring')" >Scoring</button>
                    <button :class="{'clicked-btn-style': activeButtonIndex === 'labeling', 'btn-style': activeButtonIndex !== index}" @click="clickMenuBtn('labeling'), changeCurrentMode('Labeling')">Labeling</button> -->
                        <h3>Mode</h3>
                        <button
                            :class="{ 'clicked-btn-style': activeButtonIndex === 'scoring', 'btn-style': activeButtonIndex !== 'scoring' || hoveredButton }"
                            @click="clickMenuBtn('scoring'), changeCurrentMode('Scoring')" @mouseover="onMouseOverButton"
                            @mouseout="onMouseOutButton">
                            Scoring
                        </button>
                        <button
                            :class="{ 'clicked-btn-style': activeButtonIndex === 'labeling', 'btn-style': activeButtonIndex !== 'labeling' || hoveredButton }"
                            @click="clickMenuBtn('labeling'), changeCurrentMode('Labeling')" @mouseover="onMouseOverButton"
                            @mouseout="onMouseOutButton">
                            Labeling
                        </button>
                    </div>
                    <div style="margin-bottom: 25px;"> </div>

                    <div class="id-password-testcode-style">
                        <div style="margin-bottom: 50px;">
                            <h4 class="home-h2-font">ID</h4>
                            <input class="home-input-style" v-model="userId" placeholder="ID">
                        </div>
                        <div style="margin-bottom: 50px;">
                            <h4 class="home-h2-font">Password</h4>
                            <input class="home-input-style" v-model="password" type="password" placeholder="Password">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <h4 class="home-h2-font">Testcode</h4>
                            <input class="home-input-style" v-model="testcode" placeholder="TestCode">
                        </div>
                        <button @click="submitLoginAction" class="btn-style login-btn-style">Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'homePage',
    data() {
        return {
            currentUser: '',
            currentMode: 'Nothing',
            userScoring: [],
            scoreNum: [1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false, false],
            menuBar: ['Home'],
            lastPage: false,
            videoButtonText: "Play Video",
            baseUrl: "http://localhost:8000",
            userId: '',
            password: '',
            currentPage: 0,
            testcode: '',
            activeButtonIndex: null,
            clickedButton: null,
            temp: "http://34.64.195.7:8000/serveImage",
            hoveredButton: false,
        }
    },
    created() { },
    mounted() {
    },
    methods: {
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
        goToPage() {
            if (this.currentMode == 'Scoring') {
                this.$router.push({
                    path: '/scoring',
                    query: {
                        userName: this.userId,
                        currentPage: this.currentPage,
                        testcode: this.testcode
                    }
                });
            }
            if (this.currentMode == 'Labeling') {
                this.$router.push({
                    path: '/label',
                    query: {
                        userName: this.userId,
                        currentPage: this.currentPage,
                        testcode: this.testcode
                    }
                });
            }
        },
        changeCurrentMode(mode) {
            this.currentMode = mode
        },
        submitLoginAction() {
            // 아이디와 비밀번호, testcode가 입력되었는지 확인
            if (this.userId && this.password && this.testcode) {
                if (this.currentMode == 'Nothing') {
                    alert("Please choose mode")
                } else {
                    console.log("user id: ", this.userId)
                    console.log("user password: ", this.password)
                    // 여기에 아이디와 비밀번호를 전송하는 로직을 추가합니다.
                    axios
                        .post(this.baseUrl + "/login", {
                            userID: this.userId,
                            userPassword: this.password,
                            testcode: this.testcode,
                        }).then(res => {
                            console.log("res.data: ", res.data);
                            if (res.data == "Yes") {
                                // json 파일 형식
                                // 1. 유저의 유무 isUserExist
                                alert("log in success")
                                this.currentUser = this.userId
                                this.goToPage()
                            } else {
                                alert(res.data)
                            }
                            //after post we have to init data form userScoring and currentPage
                        })
                        .catch(error => {
                            console.error(error);
                        })
                    // 전송 후 아이디와 비밀번호 초기화
                    // this.userId = '';
                    // this.password = '';
                }
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
