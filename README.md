# Wrappit — עמוד נחיתה שיווקי

עמוד נחיתה סטטי (Vite + React + Tailwind CSS v4), בעברית ו-RTL מלא, בנוי לפי עיצוב Figma — כולל Header, Hero (עם וידאו רקע), סקשן הבעיה, הצגת הפתרון, "ככה זה עובד", פרייסינג, ופוטר.

הקובץ: `jCymW3WjTwLSnlOwawanAT`. הגרסה הסופית שלפיה נבנה העמוד: נוד `1182:5963`.

## הרצה מקומית

דורש Node.js 18 ומעלה.

```bash
npm install
npm run dev       # http://localhost:5173
```

פקודות נוספות:

```bash
npm run build      # בנייה סטטית ל-dist/, מוכן לפריסה לכל שירות (Vercel, Netlify, S3, GitHub Pages...)
npm run preview    # הרצת ה-build המקומי לבדיקה
npm run lint       # oxlint
```

## מבנה הפרויקט

```
public/
  images/                כל תמונות ה-placeholder (ראו "העלאת נכסים בעצמך")
  videos/                וידאו הרקע של ה-Hero (hero-bg.mp4/.webm — קיים ופעיל!)
src/
  components/
    Header.jsx           נבר עליון: לוגו, ניווט, שתי כפתורי CTA
    HeroBackground.jsx   וידאו הרקע של ה-Hero (autoplay/loop/muted) + poster fallback
    Hero.jsx             כותרת מתחלפת (יום הולדת? / בר מצווה? / ...) + תת-כותרת + CTA
    Marquee.jsx           הבאנר הסגול הנע עם רעיונות למתנה (חופף בין ה-Hero לתחילת הסקשן הבא)
    GiftForSection.jsx    "למי המתנה?" — לוגו גדל בגלילה + כרטיס עם typewriter + שתי ערימות קלפים נפרשות (ראו למטה)
    Journey*.jsx          חמש "סצנות" קולנועיות בין GiftForSection לפרייסינג (ראו למטה)
    Pricing.jsx           3 מסלולי תמחור לעסקים
    Footer.jsx            פוטר: לינקים, רשתות חברתיות, קופירייט
    BridgeHeading.jsx     קומפוננטת "Wrappit + סלוגן" הקטנה שמגשרת בין הסקשנים
    WrappitLogo.jsx        הלוגו האמיתי (SVG inline, fill="currentColor") — במקום טקסט בפונט Berkshire Swash
    PhotoFrame.jsx        עטיפת תמונה עם fallback גרדיאנט למקרה שהתמונה חסרה
  assets/fonts/           פונט "Reisinger Michal" (ראו "העלאת נכסים בעצמך")
  App.jsx                 הרכבת כל הסקשנים
  index.css               טוקני עיצוב של Tailwind (צבעים, פונטים, אנימציית ה-marquee, @font-face)
```

**חשוב:** התמונות והווידאו נטענים דרך `public/` בנתיב מוחלט (`/images/...`, `/videos/...`), לא דרך `import` ב-JS. המשמעות: אין שום צורך לגעת בקוד כדי להחליף placeholder בקובץ אמיתי — מספיק להעלות קובץ עם אותו שם בדיוק לאותו נתיב, והוא ישתלב אוטומטית. פירוט מלא בסעיף "העלאת נכסים בעצמך".

### GiftForSection.jsx — "למי המתנה?" (בין ה-Hero ל-Journey)

סקשן חדש, לא מחליף כלום — נוסף מיד אחרי ה-Hero, לפני חמש סצנות ה-Journey. משתמש בספריית `motion` (npm package `motion`, `import ... from 'motion/react'`) לאנימציית הלוגו הגדל בגלילה בלבד — הספרייה החדשה היחידה בפרויקט, ומיושמת רק שם. שני כרטיסי המוצר **לא** משתמשים ב-`motion` וב-`useScroll` בכלל — ראו למטה.

