# Órarendtervező

A weboldal célja, hogy a felhasználó egyszerre láthassa az összes lehetséges óráját és így dönthessen azok felvételéről.

Az oldal mellékesen egy szakdolgozati téma is.

## 🏗️ Projekt Szerkezete

```
src/
├── components/         # Újrafelhasználható komponensek
│   ├── menu/           # Menu rendszer komponensei
│   │   ├── SubjectAdder.jsx
│   │   ├── ServerQuery.jsx
│   │   ├── ImportExport.jsx
│   │   ├── Settings.jsx
│   │   ├── Help.jsx
│   │   └── Modal.jsx
│   ├── subjects/       # Tárgy kezelő komponensek
│   │   ├── Subject.jsx
│   │   ├── SubjectModal.jsx
│   │   └── CourseModal.jsx
│   ├── timetable/      # Órarend komponensek
│   │   └── Timetable.jsx
│   └── ui/             # Alapvető UI komponensek
│       ├── Button.jsx
│       └── Footer.jsx
├── contexts/           # React Context API
│   ├── index.jsx
│   ├── TimetableContext.jsx
│   └── SettingsContext.jsx
├── utils/              # Segédfüggvények
│   ├── timetableUtils.js
│   └── CanvasExport.js
├── hooks/              # Custom hookok (jövőbeli használatra)
├── App.jsx             # Fő alkalmazás komponens
├── main.jsx            # Belépési pont
└── index.css           # Stílusok
```

## 🧩 Komponens Struktúra

### Menu Rendszer

- **SubjectAdder**: Új tárgy hozzáadása
- **ServerQuery**: ELTE Tanrend adatbázis lekérdezés
- **ImportExport**: JSON és PNG exportálás/importálás
- **Settings**: Megjelenítési beállítások
- **Help**: Súgó és dokumentáció
- **Modal**: Import dialog kezelése

### Tárgy Kezelés

- **Subject**: Egyedi tárgy megjelenítése és kezelése
- **SubjectModal**: Tárgy szerkesztő dialog
- **CourseModal**: Kurzus szerkesztő dialog

### Órarend Rendszer

- **Timetable**: FullCalendar komponens wrapper
- **TimetableContext**: Órarend állapot kezelés
- **SettingsContext**: Beállítások állapot kezelés

### Utility Függvények

- **timetableUtils.js**: Órarend számítások és logika
- **CanvasExport.js**: PNG exportálás funkciók

## 📚 Használt Technológiák

- **React**: https://react.dev
- **Vite**: https://vite.dev
- **Tailwind CSS**: https://tailwindcss.com
- **daisyUI**: https://daisyui.com
- **FullCalendar**: https://fullcalendar.io
- **PrimeReact**: https://primereact.org

## 🚀 Telepítés és Futtatás

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Production build
npm run build

# Build előnézet
npm run preview
```

## 📖 További Dokumentáció

Bővebb információk a [wiki oldalon](https://github.com/Vdor01/orarendtervezo/wiki) találhatók.
