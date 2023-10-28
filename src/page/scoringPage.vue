<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content" style="padding-bottom: 0;">
        <div class="videoPlayer">
            <div style="display: flex; margin-left: auto; margin-right: auto; max-height: 60%;">
                <div style="margin: 15px;">
                    <transition name="fade" mode="out-in" appear>
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden;">
                            <video id="videoNoartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoNoartifact" controlsList="nodownload" key="videoNoartifact"
                                :src="leftOriginalVideo()"  @wheel="handleWheel" @click="setZoomCenter">
                            </video>
                        </div>
                    </transition>
                </div>
                <div style="margin: 15px;">
                    <transition name="fade" mode="out-in" appear>
                        <div style="max-width: 100%; max-height: 550px; overflow: hidden;">
                            <video id="videoYesartifact" :style="videoStyles" style="height: 550px; max-width: 100%;"
                                ref="videoYesartifact" controlsList="nodownload" key="videoYesartifact" 
                                :src="rightArtifactVideo()"  @wheel="handleWheel" @click="setZoomCenter">
                            </video>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div style="margin-left: 50px; margin-right: 50px;">
            <div style="margin-bottom: 5px;">
                <button @click="seekBackward" @mouseover="isMouseOverMinus = true" @mouseout="isMouseOverMinus = false"
                    :class="{ 'btn-style': !isMouseOverMinus, 'clicked-btn-style': isMouseOverMinus }"
                    style="margin-right: 2%;">-1
                    frame</button>
                <button id="videoButton" key="videoButton" @click="changeVideoButton" @mouseover="isMouseOverPlay = true"
                    @mouseout="isMouseOverPlay = false"
                    :class="{ 'btn-style': !isMouseOverPlay, 'clicked-btn-style': isMouseOverPlay }">{{
                        videoButtonText }}</button> 
                <button @click="seekForward" @mouseover="isMouseOverPlus = true" @mouseout="isMouseOverPlus = false"
                    :class="{ 'btn-style': !isMouseOverPlus, 'clicked-btn-style': isMouseOverPlus }"
                    style="margin-left: 2%;">+1
                    frame</button>
            </div>
            <div style="display: flex; min-width: 1200px;">
                <div style="margin-left: auto; margin-right: auto; display: flex;">
                    <button v-on="click" class="btn-style" style="font-size: large; width: 120px; height: 62px;"
                        @click="changeBackVideo">back</button>
                    <button v-for="a in 5" ref="score" :key="a" v-on:click="clickedButton = a"
                        style="width: 80px; font-size:x-large;"
                        :class="{ 'clicked-btn-style': isPressed[a], 'btn-style': !isPressed[a] }"
                        @click="toggleButton(a)">{{ a }}</button>
                    <button v-on="click" class="btn-style" style="font-size: large; width: 120px; height: 62px;"
                        @click="changeNextVideo">next</button>
                </div>
            </div>
            <div>
                <button v-on="click" class="btn-style" style="width: 150px; height: 75px; font-size: x-large;"
                    @click="submitScoring()">submit</button>
            </div>
        </div>
    </div>
</template>

