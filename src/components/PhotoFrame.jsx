// Renders a photo with a soft gradient fallback so the layout still looks
// intentional before real product photography replaces the Figma placeholders.
// See README.md → "תמונות חסרות" for the full asset list.
export default function PhotoFrame({
  src,
  alt = '',
  className = '',
  gradient = 'from-stone-300 via-stone-200 to-stone-300',
  rounded = 'rounded-2xl',
  style,
  children,
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${rounded} ${className}`} style={style}>
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      {children}
    </div>
  );
}
