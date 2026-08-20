# ============================================================
# VAANIRAG — RESTORE BM25 EVIDENCE CACHE
# ============================================================

production_bm25_cache = {}

def retrieve_with_bm25_cache(query, top_k=20):

    expanded = query_expansion_cache.get(
        query,
        query
    )

    cache_key = (expanded, top_k)

    if cache_key in production_bm25_cache:
        return production_bm25_cache[cache_key], True

    tokens = expanded.lower().split()

    scores = bm25_index.get_scores(tokens)

    top_indices = np.argsort(scores)[::-1][:top_k]

    evidence = []

    for rank, idx in enumerate(
        top_indices,
        start=1
    ):
        row = sentence_corpus.iloc[int(idx)]

        evidence.append({
            "rank": rank,
            "query_id": int(row["query_id"]),
            "passage_id": int(row["passage_id"]),
            "score": float(scores[idx]),
            "text": str(row["passage_hi"]),
            "is_selected": int(row["is_selected"]),
        })

    production_bm25_cache[cache_key] = evidence

    return evidence, False


print("=" * 70)
print("VAANIRAG BM25 EVIDENCE CACHE RESTORED")
print("=" * 70)

print("BM25 index:      UNCHANGED")
print("Expansion cache: ACTIVE")
print("Evidence cache:  ACTIVE")
print("Cache entries:  ", len(production_bm25_cache))

print("[OK] retrieve_with_bm25_cache restored")
print("=" * 70)