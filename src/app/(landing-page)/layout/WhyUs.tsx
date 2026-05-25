import MagicBento from '@/components/MagicBento'

function WhyUs() {
  return (
    <div className="w-full" id="why-us">
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
    </div>
  )
}

export default WhyUs