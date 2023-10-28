<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/admin/upload">
                        <button class="signup-btn-style">Upload</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0; height: 93vh; margin: 0 0 0 0">
        <div class="wrapping">
            <div class="container">
                <!-- 태그 -->
                <div>
                    <h3>Tag</h3>
                    <div class="tagWrapper">
                        <div>
                            <button @click="selectAllTags" class="btn-style">All</button>
                            <button v-for="(item, index) in tag" :key="index" ref="tag"
                                :class="{ 'btn-style': !clickedTagBtn.includes(item), 'clicked-btn-style': clickedTagBtn.includes(item) }"
                                @click="clickTagBtn(index)" @mouseover="mouseOver(index)" @mouseout="mouseOut(index)">
                                {{ item }}</button>
                        </div>
                        <div v-for="(item, index) in clickTagBtn" :key="index">{{ item }}</div>
                    </div>
                </div>
            </div>
            <button @click="generateTestcode" class="btn-style"> Generate TestCode </button>
        </div>
        <h3 style="margin-top: 10px;">TestCode</h3>
        <div style="display: flex; flex-direction: column;">
            <div style="margin-left: auto; margin-right: auto; display: flex; flex-direction: column;">
                <div v-for="(tagItem, index) in existTestcode.tags" :key="tagItem">
                    <div style="margin: 10px; display: flex; justify-content: space-between;">
                        <span>{{ tagItem }}</span>
                        <span> = </span>
                        <span>{{ existTestcode.testcode[index] }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'videoUploadPage',
    data() {
        return {
            isClicked: [],
            menuBar: ['Home'],
            baseUrl: "http://localhost:8000",
            tag: [],
            clickedTagBtn: [],
            testcode: '',
            existTestcode: [],
        }
    },
    mounted() {
        this.getTag();
        this.getTestcodeWithTag();
    },
    methods: {
        selectAllTags() {
            if(this.tag.length === 0) {
                alert("There is no tag");
                return;
            } 
            if (this.clickedTagBtn.length === this.tag.length) { // 이미 모든 태그가 선택되었을 경우
                this.clickedTagBtn = [];
                this.isClicked = this.tag.map(() => false);
                console.log("clicked tag button: " + this.isClicked);
                this.$refs.tag.forEach((btn) => {
                    btn.className = 'btn-style';
                });
            } else { // 그렇지 않은 경우
                this.clickedTagBtn = [...this.tag];
                this.isClicked = this.tag.map(() => true);
                console.log("clicked tag button: " + this.isClicked);

                this.$refs.tag.forEach((btn) => {
                    btn.className = 'clicked-btn-style';
                });
            }
        },
        // 마우스가 버튼 위에 올라갔을 때
        mouseOver(index) {
            const tagName = this.tag[index];
            if (!this.clickedTagBtn.includes(tagName)) {
                this.$refs.tag[index].className = 'clicked-btn-style';
            }
        },
        // 마우스가 버튼에서 나갔을 때
        mouseOut(index) {
            const tagName = this.tag[index];
            if (!this.clickedTagBtn.includes(tagName)) {
                this.$refs.tag[index].className = 'btn-style';
            }
        },
        navigateTo(item) {
            if (item === 'Home') {
                this.$router.push('/');
            }
        },
        // tag 가져오는 method
        async getTag() {
            await axios
                .get(this.baseUrl + '/getTag')
                .then((response) => {
                    console.log(response.data);
                    this.tag = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        //     ressult := struct {
        // 	TestCode []string `json:"testcode"`
        // 	Tags     []string `json:"tags"`
        // }
        async getTestcodeWithTag() {
            await axios
                .get(this.baseUrl + '/getTestcodeWithTag')
                .then((response) => {
                    console.log(response.data);
                    this.existTestcode = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        async generateTestcode() {
            if (this.clickedTagBtn == 0) {
                alert("Please choose tag");
                return;
            }
            await axios
                .post(this.baseUrl + '/generateTestcode', {
                    tags: this.clickedTagBtn
                })
                .then((response) => {
                    console.log(response.data);
                    // response가 -1 이면 이미 존재하는 testcode 
                    if (response == -1) {
                        console.log("Aleread existing testcode");
                        alert("Aleread existing testcode");
                        return;
                    }
                    this.testcode = response.data;
                    alert("Generated testcode: " + this.testcode);
                    this.getTag();
                    this.getTestcodeWithTag();
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        clickTagBtn(index) {
            const tagName = this.tag[index];
            console.log("index: ", index)
            if (this.isClicked[index] == true) {
                for (var i = 0; i < this.clickedTagBtn.length; i++) {
                    if (this.clickedTagBtn[i] === tagName) {
                        this.$refs.tag[index].className = 'btn btn-outline-primary';
                        this.clickedTagBtn.splice(i, 1);
                        this.isClicked[index] = !this.isClicked[index];
                        i--;
                        console.log("removed tag:", tagName);
                        break;
                    }
                }
            } else {
                // this.$refs['clickedTagBtn'+ index].className = 'btn btn-outline-primary';
                this.$refs.tag[index].className = 'btn btn-primary';
                this.isClicked[index] = !this.isClicked[index];
                this.clickedTagBtn.push(tagName);
                console.log("added tag:", tagName);
            }
        },
    },
}
</script>

<style lang="scss">
@import '../main.css';
</style>
