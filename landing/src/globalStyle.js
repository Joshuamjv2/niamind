// GlobalStyle.js
import React from "react";

export function GlobalStyle() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

      .ff-serif { 
        font-family: 'Fraunces', Georgia, serif; 
      }

      input::placeholder, 
      textarea::placeholder { 
        @apply text-niamind-muted/55; 
      }

      .focus-ring:focus-visible {
        @apply outline outline-2 outline-offset-2 outline-niamind-gold;
      }

      input:focus, 
      textarea:focus, 
      button:focus-visible {
        outline: none;
      }

      input:focus-visible, 
      textarea:focus-visible {
        outline: none;
        @apply border-niamind-gold !important;
      }

      button:focus-visible {
        @apply outline outline-2 outline-offset-2 outline-niamind-gold;
      }

      .step-anim {
        animation: fadeSlideIn 0.45s ease both;
      }

      @keyframes fadeSlideIn {
        from { 
          opacity: 0; 
          transform: translateY(8px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .step-anim { 
          animation: none; 
        }
      }
    `}</style>
    );
}
