package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

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
	w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date")
	w.Header().Add("Content-Type", "application/json")

	var err error

	var imageRequest ImageRequest

	err = json.NewDecoder(r.Body).Decode(&imageRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	url := fmt.Sprintf("https://www.google.com/search?tbm=isch&q=%s", strings.ReplaceAll(imageRequest.Title, " ", "+"))
	page := browser.MustPage(url).MustWaitLoad()
	// html := page.MustWindowFullscreen().MustHTML()
	// html_str := []byte(html)
	// os.WriteFile(fmt.Sprintf("%s.html", imageRequest.Title), html_str, 0644)
	image_container, err := page.Timeout(10 * time.Second).Element("#search g-img > img")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	image_src := image_container.MustAttribute("src")

	fmt.Fprintf(w, *image_src)
}
