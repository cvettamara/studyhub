"use client"

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Large Book Stack - Cyan */}
      <svg
        className="absolute left-[3%] top-[12%] h-32 w-32 animate-float opacity-30"
        viewBox="0 0 80 80"
        fill="none"
      >
        <rect x="10" y="45" width="50" height="8" rx="2" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="2"/>
        <rect x="8" y="35" width="54" height="8" rx="2" fill="#06B6D4" fillOpacity="0.2" stroke="#06B6D4" strokeWidth="2"/>
        <rect x="12" y="25" width="48" height="8" rx="2" fill="#06B6D4" fillOpacity="0.25" stroke="#06B6D4" strokeWidth="2"/>
        <path d="M15 45v-5M25 45v-5M35 45v-5" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.5"/>
      </svg>

      {/* Giant Pencil - Green */}
      <svg
        className="absolute right-[5%] top-[8%] h-40 w-40 animate-float-delayed opacity-25"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M75 15L85 25L35 75L20 80L25 65L75 15Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2.5"/>
        <path d="M70 20L80 30" stroke="#10B981" strokeWidth="2"/>
        <path d="M20 80L25 65L35 75L20 80Z" fill="#10B981" fillOpacity="0.4"/>
        <path d="M30 70L35 75L25 65L30 70Z" stroke="#10B981" strokeWidth="1.5"/>
      </svg>

      {/* Large Lightbulb - Purple */}
      <svg
        className="absolute left-[8%] top-[50%] h-36 w-36 animate-float-slow opacity-30"
        viewBox="0 0 80 100"
        fill="none"
      >
        <path d="M40 10C25 10 15 22 15 35C15 45 20 52 28 58C32 61 35 66 35 72V78H45V72C45 66 48 61 52 58C60 52 65 45 65 35C65 22 55 10 40 10Z" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="2.5"/>
        <path d="M35 78H45V85C45 88 43 90 40 90C37 90 35 88 35 85V78Z" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M32 82H48M32 86H48" stroke="#8B5CF6" strokeWidth="1.5"/>
        <path d="M40 20V30M30 25L35 32M50 25L45 32" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.6"/>
      </svg>

      {/* Graduation Cap - Pink */}
      <svg
        className="absolute right-[8%] top-[45%] h-36 w-36 animate-float opacity-30"
        viewBox="0 0 100 80"
        fill="none"
      >
        <path d="M50 5L5 30L50 55L95 30L50 5Z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2.5"/>
        <path d="M20 35V55C20 55 35 70 50 70C65 70 80 55 80 55V35" stroke="#EC4899" strokeWidth="2.5"/>
        <path d="M50 55V70" stroke="#EC4899" strokeWidth="2"/>
        <circle cx="50" cy="72" r="4" fill="#EC4899" fillOpacity="0.4" stroke="#EC4899" strokeWidth="2"/>
        <path d="M90 30V50" stroke="#EC4899" strokeWidth="2.5"/>
        <circle cx="90" cy="52" r="3" fill="#EC4899"/>
      </svg>

      {/* Open Notebook - Orange */}
      <svg
        className="absolute left-[60%] top-[15%] h-32 w-32 animate-float-delayed opacity-30"
        viewBox="0 0 100 80"
        fill="none"
      >
        <path d="M5 10H45V70H5C3 70 2 68 2 66V14C2 12 3 10 5 10Z" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="2"/>
        <path d="M55 10H95C97 10 98 12 98 14V66C98 68 97 70 95 70H55V10Z" fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="2"/>
        <path d="M45 10H55V70H45V10Z" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="2"/>
        <path d="M15 25H35M15 35H30M15 45H35M15 55H25" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M65 25H85M65 35H80M65 45H85M65 55H75" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6"/>
      </svg>

      {/* Coffee Mug - Cyan */}
      <svg
        className="absolute bottom-[25%] left-[5%] h-28 w-28 animate-float-slow opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path d="M10 25H50V65C50 70 45 75 40 75H20C15 75 10 70 10 65V25Z" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2.5"/>
        <path d="M50 35H60C65 35 70 40 70 48C70 56 65 60 60 60H50" stroke="#06B6D4" strokeWidth="2.5"/>
        <path d="M20 10C20 10 22 18 30 18C38 18 40 10 40 10" stroke="#06B6D4" strokeWidth="2" strokeOpacity="0.5"/>
        <path d="M25 5C25 5 26 12 30 12C34 12 35 5 35 5" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>

      {/* Stack of Papers - Green */}
      <svg
        className="absolute bottom-[15%] right-[25%] h-28 w-28 animate-float opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <rect x="15" y="20" width="45" height="55" rx="3" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="2"/>
        <rect x="12" y="15" width="45" height="55" rx="3" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2"/>
        <rect x="9" y="10" width="45" height="55" rx="3" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2"/>
        <path d="M18 25H42M18 35H38M18 45H40M18 55H30" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6"/>
      </svg>

      {/* Magnifying Glass - Purple */}
      <svg
        className="absolute bottom-[35%] right-[5%] h-24 w-24 animate-float-delayed opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="32" cy="32" r="20" fill="#8B5CF6" fillOpacity="0.1" stroke="#8B5CF6" strokeWidth="2.5"/>
        <path d="M47 47L65 65" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="12" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>

      {/* Stars - Pink */}
      <svg
        className="absolute bottom-[45%] left-[20%] h-24 w-24 animate-float-slow opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path d="M40 5L45 25L65 25L50 38L55 58L40 45L25 58L30 38L15 25L35 25L40 5Z" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2"/>
        <path d="M65 55L68 62L75 62L70 67L72 75L65 70L58 75L60 67L55 62L62 62L65 55Z" fill="#EC4899" fillOpacity="0.3" stroke="#EC4899" strokeWidth="1.5"/>
      </svg>

      {/* Ruler & Compass - Orange */}
      <svg
        className="absolute right-[40%] top-[75%] h-28 w-28 animate-float opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <rect x="5" y="35" width="70" height="12" rx="2" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
        <path d="M15 35V42M25 35V40M35 35V42M45 35V40M55 35V42M65 35V40" stroke="#F97316" strokeWidth="1.5"/>
        <path d="M40 5L30 30H50L40 5Z" stroke="#F97316" strokeWidth="2" fill="#F97316" fillOpacity="0.15"/>
        <circle cx="40" cy="5" r="3" fill="#F97316"/>
      </svg>

      {/* Brain/Mind - Cyan */}
      <svg
        className="absolute left-[35%] top-[5%] h-24 w-24 animate-float-delayed opacity-20"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path d="M40 15C30 15 22 23 22 33C22 38 24 42 28 45C28 52 32 58 40 58C48 58 52 52 52 45C56 42 58 38 58 33C58 23 50 15 40 15Z" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="2"/>
        <path d="M35 25C35 25 30 30 35 35C40 40 35 45 35 45" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M45 25C45 25 50 30 45 35C40 40 45 45 45 45" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M40 20V50" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>

      {/* Alarm Clock - Green */}
      <svg
        className="absolute bottom-[10%] left-[40%] h-24 w-24 animate-float-slow opacity-20"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40" cy="45" r="25" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2.5"/>
        <path d="M40 30V45L50 52" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 20L28 28M60 20L52 28" stroke="#10B981" strokeWidth="2.5"/>
        <circle cx="40" cy="45" r="3" fill="#10B981"/>
        <path d="M15 25C15 25 10 15 20 12" stroke="#10B981" strokeWidth="2"/>
        <path d="M65 25C65 25 70 15 60 12" stroke="#10B981" strokeWidth="2"/>
      </svg>

      {/* Trophy - Purple */}
      <svg
        className="absolute right-[15%] top-[80%] h-20 w-20 animate-float-delayed opacity-20"
        viewBox="0 0 60 70"
        fill="none"
      >
        <path d="M15 10H45V30C45 42 38 50 30 50C22 50 15 42 15 30V10Z" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M15 15H8C5 15 3 18 5 25C7 32 12 35 15 35" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M45 15H52C55 15 57 18 55 25C53 32 48 35 45 35" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M25 50H35V55H25V50Z" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M20 55H40V62H20V55Z" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2"/>
      </svg>

      {/* Backpack - Pink */}
      <svg
        className="absolute left-[75%] top-[55%] h-24 w-24 animate-float opacity-20"
        viewBox="0 0 70 80"
        fill="none"
      >
        <rect x="12" y="20" width="46" height="50" rx="8" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="2.5"/>
        <path d="M20 20V15C20 10 25 5 35 5C45 5 50 10 50 15V20" stroke="#EC4899" strokeWidth="2.5"/>
        <rect x="22" y="35" width="26" height="18" rx="3" fill="#EC4899" fillOpacity="0.25" stroke="#EC4899" strokeWidth="2"/>
        <path d="M35 35V53" stroke="#EC4899" strokeWidth="1.5"/>
        <path d="M8 40C8 40 5 45 5 55C5 60 8 65 12 65" stroke="#EC4899" strokeWidth="2"/>
        <path d="M62 40C62 40 65 45 65 55C65 60 62 65 58 65" stroke="#EC4899" strokeWidth="2"/>
      </svg>

      {/* Globe - Orange */}
      <svg
        className="absolute bottom-[55%] right-[35%] h-20 w-20 animate-float-slow opacity-20"
        viewBox="0 0 60 60"
        fill="none"
      >
        <circle cx="30" cy="30" r="22" fill="#F97316" fillOpacity="0.1" stroke="#F97316" strokeWidth="2"/>
        <ellipse cx="30" cy="30" rx="10" ry="22" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M10 30H50" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.6"/>
        <path d="M14 18H46M14 42H46" stroke="#F97316" strokeWidth="1" strokeOpacity="0.4"/>
        <path d="M30 55V60M25 58H35" stroke="#F97316" strokeWidth="2"/>
      </svg>
    </div>
  )
}
