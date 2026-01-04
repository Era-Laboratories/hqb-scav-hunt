export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-deep-purple to-dark-navy">
      <div className="text-center space-y-8 p-8">
        {/* Logo */}
        <h1 className="font-pixel text-6xl neon-text text-neon-lime">
          UP!
        </h1>

        {/* Subtitle */}
        <div className="space-y-2">
          <p className="font-mono text-lg text-white">
            HQB Scalable HCI 2025
          </p>
          <p className="font-mono text-lg text-white">
            Scavenger Hunt
          </p>
          <p className="font-mono text-sm text-cyber-blue">
            Huaqiangbei Edition
          </p>
        </div>

        {/* Login Button */}
        <div className="pt-8">
          <button className="btn-primary">
            🔐 SIGN IN WITH GOOGLE
          </button>
        </div>

        {/* Animated pixel avatars placeholder */}
        <div className="pt-12 text-xs text-gray-500 font-mono">
          [Animated pixel avatars walking by]
        </div>
      </div>
    </main>
  );
}
