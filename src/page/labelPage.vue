<template>
  <div class="menu">
    <a v-for="item in menuBar" :key="item" @click="navigateTo(item)">{{ item }}</a>
  </div>
  <div>
    <!-- <div class="imgBoxWrapper">
      <img v-for="index in  patchImageList" :key="index" :src="index" class="imgBog" />
    </div> -->
    <div>
      <div class="imamge-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item, index) in originalImageList" :key="index" class="image-grid-item">
            <img :src="item" class="imageStyle"/>
          </div>
        </div>
      </div>
      <div class="imamge-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item,index) in artifactImageList" :key="index" class="image-grid-item">
            <img :src="item" class="imageStyle"/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-for="index in patchIndex" :key="index" class="selected-patch-container">
        <img :src="originalImageList[index]" class="selected-patch" alt="original">
        <label>original</label>
        <img :src="artifactImageList[index]" class="selected-patch" alt="artifact">
        <label>artifact</label>
      </div>
    </div>
    <!-- <img class="imgStyle" :src="this.imageList[1]" /> -->
    <button v-for="a in 2" :key="a" v-on:click="clickedButton = a" class="scoreButton" :class="{ pressed: isPressed[a] }"
      @click="toggleButton(a)">{{ buttonString[a] }}</button>
    <button class="scoreButton" @click="changeNextImage(clickedButton)">next</button>
    <p />
    <button v-on="click" class="scoreButton submit" @click="submitLabeling()">submit</button>
    <p>Clicked button : {{ clickedButton }} userLabeling : {{ userLabeling }}</p>
    <div>{{ currentImage }}</div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'scoringPage',
  data() {
    return {
      buttonString: ["", "NO", "YES"],
      originalImageList: [],
      artifactImageList: [],
      patchImageList: [require('../images/1.jpg'), require('../images/1.jpg')],
      patchIndex: [13,],
      userLabeling: [],
      isPressed: [false, false, false],
      clickedButton: 0,
      isClicked: false,
      menuBar: ['Home'],
      currentPage: 0,
      lastPage: false,
      currentImage: 0,
      baseUrl: "http://34.64.195.7:8000",
      isSubmitted: false,
      patchSize: [],
    }
  },
  created() {
    this.getImages();
  },
  mounted() {
    this.changeVideoButton;
    this.getPatchImagesTemp();
  },
  methods: {
    // TODO: 임시로 로컬에서 patch 이미지 가져오는 method 백엔드 연결하면 삭제하기
    // 임시로 로컬에서 patch 이미지 가져오는 method
    async getPatchImagesTemp(){
      for(let i = 0; i < 30; i++){
        for(let j = 0; j < 17; j++){
          let image = require(`../images/patches/original/denoised_frame_0001_30000_patch_${i}_${j}.png`)
          this.originalImageList.push(image)
        }
      }
      for(let i = 0; i < 30; i++){
        for(let j = 0; j < 17; j++){
          let image = require(`../images/patches/artifact/denoised_frame_0002_30000_patch_${i}_${j}.png`)
          this.artifactImageList.push(image)
        }
      }
    },  
    // Backend에서 patch size(행렬) 가져오는 method
    // TODO: 백엔드 연결 필요
    getPatchSize() {
      axios
        .get(this.baseUrl + `/patchsize`)
        .then((response) => {
          console.log("axios get patch size success\n");
          this.patchSize = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    //TODO: Backend에서 patch image 가져오는 method 백엔드 연결 필요 
    getPatchImages() {
      axios
        .get(this.baseUrl + `/patch`)
        .then((response) => {
          console.log("axios get patch image success\n");
          this.patchImageList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // TODO: 백엔드 연결 필요 
    getPatchIndex() {
      axios
        .get(this.baseUrl + `/patchindex`)
        .then((response) => {
          console.log("axios get patch index success\n");
          this.patchIndex = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },

    navigateTo(item) {
      if (item === 'Home') {
        this.$router.push('/');
      } else {
        alert("Still developed")
      }
    },
    leftImageNoartifact() {
      return String(this.baseUrl + '/postimage/' + (this.currentImage) + '/' + (this.imageList.length + 1))
    },
    rightImageYesartifact() {
      return String(this.baseUrl + '/postimage/' + (this.currentImage) + '/' + (this.imageList.length + 2))
    },
    submitLabeling() {
      if (this.isSubmitted == true) {
        alert("Already Submitted!");
        return;
      }

      let isartifact
      for (var i = 0; i < 3; i++) {
        if (this.isPressed[i]) {
          this.isClicked = true
          if (i == 1) {
            isartifact = false
            this.userLabeling.push(isartifact)
          } else if (i == 2) {
            isartifact = true
            this.userLabeling.push(isartifact)
          }
        }
      }

      if (this.isClicked == false) {
        alert("Please choose YES or NO!")
      } else {
        // TODO: axios로 backend통신하면 삭제할 것
        this.isSubmitted = true;
        alert("Succesfully Submitted!");
        axios
          .post("http://192.168.0.9:8000/getdata", {
            title: "labeling data",
            label: this.userLabeling,
            labelId: this.userLabelingId,
            userCurrentPage: this.currentUser
          })
          .then(res => {
            console.log(res)
            alert(res.data)
            //after post we have to init data form userScoring and currentPage
            this.isSubmitted = true
            this.currentPage = 0
            this.userLabeling = []
            this.userLabelingId
            alert("Succesfully Submitted!");
          })
          .catch(error => {
            this.isSubmitted = false;
            alert("There is error!");
            console.error(error);
          })
      }
    },
    // Backend에서 greed image 가져오는 method
    getImages() {
      axios
        .get(this.baseUrl + `/label/` + this.currentPage, {})
        .then((response) => {
          console.log("axios get label image success\n");
          this.imageList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // 다음 이미지로 변경
    changeNextImage(num) {
      // TODO: 백엔드 연결하면 삭제할 것
      // if(this.currentPage == this.lastPage){
      //   alert("This is last page!");
      //   return;
      // }

      if (this.clickedButton == 0) {
        alert("Please choose YES or NO.")
        return;
      }

      if (this.isSubmitted == false) {
        let isartifact;
        if (num == 1) {
          isartifact = false;
        } else if (num == 2) {
          isartifact = true;
        }
        this.clickedButton = 0
        this.isPressed = [false, false, false]
        this.userLabeling.push(isartifact)
        this.currentPage += 1
        this.isClicked = false
      } else {
        this.clickedButton = 0
        this.isPressed = [false, false, false]
        this.currentPage += 1
        this.isClicked = false
        this.isSubmitted = false
      }

      if (this.currentPage >= this.imageList.length - 1) {
        this.lastPage = true
      }

    },
    // 이전 이미지로 변경
    changeBackImage() {
      this.isPressed = [false, false, false, false, false, false, false, false, false, false]
      if (this.currentPage <= 0) {
        this.currentPage = 0
        alert("This is first page")
      }
      else {
        this.userLabeling.pop()
        this.currentPage -= 1
      }
      if (this.currentPage < this.imageList.length) {
        this.lastPage = false
      }
    },
    alreadyClicked() {
      if (this.clickedNo || this.clickedYes) {
        this.$refs
        return true;
      } else {
        return false;
      }
    },
    // score button 눌렸는지 안눌렸는지 확인하는 버튼
    toggleButton(index) {
      this.isPressed = [false, false]
      this.isPressed[index] = !this.isPressed[index]
    },
  },
}
</script>

<style>
@import '../main.css';
</style>
