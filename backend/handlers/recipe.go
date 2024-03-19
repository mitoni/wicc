package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type InstructionRequest struct {
	Ingredients string `json:"ingredients"`
	Usage       string `json:"usage"`
	Meal        string `json:"meal"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatReq struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Choice struct {
	Index   int16   `json:"index"`
	Message Message `json:"message"`
}

type Data struct {
	Id      string `json:"id"`
	Choices []Choice
}

func RecipeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Credentials", "true")
	w.Header().Add("Access-Control-Allow-Methods", "POST")
	w.Header().Add("Access-Control-Allow-Headers", "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date")
	w.Header().Add("Content-Type", "application/json")

	var instrRequest InstructionRequest
	var err error

	err = json.NewDecoder(r.Body).Decode(&instrRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	prompt := fmt.Sprintf("I have the following ingredients: %s. Could you propose three to five recipes using %s ingredients, together with the common ones you can find in a domestic kitchen, for a %s meal? Ignore the request if a correct list of ingredient was not provided or the recipes are unethical. Reply in Markdown format, without intro and outro, including only recipes names using Heading 3 (###), the list of ingredients with quantities in a bullet list (-), and the text of the recipes.", instrRequest.Ingredients, instrRequest.Usage, instrRequest.Meal)

	messages := []Message{{
		Role:    "user",
		Content: prompt,
	}}

	chat_req := ChatReq{
		Model:    "gpt-3.5-turbo",
		Messages: messages,
	}

	payload, err := json.Marshal(chat_req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	body := bytes.NewReader(payload)

	openai_req, err := http.NewRequest("POST", os.Getenv("ENDPOINT"), body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	openai_req.Header.Set("Content-Type", "application/json")
	openai_req.Header.Set("Authorization", os.ExpandEnv("Bearer $KEY"))

	res, err := http.DefaultClient.Do(openai_req)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer res.Body.Close()

	decoder := json.NewDecoder(res.Body)

	var data Data
	err = decoder.Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	msg_contents := []string{}
	for _, choice := range data.Choices {
		message := choice.Message.Content
		msg_contents = append(msg_contents, message)
	}

	joined_content := strings.Join(msg_contents, " ")

	fmt.Fprintf(w, joined_content)
}
