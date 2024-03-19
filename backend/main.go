package main

import (
	"fmt"
	"log"
	"net/http"
	"wicc/handlers"

	"github.com/go-rod/rod"
	"github.com/joho/godotenv"
)

var browser rod.Browser

func main() {
	var err error

    err = godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize browser for image
	handlers.InitBrowser()
	defer handlers.DeinitBrowser()

	// Handler functions
	http.HandleFunc("/recipes/", handlers.RecipeHandler)
	http.HandleFunc("/image/", handlers.ImageHandler)
	http.HandleFunc("/check/", handlers.HealthCheck)

	port := 8080

	fmt.Printf("Listening on port %d\n", port)

	err = http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}
