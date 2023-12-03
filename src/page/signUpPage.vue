<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/label/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content">
        <h2 style="font-weight: 400;">Sign up</h2>
        <form>
            <div style="width: 700px; margin-left: auto; margin-right: auto;">
                <div class="inputBox">
                    <h4 style="display: flex; margin-right: auto; margin-left: 60px; margin-bottom: 10px;" for="username">ID
                    </h4>
                    <input type="text" id="username" class="home-input-style" v-model="id" required>
                    <p :class="{ 'error-message': true, 'active': idTouched && !isIdValid, 'shake': idShake }">ID can
                        contain the following characters: lowercase characters, uppercase characters, and numbers.</p>
                </div>
                <div class="inputBox">
                    <h4 style="display: flex; margin-right: auto; margin-left: 60px; margin-bottom: 10px;" for="password">
                        Password</h4>
                    <input type="password" id="password" class="home-input-style" v-model="password" required>
                    <p :class="{ 'error-message': true, 'active': passwordTouched && !isPasswordValid, 'shake': passwordShake }"
                        style="color: red;">Do not use important password</p>
                </div>
                <!-- @click.prevent는 Vue.js에서의 이벤트 수식어(event modifier)입니다. prevent는 브라우저의 기본 이벤트 처리를 중지시키는 것으로, 
                event.preventDefault()를 호출하는 것과 같은 역할을 합니다.
                HTML 폼이 제출될 때, 기본적으로 페이지가 새로고침됩니다.
                이는 서버에 데이터를 제출하고 서버로부터 새로운 페이지를 로드하기 위한 표준적인 동작입니다. 
                그러나, SPA(Single Page Application)에서는 페이지 전체를 새로고침하지 않고 클라이언트 측에서 데이터를 처리하고 상태를 관리하기 때문에 이러한 기본 동작을 방지하고 싶을 때가 많습니다.
                Vue에서는 버튼을  클릭하거나 폼을 제출하는 이벤트가 발생할 때 기본 동작을 중지시키려면 @click.prevent 또는 @submit.prevent와 같이 수식어를 사용합니다. 
                이렇게 하면, 버튼 클릭이나 폼 제출 이벤트가 발생하더라도 페이지가 새로고침되는 것을 방지할 수 있습니다. -->
                <button @click.prevent="register" class="btn-style"
                    style="display: flex; margin-left: auto; margin-right: 100px;">Sign up</button>
            </div>
        </form>
    </div>
    <div>
    </div>
    <div class="footer">
        <p>Copyright © 2023 Pi:Lab, SMU. All rights reserved.</p>
        <p>help@pilab.smu.ac.kr</p>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            menuBar: ['Home'],
            id: '',
            password: '',
            baseUrl: process.env.BASE_URL + "api/",
            idTouched: false,
            passwordTouched: false,
            idShake: false,
            passwordShake: false,
        };
    },
    computed: {
        isIdValid() {
            // ID 유효성 검사: 영어 소문자, 대문자, 숫자, 일부 특수문자만 허용하며 최소 한 글자 이상이어야 함
            return /^[A-Za-z0-9!@#$%^&]+$/.test(this.id);
        },
        isPasswordValid() {
            // 비밀번호 유효성 검사: 영어 소문자, 대문자, 숫자, 일부 특수문자만 허용하며 최소 한 글자 이상이어야 함
            return /^[A-Za-z0-9!@#$%^&]+$/.test(this.password);
        },
    },
    mounted() {
        window.addEventListener("keydown", this.keydown);
    },
    unmounted() {
        window.removeEventListener("keydown", this.keydown);
    },

    watch: {
        id(value) {
            this.idTouched = value.length > 0;
        },
        password(value) {
            this.passwordTouched = value.length > 0;
        }
    },

    methods: {
        register() {
            if (!this.isIdValid && !this.isPasswordValid) {
                this.idShake = true; // id 입력 필드를 떨게 할 데이터 속성
                this.passwordShake = true; // password 입력 필드를 떨게 할 데이터 속성
                setTimeout(() => this.idShake = false, 500); // 애니메이션 후에 다시 false로 설정
                setTimeout(() => this.passwordShake = false, 500);
            } else if (!this.isIdValid) {
                this.idShake = true; // id 입력 필드를 떨게 할 데이터 속성
                setTimeout(() => this.idShake = false, 500); // 애니메이션 후에 다시 false로 설정
                return;
            } else if (!this.isPasswordValid) {
                this.passwordShake = true; // password 입력 필드를 떨게 할 데이터 속성
                setTimeout(() => this.passwordShake = false, 500);
                return;
            } else {
                //console.log("wrong world")
                axios
                    .post(this.baseUrl + "signUp", {
                        newId: this.id,
                        newPassword: this.password,
                    })
                    .then((res) => {
                        if (res.data == "Yes") {
                            alert("success to sign up!")
                            //console.log(res.data)
                            this.$router.push(process.env.BASE_URL)
                        } else {
                            alert("fail to sign up!")
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        },

        keydown(e) {
            if(e.key === 'enter') {
                e.preventDefault();
                this.register();
            }
        },
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
@import '../main.css';
</style>
