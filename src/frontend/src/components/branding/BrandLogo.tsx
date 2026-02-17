import { useNavigate } from '@tanstack/react-router';

export default function BrandLogo() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to: '/' })}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <img
        src="/assets/generated/rockhog-logo.dim_512x512.png"
        alt="RockHog TV"
        className="w-10 h-10 object-contain"
      />
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        RockHog TV
      </span>
    </button>
  );
}

