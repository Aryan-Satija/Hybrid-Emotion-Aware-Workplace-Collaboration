from enum import Enum, auto

class TextEmotion(Enum):
    HAPPY = auto()
    ANGRY = auto()
    SURPRISE = auto()
    SAD = auto()
    FEAR = auto()

CONSOLING_MESSAGES = [
    "I sense you're upset. Maybe take a deep breath before sending this one 💛",
    "It seems emotions are running high. How about a short break? 🌿",
    "Feeling heated? A quick pause might help clear your thoughts ✨",
    "I hear your frustration. Consider revising or waiting a moment 💙",
    "Strong emotions detected. Let’s take a breather before we continue 🕊️",
]
