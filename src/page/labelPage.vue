<template>
  <div class="menu">
    <button class="btn-style" @click="navigateTo(this.menuBar)">{{ this.menuBar }}</button>
  </div>
  <!-- <div class="imgBoxWrapper">
      <img v-for="index in  patchImageList" :key="index" :src="index" class="imgBog" />
    </div> -->
  <div class="labelContainor">
    <div class="imageContainor">
      <div class="image-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item, index) in originalPatchImageList" :key="index"
            :class="addBorder(index)"
            class="image-grid-item">
            <img :src="item" class="imageStyle" />
          </div>
        </div>
      </div>
      <div class="image-grid-wrapper">
        <div class="image-grid">
          <div v-for="(item, index) in artifactPatchImageList" :key="index"
            :class="addBorder(index)"
            class="image-grid-item">
            <img :src="item" class="imageStyle" />
          </div>
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    <div class="patchbtnContainor">
      <div>
        <div class="selected-patch-container">
          <img :src="originalPatchImageList[patchIndex]" class="selected-patch" alt="original">
          <label>: original</label>
          <img :src="artifactPatchImageList[patchIndex]" class="selected-patch" alt="artifact">
          <label>: artifact</label>
        </div>
      </div>
      <div class="btnContainor">
        <!-- <img class="imgStyle" :src="this.imageList[1]" /> -->
        <button v-for="a in 6" :key="a" v-on:click="labeling(a - 1)" class="scoreButton"
          :class="{ 'pressed': this.isPressed === a - 1 }">{{ buttonString[a - 1]
          }}</button>
      </div>
      <div class="btnContainor">
        <button class="scoreButton" @click="changeBackImage()">Previous Page</button>
        <button class="scoreButton" @click="changeNextImage()">Next Page</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'scoringPage',
  data() {
    return {
      buttonString: ["0", "1", "2", "3", "4", "5"],
      originalPatchImageList: [],
      artifactPatchImageList: [],
      selectedImage: "",
      patchImageList: [require('../images/1.jpg'), require('../images/1.jpg')], //Patch 이미지 리스트
      patchSize: [], //Patch 이미지의 사이즈(총 개수, 가로, 세로)
      patchIndex: 0, //Patch 이미지의 인덱스
      patchLength: 510, //Patch 이미지의 총 개수
      patchColumn: 17, //Patch 이미지의 가로
      patchRow: 30, //Patch 이미지의 세로
      userLabeling: [],
      isPressed: -1, //눌린 점수 체크
      clickedButton: 0,
      isClicked: false,
      menuBar: 'Home',
      currentPage: 0, //현재 이미지의 번호
      lastPage: false,
      baseUrl: "http://localhost:8000",
      isSubmitted: false,
    }
  },
  created() {
    this.getImages();
  },
  mounted() {
    this.getPatchImagesTemp();
    window.addEventListener('keydown', this.keydown);
  },
  unmounted() {
    window.removeEventListener('keydown', this.keydown);
  },

  methods: {
    keydown(e) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.changeBackPatchImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.changeNextPatchImage();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.changeUpImage();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.changeDowmImage();
          break;
        case '0':
          this.labeling(0);
          break;
        case '1':
          this.labeling(1);
          break;
        case '2':
          this.labeling(2);
          break;
        case '3':
          this.labeling(3);
          break;
        case '4':
          this.labeling(4);
          break;
        case '5':
          this.labeling(5);
          break;
      }
    },

    //테두리 주는 함수
    addBorder(index) {
      if (this.patchIndex === index) {
        return 'highlight-border';
      } else if (this.userLabeling[index] > 0) {
        return 'labeling-complate';
      } else {
        return '';
      }
    },

    // TODO: 임시로 로컬에서 patch 이미지 가져오는 method 백엔드 연결하면 삭제하기
    // 임시로 로컬에서 patch 이미지 가져오는 method
    async getPatchImagesTemp() {
      for (let i = 0; i < this.patchRow; i++) {
        for (let j = 0; j < this.patchColumn; j++) {
          let image = require(`../images/patches/original/denoised_frame_0001_30000_patch_${i}_${j}.png`)
          this.originalPatchImageList.push(image)

        }
      }
      for (let i = 0; i < this.patchRow; i++) {
        for (let j = 0; j < this.patchColumn; j++) {
          let image = require(`../images/patches/artifact/denoised_frame_0002_30000_patch_${i}_${j}.png`)
          this.artifactPatchImageList.push(image)
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

    // 점수 부여 및 다음 Patch 이미지로 변경
    labeling(num) {
      console.log(this.patchIndex);
      this.userLabeling[this.patchIndex] = num;
      console.log(this.userLabeling);
      if(this.patchIndex + 1 >= this.patchLength) {
        alert("this is last patch image");
      } else this.changeNextPatchImage();
    },

    changeNextPatchImage() {
      this.patchIndex = this.patchIndex + 1 > this.patchLength - 1 ? 0 : this.patchIndex + 1;
      console.log(this.patchIndex);

      if (this.userLabeling[this.patchIndex] >= 0) {
        this.isPressed = this.userLabeling[this.patchIndex];
        return;
      }

      this.isPressed = -1;
    },

    // 이전 이미지로 변경
    changeBackPatchImage() {
      this.patchIndex = this.patchIndex - 1 < 0 ? this.patchLength - 1: this.patchIndex - 1; 
      console.log(this.patchIndex);
      if (this.userLabeling[this.patchIndex] >= 0) {
        this.isPressed = this.userLabeling[this.patchIndex];
        return;
      }

      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //위 화살표 누르면 한 줄 위로 올라가는 method
    changeUpImage() {
      if (this.patchIndex - this.patchColumn <= 0) {
        this.patchIndex = this.patchLength - (this.patchColumn - this.patchIndex);
      } else {
        this.patchIndex -= this.patchColumn;
      }

      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //아래 화살표 누르면 한 줄 아래로 내려가는 method
    changeDowmImage() {
      if (this.patchIndex + this.patchColumn >= this.patchLength) {
        this.patchIndex = this.patchColumn - (this.patchLength - this.patchIndex);
      } else {
        this.patchIndex += this.patchColumn;
      }

      this.isPressed = this.userLabeling[this.patchIndex];
    },

    //부여된 점수 back-end로 전송
    postUserLabeling() {
      for(let i = 0; i < this.patchLength; i++) {
        if(this.userLabeling[i] === undefined) {
          this.userLabeling[i] = 0;
        }
      }
      console.log(this.userLabeling);

      axios
        .post(this.baseUrl + `/label/` + this.currentPage, {
          data: this.userLabeling
        })
        .then((response) => {
          console.log(response);
          this.userLabeling = [];
        })
        .catch((error) => {
          console.log(error);
        })
    },

    changeBackImage() {
      if(this.currentPage === 0) {
        alert("this is first image");
      } else {
        this.currentPage -= 1;
        this.getImages();
      }
    },

    changeNextImage() {
      if(this.currentPage >= this.patchLength) {
        alert("this is last image");
      } else {

        this.postUserLabeling();
        this.currentPage += 1;
        this.getImages();
      }
    },

    //TODO: 누르면 다시 해제되게 바꾸기
    // score button 눌렸는지 안눌렸는지 확인하는 버튼
    toggleButton(index) {
      this.isPressed = index;
    },
  },
}
</script>

<style>
@import '../main.css';
</style>
