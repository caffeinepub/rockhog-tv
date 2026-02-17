export default function HeroBanner() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      <img
        src="/assets/generated/rockhog-hero.dim_1600x600.png"
        alt="RockHog TV - Stream Everything"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Stream Everything
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Your all-in-one destination for music, gaming, sports, horror, and more. Join the RockHog community today.
          </p>
        </div>
      </div>
    </div>
  );
}

