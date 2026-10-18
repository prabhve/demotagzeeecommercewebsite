import React from 'react';

interface ProductArtworkProps {
  productId: string;
  className?: string;
  zoom?: boolean;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  productId,
  className = 'w-full h-full',
  zoom = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${className} ${
        zoom ? 'scale-110' : 'group-hover:scale-105'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, #FFFDF8 0%, #F8F5EE 60%, #ECE6D8 100%)',
      }}
    >
      {/* Background subtle mandala halo */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#C5A059" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 4" />
        <path
          d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M43 157 L157 43"
          stroke="#C5A059"
          strokeWidth="0.3"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Render bespoke artisanal vector rendering based on product */}
      {productId.includes('urli') && <UrliVectorArtwork />}
      {productId.includes('lamp') && <PeacockLampVectorArtwork />}
      {productId.includes('cutl') && <CutleryVectorArtwork />}
      {productId.includes('plnt') && <PlanterVectorArtwork />}
      {productId.includes('mirr') && <MirrorVectorArtwork />}
      {productId.includes('lant') && <LanternVectorArtwork />}

      {/* Luxury Metallic Floor Reflection Shadow */}
      <div
        className="absolute bottom-4 w-3/4 h-4 rounded-full opacity-35 blur-md pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(160, 120, 40, 0.5) 0%, rgba(200, 160, 60, 0.1) 60%, transparent 100%)',
        }}
      />
    </div>
  );
};

