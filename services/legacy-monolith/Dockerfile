# Użyj oficjalnego, lekkiego obrazu Node.js w wersji 18 jako bazy
FROM node:18-alpine

# Ustaw folder roboczy wewnątrz kontenera na /app
WORKDIR /app

# Skopiuj plik package.json (i package-lock.json) do kontenera
# Robimy to jako osobny krok, aby Docker mógł cache'ować zainstalowane zależności
COPY package*.json ./

# Uruchom instalację zależności zdefiniowanych w package.json
RUN npm install

# Skopiuj resztę plików aplikacji (kod źródłowy) do kontenera
COPY . .

# Ujawnij port 3000, na którym nasza aplikacja będzie nasłuchiwać
EXPOSE 3000

# Komenda, która zostanie uruchomiona po starcie kontenera
# Używamy skryptu 'start' z package.json (czyli 'nodemon index.js')
CMD [ "npm", "start" ]