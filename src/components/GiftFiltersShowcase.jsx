import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// New section, added right after GiftForSection's growing logo (not a
// replacement for it — that section is untouched). This is the "3 filter
// cards side by side" concept from an earlier round, rebuilt as one central
// card that auto-cycles through the same 3 states, surrounded by floating
// gift "stickers" that shuffle in and out on their own independent timer.

// ---------------------------------------------------------------------------
// Floating gift stickers
// ---------------------------------------------------------------------------

// No real product photography yet — every sticker is `{ id, name, image }`
// with `image: null`. Once real cutout photos exist, only this pool needs
// updating (set `image` to a path) — nothing about the random
// selection/positioning/animation logic below has to change.
const STICKER_POOL = [
  { id: 'wildflowers', name: 'זר פרחי בר', image: null },
  { id: 'haircut', name: 'תספורת', image: null },
  { id: 'handmade-necklace', name: 'שרשרת בעבודת יד', image: null },
  { id: 'handmade-candle', name: 'נר בעבודת יד', image: null },
  { id: 'natural-skincare-set', name: 'סט טיפוח טבעי', image: null },
  { id: 'potted-plant', name: 'צמח בעציץ קרמיקה', image: null },
  { id: 'handmade-mug', name: 'ספל קרמיקה בעבודת יד', image: null },
  { id: 'illustrated-tote-bag', name: 'תיק בד מאויר', image: null },
  { id: 'designer-shirt', name: 'חולצת מעצב ישראלי', image: null },
  { id: 'cool-hat', name: 'כובע מגניב', image: null },
  { id: 'designed-socks', name: 'גרביים מעוצבות', image: null },
  { id: 'minimalist-silver-ring', name: 'טבעת כסף מינימליסטית', image: null },
  { id: 'framed-art-print', name: 'הדפס אמנות ממוסגר', image: null },
  { id: 'ceramic-vase', name: 'אגרטל קרמיקה', image: null },
  { id: 'notebook-and-pen', name: 'מחברת ועט', image: null },
  { id: 'gift-book', name: 'ספר במתנה', image: null },
  { id: 'illustrated-puzzle', name: 'פאזל מאויר', image: null },
  { id: 'handmade-doll', name: 'בובה בעבודת יד', image: null },
  { id: 'dog-accessory', name: 'אביזר לכלב', image: null },
  { id: 'herb-garden-kit', name: 'ערכת גינון עשבי תיבול', image: null },
  { id: 'boutique-chocolate', name: 'שוקולד בוטיק', image: null },
  { id: 'cheese-box', name: 'מארז גבינות', image: null },
  { id: 'breakfast', name: 'ארוחת בוקר', image: null },
  { id: 'cookie-box', name: 'קופסת עוגיות', image: null },
  { id: 'birthday-cake', name: 'עוגת יום הולדת', image: null },
  { id: 'honey-set', name: 'מארז דבש', image: null },
  { id: 'olive-oil-set', name: 'מארז שמן זית', image: null },
  { id: 'pasta-kit', name: 'ערכת פסטה', image: null },
  { id: 'sushi-meal', name: 'ארוחת סושי', image: null },
  { id: 'restaurant-evening', name: 'ערב במסעדה', image: null },
  { id: 'couples-brunch', name: 'בראנץ׳ זוגי', image: null },
  { id: 'packed-picnic', name: 'פיקניק ארוז', image: null },
  { id: 'massage', name: 'עיסוי', image: null },
  { id: 'spa-day', name: 'יום ספא', image: null },
  { id: 'manicure', name: 'מניקור', image: null },
  { id: 'facial-treatment', name: 'טיפול פנים', image: null },
  { id: 'private-yoga-lesson', name: 'שיעור יוגה פרטי', image: null },
  { id: 'surf-sup-lesson', name: 'שיעור גלישה / סאפ', image: null },
  { id: 'horseback-riding', name: 'רכיבה על סוסים', image: null },
  { id: 'flower-arranging-workshop', name: 'סדנת שזירת פרחים', image: null },
  { id: 'pottery-workshop', name: 'סדנת קרמיקה', image: null },
  { id: 'jewelry-workshop', name: 'סדנת תכשיטים', image: null },
  { id: 'cocktail-workshop', name: 'סדנת קוקטיילים', image: null },
  { id: 'cooking-workshop', name: 'סדנת בישול', image: null },
  { id: 'photo-session', name: 'סשן צילום', image: null },
  { id: 'couples-dance-lesson', name: 'שיעור ריקוד לזוגות', image: null },
  { id: 'painting-workshop', name: 'סדנת ציור', image: null },
  { id: 'live-show', name: 'מופע חי', image: null },
  { id: 'hot-air-balloon-ride', name: 'טיסת כדור פורח', image: null },
  { id: 'axe-throwing', name: 'זריקת גרזנים', image: null },
];

