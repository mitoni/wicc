FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY main.go ./
COPY handlers ./handlers

RUN apk update && apk add chromium

RUN CGO_ENABLED=0 GOOS=linux go build -o /wicc

EXPOSE 8080

CMD APP_ENV=production /wicc
