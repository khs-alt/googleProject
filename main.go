package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"text/template"
	"time"

	"github.com/google/uuid"
)

type UserScoringData struct {
	UserID  uuid.UUID
	VideoID []int
	Time    time.Time
	Sex     string
	Score   int
}

//var u = UserScoringData{}

func makeData() *UserScoringData {
	u := UserScoringData{}
	return &u
}

func getUserID() uuid.UUID {
	userId := uuid.Must(uuid.NewRandom())
	return userId
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("mainPage.html")
	if err != nil {
		panic(err)
	}
	u := makeData()
	u.Time = time.Now()
	u.UserID = getUserID()
	u.Score = 100
	fmt.Println(u)
	err = t.Execute(w, u)
	if err != nil {
		fmt.Println(err)
	}
}

func scoringHandler(w http.ResponseWriter, r *http.Request) {

}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method)
	fmt.Println(http.MethodPost)
	if r.Method == http.MethodPost {
		fmt.Println(r)
		data := r.FormValue("gender")
		fmt.Fprintf(w, data)
		fmt.Println(data)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func reqeustHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		contentType := r.Header.Get("Content-Type")
		if contentType != "application/json" {
			http.Error(w, "Invalid Content-Type", http.StatusBadRequest)
			return
		}

		// 요청 본문 읽기
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		// JSON 데이터 디코딩
		var data map[string]interface{}
		err = json.Unmarshal(body, &data)
		if err != nil {
			http.Error(w, "Error decoding JSON data", http.StatusBadRequest)
			return
		}

		// 받은 데이터 출력
		fmt.Println("Received Data:", data)
		fmt.Println("Received Data:", data["gender"], data["name"])

		// 응답 보내기
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Data received successfully"))
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func tmpHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("tmp.html")
	if err != nil {
		panic(err)
	}
	u := makeData()
	err = t.Execute(w, u)
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	http.HandleFunc("/hello", reqeustHandler)
	http.HandleFunc("/main", mainHandler)
	http.HandleFunc("/scoringData", scoringHandler)
	http.HandleFunc("/tmp", tmpHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
