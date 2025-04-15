# Aplikacja do zarządzania zadaniami (Next.js + React)

Frontendowa aplikacja napisana w **Next.js 15** i **React 19**, stworzona jako projekt edukacyjny w trakcie nauki Reacta.  
Brak backendu – wszystkie dane przechowywane lokalnie z wykorzystaniem `localStorage`.

---

## Technologie

### Frameworki i biblioteki
- **Next.js 15 (App Router)**
- **React 19** – komponenty funkcyjne, hooki, lazy loading
- **Tailwind CSS + Material UI**

### Formularze i dane
- **Formik + Yup** 
- **LocalStorage API** 

---

## Zastosowane techniki

- **Zarządzanie stanem**: Context API (`User`, `Theme`, `Notification`, `UserActivity`) + `useReducer` w wybranych komponentach
- **Wydajność**: `React.lazy`, `Suspense`, `useMemo`, `useCallback`
- **Import / Eksport danych**: obsługa formatów **JSON**, **CSV**, **XML**
- **Dynamiczne komponenty**: kalendarz, powiadomienia, załączniki, komentarze, udostępnianie zadań
- **Tryb jasny/ciemny**: przechowywanie preferencji z użyciem kontekstu
- **Panel administracyjny**: zarządzanie użytkownikami oraz logi aktywności

---

## Funkcje aplikacji

- Zarządzanie zadaniami: CRUD, priorytety, statusy
- Autoryzacja użytkowników i system ról
- Udostępnianie zadań innym użytkownikom
- Komentarze i dodawanie załączników do zadań
- Eksport i import danych zadań (JSON / CSV / XML)
- System powiadomień
- Dashboard administratora z logami aktywności i zarządzaniem użytkownikami
