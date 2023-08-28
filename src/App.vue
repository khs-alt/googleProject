<template>
  <div class="menu">
    <a v-for="a in menuBar" :key="a">{{ a }}</a>
  </div>
  <div class="videoPlayer">
    <transition name="fade" mode="out-in" appear >
      <video id="videoId" :key="currentPage" ref="videoRef" :src="videoList[currentPage]" controls preload="auto" controlsList="nodownload" width="550">
    </video>
    </transition>

  </div>
  <div>
    <button v-on="click" class="scoreButton" @click="changeBackVideo()">back</button>
    <button v-on:click="clickedButton = 1" id="first" class="scoreButton" :class="{pressed: isPressed[0]}" @click="toggleButton(0)">1</button>
    <button v-on:click="clickedButton = 2" id="second" class="scoreButton" :class="{pressed: isPressed[1]}" @click="toggleButton(1)">2</button>
    <button v-on:click="clickedButton = 3" id="third" class="scoreButton" :class="{pressed: isPressed[2]}" @click="toggleButton(2)">3</button>
    <button v-on:click="clickedButton = 4" id="fourth" class="scoreButton" :class="{pressed: isPressed[3]}" @click="toggleButton(3)">4</button>
    <button v-on:click="clickedButton = 5" id="fifth" class="scoreButton" :class="{pressed: isPressed[4]}" @click="toggleButton(4)">5</button>
    <button v-if="lastPage" v-on="click" class="scoreButton submit" @click="submitscoring()">submit</button>
    <button v-else v-on="click" class="scoreButton" @click="changeNextVideo(clickedButton)">next</button>
    <p>Clicked button : {{ clickedButton }} userScoring : {{ userScoring }}</p>
  </div>
</template>


<script>
import axios from 'axios'
export default {
  name: 'App',
  data(){
    return{
      userScoring : [],
      videoList : [require('./videos/20230726_213056.mp4'), require('./videos/20230726_213255.mp4')],
      scoreNum : [1,2,3,4,5],
      isPressed : [false,false,false,false,false],
      clickedButton : 0,
      menuBar:['Home', 'Test'],
      currentPage : 0,
      lastPage : false
    }
  },
  methods: {
    submitscoring(){
      this.userScoring.push(this.clickedButton)
      axios.post("http://192.168.0.9:8000/getdata",{
        score : this.userScoring,
      })
      .then(res  => {
        console.log(res)
      })
      .catch( error => {
        console.error(error);
      })
    },
    changeNextVideo(num){
      if (this.clickedButton == 0){
        alert("Please choose score.")
      }
      else{
      this.clickedButton = 0      
      this.isPressed = [false,false,false,false,false]
      this.userScoring.push(num)
      this.currentPage += 1
      }
      if(this.currentPage >= this.videoList.length -1){
        this.lastPage = true
      }
    },
    changeBackVideo(){
      this.isPressed = [false,false,false,false,false]
      if (this.currentPage <= 0){
        this.currentPage = 0
        alert("This is first page")
      }
      else{
        this.userScoring.pop()
        this.currentPage -= 1
      }
      if(this.currentPage < this.videoList.length){
        this.lastPage = false
      }
    },
    toggleButton(index) {
      this.isPressed = [false,false,false,false,false]
      this.isPressed[index] = !this.isPressed[index]
    },
  },
}
</script>

<style>
.videoPlayer{
  padding: 15px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.menu{
  background: darkslateblue;
  padding: 15px;
  border-radius: 5px;
}
.menu a{
  color: white;
  padding: 10px;
}
.scoreButton{
  box-sizing: border-box;
  appearance: none;
  background-color: transparent;
  border: 2px solid darkslateblue;
  border-radius: 0.6em;
  color: darkslateblue;
  cursor: pointer;
  display: in;
  align-self: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  margin: 20px;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;

  &:hover,
  &:focus {
    color: white;
    box-shadow: 0 0 40px 40px darkslateblue inset;
    outline: 0;
  }
  transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  &:hover {
    box-shadow: 0 0 40px 40px darkslateblue inset;
  }
}
.submit{
  border: 2px solid red;
  color: red;
  &:hover,
  &:focus {
    color: white;
    box-shadow: 0 0 40px 40px red inset;
    outline: 0;
  }
  transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  &:hover {
    box-shadow: 0 0 40px 40px red inset;
  }
}
.pressed{
  box-sizing: border-box;
  appearance: none;
  background-color: darkslateblue;
  border: 2px solid darkslateblue;
  border-radius: 0.6em;
  color: white;
  cursor: pointer;
  display: in;
  align-self: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  margin: 20px;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active-from, .fade-enter-to {
  opacity: 1;
}
</style>
