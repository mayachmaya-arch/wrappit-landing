export default function BridgeHeading({ tagline }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
      <p className="font-logo text-4xl leading-none text-pink sm:text-5xl">Wrappit</p>
      <p className="text-xl font-bold sm:text-2xl">{tagline}</p>
    </div>
  );
}
