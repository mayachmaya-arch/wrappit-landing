import PhotoFrame from './PhotoFrame';

// Plain /public paths — see README.md → "העלאת נכסים בעצמך".
const GALLERY_PHOTOS = [
  { src: '/images/gallery-photo-1.jpg', gradient: 'from-amber-200 via-stone-300 to-stone-400' },
  { src: '/images/gallery-photo-2.jpg', gradient: 'from-rose-200 via-stone-300 to-stone-400' },
  { src: '/images/gallery-photo-3.jpg', gradient: 'from-emerald-200 via-stone-300 to-stone-400' },
];

function PhotoColumn({ offsetDown = false }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      <div className={`flex flex-col gap-4 sm:gap-5 ${offsetDown ? 'mt-8' : ''}`}>
        {GALLERY_PHOTOS.map((photo, i) => (
          <PhotoFrame
            key={`a-${i}`}
            src={photo.src}
            alt="מוצר מתנה מקומי"
            gradient={photo.gradient}
            rounded="rounded-3xl"
            className="aspect-[664/1072] w-full shadow-[20px_16px_20px_7px_rgba(0,0,0,0.25)]"
          />
        ))}
      </div>
      <div className={`flex flex-col gap-4 sm:gap-5 ${offsetDown ? '' : 'mt-8'}`}>
        {GALLERY_PHOTOS.map((photo, i) => (
          <PhotoFrame
            key={`b-${i}`}
            src={photo.src}
            alt="מוצר מתנה מקומי"
            gradient={photo.gradient}
            rounded="rounded-3xl"
            className="aspect-[664/1072] w-full shadow-[20px_16px_20px_7px_rgba(0,0,0,0.25)]"
          />
        ))}
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[36px] border-4 border-stone-700 bg-ink shadow-2xl sm:w-[280px]">
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-stone-600" />
      <div className="flex items-center justify-between px-5 pt-4 text-xs text-cloud/70">
        <span>13:54</span>
        <span className="font-logo text-lg text-cloud">Wrappit</span>
      </div>

      <div className="mx-4 mt-6 aspect-square rounded-2xl bg-gradient-to-br from-purple/40 to-stone-700" />

      <div className="flex flex-col gap-2 px-5 pt-5">
        <p className="text-lg font-bold text-cloud">שיעור גיטרה</p>
        <p className="text-2xl font-black text-pink">₪1600</p>
      </div>

      <div className="mx-5 mt-4 flex flex-col gap-2 rounded-2xl bg-white/5 p-4">
        <p className="text-sm text-cloud/70">תנו לנו כמה מילים למתנה</p>
        <div className="h-16 rounded-lg border border-cloud/20" />
      </div>

      <button
        type="button"
        className="mx-5 my-5 rounded-full bg-pink py-3 text-base font-semibold text-white"
      >
        שליחת מתנה
      </button>
    </div>
  );
}

export default function DarkGallery() {
  return (
    <section id="solution" aria-label="הפתרון שלנו" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1820px] grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        <PhotoColumn />
        <PhoneMockup />
        <div className="hidden lg:block">
          <PhotoColumn offsetDown />
        </div>
      </div>
    </section>
  );
}