<!-- TODO: 원래 기록되어있던 점수가 눌러있는 상태로 나오게 -->
<script>
import axios from 'axios'
export default {
    name: 'scoringPage',
    data() {
        return {
            clickedButton: 0,
            noScore: false,
            maxVideonum: 3,
            userScoring: 0,
            scoreNum: [1, 2, 3, 4, 5],
            isPressed: [false, false, false, false, false],
            isClicked: false,
            menuBar: ['Home'],
            currentPage: this.$route.query.currentPage,
            currentUser: this.$route.query.userName,
            testCode: this.$route.query.testcode,
            lastPage: false,
            videoButtonText: "Play Video",
            baseUrl: "http://localhost:8000",
            leftVideoUrl: "",
            rightVideoUrl: "",
            isMouseOverMinus: false,
            isMouseOverPlus: false,
            isMouseOverPlay: false,
            videoIndexString: "",
            videoIndex: [],
            zoom: 1,
            minZoom: 1,
            videoStyles: {},
            zoomCenterX: 50, // percentage, 50% is the center
            zoomCenterY: 50,  // percentage, 50% is the center
            // video url list
            videoList: [],
        }
    },
    created() { },
    mounted() {
        this.changeVideoButton;
        this.getVideoIndexCurrentPage();
    },
    methods: {
        zoomIn() {
            this.zoom += 0.1;
            this.updateVideoStyle();
        },
        zoomOut() {
            if (this.zoom > this.minZoom + 0.1) { // minZoom + 0.1 (예를 들면, 1.1)보다 클 때만 줌아웃 가능
                this.zoom -= 0.1;
                this.updateVideoStyle();
            }
        },
        updateVideoStyle() {
            this.videoStyles = {
                transform: `scale(${this.zoom})`,
                transformOrigin: `${this.zoomCenterX}% ${this.zoomCenterY}%`
            }
        },
        setZoomCenter(event) {
            const rect = this.$refs.videoNoartifact.getBoundingClientRect();
            // const rect2 = this.$refs.video2.getBoundingClientRect();
            this.zoomCenterX = ((event.clientX - rect.left) / rect.width) * 100;
            this.zoomCenterY = ((event.clientY - rect.top) / rect.height) * 100;

            // this.zoomCenterX = ((event.clientX - rect2.left) / rect2.width) * 100;
            // this.zoomCenterY = ((event.clientY - rect2.top) / rect2.height) * 100;
            this.updateVideoStyle();
        },
        handleWheel(event) {
            if (event.shiftKey) {
                // deltaY 값이 양수면 휠을 위로 굴렸다는 의미이므로 확대, 음수면 축소
                if (event.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
                // 확대/축소 중심점 설정
                this.setZoomCenter(event);

                // 기본 휠 이벤트(스크롤) 방지
                event.preventDefault();
            }
        },
        // json 받아오는 형식
        // resData := map[string]string{
		// 	"currentPage": currentPage,
		// 	"videoList":   videoList,
		// }
        async getVideoIndexCurrentPage() {
            await axios
                .post(this.baseUrl + "/getVideoIndexCurrentPage", {
                    userID: this.currentUser,
                    testcode: this.testCode,
                })
                .then((response) => {
                    this.currentPage = response.data.currentPage;
                    this.videoList = response.data.videoList;
                    console.log("current page: ", this.currentPage);
                    console.log("video list: ", this.videoList)
                    this.parsingStringToIntArray();
                    this.leftOriginalVideo();
                    this.rightArtifactVideo();
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        parsingStringToIntArray() {
            var temp = this.videoList.split(",");
            for (var i in temp) {
                this.videoIndex.push(parseInt(temp[i]));
            }
            console.log("video index: ", this.videoIndex);
        },

        navigateTo(item) {
            if (item === 'Home') {
                this.$router.push('/');
            } else {
                alert("Still developed")
            }
        },
        leftOriginalVideo() {
            console.log("original page url: ",this.baseUrl + "/postvideo/original/" + (this.currentPage))
            return String(this.baseUrl + "/postvideo/original/" + (this.currentPage))
        },
        rightArtifactVideo() {
            console.log("artifact page url: ",this.baseUrl + "/postvideo/artifact/" + (this.currentPage))
            return String(this.baseUrl + "/postvideo/artifact/" + (this.currentPage))
        },
        submitScoring() {
            for (var i = 0; i < 10; i++) {
                if (this.isPressed[i]) {
                    this.isClicked = true
                }
            }
            if (this.isClicked == false) {
                console.log("Please chose the score!")
            } else {
                this.userScoring = this.clickedButton
                
                axios
                    .post(this.baseUrl + "/postdata", {
                        Title: "scoring data",
                        Score: this.userScoring,
                        CurrentUser: this.currentUser,
                        ImageId: parseInt(this.currentPage),
                        TestCode: this.testCode
                    })
                    .then(res => {
                        console.log(res)
                        // alert(res.data)
                        //after post we have to init data form userScoring and currentPage
                        this.userScoring = 0

                        for (var i in this.videoIndex.length) {
                            if (this.videoIndex[i] == this.videoIndex[this.videoIndex.length - 1]) {
                                this.lastPage = true;
                                console.log("This is the last page");
                                console.log("last page: ", this.currentPage);
                                alert("Successfully submitted. This is the last page.")
                                return;
                            } else if (this.videoIndex[i] == this.currentPage) {
                                this.currentPage = this.videoIndex[i + 1];
                                console.log("next page : " + this.currentPage);
                                alert("Successfully submitted.")
                                return;
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        },
        // 다음 비디오로 비디오 변경
        changeNextVideo() {
            if (this.clickedButton == 0) {
                alert("Please choose score.")
            } else {
                this.userScoring = this.clickedButton
                // this.leftOriginalVideo()
                // this.rightArtifactVideo()
                console.log("user scoring: ", this.userScoring)
                console.log("current user:", this.currentUser)
                console.log("current page: ", this.currentPage)
                console.log("test code: ", this.testCode)
                
                axios
                    .post(this.baseUrl + "/postdata", {
                        Title: "scoring data",
                        Score: this.userScoring,
                        CurrentUser: this.currentUser,
                        ImageId: parseInt(this.currentPage),
                        TestCode: this.testCode
                    })
                    .then(res => {
                        console.log(res.data)
                        //after post we have to init data form userScoring and currentPage
                        // this.currentPage = this.currentPage + 1
                        this.userScoring = 0
                        this.isPressed = [false, false, false, false, false, false, false, false, false, false]

                        for (var i = 0; i < this.videoIndex.length; i++) {
                            if (this.currentPage == this.videoIndex[this.videoIndex.length - 1]) {
                                this.lastPage = true;
                                alert("This is the last page");
                                console.log("This is the last page");
                                return;
                            } else if (this.videoIndex[i] == this.currentPage) {
                                this.currentPage = this.videoIndex[i + 1];
                                //alert("next page : " + this.currentPage);
                                console.log("next page : " + this.currentPage);
                                this.lastPage = false;
                                return;
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
            // if (this.currentPage >= this.maxVideonum - 1) {
            //     this.lastPage = true
            // }
        },
        // 이전 비디오로 비디오 변경
        changeBackVideo() {
            this.isPressed = [false, false, false, false, false, false, false, false, false, false]
                for (var i = 0; i < this.videoIndex.length; i++) {
                    if (this.currentPage == this.videoIndex[0]) {
                        alert("This is the first page. current page: ", this.currentPage);
                        console.log("first page", this.currentPage);
                        return;
                    } else if (this.videoIndex[i] == this.currentPage) {
                        this.currentPage = this.videoIndex[i - 1];
                        //alert("prev page : " + this.currentPage);
                        console.log("prev page : " + this.currentPage);
                        return;
                    }
                }
                // this.currentPage -= 1
            
            // if (this.currentPage < this.maxVideonum) {
            //     this.lastPage = false
            // }
        },
        // score button 눌렸는지 안눌렸는지 확인하는 method
        toggleButton(index) {
            this.isPressed = [false, false, false, false, false, false, false, false, false, false]
            this.isPressed[index] = !this.isPressed[index]
        },
        // video 2개 동시에 플레이 시키는 method
        playVideos() {
            const video1 = document.getElementById('videoNoartifact');
            const video2 = document.getElementById('videoYesartifact');
            if (video1 && video2) {
                video1.play();
                video2.play();
            }
        },
        // video 2개 동시에 Stop 시키는 method
        pauseVideos() {
            const video1 = document.getElementById('videoNoartifact');
            const video2 = document.getElementById('videoYesartifact');
            if (video1 && video2) {
                video1.pause();
                video2.pause();
            }
        },
        // Play Video/Stop 및 text 변경 버튼
        changeVideoButton() {
            if (this.videoButtonText == "Play Video") {
                this.playVideos();
                this.videoButtonText = "Stop Video";
            } else {
                this.pauseVideos();
                this.videoButtonText = "Play Video";
            }
        },
        seekBackward() {
            const video1 = this.$refs.videoNoartifact; // 비디오 엘리먼트 가져오기
            const video2 = this.$refs.videoYesartifact;
            if (video1 && video2) {
                video1.currentTime -= (1 / 29.96); // 1/29.96초씩 뒤로 이동
                video2.currentTime -= (1 / 29.96);
            }
        },
        seekForward() {
            const video1 = this.$refs.videoNoartifact; // 비디오 엘리먼트 가져오기
            const video2 = this.$refs.videoYesartifact;
            if (video1 && video2) {
                video1.currentTime += (1 / 29.96); // 1/29.96초씩 앞으로 이동
                video2.currentTime += (1 / 29.96);
            }
        },
    },
}
</script>

<style>
@import '../main.css';
</style>
