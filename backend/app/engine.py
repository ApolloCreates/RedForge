from app.attacks.agent import AttackAgent
from app.target.groq_target import GroqTarget
from app.evaluation.evaluator import BasicEvaluator
from app.evaluation.schema import AttackResult
from app.attacks.registry import AttackRegistry


class RedTeamEngine:

    def __init__(
        self,
        evaluator=None,
        progress_callback=None,
    ):
        self.progress_callback = progress_callback

        self.attack_agent = AttackAgent()
        self.target = GroqTarget()

        self.evaluator = (
            evaluator
            if evaluator is not None
            else BasicEvaluator()
        )

        self.registry = AttackRegistry()

    def run_attack(
        self,
        category: str,
        strategy: str,
        attempt_number: int = 1
    ) -> AttackResult:

        allowed_strategies = self.registry.strategies(
            category
        )

        attack = self.attack_agent.generate_attack(
            category=category,
            strategy=strategy,
            allowed_strategies=allowed_strategies,
        )

        response = self.target.generate(
            attack.prompt
        )

        evaluation = self.evaluator.evaluate(
            attack_prompt=attack.prompt,
            target_response=response,
            category=attack.category,
            objective=attack.objective,
            success_criteria=attack.success_criteria,
        )

        result = AttackResult(
            attack_id=attack.attack_id,
            category=attack.category,
            strategy=attack.strategy,
            prompt=attack.prompt,
            objective=attack.objective,
            success_criteria=attack.success_criteria,
            response=response,
            successful=evaluation.successful,
            reason=evaluation.reason,
            attempt_number=attempt_number,
            classification=evaluation.classification,
            evidence=evaluation.evidence
        )

        return result

    def run_adaptive_attack(
        self,
        category: str,
        initial_strategy: str,
        max_attempts: int = 3
    ):

        results = []

        allowed_strategies = self.registry.strategies(
            category
        )

        attack = self.attack_agent.generate_attack(
            category=category,
            strategy=initial_strategy,
            allowed_strategies=allowed_strategies,
        )

        for attempt in range(1, max_attempts + 1):

            print(f"\n{'=' * 60}")
            print(f"ATTEMPT {attempt}")
            print(f"{'=' * 60}")

            print("\nStrategy:")
            print(attack.strategy)

            print("\nObjective:")
            print(attack.objective)

            print("\nSuccess Criteria:")
            print(attack.success_criteria)

            print("\nPrompt:")
            print(attack.prompt)

            response = self.target.generate(
                attack.prompt
            )

            print("\nTarget Response:")
            print(response)

            evaluation = self.evaluator.evaluate(
                attack_prompt=attack.prompt,
                target_response=response,
                category=attack.category,
                objective=attack.objective,
                success_criteria=attack.success_criteria,
            )

            result = AttackResult(
                attack_id=attack.attack_id,
                category=attack.category,
                strategy=attack.strategy,
                prompt=attack.prompt,
                objective=attack.objective,
                success_criteria=attack.success_criteria,
                response=response,
                successful=evaluation.successful,
                reason=evaluation.reason,
                attempt_number=attempt,
                classification=evaluation.classification,
                evidence=evaluation.evidence
            )

            results.append(result)

            print("\nResult:")

            print(result.classification)
            print("Reason:", result.reason)

            if attempt < max_attempts:

                print("\nRefining attack...")

                attack = self.attack_agent.refine_attack(
                    category=attack.category,
                    previous_strategy=attack.strategy,
                    previous_prompt=attack.prompt,
                    target_response=response,
                    failure_reason=evaluation.reason,
                    allowed_strategies=allowed_strategies,
                )

        return results

    def run_category(
        self,
        category: str,
        max_attempts_per_strategy: int = 2
    ):

        strategies = self.registry.strategies(
            category
        )

        results = []

        for strategy in strategies:

            print("\n")
            print("=" * 60)
            print(f"CATEGORY: {category}")
            print(f"STRATEGY: {strategy}")
            print("=" * 60)

            strategy_results = self.run_adaptive_attack(
                category=category,
                initial_strategy=strategy,
                max_attempts=max_attempts_per_strategy
            )

            results.extend(strategy_results)

        return results

    def run_scan(
        self,
        categories=None,
        max_attempts_per_strategy: int = 2
    ):

        if categories is None:
            categories = self.registry.categories()

        total_attempts = 0

        for category in categories:

            strategies = self.registry.strategies(
                category
            )

            total_attempts += (
                len(strategies)
                * max_attempts_per_strategy
            )

        completed_attempts = 0

        all_results = []

        for category in categories:

            strategies = self.registry.strategies(
                category
            )

            for strategy in strategies:

                results = self.run_adaptive_attack(
                    category=category,
                    initial_strategy=strategy,
                    max_attempts=max_attempts_per_strategy
                )

                all_results.extend(results)

                completed_attempts += len(results)

                self._report_progress(
                    completed=completed_attempts,
                    total=total_attempts,
                    category=category,
                    strategy=strategy,
                )

        return all_results
    
    def _report_progress(
        self,
        completed: int,
        total: int,
        category: str,
        strategy: str,
    ):

        if self.progress_callback:

            self.progress_callback(
                completed=completed,
                total=total,
                category=category,
                strategy=strategy,
            )