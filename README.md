# Órarendtervező

A weboldal célja, hogy a felhasználó egyszerre láthassa az összes lehetséges óráját és így dönthessen azok felvételéről. Az alkalmazás lehetővé teszi az ELTE Tanrend adatbázisból való tárgykeresést és importálást, valamint a saját órarend tervezését és exportálását.

**Ez a projekt egy szakdolgozati munka keretében készül.**

🌐 **Élő verzió:** [https://orarendtervezo.vercel.app](https://orarendtervezo.vercel.app)

## 🏗️ Projekt Szerkezete

```
src/
├── components/         # Újrafelhasználható komponensek
│   ├── menu/           # Menu rendszer komponensei
│   │   ├── SubjectAdder.jsx      # Új tárgy hozzáadása
│   │   ├── ServerQuery.jsx       # ELTE Tanrend lekérdezés
│   │   ├── ImportExport.jsx      # JSON/PNG export/import
│   │   ├── ImportModal.jsx       # Import dialog kezelés
│   │   ├── Settings.jsx          # Megjelenítési beállítások
│   │   └── Help.jsx              # Súgó és dokumentáció
│   ├── subjects/       # Tárgy kezelő komponensek
│   │   ├── Subject.jsx           # Egyedi tárgy komponens
│   │   ├── SubjectModal.jsx      # Tárgy szerkesztő dialog
│   │   ├── CourseModal.jsx       # Kurzus szerkesztő dialog
│   │   ├── CourseAdder.jsx       # Kurzus hozzáadó komponens
│   │   └── CourseTable.jsx       # Kurzus táblázat megjelenítés
│   ├── timetable/      # Órarend komponensek
│   │   ├── Timetable.jsx         # FullCalendar wrapper
│   │   └── SubjectTimetable.jsx  # Tárgy-specifikus órarend nézet
│   ├── table/          # Táblázat komponensek
│   │   ├── TableHead.jsx         # Táblázat fejléc
│   │   └── TableBody.jsx         # Táblázat törzs
│   └── ui/             # Alapvető UI komponensek
│       ├── Button.jsx            # Testreszabott gomb komponens
│       └── Footer.jsx            # Oldal lábléc
├── contexts/           # React Context API
│   ├── index.jsx                 # Context provider wrapper
│   ├── TimetableContext.jsx      # Órarend állapot kezelés
│   └── StateContext.jsx          # Alkalmazás állapot kezelés
├── utils/              # Segédfüggvények
│   ├── timetableUtils.js         # Órarend számítások és logika
│   ├── serverApi.js              # ELTE API kommunikáció
│   └── CanvasExport.js           # PNG exportálás funkciók
├── hooks/              # Custom React hookok
│   ├── index.js                  # Hook exportok
│   └── useKeyboardShortcuts.js   # Billentyűparancsok kezelése
├── App.jsx             # Fő alkalmazás komponens
├── main.jsx            # Belépési pont
├── Menu.jsx            # Főmenü komponens
├── Subjects.jsx        # Tárgyak lista komponens
├── Courses.jsx         # Kurzusok lista komponens
└── index.css           # Globális stílusok
```

## 🧩 Komponens Struktúra

### 🎛️ Menu Rendszer

- **SubjectAdder**: Új tárgy manuális hozzáadása az órarendhez
- **ServerQuery**: ELTE Tanrend adatbázis lekérdezés és automatikus importálás
- **ImportExport**: JSON és PNG formátumú exportálás/importálás funkciók
- **ImportModal**: Import dialog kezelés a szerver lekérdezések után
- **Settings**: Megjelenítési beállítások és személyre szabás
- **Help**: Súgó, dokumentáció és használati útmutató

### 📚 Tárgy és Kurzus Kezelés

- **Subject**: Egyedi tárgy megjelenítése, szerkesztése és törlése
- **SubjectModal**: Tárgy tulajdonságainak részletes szerkesztő dialog
- **CourseModal**: Kurzus adatainak szerkesztő dialog (időpont, oktató, helyszín)
- **CourseAdder**: Új kurzus hozzáadása meglévő tárgyhoz
- **CourseTable**: Kurzusok táblázatos megjelenítése és kezelése

### 📅 Órarend Rendszer

- **Timetable**: FullCalendar könyvtár wrapper komponens
- **SubjectTimetable**: Tárgy-specifikus órarend nézet és szűrési opciók
- **TimetableContext**: Órarend állapot kezelés, esemény tárolás és manipuláció
- **StateContext**: Alkalmazás-szintű állapot kezelés és beállítások

### 🛠️ Segéd Komponensek és Funkciók

- **TableHead/TableBody**: Újrafelhasználható táblázat komponensek
- **Button**: Egységes design nyelvet biztosító gomb komponens
- **Footer**: Alkalmazás lábléc
- **useKeyboardShortcuts**: Billentyűparancsok kezelése (Ctrl+K)

### 🔧 Utility Függvények

- **timetableUtils.js**: Órarend számítások, időpont kezelés
- **serverApi.js**: ELTE Tanrend API kommunikáció és adatfeldolgozás
- **CanvasExport.js**: PNG exportálás HTML5 Canvas technológiával

## 📚 Használt Technológiák

### 🎯 Frontend Framework és Build Tool

- **React 18.3.1**: Modern React funkcionalitásokkal (Hooks, Context API)
- **Vite 6.0.5**: Gyors fejlesztői környezet és build tool
- **JavaScript (ES6+)**: Modern JavaScript szintaxis és funkciók

### 🎨 UI és Styling

- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **daisyUI 4.12.23**: Tailwind-alapú komponens könyvtár
- **PrimeIcons 7.0.0**: Ikonkészlet a felhasználói felülethez

### 📅 Órarend és Adatkezelés

- **FullCalendar 6.1.15**: Professzionális naptár komponens
    - Core, DayGrid, TimeGrid, React integráció
    - Moment-timezone támogatás időzóna kezeléshez
- **HTML5 Canvas**: PNG exportálás implementációhoz

### 📊 Analitika és Teljesítmény

- **Vercel Analytics 1.5.0**: Felhasználói analitika
- **Vercel Speed Insights 1.2.0**: Teljesítmény monitoring

### 🛠️ Fejlesztői Eszközök

- **ESLint 9.17.0**: Kód minőség és stílus ellenőrzés
- **Prettier 3.4.2**: Automatikus kódformázás
- **PostCSS 8.5.1**: CSS preprocesszor Tailwind-hoz

### 🖼️ Export Funkciók

- **dom-to-image-more 3.6.0**: DOM → kép konvertálás
- **html2canvas 1.4.1**: HTML canvas alapú képgenerálás

## 🚀 Telepítés és Futtatás

### Előfeltételek

- **Node.js** (v16 vagy újabb)
- **npm** vagy **yarn** package manager

### Helyi fejlesztés

```bash
# Repository klónozása
git clone https://github.com/Vdor01/orarendtervezo.git
cd orarendtervezo

# Függőségek telepítése
npm install

# Fejlesztői szerver indítása (http://localhost:5173)
npm run dev

# Production build készítése
npm run build

# Build előnézet
npm run preview

# Kód minőség ellenőrzés
npm run lint
```

### 🌐 Deployment

Az alkalmazás automatikusan települ a Vercel-re minden push után a main ágra.

**Élő verzió:** [https://orarendtervezo.vercel.app](https://orarendtervezo.vercel.app)

### 🔧 Környezeti Változók

Az alkalmazás automatikusan felismeri a futási környezetet:

- **Fejlesztés**: `localhost` vagy `127.0.0.1` - proxy API hívásokhoz
- **Production**: Vercel - `/api/tanrend` végpont használata

## 🎮 Használat

### Gyors kezdés

1. **Tárgy hozzáadása**: Használd a "Hozzáadás" tab-ot új tárgy létrehozásához
2. **ELTE import**: A "Lekérés" tab-ban keress rá tárgy nevére vagy oktató nevére
3. **Órarend szerkesztése**: Kattints a kurzusokra a naptárban a szerkesztéshez
4. **Export**: Az "Import / Export" tab-ban mentheted PNG vagy JSON formátumban

### Billentyűparancsok

- **Ctrl + K**: Váltás a lista és naptár nézet között

### Tippek

- JSON export segítségével biztonsági mentést készíthetsz az órarendedről
- A PNG export tökéletes az órarend nyomtatásához vagy megosztásához

## 🔄 Fejlesztési Állapot

📋 **Részletes fejlesztési állapot és roadmap:** [GitHub Projects](https://github.com/users/Vdor01/projects/3/views/2)

## 📧 Kapcsolat

**Fejlesztő**: Vdor01  
**GitHub**: [https://github.com/Vdor01](https://github.com/Vdor01)  
**Projekt Link**: [https://github.com/Vdor01/orarendtervezo](https://github.com/Vdor01/orarendtervezo)

_Ez a projekt szakdolgozati munka keretében készül. Jelenleg nem fogadok külső közreműködőket._

## 🙏 Köszönetnyilvánítás

- **ELTE**: A tanrend adatok biztosításáért
- **FullCalendar**: A kiváló naptár komponensért
- **Tailwind CSS & daisyUI**: A gyönyörű UI elemekért
- **Vite**: A gyors fejlesztői környezetért
- **Vercel**: Az ingyenes hosting és deployment szolgáltatásért
