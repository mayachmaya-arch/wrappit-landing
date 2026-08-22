import WrappitLogo from './WrappitLogo';

export default function BridgeHeading({ tagline }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
      <WrappitLogo className="h-9 w-auto text-pink sm:h-12" />
      <p className="text-xl font-bold sm:text-2xl">{tagline}</p>
    </div>
  );
}