- **לוגו גדל בגלילה** — `WrappitLogo` עובר scale מ-0.5 עד 2.4 לפי `scrollYProgress` של הבלוק שלו (`useScroll({ target, offset: ["start end", "end start"] })`), לא אנימציית כניסה חד-פעמית.
- **כרטיס "למי המתנה?"** — accordion פתוח כברירת מחדל (ניתן לסגור), טוגל "לאדם אחד / לכמה אנשים", ותיבת typewriter שמתחילה להקליד כשהכרטיס נכנס לתצוגה (`useInView`, פעם אחת) ואז לופ אינסופי בין 3 משפטי דוגמה.
- **שני "סלוטים" של מוצרים** (3 מוצרים בכל צד, שונים בין הצדדים) — **לא** scroll-scrubbed. כל סלוט הוא `setInterval` פשוט (`useAutoAdvance`) שמקדם אינדקס בין 3 המוצרים; שלושתם מוצגים בו-זמנית כשכבות `absolute inset-0` חופפות בתוך מיכל בגובה/רוחב קבוע, וה-crossfade עצמו הוא מעבר CSS `opacity` נקי (700ms) — אין scroll listener מעורב בכלל בחלק הזה. הצד הימני מתקדם כל 4200ms, השמאלי כל 4900ms — משכים שונים בכוונה, כדי ששני הצדדים "יתפזרו" זה מזה עם הזמן ולא יתחלפו ביחד.
- כל האנימציות מכבדות `prefers-reduced-motion`: הלוגו נשאר בגודלו הסופי, כל סלוט מוצר נשאר קפוא על המוצר הראשון שלו (ה-`setInterval` פשוט לא מופעל).

**מגבלת תמונות:** כל 6 כרטיסי המוצר (ראו הטבלה למטה לשמות/ספקים/מחירים המעודכנים) משתמשים ב-`PhotoFrame` עם `src` שמצביע כרגע ל-placeholder זמני מ-Lorem Picsum (`https://picsum.photos/seed/wrappit-<id>/400/500`, seeded כדי שיישאר יציב בין רענונים) — לא ל-`public/images/product-*.jpg` מקומי. זה מכוון: תמונות המוצר האמיתיות עוד לא התקבלו (מגיעות אחת בכל הודעה), וההנחיה המפורשת היא להמתין לכל 6 התמונות האמיתיות לפני שמחליפים את ה-`src` לקובץ מקומי — לא להחליף אחת בכל פעם שהיא מגיעה.

### קומפוננטות ה-Journey (בין GiftForSection לפרייסינג)

חמש סצנות קולנועיות, כל אחת פילת "רגע וואו" אחד, מוצגות לפי הסדר הזה:

1. `JourneySpark.jsx` — "אין לך מושג מה לקנות. שוב." תמונה מלאה (buyer-photo.jpg) עם אפקט זום איטי (Ken Burns).
2. `JourneyPause.jsx` — נשימה: "מה אם..." + לוגו Wrappit (`BridgeHeading`).
3. `JourneyCoffeeReveal.jsx` — הוואו הראשון: "כרטיסיית קפה? מתנה." עם תמונת עגלת הקפה (business-photo-1.jpg).
4. `JourneyDiscoveries.jsx` — "וזה רק ההתחלה": עוד 3 תמונות עסקים אמיתיות עם כיתוב קצר לכל אחת.
5. `JourneyBridge.jsx` — סגירה קצרה לפני הפרייסינג (`BridgeHeading` נוסף).

**מגבלת תמונות:** יש בפרויקט 5 תמונות אמיתיות בלבד (buyer-photo + business-photo-1..4). אין תמונות אמיתיות של סטודיו קרמיקה, חנות פרחים, מאפייה, או חנות עיצוב — קטגוריות שהוזכרו בבריף היצירתי אך לא נבנו, כדי לא להשתמש בתמונות stock גנריות. אם וכשתעלו תמונות חדשות (לפי אותה שיטת ה-`public/images/` המתוארת למעלה), אפשר להוסיף סצנות/כרטיסים נוספים ל-`JourneyDiscoveries.jsx`.

## RTL

