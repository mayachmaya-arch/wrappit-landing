import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';

// Plain square photo tiles forming a diagonal band behind the phone — a
// simplified stand-in for the dense multi-row photo mosaic in the Figma
// file. No price/title chrome: the Figma reference for this section is
// pure photography, not a browsable product-card list (that pattern lives
// on the app's own discover screen, not the landing page). See README.md
// → "העלאת נכסים בעצמך".
const GALLERY_PHOTOS = ['/images/gallery-photo-1.jpg', '/images/gallery-photo-2.jpg', '/images/gallery-photo-3.jpg'];

const MOSAIC_ROW_TOP = Array.from({ length: 9 }, (_, i) => GALLERY_PHOTOS[i % GALLERY_PHOTOS.length]);
const MOSAIC_ROW_BOTTOM = Array.from({ length: 9 }, (_, i) => GALLERY_PHOTOS[(i + 2) % GALLERY_PHOTOS.length]);

function MosaicTile({ src }) {
  return (
    <PhotoFrame
      src={src}
      alt=""
      rounded="rounded-xl"
      gradient="from-amber-100 via-rose-100 to-stone-200"
      className="aspect-square w-[100px] shrink-0 shadow-md sm:w-[130px] lg:w-[150px]"
    />
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[36px] border-4 border-stone-800 bg-white shadow-2xl sm:w-[280px]">
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-stone-300" />
      <div className="flex items-center justify-between px-5 pt-4 text-xs text-stone-500">
        <span>13:54</span>
        <span className="font-logo text-lg text-pink">Wrappit</span>
      </div>

      <div className="mx-4 mt-6 aspect-square rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-stone-200" />

      <div className="flex flex-col gap-1 px-5 pt-5">
        <p className="text-sm text-stone-500">שיעור גיטרה — עודן אצטרובל</p>
        <p className="text-2xl font-black text-ink">₪1,600</p>
      </div>

      <div className="mx-5 mt-4 flex flex-col gap-3 rounded-2xl border border-stone-200 p-4">
        <p className="text-sm font-bold text-ink">ספרו לנו על מקבל/ת המתנה</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-pink px-3 py-1 font-semibold text-white">מכיר/ה אישית</span>
          <span className="rounded-full border border-stone-300 px-3 py-1 text-stone-500">לא מכיר/ה</span>
        </div>
        <div className="h-2 rounded-full bg-stone-200">
          <div className="h-2 w-2/3 rounded-full bg-pink" />
        </div>
      </div>

      <button type="button" className="mx-5 my-5 rounded-full bg-pink py-3 text-base font-semibold text-white">
        מצאו לי מתנה
      </button>
    </div>
  );
}

export default function GiftCollage() {
  return (
    <section id="solution" aria-label="הפתרון שלנו" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative flex items-center justify-center">
        <div
          className="pointer-events-none absolute inset-x-[-10%] top-1/2 flex -translate-y-1/2 flex-col gap-3 -rotate-6 opacity-80 sm:gap-4"
          aria-hidden="true"
        >
          <div className="flex justify-center gap-3 sm:gap-4">
            {[...MOSAIC_ROW_TOP, ...MOSAIC_ROW_TOP].map((src, i) => (
              <MosaicTile key={i} src={src} />
            ))}
          </div>
          <div className="flex justify-center gap-3 sm:gap-4">
            {[...MOSAIC_ROW_BOTTOM, ...MOSAIC_ROW_BOTTOM].map((src, i) => (
              <MosaicTile key={i} src={src} />
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <PhoneMockup />
        </div>
      </div>

      <div className="relative z-10 mt-20">
        <BridgeHeading tagline="ככה זה עובד" />
      </div>
    </section>
  );
}