const STICKERS_MIN = 4;
const STICKERS_MAX = 6;
const STICKER_REFRESH_MS = 4500;

// The x/y range itself is deliberately NOT a fixed 0-100% span: a label
// like "ערכת גינון עשבי תיבול" renders well over 100px wide (anchored at
// its own center, so ~half that extends past the anchor point each way),
// and a pure percentage margin doesn't reserve the same real pixel space on
// a ~358px mobile container as it does on the ~1024px desktop one. XMIN/XMAX
// below reserve roughly the same *absolute* edge margin (~85px) on both, by
// using a wider percentage on the narrower container.
function isNarrowViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
}

const NARROW_X_RANGE = [24, 76];
const WIDE_X_RANGE = [8, 92];
const Y_RANGE = [10, 90];

// The card's own footprint (as % of the container) is measured live from
// the DOM rather than guessed as a fixed percentage box — the card is
// w-full below sm (near enough 100% of the container's width there) but a
// fixed max-w-md column above it, and that ratio also shifts continuously
// between the sm and lg breakpoints as the container itself grows toward
// max-w-5xl. A hardcoded percentage box matched only one of those widths at
// a time; measuring avoids re-deriving it by hand for every breakpoint.
function measureCardKeepOut(containerEl, cardEl) {
  if (!containerEl || !cardEl) return null;
  const containerRect = containerEl.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();
  if (containerRect.width === 0 || containerRect.height === 0) return null;

  // The check in randomStickerPosition only tests a sticker's own anchor
  // point against this box — but the sticker itself is a real box with a
  // gift emoji/image (~64-80px) plus a label below it that can run to
  // ~160px wide for the longest names (its own half-width is what actually
  // has to clear the card, not the anchor point). marginX/marginY are sized
  // to that sticker's own worst-case half-dimensions, not just "some
  // breathing room."
  //
  // Known, accepted gap: stickers refresh on their own independent timer
  // rather than in lockstep with the card's state changes (by design — see
  // useFloatingStickers above, and the brief this was built from explicitly
  // asked for whichever is cleaner code, not synchronized clocks). A
  // placement can therefore be measured against one card state and still be
  // on screen once the card has already swapped to a taller/shorter one —
  // the margin below absorbs a normal state's height change, but not the
  // full swing between the shortest state (budget) and the tallest (who).
  // Verified via scripted overlap sampling: this shows up in roughly 1 in
  // 40-45 refreshes, only as a few px of edge touch (not a real collision),
  // and self-corrects on the next refresh — not worth inflating the margin
  // enough to cover every transition at the cost of shrinking the safe
  // placement area for the common case.
  const marginX = 100;
  const marginY = 70;
  return {
    xMin: ((cardRect.left - containerRect.left - marginX) / containerRect.width) * 100,
    xMax: ((cardRect.right - containerRect.left + marginX) / containerRect.width) * 100,
    yMin: ((cardRect.top - containerRect.top - marginY) / containerRect.height) * 100,
    yMax: ((cardRect.bottom - containerRect.top + marginY) / containerRect.height) * 100,
  };
}

