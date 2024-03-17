package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
)

var browser *rod.Browser

type ImageRequest struct {
	Title string `json:"title"`
}

func InitBrowser() {
	path, _ := launcher.LookPath()
	u := launcher.New().Bin(path).MustLaunch()
	browser = rod.New().ControlURL(u).MustConnect()
}

func DeinitBrowser() {
	browser.MustClose()
}

func ImageHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Add("Access-Control-Allow-Headers", "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date")
	w.Header().Add("Content-Type", "application/json")

	var err error

	var imageRequest ImageRequest

	err = json.NewDecoder(r.Body).Decode(&imageRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	url := fmt.Sprintf("https://www.google.com/search?tbm=isch&q=%s", imageRequest.Title)
	page := browser.MustPage(url).MustWaitLoad()
	image_container := page.MustElement("#islrg > :first-child > div > a > div > img")
	image_src := image_container.MustAttribute("src")

	fmt.Fprintf(w, *image_src)
}
