// constants.js
export const FOCUS_OPTIONS = [
    "Confidence and self-worth",
    "Relationships and connection",
    "Purpose and direction",
    "Entrepreneurship and career",
    "Creativity and expression",
    "Emotional wellbeing",
    "Parenting",
    "Grief and loss",
    "Something else",
];

export const SCREENS = [
    {
        key: "last_scroll",
        q: "What's the last thing you mindlessly scrolled through?",
        placeholder: "No judgment. We've all been there.",
    },
    {
        key: "real_talk",
        q: "How often do you have a conversation that actually goes somewhere?",
        placeholder: "Daily, rarely, it depends...",
    },
    {
        key: "working_on",
        q: "What's one thing you're quietly working on right now?",
        placeholder: "Could be big. Could be small.",
    },
    {
        key: "good_day",
        q: "What does a genuinely good day feel like for you?",
        placeholder: "Not the Instagram version. The real one.",
    },
    {
        key: "bring",
        q: "What do you think you could bring to a space like this?",
        placeholder: "Could be small. Could be surprising.",
        required: true,
    },
    {
        key: "focus",
        q: "What areas of life are you most focused on right now?",
        multi: true,
        options: [], // loaded from API
    },
];
