@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --line: rgba(140, 160, 188, 0.18);
}

* {
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 88px;
}

body {
  @apply bg-ice text-navy-900 font-sans antialiased;
  overflow-x: hidden;
}

::selection {
  background: theme("colors.navy.500");
  color: #fff;
}

/* Скролбар */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #eef2f8;
}
::-webkit-scrollbar-thumb {
  background: theme("colors.navy.600");
  border-radius: 999px;
  border: 2px solid #eef2f8;
}
::-webkit-scrollbar-thumb:hover {
  background: theme("colors.navy.700");
}

@layer components {
  /* Скло-картка на світлому тлі */
  .glass {
    @apply bg-white/70 backdrop-blur-xl border border-white/60 shadow-card;
  }
  /* Скло-панель на темному тлі */
  .glass-dark {
    background: linear-gradient(180deg, rgba(18, 42, 84, 0.55), rgba(8, 20, 40, 0.55));
    @apply backdrop-blur-xl border border-white/10;
  }
  .container-x {
    @apply mx-auto w-full max-w-[1240px] px-5 sm:px-8;
  }
  .eyebrow {
    @apply inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-navy-500;
  }
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2;
  }
  .btn-primary {
    @apply btn bg-navy-700 text-white hover:bg-navy-600 shadow-card hover:-translate-y-0.5;
  }
  .btn-ghost {
    @apply btn border border-navy-700/15 bg-white text-navy-800 hover:border-navy-500/40 hover:bg-white;
  }
  .btn-signal {
    @apply btn bg-signal text-navy-950 hover:brightness-105 shadow-card hover:-translate-y-0.5;
  }
  .field-label {
    @apply mb-1.5 block text-[13px] font-medium text-navy-800;
  }
  .field {
    @apply w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-steel/80 transition focus:border-navy-500 focus:outline-none focus:ring-4 focus:ring-navy-500/10;
  }
  /* Тонкий восьмикутний щит-мотив як роздільник */
  .rule-shield {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent);
  }
}

/* Приховати нативний фокус-ринг там, де ведемо власний */
:focus:not(:focus-visible) {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
