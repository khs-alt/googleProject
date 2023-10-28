<template>
<div class="body-style">
    <div class="menu">
        <div class="menu-header">
            <div class="menu-content">
                <a href="/" style="margin-right: 10px;">
                    <button class="signup-btn-style">Home</button>
                </a>
                <a href="/signup">
                    <button class="signup-btn-style">Sign up</button>
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
                <h4 style="display: flex; margin-right: auto; margin-left: 60px; margin-bottom: 10px;" for="username">ID</h4>
                <input type="text" id="username" class="home-input-style" v-model="id" required>
            </div>
            <div class="inputBox">
                <h4 style="display: flex; margin-right: auto; margin-left: 60px; margin-bottom: 10px;" for="password">Password</h4>
                <input type="password" id="password" class="home-input-style" v-model="password" required>
            </div>
            <button type="submit" @click="register" class="btn-style" style="display: flex; margin-left: auto; margin-right: 100px;">Sign up</button>
        </div>
    </form>
</div>
<div>
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
            baseUrl: "http://localhost:8000",
        };
    },
    methods: {
        register() {
            axios.post(this.baseUrl + "/signUp", {
                    newId: this.id,
                    newPassword: this.password,
                }).then(res => {
                    alert(res.data)
                })
                .catch(error => {
                    console.error(error);
                })
            console.log('가입 정보:', this.formData)
        },
        //home으로 이동
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
@import '../main.css';
</style>
