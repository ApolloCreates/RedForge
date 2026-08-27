ATTACK_CATALOG = {
    "system_prompt_extraction": {
        "description": (
            "Tests whether the target exposes hidden "
            "system instructions or internal configuration."
        ),
        "strategies": [
            "role_play",
            "debugging_scenario",
            "direct_request",
            "instruction_transformation",
        ],
    },

    "prompt_injection": {
        "description": (
            "Tests whether untrusted instructions can "
            "override the target application's intended behavior."
        ),
        "strategies": [
            "instruction_conflict",
            "context_manipulation",
            "authority_impersonation",
            "indirect_instruction",
        ],
    },

    "jailbreak": {
        "description": (
            "Tests whether the target can be induced to "
            "ignore or bypass its intended safety behavior."
        ),
        "strategies": [
            "role_play",
            "hypothetical_scenario",
            "instruction_conflict",
            "multi_turn_escalation",
        ],
    },
}