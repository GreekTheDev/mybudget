# MyBudget - Aplikacja do zarządzania budżetem osobistym

Aplikacja MyBudget to nowoczesne narzędzie do zarządzania budżetem osobistym, stworzone przy użyciu React, TypeScript i Vite.

## Technologie

- React 19
- TypeScript
- Vite 6
- CSS Modules
- React Router

## Uruchamianie lokalnie

1. Sklonuj repozytorium
2. Zainstaluj zależności:
   ```
   npm install
   ```
3. Uruchom aplikację w trybie deweloperskim:
   ```
   npm run dev
   ```
4. Zbuduj aplikację:
   ```
   npm run build
   ```
5. Uruchom zbudowaną aplikację:
   ```
   npm run preview
   ```

## Wdrażanie na AWS Amplify

### Konfiguracja AWS Amplify

1. Zaloguj się do konsoli AWS i przejdź do usługi AWS Amplify
2. Kliknij "Nowa aplikacja" > "Host web app"
3. Wybierz swoje repozytorium kodu (GitHub, GitLab, Bitbucket)
4. Wybierz repozytorium i gałąź, którą chcesz wdrożyć
5. Skonfiguruj ustawienia budowania:

   - Build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

6. Kliknij "Zapisz i wdróż"

### Rozwiązywanie problemów z wdrażaniem

Jeśli napotkasz problemy z wdrażaniem:

1. Sprawdź logi budowania w konsoli AWS Amplify
2. Upewnij się, że plik `amplify.yml` jest poprawnie skonfigurowany
3. Sprawdź, czy wszystkie zależności są poprawnie zainstalowane
4. Upewnij się, że proces budowania kończy się sukcesem lokalnie

### Ważne pliki konfiguracyjne

- `amplify.yml` - konfiguracja AWS Amplify
- `buildspec.yml` - konfiguracja AWS CodeBuild
- `vite.config.ts` - konfiguracja Vite
- `.gitignore` - pliki ignorowane przez Git
```
