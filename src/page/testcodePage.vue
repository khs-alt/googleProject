<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/label/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/label/admin/upload">
                        <button class="signup-btn-style">Upload</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0; height: 93vh; margin: 0 0 0 0">
        <div class="wrapping">
            <div class="container">
                <div>
                    <h3>Tag</h3>
                    <div class="tagWrapper">
                        <div>
                            <button @click="selectAllTags(); getVideoListFromTag()" ref="selectAllBtn"
                                class="btn-style">All</button>
                            <button v-for="(item, index) in tag" :key="index" ref="tag"
                                :class="{ 'btn-style': !clickedTagBtn.includes(item), 'clicked-btn-style': clickedTagBtn.includes(item) }"
                                @click="clickTagBtn(index); getVideoListFromTag()" @mouseover="mouseOver(index)"
                                @mouseout="mouseOut(index)">
                                {{ item }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="generateTestcode" class="btn-style"> TestCode Generation </button>
        </div>
        <div style="width: 800px; max-height: 500px; margin-left: auto; margin-right: auto;">
            <h3 style="margin-top: 10px;">TestCode</h3>
            <div style="display: flex; flex-direction: column;">
                <div style="margin-left: auto; margin-right: auto; display: flex; flex-direction: column;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="(tagItem, index) in existTestcode.tags" :key="tagItem"
                            style="display: flex; justify-content: space-between;">
                            <div style="margin-top: 10px; margin-left: 1px; margin-right: 1px; display: flex;
                                justify-content: space-between;">
                                <button @click="clickTestcodeBtn(existTestcode.testcode[index])"
                                    :class="{ 'clicked-btn-style': clickedTestcodeBtn == existTestcode.testcode[index], 'btn-style': clickedTestcodeBtn != existTestcode.testcode[index] }"
                                    style="margin-right: 10px;">{{ existTestcode.testcode[index] }}</button>
                                <div style="margin-right: 10px;">:</div>
                                <div>{{ tagItem }}</div>
                            </div>
                        </div>
                        <div>
                            <button class="btn-style" @click="clickExport">Export</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <div style="max-height: 500px; overflow: auto;">video list</div>
            <div v-for="item in videoFromTag" :key="item">
                {{ item }}
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
    name: 'videoUploadPage',
    data() {
        return {
            isClicked: [],
            menuBar: ['Home'],
            baseUrl: process.env.BASE_URL + "api/",
            tag: [],
            clickedTagBtn: [],
            clickedTestcodeBtn: "",
            testcode: '',
            existTestcode: [],
            // click된 video list 
            videoFromTag: [],
        }
    },
    mounted() {
        this.getTag();
        this.getTestcodeWithTag();
    },
    methods: {
        // TODO: tag를 누르면 거기에 있는 data list 이름이 보이게 만들기
        // ex) ALL 누르면 모든 비디오 영상이 나오고, bright 누르면 bright태그에 있는 모든 영상 리스트 보여주기 

        // TODO: 클릭은 되는데 videoList가 안 옴
        // TODO: tsetcode 버튼을 누르고 그냥 tag 버튼을 누르면 뻑 남
        clickExport() {
            axios
                .post(this.baseUrl + 'getCSVFile', {
                    testcode: this.clickedTestcodeBtn
                })
                .then((response) => {
                    console.log(response.data);
                    console.log("response: " + response)
                    // alert("Exported testcode: " + this.clickedTestcodeBtn);
                    const url = window.URL.createObjectURL(response);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'file.csv'); // 다운로드될 파일 이름
                    document.body.appendChild(link);
                    link.click();
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        clickTestcodeBtn(testcodeName) {
            if (this.clickedTestcodeBtn == "") {
                this.clickedTestcodeBtn = testcodeName;
            }
            const testcodeIndex = this.existTestcode.testcode.indexOf(testcodeName);
            if (testcodeIndex !== -1) {
                for (var i = 0; i < this.tag.length; i++) {
                    this.clickTagBtn(i);
                }
            }
            this.getVideoListFromTag();
        },
        async getVideoListFromTag() {
            this.videoFromTag = [];
            if (this.clickedTagBtn.length === 0) {
                //console.log("There are no clicked tags");
                return;
            }
            await axios
                .get(this.baseUrl + 'getVideoListFromTag', {
                    params: {
                        tag: this.clickedTagBtn
                    }
                })
                .then((response) => {
                    // console.log("get video list from tag: " + response.data);
                    this.videoFromTag = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        selectAllTags() {
            if (this.tag.length === 0) {
                alert("There is no tag");
                return;
            }
            if (this.clickedTagBtn.length === this.tag.length) { // 이미 모든 태그가 선택되었을 경우
                this.clickedTagBtn = [];
                this.isClicked = this.tag.map(() => false);
                //console.log("clicked tag button: " + this.isClicked);
                this.$refs.tag.forEach((btn) => {
                    btn.className = 'btn-style';
                });
                this.$refs.selectAllBtn.className = 'btn-style';
            } else { // 그렇지 않은 경우
                this.clickedTagBtn = [...this.tag];
                this.isClicked = this.tag.map(() => true);
                //console.log("clicked tag button: " + this.isClicked);
                this.$refs.tag.forEach((btn) => {
                    btn.className = 'clicked-btn-style';
                });
                this.$refs.selectAllBtn.className = 'clicked-btn-style';
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
                .get(this.baseUrl + 'getTag')
                .then((response) => {
                    //console.log(response.data);
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
                .get(this.baseUrl + 'getTestcodeWithTag')
                .then((response) => {
                    //console.log(response.data);
                    this.existTestcode = response.data;
                    for (var i = 0; i < this.existTestcode.tags.length; i++) {
                        this.existTestcode.tags[i] = this.existTestcode.tags[i].replace(/,/g, ', ')
                    }
                    //console.log("exist testcode tags: ", this.existTestcode.tags);
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
                .post(this.baseUrl + 'generateTestcode', {
                    tags: this.clickedTagBtn
                })
                .then((response) => {
                    //console.log(response.data);
                    // response가 -1 이면 이미 존재하는 testcode 
                    if (response == -1) {
                        //console.log("Aleread existing testcode");
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
            //console.log("index: ", index)
            if (this.isClicked[index] == true) {
                for (var i = 0; i < this.clickedTagBtn.length; i++) {
                    if (this.clickedTagBtn[i] === tagName) {
                        this.$refs.tag[index].className = 'btn-style';
                        this.clickedTagBtn.splice(i, 1);
                        this.isClicked[index] = !this.isClicked[index];
                        i--;
                        //console.log("removed tag:", tagName);
                        break;
                    }
                }
            } else {
                // this.$refs['clickedTagBtn'+ index].className = 'btn btn-outline-primary';
                this.$refs.tag[index].className = 'clicked-btn-style';
                this.isClicked[index] = !this.isClicked[index];
                this.clickedTagBtn.push(tagName);
                //console.log("added tag:", tagName);
            }
        },
    },
}
</script>

<style lang="scss">
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
