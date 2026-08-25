from .catalog import ATTACK_CATALOG


class AttackRegistry:

    def __init__(self):

        self.catalog = ATTACK_CATALOG

    def categories(self):

        return list(self.catalog.keys())

    def get_category(self, category: str):

        if category not in self.catalog:

            raise ValueError(
                f"Unknown attack category: {category}"
            )

        return self.catalog[category]

    def strategies(self, category: str):

        return self.get_category(
            category
        )["strategies"]

    def description(self, category: str):

        return self.get_category(
            category
        )["description"]