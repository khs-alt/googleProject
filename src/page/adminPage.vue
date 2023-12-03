<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/label/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/label/signup/">
                        <button class="signup-btn-style">Sign Up</button>
                    </a>
                </div>
            </div>
        </div>
        <div>
            <div class="home-main-content" style="height: 93vh; margin-bottom: 0; padding-bottom: 0;">
                <br>
                <h2 style="font-weight: 400;">Admin Page</h2>
                <div style="margin-bottom: 25px;"> </div>
                <!-- <p>Current Mode : {{ currentMode }} </p> -->
                <br>
                <div class="id-password-testcode-style">
                    <div style="margin-bottom: 50px;">
                        <h4 class="home-h2-font">ID</h4>
                        <input class="home-input-style" v-model="userId" placeholder="your id">
                    </div>
                    <div style="margin-bottom: 25px;">
                        <h4 class="home-h2-font">Password</h4>
                        <input class="home-input-style" v-model="password" type="password" placeholder="your password">
                    </div>
                    <button @click="submitCredentials" class="btn-style login-btn-style">Login</button>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Copyright © 2023 Pi:Lab, SMU. All rights reserved.</p>
            <p>help@pilab.smu.ac.kr</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'homePage',
    data() {
        return {
            // videoList: [require('./videos/20230726_213056.mp4'), require('./videos/20230726_213255.mp4')],
            currentUser: '',
            currentMode: 'Nothing',
            userScoring: [],
            clickedButton: 0,
            menuBar: ['Home'],
            lastPage: false,
            baseUrl: process.env.BASE_URL + "api/",
            userId: '',
            password: '',
            currentPage: 0
        }
    },
    created() { },
    mounted() {
        window.addEventListener('keydown', this.keydown);
    },
    methods: {
        // TODO: export page 메인 admin page를 만들기 
        // export 할 때 점수는 평균으로
        // Tag를 선택하여 export 할 수 있도록 하기
        // 반환 데이터
        // originalVideoName, desoisedVideoName, Score(Laebled)

        goToPage() {
            this.$router.push({
                path: 'admin/upload',
                query: {
                    userName: this.userId,
                    currentPage: this.currentPage
                }
            })
        },
        changeCurrentMode(mode) {
            this.currentMode = mode
        },
        submitCredentials() {
            if (this.userId && this.password) {
                //console.log(this.userId, this.password)
                console.log("location origin: " + location.origin);
                axios
                    .post(this.baseUrl + "admin/login", {
                        adminId: this.userId,
                        adminPassword: this.password,
                    })
                    .then(res => {
                        if (res.data == "yes") {
                            alert("login success")
                            this.currentUser = this.userId
                            this.$router.push(process.env.BASE_URL + 'admin/upload/')
                        } else {
                            alert("login failed");
                            return;
                        }
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

        keydown(e) {
            if (e.key === 'enter') {
                e.preventDefault();
                this.submitCredentials();
            }
        },
    }
}
</script>

<style>
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
