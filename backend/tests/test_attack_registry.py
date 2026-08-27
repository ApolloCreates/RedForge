from app.attacks.registry import AttackRegistry


def main():

    registry = AttackRegistry()

    print("\nRedForge Attack Registry")
    print("=" * 50)

    for category in registry.categories():

        print(f"\nCategory: {category}")

        print(
            "Description:",
            registry.description(category)
        )

        print(
            "Strategies:",
            ", ".join(
                registry.strategies(category)
            )
        )


if __name__ == "__main__":
    main()