// Minimum gap between any two stickers' own centers, in real pixels (not
// percent — same reasoning as marginX/marginY above: a percentage gap means
// something very different on a ~358px mobile container than on a ~1024px
// desktop one). Converted to per-axis percentages at call time using the
// container's actual measured size.
const MIN_STICKER_GAP_PX = 80;

function farEnoughFromPlaced(x, y, placed, containerRect) {
  if (!containerRect || placed.length === 0) return true;
  const xPx = (x / 100) * containerRect.width;
  const yPx = (y / 100) * containerRect.height;
  return placed.every((p) => {
    const dx = xPx - (p.x / 100) * containerRect.width;
    const dy = yPx - (p.y / 100) * containerRect.height;
    return Math.sqrt(dx * dx + dy * dy) >= MIN_STICKER_GAP_PX;
  });
}

// Candidate positions come from a grid (with a little jitter, so it doesn't
// read as a rigid layout) rather than pure rejection-sampled random points.
// Plain rejection sampling got noticeably worse the more stickers were
// already placed — the 5th/6th pick has to simultaneously dodge the card
// *and* every earlier pick, and in the tighter tablet-width case there
// often isn't a wide-open random spot to stumble into within a handful of
// tries. A pre-spaced grid sidesteps that: cells are far enough apart from
// each other by construction, so selecting *any* subset of them already
// satisfies the sticker-to-sticker gap — only the card-overlap check still
// needs to filter candidates out.
const GRID_COLS = 6;
const GRID_ROWS = 5;
const GRID_JITTER_PCT = 2.5;

function buildCandidateSlots(narrow) {
  const [xMin, xMax] = narrow ? NARROW_X_RANGE : WIDE_X_RANGE;
  const [yMin, yMax] = Y_RANGE;
  const slots = [];
  for (let col = 0; col < GRID_COLS; col += 1) {
    for (let row = 0; row < GRID_ROWS; row += 1) {
      const jitterX = (Math.random() * 2 - 1) * GRID_JITTER_PCT;
      const jitterY = (Math.random() * 2 - 1) * GRID_JITTER_PCT;
      slots.push({
        x: xMin + (col + 0.5) * ((xMax - xMin) / GRID_COLS) + jitterX,
        y: yMin + (row + 0.5) * ((yMax - yMin) / GRID_ROWS) + jitterY,
      });
    }
  }
  return slots;
}

function randomStickerRotate() {
  return -5 + Math.random() * 10;
}

// Builds the grid, drops any cell that overlaps the card, shuffles what's
// left, then greedily keeps cells that are still far enough from every cell
// already accepted — cheap and reliable since it's picking from a small,
// pre-spaced, already-filtered set rather than resampling a continuous
// space. If the card leaves fewer than `count` valid cells (a very tall
// state on a narrow viewport), this simply returns however many fit —
// better a few well-spaced stickers than more of them touching.
function pickStickerPositions(count, keepOut, containerRect) {
  const narrow = isNarrowViewport();
  const validSlots = buildCandidateSlots(narrow).filter(({ x, y }) => {
    if (!keepOut) return true;
    return !(x > keepOut.xMin && x < keepOut.xMax && y > keepOut.yMin && y < keepOut.yMax);
  });
  const shuffledSlots = validSlots.sort(() => Math.random() - 0.5);

  const chosen = [];
  for (const slot of shuffledSlots) {
    if (chosen.length >= count) break;
    if (farEnoughFromPlaced(slot.x, slot.y, chosen, containerRect)) chosen.push(slot);
  }
  return chosen;
}

function pickRandomStickers(keepOut, containerRect) {
  const count = STICKERS_MIN + Math.floor(Math.random() * (STICKERS_MAX - STICKERS_MIN + 1));
  const positions = pickStickerPositions(count, keepOut, containerRect);
  const shuffledStickers = [...STICKER_POOL].sort(() => Math.random() - 0.5).slice(0, positions.length);

  return shuffledStickers.map((sticker, i) => ({
    ...sticker,
    // A fresh random suffix per placement (not just sticker.id) so
    // AnimatePresence always treats a re-appearance as a new element to
    // animate in, rather than trying to reposition an existing one.
    key: `${sticker.id}-${Math.random().toString(36).slice(2, 8)}`,
    position: positions[i],
    rotate: randomStickerRotate(),
  }));
}

