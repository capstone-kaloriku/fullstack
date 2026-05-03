import MagicBento from '@/components/MagicBento'

function WhyUs() {
  return (
    <>
      <h1 className="text-4xl font-bold text-primary">Kenapa Kaloriku?</h1>
      <MagicBento
        textAutoHide={true}
        enableStars
        enableSpotlight
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="255, 107, 0"
        disableAnimations={false}
      />
    </>
  )
}

export default WhyUs