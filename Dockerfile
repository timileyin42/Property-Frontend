# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# 1) Install deps first (best cache usage)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copy only what Vite actually needs (avoids ghost cache)
COPY index.html ./
COPY vite.config.* ./
COPY tsconfig.* ./
COPY public ./public
COPY src ./src

# 3) Build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_OPTIONS=--max_old_space_size=4096

# 4) Build
RUN npm run build


# ---------- Serve stage ----------
FROM nginx:1.27-alpine

# SPA nginx config
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