/* 1. Royal Hand-Hammered Brass Urli Bowl */
function UrliVectorArtwork() {
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full max-h-[300px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="brassOuterGold" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF1B8" />
          <stop offset="25%" stopColor="#F5D061" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="85%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#6E4F06" />
        </radialGradient>
        <radialGradient id="brassWaterDepth" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E2F1F8" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#A5D4E6" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#6BA8C5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#96701B" stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="scallopedRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="30%" stopColor="#DFB135" />
          <stop offset="70%" stopColor="#9A7210" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>
        <radialGradient id="diyaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7C2" />
          <stop offset="40%" stopColor="#FFA000" />
          <stop offset="80%" stopColor="#E65100" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Cast Brass Pedestal Ring */}
      <ellipse cx="200" cy="245" rx="100" ry="24" fill="#6A4C07" />
      <ellipse cx="200" cy="240" rx="98" ry="22" fill="url(#brassOuterGold)" />

      {/* Main Basin Lower Bell */}
      <path
        d="M60 160 C 60 250, 130 260, 200 260 C 270 260, 340 250, 340 160 C 340 145, 60 145, 60 160 Z"
        fill="url(#brassOuterGold)"
      />

      {/* Hand-hammered faceted indentation dots */}
      <g fill="#9A7210" opacity="0.35">
        <circle cx="120" cy="180" r="4" /><circle cx="150" cy="190" r="5" />
        <circle cx="190" cy="195" r="5.5" /><circle cx="230" cy="193" r="5" />
        <circle cx="270" cy="183" r="4" /><circle cx="100" cy="195" r="4.5" />
        <circle cx="135" cy="210" r="4.5" /><circle cx="175" cy="220" r="5" />
        <circle cx="215" cy="222" r="5" /><circle cx="255" cy="212" r="4.5" />
        <circle cx="290" cy="198" r="4" /><circle cx="160" cy="238" r="4" />
        <circle cx="200" cy="242" r="4.5" /><circle cx="240" cy="239" r="4" />
      </g>

      {/* Scalloped Lotus Petal Basin Rim */}
      <ellipse cx="200" cy="155" rx="145" ry="38" fill="url(#scallopedRim)" stroke="#6A4C07" strokeWidth="1.5" />
      <ellipse cx="200" cy="156" rx="138" ry="34" fill="#886008" />

      {/* Water Pool with Reflective Shimmer */}
      <ellipse cx="200" cy="157" rx="134" ry="31" fill="url(#brassWaterDepth)" />

      {/* Water Ripple Rings */}
      <ellipse cx="200" cy="157" rx="90" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
      <ellipse cx="200" cy="157" rx="55" ry="11" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />

      {/* Floating Orange Marigold Petals (Genda Phool) */}
      <g transform="translate(140, 142)">
        <circle cx="10" cy="10" r="14" fill="#FF8F00" opacity="0.95" />
        <circle cx="10" cy="10" r="10" fill="#FFB300" />
        <circle cx="10" cy="10" r="5" fill="#FFE082" />
      </g>
      <g transform="translate(230, 148)">
        <circle cx="10" cy="10" r="13" fill="#E65100" opacity="0.95" />
        <circle cx="10" cy="10" r="9" fill="#FF9800" />
        <circle cx="10" cy="10" r="4.5" fill="#FFE082" />
      </g>
      <g transform="translate(185, 162)">
        <circle cx="8" cy="8" r="11" fill="#FF6F00" />
        <circle cx="8" cy="8" r="7" fill="#FFB300" />
      </g>

      {/* Center Floating Brass Diya with Flame */}
      <ellipse cx="200" cy="153" rx="18" ry="7" fill="#8B6508" />
      <ellipse cx="200" cy="151" rx="16" ry="6" fill="#D4AF37" />
      {/* Flame & Glow */}
      <circle cx="200" cy="144" r="15" fill="url(#diyaGlow)" opacity="0.75" />
      <path d="M197 149 C 195 142, 200 134, 200 132 C 200 134, 205 142, 203 149 Z" fill="#FFEAA7" />
      <path d="M198 148 C 197 144, 200 138, 200 136 C 200 138, 203 144, 202 148 Z" fill="#FF6D00" />

      {/* Traditional Side Handles (Mughal Ring Mounts) */}
      <path d="M50 160 C 35 155, 30 175, 45 182 C 55 185, 60 175, 55 165" fill="none" stroke="url(#scallopedRim)" strokeWidth="6" strokeLinecap="round" />
      <path d="M350 160 C 365 155, 370 175, 355 182 C 345 185, 340 175, 345 165" fill="none" stroke="url(#scallopedRim)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/* 2. Brass Peacock Mayur Diya with Intricate Filigree */
function PeacockLampVectorArtwork() {
  return (
    <svg viewBox="0 0 320 380" className="w-full h-full max-h-[300px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="peacockGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="35%" stopColor="#F5CD47" />
          <stop offset="70%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#7E580B" />
        </linearGradient>
        <radialGradient id="oilBasinGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
      </defs>

      {/* Stepped Heavy Base */}
      <path d="M110 340 L210 340 L225 365 L95 365 Z" fill="url(#peacockGold)" stroke="#6A4C07" strokeWidth="1.5" />
      <ellipse cx="160" cy="340" rx="55" ry="10" fill="#FFEAA7" />

      {/* Pillar Column with classical turnings */}
      <path d="M152 230 L168 230 L165 330 L155 330 Z" fill="url(#peacockGold)" />
      <ellipse cx="160" cy="275" rx="14" ry="7" fill="#F5CD47" />
      <ellipse cx="160" cy="230" rx="18" ry="8" fill="#F5CD47" />

      {/* Multi-Wick Oil Basin (Panch-Aarti Dish) */}
      <ellipse cx="160" cy="220" rx="72" ry="20" fill="url(#peacockGold)" stroke="#6A4C07" strokeWidth="1" />
      <ellipse cx="160" cy="218" rx="66" ry="16" fill="#886008" />
      <ellipse cx="160" cy="217" rx="62" ry="14" fill="#FFA000" opacity="0.8" />

      {/* 5 Wicks at edge */}
      <circle cx="98" cy="220" r="3" fill="#FFEAA7" />
      <circle cx="130" cy="228" r="3" fill="#FFEAA7" />
      <circle cx="160" cy="231" r="3" fill="#FFEAA7" />
      <circle cx="190" cy="228" r="3" fill="#FFEAA7" />
      <circle cx="222" cy="220" r="3" fill="#FFEAA7" />

      {/* Center Rising Stalk to Peacock */}
      <rect x="156" y="160" width="8" height="60" fill="url(#peacockGold)" />

      {/* The Majestic Moradabad Peacock Finial */}
      {/* Peacock Body & Arching Neck */}
      <path
        d="M156 165 C 145 155, 145 130, 155 115 C 160 105, 155 85, 168 75 C 172 72, 180 72, 178 82 C 176 90, 168 100, 168 115 C 175 125, 182 145, 164 165 Z"
        fill="url(#peacockGold)"
        stroke="#6A4C07"
        strokeWidth="1.2"
      />
      {/* Crown / Crest Feather Plume (Kalgi) */}
      <path d="M174 74 L184 60 M174 74 L180 56 M174 74 L174 54" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <circle cx="184" cy="59" r="2.5" fill="#FFEAA7" />
      <circle cx="180" cy="55" r="2.5" fill="#FFEAA7" />
      <circle cx="174" cy="53" r="2.5" fill="#FFEAA7" />

      {/* Spectacular Fan Plume Plumage (Filigree Openwork) */}
      <path
        d="M158 135 C 130 115, 110 70, 140 40 C 170 10, 225 30, 220 85 C 218 115, 185 135, 158 135 Z"
        fill="url(#peacockGold)"
        stroke="#6A4C07"
        strokeWidth="1.5"
      />
      {/* Filigree piercings inside feathers */}
      <g fill="#FFFDF5" opacity="0.85">
        <ellipse cx="150" cy="65" rx="6" ry="12" transform="rotate(-20 150 65)" />
        <ellipse cx="170" cy="48" rx="6" ry="12" />
        <ellipse cx="195" cy="58" rx="6" ry="12" transform="rotate(25 195 58)" />
        <ellipse cx="205" cy="85" rx="6" ry="12" transform="rotate(50 205 85)" />
        <ellipse cx="185" cy="95" rx="5" ry="10" transform="rotate(30 185 95)" />
        <ellipse cx="160" cy="90" rx="5" ry="10" transform="rotate(-15 160 90)" />
      </g>
      <g fill="#D4AF37">
        <circle cx="150" cy="65" r="3" />
        <circle cx="170" cy="48" r="3" />
        <circle cx="195" cy="58" r="3" />
        <circle cx="205" cy="85" r="3" />
      </g>
    </svg>
  );
}

/* 3. Hand-Forged Pure Copper & Brass Royal Cutlery Set */
function CutleryVectorArtwork() {
  return (
    <svg viewBox="0 0 380 320" className="w-full h-full max-h-[300px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="copperBasin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAA8A" />
          <stop offset="35%" stopColor="#E27248" />
          <stop offset="70%" stopColor="#B34B24" />
          <stop offset="100%" stopColor="#6C280E" />
        </linearGradient>
        <linearGradient id="brassStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6409" />
        </linearGradient>
      </defs>

      {/* Velvet Presentation Cushion Base */}
      <rect x="30" y="40" width="320" height="240" rx="12" fill="#1C1427" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="40" y="50" width="300" height="220" rx="8" fill="#2A1B3D" opacity="0.6" />

      {/* Item 1: Royal Dinner Spoon */}
      <g transform="translate(75, 60)">
        <ellipse cx="20" cy="45" rx="18" ry="28" fill="url(#copperBasin)" stroke="#6C280E" strokeWidth="1" />
        {/* Hammered indentations */}
        <circle cx="16" cy="40" r="3" fill="#6C280E" opacity="0.25" />
        <circle cx="24" cy="48" r="3.5" fill="#6C280E" opacity="0.25" />
        {/* Brass Rivet Collar */}
        <rect x="15" y="70" width="10" height="8" rx="2" fill="url(#brassStem)" />
        {/* Faceted Hexagonal Handle */}
        <polygon points="17,78 23,78 26,190 14,190" fill="url(#brassStem)" stroke="#8A6409" strokeWidth="0.8" />
        <circle cx="20" cy="184" r="3" fill="#FFEAA7" />
      </g>

      {/* Item 2: Banquet Fork */}
      <g transform="translate(145, 60)">
        {/* 4 Tines in copper */}
        <path
          d="M6 25 L6 55 C 6 68, 34 68, 34 55 L34 25 L30 25 L30 52 C 30 62, 26 62, 26 52 L26 25 L22 25 L22 52 C 22 62, 18 62, 18 52 L18 25 L14 25 L14 52 C 14 62, 10 62, 10 52 L10 25 Z"
          fill="url(#copperBasin)"
          stroke="#6C280E"
          strokeWidth="0.8"
        />
        <rect x="15" y="68" width="10" height="8" rx="2" fill="url(#brassStem)" />
        <polygon points="17,76 23,76 26,190 14,190" fill="url(#brassStem)" stroke="#8A6409" strokeWidth="0.8" />
        <circle cx="20" cy="184" r="3" fill="#FFEAA7" />
      </g>

      {/* Item 3: Royal Dinner Knife */}
      <g transform="translate(215, 60)">
        <path
          d="M16 20 C 22 20, 26 35, 26 60 L24 72 L16 72 Z"
          fill="url(#copperBasin)"
          stroke="#6C280E"
          strokeWidth="0.8"
        />
        <line x1="24" y1="35" x2="24" y2="65" stroke="#FFEAA7" strokeWidth="0.8" opacity="0.6" />
        <rect x="15" y="72" width="10" height="8" rx="2" fill="url(#brassStem)" />
        <polygon points="17,80 23,80 26,190 14,190" fill="url(#brassStem)" stroke="#8A6409" strokeWidth="0.8" />
        <circle cx="20" cy="184" r="3" fill="#FFEAA7" />
      </g>

      {/* Item 4: Petite Dessert / Tea Spoon */}
      <g transform="translate(275, 80)">
        <ellipse cx="16" cy="35" rx="13" ry="19" fill="url(#copperBasin)" stroke="#6C280E" strokeWidth="0.8" />
        <rect x="12" y="52" width="8" height="6" rx="1.5" fill="url(#brassStem)" />
        <polygon points="13,58 19,58 21,155 11,155" fill="url(#brassStem)" stroke="#8A6409" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

/* 4. Antique Bronze & Patina Ribbed Planter with Gold Tripod */
function PlanterVectorArtwork() {
  return (
    <svg viewBox="0 0 340 380" className="w-full h-full max-h-[300px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bronzeVerdigris" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A6B63" />
          <stop offset="25%" stopColor="#2F4F48" />
          <stop offset="50%" stopColor="#3B5750" />
          <stop offset="75%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#2E3D39" />
        </linearGradient>
        <linearGradient id="goldLeg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8D6E18" />
        </linearGradient>
      </defs>

      {/* Lush Indoor Ficus Leaves sprouting from top */}
      <g opacity="0.95">
        <path d="M170 120 C 130 90, 110 50, 125 30 C 150 45, 160 85, 170 120 Z" fill="#2E7D32" />
        <path d="M170 120 C 190 85, 230 65, 245 80 C 235 105, 195 115, 170 120 Z" fill="#388E3C" />
        <path d="M170 120 C 160 70, 180 30, 190 20 C 195 45, 185 85, 170 120 Z" fill="#43A047" />
        <path d="M170 120 C 140 100, 100 110, 95 125 C 115 135, 150 125, 170 120 Z" fill="#1B5E20" />
      </g>

      {/* Elegant Architectural Gold Tripod Legs */}
      {/* Rear leg */}
      <line x1="170" y1="200" x2="170" y2="350" stroke="url(#goldLeg)" strokeWidth="6" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="125" y1="210" x2="85" y2="355" stroke="url(#goldLeg)" strokeWidth="7" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="215" y1="210" x2="255" y2="355" stroke="url(#goldLeg)" strokeWidth="7" strokeLinecap="round" />
      {/* Tripod Brass Center Ring */}
      <ellipse cx="170" cy="275" rx="35" ry="9" fill="none" stroke="url(#goldLeg)" strokeWidth="5" />

      {/* Planter Pot Body with Fluted Vertical Ribbing */}
      <path
        d="M105 130 L235 130 L220 235 C 220 245, 120 245, 120 235 Z"
        fill="url(#bronzeVerdigris)"
        stroke="#2E3D39"
        strokeWidth="1.5"
      />

      {/* Vertical Ribbing Flutes */}
      <line x1="125" y1="130" x2="132" y2="236" stroke="#52796F" strokeWidth="3" opacity="0.7" />
      <line x1="145" y1="130" x2="148" y2="238" stroke="#52796F" strokeWidth="3" opacity="0.7" />
      <line x1="170" y1="130" x2="170" y2="240" stroke="#7BA69B" strokeWidth="3.5" opacity="0.8" />
      <line x1="195" y1="130" x2="192" y2="238" stroke="#3D5A52" strokeWidth="3" opacity="0.7" />
      <line x1="215" y1="130" x2="208" y2="236" stroke="#253833" strokeWidth="3" opacity="0.7" />

      {/* Top Gold Rim Collar */}
      <ellipse cx="170" cy="130" rx="65" ry="14" fill="url(#goldLeg)" stroke="#8D6E18" strokeWidth="1" />
      <ellipse cx="170" cy="130" rx="58" ry="11" fill="#3E2723" />
    </svg>
  );
}

/* 5. Royal Gold Leaf Moradabad Etched Wall Mirror */
function MirrorVectorArtwork() {
  return (
    <svg viewBox="0 0 360 360" className="w-full h-full max-h-[300px] drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldLeafRim" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#FFF2B2" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="85%" stopColor="#AA821C" />
          <stop offset="98%" stopColor="#5E4306" />
        </radialGradient>
        <linearGradient id="mirrorGlassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF5FB" />
          <stop offset="45%" stopColor="#D4E6F1" />
          <stop offset="70%" stopColor="#A9CCE3" />
          <stop offset="100%" stopColor="#EBF5FB" />
        </linearGradient>
      </defs>

      {/* Outer Scalloped Sunburst Brass Sheet */}
      <circle cx="180" cy="180" r="150" fill="url(#goldLeafRim)" stroke="#8A6409" strokeWidth="2" />

      {/* Repoussé Chiseled Mughal Floral Petal Ring (16 Petals) */}
      <g stroke="#7A5605" strokeWidth="1" fill="#D4AF37" opacity="0.75">
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
          <ellipse
            key={i}
            cx="180"
            cy="46"
            rx="12"
            ry="18"
            transform={`rotate(${angle} 180 180)`}
            fill="#FFE082"
          />
        ))}
      </g>

      {/* Beaded Granulation Border Ring */}
      <circle cx="180" cy="180" r="115" fill="none" stroke="#5E4306" strokeWidth="3" strokeDasharray="4 4" />

      {/* Inner Beveled Brass Framing Ring */}
      <circle cx="180" cy="180" r="105" fill="#FFEAA7" stroke="#8A6409" strokeWidth="3" />

      {/* Ultra-Clear Saint-Gobain Distortion-Free Mirror Glass Basin */}
      <circle cx="180" cy="180" r="95" fill="url(#mirrorGlassReflection)" />

      {/* Diagonal Glass Sheen Highlight Strip */}
      <polygon points="120,85 160,85 240,275 200,275" fill="#FFFFFF" opacity="0.3" />
      <polygon points="168,85 185,85 258,260 241,260" fill="#FFFFFF" opacity="0.2" />

      {/* Center Subtle Reflection Star */}
      <circle cx="180" cy="180" r="6" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
}

/* 6. Handcrafted Moroccan Hanging Lantern with Amber Glass */
function LanternVectorArtwork() {
  return (
    <svg viewBox="0 0 320 400" className="w-full h-full max-h-[300px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moroccanBrass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#8A6409" />
          <stop offset="100%" stopColor="#4A3403" />
        </linearGradient>
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="40%" stopColor="#FFB300" />
          <stop offset="85%" stopColor="#FF6F00" />
          <stop offset="100%" stopColor="#BF360C" />
        </radialGradient>
      </defs>

      {/* Suspension Chain & Hanging Ring */}
      <circle cx="160" cy="20" r="10" fill="none" stroke="url(#moroccanBrass)" strokeWidth="3.5" />
      <line x1="160" y1="30" x2="160" y2="70" stroke="url(#moroccanBrass)" strokeWidth="3" strokeDasharray="5 3" />

      {/* Moorish Onion Dome Top Cap */}
      <path
        d="M160 70 C 145 85, 120 100, 110 120 L210 120 C 200 100, 175 85, 160 70 Z"
        fill="url(#moroccanBrass)"
        stroke="#4A3403"
        strokeWidth="1.2"
      />
      {/* Pierced ventilation holes on dome */}
      <circle cx="160" cy="95" r="2.5" fill="#FFEAA7" />
      <circle cx="145" cy="105" r="2.5" fill="#FFEAA7" />
      <circle cx="175" cy="105" r="2.5" fill="#FFEAA7" />

      {/* Lantern Middle Hexagonal Amber Glass Chamber */}
      <polygon points="110,120 210,120 225,230 195,290 125,290 95,230" fill="url(#amberGlow)" opacity="0.92" />

      {/* Brass Structural Struts & Framework */}
      <polygon points="110,120 210,120 225,230 195,290 125,290 95,230" fill="none" stroke="url(#moroccanBrass)" strokeWidth="4" />
      <line x1="160" y1="120" x2="160" y2="290" stroke="url(#moroccanBrass)" strokeWidth="3" />
      <line x1="102" y1="230" x2="218" y2="230" stroke="url(#moroccanBrass)" strokeWidth="2.5" />

      {/* Geometric Moradabad Pierced Jali Mesh Pattern on Glass */}
      <g stroke="#6A4C07" strokeWidth="1" opacity="0.75" fill="none">
        <circle cx="160" cy="175" r="24" />
        <circle cx="160" cy="175" r="14" />
        <path d="M140 175 L180 175 M160 155 L160 195" />
        <circle cx="160" cy="245" r="16" />
        <path d="M145 245 L175 245 M160 230 L160 260" />
      </g>

      {/* Internal Candle Glow Core */}
      <circle cx="160" cy="195" r="16" fill="#FFFDE7" opacity="0.8" />
      <path d="M158 190 C 156 182, 160 174, 160 172 C 160 174, 164 182, 162 190 Z" fill="#FFE082" />

      {/* Pendant Droplet Finial Base */}
      <path d="M125 290 L195 290 L160 340 Z" fill="url(#moroccanBrass)" stroke="#4A3403" strokeWidth="1" />
      <circle cx="160" cy="348" r="7" fill="url(#moroccanBrass)" />
    </svg>
  );
}