`index.html` מוגדר `<html lang="he" dir="rtl">` וגם `<body dir="rtl">`, והעטיפה הראשית ב-`App.jsx` מוסיפה `dir="rtl"` מפורש. סדר האלמנטים ב-JSX נבנה כך שינוצל כיוון ה-flex הטבעי תחת RTL (למשל בהדר: לוגו → ניווט → CTA, כך שהלוגו נשאר מימין/התחלה והכפתורים משמאל/סוף), ובסקשן "ככה זה עובד" סדר ה-DOM של תמונה/טקסט מתחלף כל שלב בהתאם לצד שבו הם אמורים להופיע ב-RTL — בלי טריקים של pixel-positioning.

## אנימציות

- **וידאו רקע ה-Hero** — `<video autoPlay loop muted playsInline>` ב-`HeroBackground.jsx`, עם קובץ MP4 (H.264) וגם WebM (VP9, נוצר מקומית לביצועים טובים יותר). יש `poster` שמוצג עד שהווידאו נטען, ונפילה חלקה לתמונה סטטית אם הווידאו לא זמין. מכבד `prefers-reduced-motion` (עוצר את הניגון אוטומטית). **נבדק ועובד** — ראו הערה למטה.
- **כותרת מתחלפת (Hero)** — 5 הביטויים ("יום הולדת?", "בר מצווה?" וכו') מתחלפים כל 2.8 שניות עם fade, לפי הלוגיקה מ-Figma (היה מבוסס על ספריית `motion`, כאן מומש עם `useState`/`setInterval` + CSS transitions כדי לא להוסיף תלות מיותרת לעמוד סטטי).
- **הבאנר הנע (Marquee)** — רשימת הרעיונות משוכפלת פעמיים ונעה ברצף אינסופי (`@keyframes marquee-scroll` ב-`index.css`), נטויה ב-2.7deg כמו במקור.

### הערת בדיקה על הווידאו

קיבלנו את קובץ ה-MP4 האמיתי והוא כבר בפנים (`public/videos/hero-bg.mp4`, H.264/AAC תקין, 1920×1080, 8 שניות). כשבדקתי את הניגון בדפדפן הבדיקה שלי (Chromium headless בסביבה הזו) גיליתי שה-build הספציפי הזה **לא כולל תמיכה ב-H.264 בכלל** (`canPlayType` מחזיר ריק) — זו מגבלה ידועה של גרסאות Chromium קוד-פתוח בלי קודקים קנייניים, ולא נוגעת לדפדפני האמת (Chrome/Safari/Firefox/Edge האמיתיים תומכים ב-H.264 ללא בעיה). כדי לוודא בכל זאת שהקומפוננטה עצמה עובדת נכון (autoplay+loop+muted, לא רק שהקובץ תקין), יצרתי גם גרסת **WebM (VP9)** מקומית מאותו קובץ המקור (`public/videos/hero-bg.webm`, ~1.6MB) — עם שני הפורמטים ראיתי בעיניים שהווידאו מתנגן, לופ, ומתעדכן ב-`currentTime` כמו שצריך. שני הקבצים כבר בפרויקט; אין צורך לעשות כלום נוסף.

## מה עוד חסר להשלמת העמוד

Header, Hero, Marquee, חמש סצנות ה-Journey, פרייסינג, ופוטר בנויים ופעילים. מה שנשאר:

1. **טפסי הרשמה בפועל** — כפתורי ה-CTA ("לפתיחת חנות", "לקניית מתנה", כפתורי הפרייסינג וכו') מקשרים כבר לאפליקציית הייצור (gift-wish-unfold), לא ל-placeholder — אבל שווה לוודא שהזרימה שם מלאה מקצה לקצה.
2. **דפי פוטר** — הלינקים "אודות", "צור קשר", "תנאי שימוש" בפוטר מצביעים ל-`#about`/`#contact`/`#terms` שעדיין לא קיימים כדפים.
3. **רשתות חברתיות אמיתיות** — אייקוני Instagram/Facebook/YouTube/Twitter בפוטר לא מקושרים לעמודים אמיתיים עדיין (קישורי `#` placeholder).
4. **SEO / מטא-דאטה מלאים** — יש `<title>` ו-`<meta description>` בסיסיים, אבל חסרים Open Graph, favicon אמיתי (יש רק placeholder), ו-`sitemap`.
5. **נגישות** — כדאי מעבר נוסף על ניגודיות צבעים (טקסט cloud על תמונת/וידאו הרקע), ותיוג ARIA לכפתורי ניווט מתחלפים.
6. **תמונות נוספות ל-Journey** — ראו "מגבלת תמונות" למעלה: סטודיו קרמיקה, חנות פרחים, מאפייה, וחנות עיצוב עדיין לא מיוצגים בתמונה אמיתית.

## העלאת נכסים בעצמך — הוראות מדויקות

הסביבה שהריצה אותי לא הצליחה לגשת לאינטרנט החיצוני באופן כללי (בדקתי עם `curl`, `WebFetch`, וגם דרך כלי ה-Figma MCP עצמו — כולם נחסמים ב-`403` על ידי מדיניות ה-network של הסביבה). התמונות הן **placeholder-ים אמיתיים בפורמט הסופי** (JPG אמיתיים, לא SVG) — כדי שתוכלי פשוט **לדרוס כל קובץ באותו נתיב ואותו שם בדיוק**, בלי לגעת בקוד בכלל. **הווידאו והפונט כבר הועלו על ידך וקיימים בפרויקט** — לא נדרשת פעולה נוספת לגביהם.

הכלל: שם הקובץ + הסיומת + הנתיב חייבים להיות **בדיוק** כמו בטבלה. אם תשמרי עם סיומת אחרת (למשל `.png` במקום `.jpg`) — צריך גם לעדכן את השם בקוד, אז עדיף להמיר לסיומת המבוקשת לפני ההעלאה.

### תמונות (בתיקיית `public/images/`, מוגשות כקבצים סטטיים בנתיב מוחלט)

| # | שימוש בעמוד | נתיב מדויק להעלאה | Figma asset (זמני, תקף עד ~29.7.2026) |
|---|---|---|---|
| 1 | Poster/fallback לווידאו (frame סטטי, מוצג עד שהווידאו עולה) | `public/images/hero-bg.jpg` | **כבר קיים ומעודכן** — חילצתי פריים אמיתי מהווידאו שהעלית |
| 2 | תמונת "קוני מתנה" (מצד אחד) | `public/images/buyer-photo.jpg` | [d8724e45](https://www.figma.com/api/mcp/asset/d8724e45-c5c7-4205-9f91-9b9a3a0cf66a) |
| 3 | תמונת עסק #1 (מצד שני) | `public/images/business-photo-1.jpg` | [13282ae1](https://www.figma.com/api/mcp/asset/13282ae1-2cf8-4873-b162-f1c13e54c402) |
| 4 | תמונת עסק #2 | `public/images/business-photo-2.jpg` | [d7823d47](https://www.figma.com/api/mcp/asset/d7823d47-0490-4dff-b767-6fc387130335) |
| 5 | תמונת עסק #3 | `public/images/business-photo-3.jpg` | [66bcb6d6](https://www.figma.com/api/mcp/asset/66bcb6d6-8108-43f2-a85f-975c12967cf1) |
| 6 | תמונת עסק #4 | `public/images/business-photo-4.jpg` | [ab067fd6](https://www.figma.com/api/mcp/asset/ab067fd6-3623-4f65-8c42-fb7411ad5829) |
| 7 | כרטיס בקולאז' הפתרון #1 (וגם בגלריה) | `public/images/gallery-photo-1.jpg` | דוגמה מהקובץ: [57ce50c5](https://www.figma.com/api/mcp/asset/57ce50c5-98e9-4392-96ad-ae79b7f703a4) |
| 8 | כרטיס בקולאז' הפתרון #2 | `public/images/gallery-photo-2.jpg` | חלופה מהקובץ: [9a949bd8](https://www.figma.com/api/mcp/asset/9a949bd8-a559-4617-8bf1-ec6127cf7d09) |
| 9 | כרטיס בקולאז' הפתרון #3 | `public/images/gallery-photo-3.jpg` | חלופה מהקובץ: [b29dd75f](https://www.figma.com/api/mcp/asset/b29dd75f-a8ad-4c0d-a836-ae458947911e) |
| 10 | סלוט מוצר ימני #1 — ארגז ירקות טרי מהחקלאי, חקלאי הצפון (₪85) | `public/images/product-vegetables.jpg` | טרם התקבל — `GiftForSection.jsx` משתמש כרגע ב-placeholder של Lorem Picsum (`seed/wrappit-vegetables`) |
| 11 | סלוט מוצר ימני #2 — תספורת מקצועית, סלון תמר (₪150) | `public/images/product-haircut.jpg` | טרם התקבל — placeholder `seed/wrappit-haircut` |
| 12 | סלוט מוצר ימני #3 — שיעור גיטרה, סטודיו נגן (₪120) | `public/images/product-guitar.jpg` | טרם התקבל — placeholder `seed/wrappit-guitar` |
| 13 | סלוט מוצר שמאלי #1 — סדנת קרמיקה, סטודיו חומר (₪220) | `public/images/product-pottery.jpg` | טרם התקבל — placeholder `seed/wrappit-pottery` |
| 14 | סלוט מוצר שמאלי #2 — זר פרחים, עלה פרא (₪140) | `public/images/product-flowers.jpg` | טרם התקבל — placeholder `seed/wrappit-flowers` |
| 15 | סלוט מוצר שמאלי #3 — עיסוי מפנק, קליניק רוטס (₪180) | `public/images/product-massage.jpg` | טרם התקבל — placeholder `seed/wrappit-massage` |

כל 6 השורות למעלה ממתינות לתמונות אמיתיות שיישלחו בהודעות נפרדות — לפי ההנחיה, ה-`src` בקוד יוחלף לקובץ מקומי (`public/images/product-*.jpg`, בדיוק לפי השמות בטבלה) רק אחרי שכל 6 יתקבלו, לא אחת בכל פעם.

אייקון המתנה בבאנר הנע, ואייקוני הרשתות החברתיות בפוטר, **לא** מיובאים מ-Figma — מומשו כ-SVG inline (ב-`Marquee.jsx` וב-`Footer.jsx` בהתאמה) כדי לא להעתיק אייקונים קנייניים. אם רוצה את המקור המדויק מ-Figma של אייקון המתנה: [5833b2b3](https://www.figma.com/api/mcp/asset/5833b2b3-9159-4f8a-ba41-914289c6b1ff).

### פונט (בתיקיית `src/assets/fonts/`)

כותרת ה-Hero המתחלפת משתמשת בפונט **"Reisinger Michal"** (מיכל, משקל Bold) — פונט חינמי בקוד פתוח מפרויקט המורשת של דן ריזינגר עם הספרייה הלאומית. **הקובץ כבר בפרויקט ומחובר** (`src/assets/fonts/Reisinger-Michal.{woff2,woff,otf,ttf}`, כולם משקל Bold בלבד — זה המשקל היחיד שבשימוש בעמוד). מוגדר ב-`@font-face` ב-`src/index.css` עם `font-family: 'Reisinger Michal'` ו-`font-weight: 700`, וממופה למשתנה `--font-display` שמיושם **רק** על כותרת ה-Hero המתחלפת (`Hero.jsx`, המחלקה `font-display`) — שאר הטקסט בעמוד (תת-כותרת, ניווט, גוף) ממשיך להשתמש ב-Noto Sans Hebrew. אומת בדפדפן שהפונט אכן נטען ומוצג (`document.fonts` + network request על `Reisinger-Michal.woff2`), לא נופל ל-fallback.

## פריסה (Deployment)

הפרויקט הוא build סטטי טהור (`npm run build` → `dist/`) — ניתן לפרוס בכל שירות סטטי: Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront וכו', ללא צורך בשרת. **שימו לב:** תיקיית `public/videos/` מכילה קובץ MP4 בגודל ~13MB — ודאו שהשירות שבו תפרסו לא חוסם קבצים סטטיים גדולים (רוב השירותים הנ"ל תומכים בכך ללא בעיה, אך שווה לבדוק מגבלות גודל build).
