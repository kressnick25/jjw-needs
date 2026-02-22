FROM docker.io/node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NOTIFY_URL
ENV VITE_NOTIFY_URL=${NOTIFY_URL}
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:stable-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/kressnick25/jjw-needs"
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
