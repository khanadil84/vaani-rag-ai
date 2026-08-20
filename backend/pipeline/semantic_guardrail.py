# ============================================================
# VAANIRAG — FINAL SEMANTIC EVIDENCE GUARDRAIL
# CrossEncoder-based
# ============================================================

def evidence_guard(
    query,
    evidence,
    expanded_query=None,
    min_score=1.0,
):

    if not evidence:
        return False, "NO_EVIDENCE"

    # Use original user question for semantic relevance.
    # This prevents expansion terms from artificially
    # increasing the relevance score.
    guard_query = query

    pairs = [
        [guard_query, item["text"]]
        for item in evidence[:20]
    ]

    scores = reranker.predict(
        pairs,
        show_progress_bar=False
    )

    best_score = float(
        np.max(scores)
    )

    if best_score >= min_score:
        return (
            True,
            f"EVIDENCE_SUFFICIENT_RERANK_{best_score:.4f}"
        )

    return (
        False,
        f"INSUFFICIENT_EVIDENCE_RERANK_{best_score:.4f}"
    )


print("=" * 70)
print("VAANIRAG — SEMANTIC EVIDENCE GUARDRAIL")
print("=" * 70)
print("Model: cross-encoder/mmarco-mMiniLMv2-L12-H384-v1")
print("Minimum relevance score:", 1.0)
print("Empty evidence: BLOCK")
print("Low semantic relevance: BLOCK")
print("High semantic relevance: ALLOW")
print("[OK] SEMANTIC GUARDRAIL READY")
print("=" * 70)