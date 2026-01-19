# Używamy oficjalnego obrazu Microsoftu, który ma już zainstalowane przeglądarki
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Kopiujemy pliki projektu
COPY package*.json ./
RUN npm install

# Kopiujemy resztę (testy i config)
COPY . .

# Domyślna komenda
CMD ["npx", "playwright", "test"]