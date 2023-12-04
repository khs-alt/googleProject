<template>
    <div class="body-style">
        <div class="menu">
            <div class="menu-header">
                <div class="menu-content">
                    <a href="/label/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Home</button>
                    </a>
                    <a href="/label/signup/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Sign up</button>
                    </a>
                    <a href="/label/admin/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Admin</button>
                    </a>
                    <a href="/label/admin/imageupload/" style="margin-right: 10px;">
                        <button class="signup-btn-style">Image Upload</button>
                    </a>
                    <a href="/label/admin/testcode">
                        <button class="signup-btn-style">Test Code</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="home-main-content">
        <div style=" width: 80%; margin-left: auto; margin-right: auto;">
            <div class="file-upload-left-container" @dragenter="onDragenter" @dragover="onDragover" @dragleave="onDragover"
                @drop="onOriginalDrop">
                <div @click="onOriginalClick" class="file-upload" :class="isDragged ? 'dragged' : ''">
                    Drag & Drop Original Files
                    <!-- 업로드된 리스트 -->
                    <!-- TODO: 업로드된 리스트 안 쪽에 좀 더 깔끔하게 UI 만들기 -->
                    <div class="scrollingUploadedData">
                        <div class="file-upload-list">
                            <div class="file-upload-list__item" v-for="originalFile in originalFileList"
                                :key="originalFile">
                                <!-- <template v-if="originalFile.type.includes('.mp4') || originalFile.type.includes('.mov') ">
                                <video :src="originalFile" width="100" height="100" muted></video>
                            </template>
                            <template v-else>
                                <img :src="originalFile"  width="100" height="100">
                            </template> -->
                                <div class="file-upload-list__item__data-name">{{ originalFile.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn-style" style=" padding: 10px; font-weight: 400; margin-top: 30px;"
                    @click="originalHandleRemove(index)">
                    삭제
                </button>
            </div>
            <input type="file" ref="originalFileInput" class="file-upload-input" @change="onOriginalFileChange" multiple>

            <div class="file-upload-right-container" @dragenter="onDragenter" @dragover="onDragover" @dragleave="onDragover"
                @drop="onArtifactDrop">
                <div @click="onArtifactClick" class="file-upload" :class="isDragged ? 'dragged' : ''">
                    Drag & Drop Artifact Files
                    <!-- 업로드된 리스트 -->
                    <div class="scrollingUploadedData">
                        <div class="file-upload-list">
                            <div class="file-upload-list__item" v-for="artifactFile in artifactFileList"
                                :key="artifactFile">
                                <!-- <template v-if="artifactFile.type.includes('.mp4') || artifactFile.type.includes('.mov')">
                                <video :src="artifactFile" width="100" height="100" muted></video>
                            </template>
                            <template v-else>
                                <img :src="artifactFile"  width="100" height="100">
                            </template> -->
                                <div class="file-upload-list__item__data-name">{{ artifactFile.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="file" ref="artifactFileInput" class="file-upload-input" @change="onArtifactFileChange"
                    multiple>
                <button class="btn-style" style="padding: 10px; font-weight: 400; margin-top: 30px;"
                    @click="artifactHandleRemove(index)">
                    삭제
                </button>
            </div>
        </div>

        <!-- 태그 -->
        <div class="tagWrapper">
            <div style="width: 100%;">
                <div>
                    <div>
                        <div style="margin-bottom: 5px;">
                            <div class="width-style" style="display: flex; margin-left: 10px;">Tag</div>
                        </div>
                        <div style="display: flex;">
                            <button v-for="(item, index) in tag" :key="index" ref="tag" class="btn-style"
                                @click="clickTagBtn(index)">{{
                                    item }}</button>
                        </div>
                    </div>
                    <div style="display: flex; margin-top: 10px;">
                        <input type="text" v-model="tagInput" class="home-input-style"
                            style="border-radius: 0.75rem; width: 350px; display: flex; margin-left: 5px;"
                            placeholder="Add Tag">
                        <button class="btn-style" style="font-size:medium; width: 80px; height: 24; margin-top: 0;"
                            @click="addTag">Add</button>
                        <button class="btn-style" style="font-size:medium; width: 80px; height: 24; margin-top: 0;"
                            @click="deleteTag">Delete</button>
                    </div>
                    <div style="display: flex; margin-top: 10px;">
                    </div>
                    <div style="display: flex;">
                        <div v-for="(item, index) in clickTagBtn" :key="index">{{ item }}</div>
                    </div>
                    <div style="style=display: flex;">
                        <div class="width-style" style="display: flex; margin-left: 10px; margin-top: 15px;">Upload Options
                        </div>
                        <div style="display: flex;" role="group" aria-label="Basic checkbox toggle button group">
                            <button v-for="(item, index) in uploadOptions" :key="index" ref="uploadOptions"
                                :class="{ 'clicked-btn-style': activeButtonIndex === index, 'btn-style': activeButtonIndex !== index }"
                                @click="clickUploadOptions(index)">{{ item }}</button>
                            <button @click="uploadFiles" class="btn-style"
                                style="background-color: #3182F6; color: white; margin-left: auto;">
                                Data Upload
                            </button>
                        </div>
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
    name: 'videoUploadPage',
    data() {
        return {
            isClicked: [],
            menuBar: ['Home'],
            currentUser: this.$route.query.userName,
            lastPage: false,
            baseUrl: process.env.BASE_URL + "api/",
            originalFileList: [],
            artifactFileList: [],
            isDragged: false,
            tagInput: "",
            tag: [],
            clickedTagBtn: [],
            uploadOptions: ['video'],
            activeButtonIndex: null,
            clickedUploadOption: null,
            uploadedOriginalFiles: [],
            uploadedArtifactFiles: [],
        }
    },
    created() { },
    mounted() {
        this.getTag();
    },
    methods: {
        navigateTo(item) {
            if (item === 'Home') {
                this.$router.push('');
            } else {
                alert("Still developed")
            }
        },
        uploadFiles() {
            if (this.originalFileList.length == 0 || this.artifactFileList.length == 0) {
                alert('Please select two video files.');
                //console.log('Please select two video files.');
                return;
            }

            if (this.originalFileList.length != this.artifactFileList.length) {
                alert('Please match the number of original videos and artifact videos.');
                //console.log('Please match the number of original videos and artifact videos.');
                return;
            }

            if (this.clickedTagBtn.length == 0) {
                alert('Please enter a Tag.');
                //console.log('Please enter a Tag.');
                return;
            }

            if (this.clickedUploadOption == null) {
                alert('Please select upload option.');
                //console.log('Please select upload option.');
                return;
            }

            var formData = new FormData();
            //console.log("Created formData");

            // original video formData에 저장
            for (let i = 0; i < this.originalFileList.length; i++) {
                formData.append("original", this.originalFileList[i])
                //console.log("original video");
                for (let key of formData.keys()) {
                    console.log(key);
                }
                for (let value of formData.values()) {
                    console.log(value);
                }
            }
            // artifact video formData에 저장
            for (let i = 0; i < this.artifactFileList.length; i++) {
                formData.append("artifact", this.artifactFileList[i])
                //console.log("artifact video");
                for (let key of formData.keys()) {
                    console.log(key);
                }
                for (let value of formData.values()) {
                    console.log(value);
                }
            }
            // 이 데이터에서 선택된 tag post하는 method
            formData.append("tags", this.clickedTagBtn)

            // video sending method
            if (this.clickedUploadOption == "video") {
                //console.log("video");
                // label/
                axios
                    .post(this.baseUrl + 'upload/video', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((response) => {
                        alert("Data transfer successful.");
                        this.originalFileList = [];
                        this.artifactFileList = [];
                        console.log(response.data);
                    })
                    .catch((error) => {
                        alert(error);
                        console.error(error);
                    });
            } else if (this.clickedUploadOption == "image") {
                //console.log("image")
                // image sending method ex)upload/image
                axios
                    .post(this.baseUrl + 'upload/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((response) => {
                        alert("Data transfer successful.");
                        this.originalFileList = [];
                        this.artifactFileList = [];
                        console.log(response.data);
                    })
                    .catch((error) => {
                        alert(error);
                        console.error(error);
                    });
            }
        },
        clickUploadOptions(index) {
            if (this.activeButtonIndex === index) {
                // 이미 활성화된 버튼을 다시 클릭하면 비활성화하고 변수를 null로 설정
                this.activeButtonIndex = null;
                this.clickedUploadOption = null;
            } else {
                this.activeButtonIndex = index;
                this.clickedUploadOption = this.uploadOptions[index]; // 클릭된 옵션을 저장
            }
        },
        deleteTag() {
            if (this.clickedTagBtn.length == 0) {
                alert("Please Clicke the Button")
            } else {
                axios
                    .post(this.baseUrl + 'deleteTag', {
                        tags: this.clickedTagBtn
                    })
                    .then((response) => {
                        console.log(response);
                        this.getTag();
                        this.clickTagBtn = [];
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        },
        // tag 가져오는 method
        getTag() {
            axios
                .get(this.baseUrl + 'getTag')
                .then((response) => {
                    if (response.data != null) {
                        if (response.data != null) {
                            this.tag = response.data;
                        }
                        this.isClicked = [];
                        this.activeButtonIndex = null;
                        this.clickedUploadOption = null;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        // tag를 추가하는 method
        addTag() {
            if (this.tagInput == '') {
                alert("Please enter a value.");
                return;
            } else if (this.tag && this.tag.includes(this.tagInput)) {
                alert("Already exist tag.");
                return;
            }
            this.tag.push(this.tagInput)
            //console.log(this.tagInput)

            axios
                .post(this.baseUrl + 'addTag', {
                    tag: this.tagInput
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
            this.tagInput = '';
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
        onOriginalClick() {
            this.$refs.originalFileInput.click()
            //console.log(this.$refs.originalFileInput)
        },
        onArtifactClick() {
            this.$refs.artifactFileInput.click()
        },
        onDragenter() {
            this.isDragged = true
        },
        onDragleave() {
            this.isDragged = false
        },
        onDragover(event) {
            event.preventDefault()
        },
        onOriginalDrop(event) {
            event.preventDefault();
            this.isDragged = false
            const files = event.dataTransfer.files
            this.addOriginalFiles(files)
        },
        onArtifactDrop(event) {
            event.preventDefault();
            this.isDragged = false
            const files = event.dataTransfer.files
            this.addArtifactFiles(files)
        },
        onOriginalFileChange(event) {
            const files = event.target.files;
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedOriginalFiles.push(e.target.result);
                }
                reader.readAsDataURL(files[0]);
            }
            this.addOriginalFiles(files)
        },
        onArtifactFileChange(event) {
            const files = event.target.files;
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedOriginalFiles.push(e.target.result);
                }
                reader.readAsDataURL(files[0]);
            }
            this.addArtifactFiles(files)
        },
        async addOriginalFiles(files) {
            for (var i = 0; i < files.length; i++) {
                const src = await this.readOriginalFiles(files[i])
                files[i].src = src
                this.originalFileList.push(files[i])
            }
        },
        async addArtifactFiles(files) {
            for (var i = 0; i < files.length; i++) {
                const src = await this.readArtifactFiles(files[i])
                files[i].src = src
                this.artifactFileList.push(files[i])
            }
        },
        async readOriginalFiles(files) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    resolve(e.target.result)
                }
                reader.readAsDataURL(files)
            })
        },
        async readArtifactFiles(files) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    resolve(e.target.result)
                }
                reader.readAsDataURL(files)
            })
        },
        originalHandleRemove(index) {
            //console.log("remove")
            this.originalFileList.splice(index, 1)
        },
        artifactHandleRemove(index) {
            //console.log("remove")
            this.artifactFileList.splice(index, 1)
        }
    },
}
</script>

<style lang="scss">
@import '../main.css';
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap');
</style>
