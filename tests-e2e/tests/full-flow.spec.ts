import { test, expect } from '@playwright/test';

test('Pełny przepływ użytkownika: Rejestracja, Logowanie, CRUD Projektu', async ({ page }) => {
  // Generujemy unikalnego użytkownika, aby test był powtarzalny
  const timestamp = Date.now();
  const email = `e2e_user_${timestamp}@example.com`;
  const password = 'SecurePassword123!';
  const projectName = `Projekt E2E ${timestamp}`;

  // 1. Wejście na stronę i przekierowanie do logowania
  await page.goto('/');
  await expect(page).toHaveURL(/.*login/);

  // 2. Przejście do rejestracji
  await page.getByRole('link', { name: 'Zarejestruj się' }).click();
  await expect(page).toHaveURL(/.*register/);

  // 3. Rejestracja
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Zarejestruj' }).click();
  
  // Oczekujemy komunikatu sukcesu i przekierowania (lub linku) do logowania
  await expect(page.getByText('Rejestracja pomyślna')).toBeVisible();
  await page.getByRole('link', { name: 'Zaloguj się' }).click();

  // 4. Logowanie
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Zaloguj' }).click();

  // Oczekujemy przekierowania do listy projektów
  await expect(page).toHaveURL(/.*projects/);
  await expect(page.getByRole('heading', { name: 'Twoje Projekty' })).toBeVisible();

  // 5. Dodanie Projektu
  await page.fill('input#title', projectName);
  await page.fill('textarea#description', 'To jest testowy projekt utworzony przez Playwright');
  
  
  const createProjectResponsePromise = page.waitForResponse(response => 
    response.url().includes('/api/projects') && 
    response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Dodaj projekt' }).click();

  const response = await createProjectResponsePromise;
  
  // Teraz sprawdzamy status. Jeśli będzie 401, test padnie tu i od razu powie dlaczego.
  expect([200, 201]).toContain(response.status());

  // 6. Weryfikacja, czy projekt pojawił się na liście
  // Szukamy elementu listy, który zawiera nasz tytuł
  await expect(page.getByText(projectName)).toBeVisible();
  await expect(page.getByText('To jest testowy projekt utworzony przez Playwright')).toBeVisible();

  // 7. Usunięcie Projektu
  // Obsługa okienka dialogowego "confirm" w przeglądarce
  page.on('dialog', dialog => dialog.accept());
  
  // Kliknij "Usuń" przy naszym projekcie
  // Używamy filtru, aby znaleźć przycisk usuwania DLA TEGO KONKRETNEGO projektu
  await page.locator('article')
    .filter({ hasText: projectName })
    .getByRole('button', { name: 'Usuń' })
    .click();

  // 8. Weryfikacja usunięcia
  await expect(page.getByText(projectName)).not.toBeVisible();

  // 9. Wylogowanie
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await expect(page).toHaveURL(/.*login/);
});