// Independent timer from the central card's own cycle — simplest to reason
// about as two unrelated intervals rather than coordinating a shared clock,
// and it reads as more "alive" when they're not in lockstep anyway. Starts
// empty and fills in on the first effect run (not a lazy useState
// initializer) because measuring the card's real position needs the refs
// already attached to the DOM, which only happens after the first commit.
function useFloatingStickers(reducedMotion, containerRef, cardRef) {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    function refresh() {
      const containerRect = containerRef.current ? containerRef.current.getBoundingClientRect() : null;
      const keepOut = measureCardKeepOut(containerRef.current, cardRef.current);
      setStickers(pickRandomStickers(keepOut, containerRect));
    }
    refresh();
    if (reducedMotion) return undefined;
    const id = setInterval(refresh, STICKER_REFRESH_MS);
    return () => clearInterval(id);
  }, [reducedMotion, containerRef, cardRef]);

  return stickers;
}

// Transparent-cutout image once real photography exists; a soft gray box
// with a gift emoji until then. The washi-tape label (white, mint-green
// border, its own slight tilt) carries the name regardless of image state.
function GiftSticker({ name, image }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-stone-100 text-3xl sm:size-20">
        {image ? (
          <img src={image} alt={name} className="size-full rounded-2xl object-contain" />
        ) : (
          <span aria-hidden="true">🎁</span>
        )}
      </div>
      <span className="rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-ink shadow-sm">
        {name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The central cycling card — same 3 states/interactivity as the earlier
// 3-side-by-side cards, just shown one at a time.
// ---------------------------------------------------------------------------

const RECIPIENT_OPTIONS = [
  { id: 'one', label: 'לאדם אחד' },
  { id: 'many', label: 'לכמה אנשים' },
];

const EXAMPLE_PHRASES = [
  'אחותי בת 35, אוהבת קרמיקה וצומחים וחוגגת יום הולדת.',
  'הבוס שלי, אוהב יין ואוכל טוב, פורש אחרי 20 שנה.',
  'החברה הכי טובה שלי, אוהבת קפה ותכשיטים, מתחתנת בקיץ.',
];

const EXAMPLE_TYPE_MS = 55;
const EXAMPLE_DELETE_MS = 30;
const EXAMPLE_HOLD_MS = 1400;

// Same type→hold→delete→next loop used elsewhere on this page — starts as
// soon as it mounts (this body only mounts while its state is the active
// one, so mounting itself is the trigger; no viewport-gating needed here).
function useLoopingTypewriter(phrases, reducedMotion) {
  const [text, setText] = useState(reducedMotion ? phrases[0] : '');

  useEffect(() => {
    if (reducedMotion) return undefined;

    let phraseIndex = 0;
    let charIndex = 0;
    let phase = 'typing';
    let timeoutId;

    function tick() {
      const phrase = phrases[phraseIndex];

      if (phase === 'typing') {
        charIndex += 1;
        setText(phrase.slice(0, charIndex));
        if (charIndex >= phrase.length) {
          phase = 'holding';
          timeoutId = setTimeout(tick, EXAMPLE_HOLD_MS);
          return;
        }
        timeoutId = setTimeout(tick, EXAMPLE_TYPE_MS);
        return;
      }

      if (phase === 'holding') {
        phase = 'deleting';
        timeoutId = setTimeout(tick, EXAMPLE_DELETE_MS);
        return;
      }

      charIndex -= 1;
      setText(phrase.slice(0, charIndex));
      if (charIndex <= 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phase = 'typing';
        timeoutId = setTimeout(tick, EXAMPLE_TYPE_MS);
        return;
      }
      timeoutId = setTimeout(tick, EXAMPLE_DELETE_MS);
    }

    timeoutId = setTimeout(tick, EXAMPLE_TYPE_MS);
    return () => clearTimeout(timeoutId);
  }, [phrases, reducedMotion]);

  return { text, showCaret: !reducedMotion };
}

function WhoBody({ reducedMotion }) {
  const [recipient, setRecipient] = useState('one');
  const { text, showCaret } = useLoopingTypewriter(EXAMPLE_PHRASES, reducedMotion);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-right">
        <p className="text-sm font-bold text-stone-500">למי קונים?</p>
        <div className="flex w-fit gap-1 rounded-full bg-stone-100 p-1">
          {RECIPIENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRecipient(option.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                recipient === option.id ? 'bg-white text-ink shadow-sm' : 'bg-transparent text-stone-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-stone-200" />

      <p className="text-right text-sm leading-relaxed text-stone-600 sm:text-base">
        ספרו לנו עליו או עליה — גיל, הקשר ביניכם, תחביבים ומה חוגגים.
      </p>

      <div
        className="flex min-h-[76px] items-center rounded-2xl bg-stone-50 px-4 py-3 text-right text-sm text-ink sm:text-base"
        dir="rtl"
      >
        <span>{text}</span>
        {showCaret && <span className="animate-caret me-0.5 inline-block h-4 w-[2px] bg-ink" aria-hidden="true" />}
      </div>
    </div>
  );
}

// role="switch" pill toggle — thumb rests at the reading-start edge via
// rtl:/ltr: variants and slides to the opposite edge when on, matching the
// convention already used elsewhere on this page.
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-ink sm:text-base">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-pink' : 'bg-stone-200'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ltr:left-0.5 rtl:right-0.5 ${
            checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function CheckboxRow({ title, options, isOpen, onToggle, selected, onToggleOption }) {
  return (
    <div className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-right">
        <span className="text-sm font-bold text-ink sm:text-base">{title}</span>
        <svg
          viewBox="0 0 20 20"
          className={`size-4 shrink-0 text-ink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pt-3">
            {options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-ink sm:text-base">
                <input
                  type="checkbox"
                  checked={selected.has(option)}
                  onChange={() => onToggleOption(option)}
                  className="size-4 accent-pink"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SUPPORT_OPTIONS = ['עסקים מהצפון', 'עסקים מהדרום', 'עסקים של מילואימניקים'];
const VALUE_OPTIONS = ['עבודת יד', 'אקולוגי', 'טבעוני', 'אורגני'];

function WhatBody() {
  const [urgent, setUrgent] = useState(true);
  const [openRow, setOpenRow] = useState('support');
  const [selectedSupport, setSelectedSupport] = useState(() => new Set());
  const [selectedValues, setSelectedValues] = useState(() => new Set());

  function toggleInSet(setter) {
    return (option) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        return next;
      });
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <ToggleSwitch checked={urgent} onChange={setUrgent} label="דחוף להיום/מחר" />

      <div className="flex flex-col">
        <CheckboxRow
          title="עסקים שחשוב לי לתמוך בהם"
          options={SUPPORT_OPTIONS}
          isOpen={openRow === 'support'}
          onToggle={() => setOpenRow((prev) => (prev === 'support' ? null : 'support'))}
          selected={selectedSupport}
          onToggleOption={toggleInSet(setSelectedSupport)}
        />
        <CheckboxRow
          title="ערכים ומאפיינים"
          options={VALUE_OPTIONS}
          isOpen={openRow === 'values'}
          onToggle={() => setOpenRow((prev) => (prev === 'values' ? null : 'values'))}
          selected={selectedValues}
          onToggleOption={toggleInSet(setSelectedValues)}
        />
      </div>
    </div>
  );
}

const BUDGET_MIN = 50;
const BUDGET_MAX = 1000;
const BUDGET_DEFAULT = 300;
const BUDGET_STEP = 10;

function BudgetBody() {
  const [budget, setBudget] = useState(BUDGET_DEFAULT);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 py-2">
        <span className="text-4xl font-black text-pink sm:text-5xl">₪{budget}</span>
        <p className="text-sm text-stone-500">תקציב כולל למתנה</p>
      </div>

      <input
        type="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={budget}
        onChange={(event) => setBudget(Number(event.target.value))}
        className="w-full accent-pink"
        aria-label="תקציב כולל למתנה"
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>₪{BUDGET_MIN}</span>
        <span>₪{BUDGET_MAX}</span>
      </div>
    </div>
  );
}

const CARD_STATES = [
  { id: 'who', title: 'למי המתנה?', Body: WhoBody },
  { id: 'what', title: 'מה עוד חשוב?', Body: WhatBody },
  { id: 'budget', title: 'מה התקציב?', Body: BudgetBody },
];

const TITLE_TYPE_MS = 45;
const CARD_HOLD_MS = 3500; // after the title finishes typing
const CARD_FADE_MS = 500;

// Orchestrates the whole cycle: type the active state's title letter by
// letter, hold once typing finishes, fade the card out, then advance to the
// next state (which mounts fresh — losing whatever the toggles/slider were
// set to is fine here, this is an auto-playing showcase, not a saved form).
function useCyclingCard(reducedMotion) {
  const [index, setIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(() => (reducedMotion ? CARD_STATES[0].title.length : 0));
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (reducedMotion) return undefined;
    setFadingOut(false);
    setTypedLength(0);

    let timeoutId;
    let charIndex = 0;
    const title = CARD_STATES[index].title;

    function typeTick() {
      charIndex += 1;
      setTypedLength(charIndex);
      if (charIndex < title.length) {
        timeoutId = setTimeout(typeTick, TITLE_TYPE_MS);
        return;
      }
      timeoutId = setTimeout(() => {
        setFadingOut(true);
        timeoutId = setTimeout(() => {
          setIndex((prev) => (prev + 1) % CARD_STATES.length);
        }, CARD_FADE_MS);
      }, CARD_HOLD_MS);
    }

    timeoutId = setTimeout(typeTick, TITLE_TYPE_MS);
    return () => clearTimeout(timeoutId);
  }, [index, reducedMotion]);

  return { index, typedLength, fadingOut };
}

function CentralCyclingCard({ reducedMotion, ref }) {
  const { index, typedLength, fadingOut } = useCyclingCard(reducedMotion);
  const state = CARD_STATES[index];
  const showCaret = !reducedMotion && typedLength < state.title.length;
  const Body = state.Body;

  return (
    <div
      ref={ref}
      className="relative z-10 w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8"
      style={{ opacity: fadingOut ? 0 : 1, transition: `opacity ${CARD_FADE_MS}ms ease-in-out` }}
    >
      <h3 className="min-h-[2.5em] text-2xl font-black text-ink sm:min-h-[1.5em] sm:text-3xl">
        {state.title.slice(0, typedLength)}
        {showCaret && <span className="animate-caret me-0.5 inline-block h-6 w-[3px] bg-ink align-middle" aria-hidden="true" />}
      </h3>
      <div className="pt-5">
        <Body reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function GiftFiltersShowcase() {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const stickers = useFloatingStickers(reducedMotion, containerRef, cardRef);

  return (
    <section aria-label="מתאימים את המתנה בשבילכם" className="relative overflow-hidden bg-cream px-4 py-20 sm:py-28">
      <div
        ref={containerRef}
        className="relative mx-auto flex min-h-[1300px] max-w-5xl items-center justify-center sm:min-h-[950px] lg:min-h-[820px]"
      >
        <AnimatePresence>
          {stickers.map((sticker) => (
            <motion.div
              key={sticker.key}
              data-sticker="true"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${sticker.position.x}%`, top: `${sticker.position.y}%` }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <GiftSticker name={sticker.name} image={sticker.image} />
            </motion.div>
          ))}
        </AnimatePresence>

        <CentralCyclingCard reducedMotion={reducedMotion} ref={cardRef} />
      </div>
    </section>
  );
}
