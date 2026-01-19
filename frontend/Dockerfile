# frontend/Dockerfile

# ===== Etap 1: Budowanie Aplikacji Vue.js =====
# Używamy oficjalnego obrazu Node.js jako "środowiska budującego"
FROM node:20-alpine AS build

# Ustaw folder roboczy
WORKDIR /app

# Skopiuj package.json i package-lock.json, aby cache'ować zależności
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę kodu źródłowego
COPY . .

# Zbuduj aplikację w trybie produkcyjnym.
# Wynik (statyczne pliki) znajdzie się w folderze /app/dist
RUN npm run build

# ===== Etap 2: Serwowanie Plików przez Nginx =====
# Używamy bardzo lekkiego, oficjalnego obrazu Nginx
FROM nginx:1.23-alpine

# Skopiuj gotowe, statyczne pliki z etapu 'build' do folderu,
# z którego Nginx domyślnie serwuje pliki.
COPY --from=build /app/dist /usr/share/nginx/html

# Skopiuj naszą niestandardową konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ujawnij port 80, na którym Nginx będzie nasłuchiwał
EXPOSE 80

# Komenda startowa, która uruchamia serwer Nginx
CMD ["nginx", "-g", "daemon off;"]