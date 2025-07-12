# Интерактивные Часы

Интерактивное приложение для обучения определению времени на аналоговых часах.

## Установка и запуск

### Предварительные требования
- Node.js (версия 18 или выше)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Настройка переменных окружения
1. Создайте файл `.env.local` в корне проекта
2. Добавьте ваш Gemini API ключ:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Получите API ключ на [Google AI Studio](https://makersuite.google.com/app/apikey)

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена
```bash
npm run build
```

Собранные файлы будут в папке `dist/`

### Предварительный просмотр сборки
```bash
npm run preview
```

## Деплой на Netlify

### Автоматический деплой через GitHub
1. Загрузите код на GitHub
2. Подключите репозиторий к Netlify
3. В настройках сайта добавьте переменную окружения:
   - **Ключ:** `GEMINI_API_KEY`
   - **Значение:** ваш Gemini API ключ
4. Настройки билда:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Ручной деплой
1. Соберите проект: `npm run build`
2. Загрузите содержимое папки `dist/` на Netlify

## Технологии
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## Структура проекта
```
├── components/          # React компоненты
│   ├── AnalogClock.tsx
│   ├── ControlButtons.tsx
│   ├── DifficultySelector.tsx
│   ├── ScoreBoard.tsx
│   └── TaskPanel.tsx
├── App.tsx             # Главный компонент
├── index.tsx           # Точка входа
├── types.ts            # TypeScript типы
├── constants.ts        # Константы
└── vite.config.ts      # Конфигурация Vite
``` 
