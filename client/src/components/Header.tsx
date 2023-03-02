// Logo rendered as inline SVG
import ThemeToggle from './ThemeToggle'

function Header() {
    return (
        <header className="sticky top-0 z-header">
            <div className="bg-gradient-to-r from-brand-gradientFrom/90 via-brand-gradientVia/90 to-brand-gradientTo/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <nav className="px-4 lg:px-8">
                    <div className="mx-auto max-w-screen-xl h-16 flex items-center justify-between">
                        <a href="#" className="group flex items-center gap-3">
                            <svg
                                className="h-10 w-10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                                viewBox="0 0 72 72"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                            >
                                <defs>
                                    <linearGradient
                                        id="brandGrad"
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="1"
                                        gradientUnits="objectBoundingBox"
                                    >
                                        <stop
                                            offset="0%"
                                            stop-color="#06b6d4"
                                        />
                                        <stop
                                            offset="50%"
                                            stop-color="#22d3ee"
                                        />
                                        <stop
                                            offset="100%"
                                            stop-color="#4f46e5"
                                        />
                                        <animateTransform
                                            attributeName="gradientTransform"
                                            attributeType="XML"
                                            type="rotate"
                                            from="0 .5 .5"
                                            to="360 .5 .5"
                                            dur="8s"
                                            repeatCount="indefinite"
                                        />
                                    </linearGradient>
                                    <radialGradient
                                        id="glow"
                                        cx="50%"
                                        cy="50%"
                                        r="50%"
                                    >
                                        <stop
                                            offset="0%"
                                            stop-color="#22d3ee"
                                            stop-opacity="0.7"
                                        />
                                        <stop
                                            offset="100%"
                                            stop-color="#22d3ee"
                                            stop-opacity="0"
                                        />
                                    </radialGradient>
                                </defs>
                                <circle
                                    cx="36"
                                    cy="36"
                                    r="22"
                                    fill="url(#glow)"
                                />
                                <rect
                                    x="22"
                                    y="22"
                                    width="28"
                                    height="28"
                                    rx="8"
                                    fill="url(#brandGrad)"
                                />
                                <g
                                    stroke="url(#brandGrad)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    fill="none"
                                >
                                    <path d="M36 8v10" />
                                    <path d="M36 54v10" />
                                    <path d="M8 36h10" />
                                    <path d="M54 36h10" />
                                    <path d="M15 15l8 8" />
                                    <path d="M57 15l-8 8" />
                                    <path d="M15 57l8-8" />
                                    <path d="M57 57l-8-8" />
                                </g>
                                <text
                                    x="36"
                                    y="41"
                                    textAnchor="middle"
                                    fontFamily="ui-sans-serif, system-ui"
                                    fontSize="14"
                                    fontWeight="800"
                                    fill="#ffffff"
                                >
                                    AI
                                </text>
                            </svg>
                            <div className="flex flex-col leading-tight">
                                <span className="text-white font-semibold tracking-wide">
                                    Dream Canvas
                                </span>
                                <span className="text-white/70 text-xs">
                                    Create stunning visuals with prompts
                                </span>
                            </div>
                        </a>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header
