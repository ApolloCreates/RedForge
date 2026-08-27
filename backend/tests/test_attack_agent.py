from app.attacks.agent import AttackAgent


def main():

    agent = AttackAgent()

    attack = agent.generate_attack(
        category="system_prompt_extraction",
        strategy="role_play"
    )

    print("\nGenerated Attack")
    print("=" * 50)

    print("Category:", attack.category)
    print("Strategy:", attack.strategy)
    print("Prompt:", attack.prompt)


if __name__ == "__main__":
    main()