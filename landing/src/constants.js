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
        key: "working",
        q: "What are you working on right now in your life?",
        placeholder: "Doesn't need to be polished. Just honest.",
    },
    {
        key: "talk",
        q: "Who do you talk to about it?",
        placeholder: "Could be one person, could be nobody in particular.",
    },
    {
        key: "goodDay",
        q: "What does a good day look like for you?",
        placeholder: "No wrong answer here.",
    },
    {
        key: "bring",
        q: "What do you think you could bring to a space like this?",
        placeholder: "Could be small. Could be surprising.",
    },
    {
        key: "focus",
        q: "What areas of life are you most focused on right now?",
        multi: true,
    },
];
