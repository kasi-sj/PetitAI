# severity_keywords.py

# Map each keyword to its severity level
SEVERITY_LOOKUP = {}

SEVERITY_KEYWORDS = {
    "High": [
        "immediately", "urgent", "critical", "as soon as possible", "emergency", 
        "high priority", "top priority", "act now", "requires immediate attention", 
        "important", "severe", "time-sensitive"
    ],
    "Medium": [
        "ASAP", "soon", "moderate", "needs attention", "fairly important",
        "whenever possible", "within a reasonable time", "should be addressed"
    ],
    "Low": [
        "minor", "low priority", "not urgent", "whenever convenient", "can wait",
        "optional", "not immediate", "no rush", "take your time"
    ]
}

# Assign severity levels numerically for comparison
SEVERITY_ORDER = {"High": 3, "Medium": 2, "Low": 1, "Unknown": 0}

# Populate HashMap for fast lookups
for severity, keywords in SEVERITY_KEYWORDS.items():
    for keyword in keywords:
        SEVERITY_LOOKUP[keyword] = severity  # { "urgent": "High", "ASAP": "Medium", ... }


def get_highest_severity_word(text):
    """Find the highest severity word dynamically using max() for efficiency."""
    words = text.lower().split()
    
    highest_word, highest_severity = max(
        ((word, SEVERITY_LOOKUP[word]) for word in words if word in SEVERITY_LOOKUP),
        key=lambda item: SEVERITY_ORDER[item[1]],
        default=(None, None)
    )

    return highest_severity
