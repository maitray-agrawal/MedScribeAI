"""Deterministic clinical fact extraction engine.

Extracts canonical clinical concepts, evaluates negation scope, attaches exact
character offsets and verbatim evidence, and NEVER fabricates unstated facts.
"""

import re
from typing import List, Dict, Any, Optional
from ..clinical.models import (
    ClinicalFact,
    FactCategory,
    FactAssertion,
    FactTemporality,
    FactExperiencer,
    FactSource,
    FactProvenance,
)

# Standard concept dictionary (English & Hindi clinical terms)
CLINICAL_DICTIONARY: List[Dict[str, Any]] = [
    {
        "concept_id": "SYM_HEADACHE",
        "canonical_text": "headache",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bsar\s+dard\b",
            r"\bsirdard\b",
            r"\bsar\s+mein\s+dard\b",
            r"\bheadache\b",
            r"\bhead\s+pain\b",
            r"\bmatha\s+dukhna\b",
            r"\bसिरदर्द\b",
            r"\bसर\s+दर्द\b",
            r"\bसिर\s+में\s+दर्द\b",
        ],
    },
    {
        "concept_id": "COND_HYPERTENSION",
        "canonical_text": "hypertension",
        "category": FactCategory.CONDITION,
        "patterns": [
            r"\bbp\s+ka\s+problem\b",
            r"\bhigh\s+bp\b",
            r"\bhypertension\b",
            r"\bblood\s+pressure\b",
            r"\bbp\b",
            r"\buccha\s+raktchap\b",
            r"\bउच्च\s+रक्तचाप\b",
            r"\bबीपी\b",
        ],
    },
    {
        "concept_id": "SYM_CHEST_PAIN",
        "canonical_text": "chest pain",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bseene\s+me(in)?\s+dard\b",
            r"\bsine\s+me(in)?\s+dard\b",
            r"\bchhati\s+me(in)?\s+dard\b",
            r"\bchest\s+pain\b",
            r"\bसीने\s+में\s+दर्द\b",
            r"\bछाती\s+में\s+दर्द\b",
        ],
    },
    {
        "concept_id": "SYM_FEVER",
        "canonical_text": "fever",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bbukhar\b",
            r"\btaap\b",
            r"\bbadan\s+garam\b",
            r"\bfever\b",
            r"\bhigh\s+temp(erature)?\b",
            r"\bबुखार\b",
            r"\bताप\b",
        ],
    },
    {
        "concept_id": "SYM_COUGH",
        "canonical_text": "cough",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bkha?asi\b",
            r"\bkhaansi\b",
            r"\bcough\b",
            r"\bखांसी\b",
        ],
    },
    {
        "concept_id": "SYM_BREATHLESSNESS",
        "canonical_text": "breathlessness",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bsa?ans\s+phool(na|raha)?\b",
            r"\bbreathlessness\b",
            r"\bshortness\s+of\s+breath\b",
            r"\bdam\s+ghutna\b",
            r"\bसांस\s+फूलना\b",
        ],
    },
    {
        "concept_id": "SYM_VOMITING",
        "canonical_text": "vomiting",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bulti\b",
            r"\bvomit(ing)?\b",
            r"\bउल्टी\b",
        ],
    },
    {
        "concept_id": "SYM_DIARRHEA",
        "canonical_text": "diarrhea",
        "category": FactCategory.SYMPTOM,
        "patterns": [
            r"\bdast\b",
            r"\bloose\s+motions?\b",
            r"\bdiarrhea\b",
            r"\bदस्त\b",
            r"\bजुलाब\b",
        ],
    },
    {
        "concept_id": "COND_DIABETES",
        "canonical_text": "diabetes mellitus",
        "category": FactCategory.CONDITION,
        "patterns": [
            r"\bdiabetes\b",
            r"\bsugar\s+ki\s+bimari\b",
            r"\bsugar\b",
            r"\bmadhumeh\b",
            r"\bमधुमेह\b",
            r"\bशुगर\b",
        ],
    },
]

# Negation patterns
POST_NEGATION_PATTERNS = [
    r"\b(nahi|nahin|nhi|ni)\s+(hai|tha|thi|hote)?\b",
    r"\b(ka\s+problem|ki\s+bimari|ki\s+shikayat)?\s*(nahi|nahin|nhi)\s*(hai|tha)?\b",
    r"\bnot\s+present\b",
    r"\bdenied\b",
    r"\babsent\b",
    r"\bruled\s+out\b",
]

PRE_NEGATION_PATTERNS = [
    r"\b(no|denies|denied|without|negative\s+for|rules?\s+out)\b",
    r"\b(koi|kisi\s+bhi)\s*(\w+\s*){0,2}(nahi|nahin)\b",
]

CONTRASTIVE_CONJUNCTIONS = [
    r"\blekin\b",
    r"\bpar\b",
    r"\bparantu\b",
    r"\bmagar\b",
    r"\bkintu\b",
    r"\bbut\b",
    r"\bhowever\b",
    r"\balso\b",
    r"\baur\b",
    r"\band\b",
]


def extract_clinical_facts(
    text: str,
    language: str = "hi",
    source_id: str = "encounter-live",
) -> List[ClinicalFact]:
    """Extracts clinical facts from transcript with evidence grounding and negation detection."""
    if not text or not text.strip():
        return []

    lower_text = text.lower()
    extracted_facts: List[ClinicalFact] = []
    seen_concepts = set()

    for item in CLINICAL_DICTIONARY:
        concept_id = item["concept_id"]
        if concept_id in seen_concepts:
            continue

        best_match = None
        for pattern_str in item["patterns"]:
            match = re.search(pattern_str, lower_text, re.IGNORECASE)
            if match:
                best_match = match
                break

        if not best_match:
            continue

        seen_concepts.add(concept_id)
        start_char, end_char = best_match.span()
        matched_text = text[start_char:end_char]

        # Evaluate Negation Scope within a bounded window
        is_negated, evidence_start, evidence_end, trigger_word = check_negation_scope(
            text, start_char, end_char
        )

        assertion = FactAssertion.NEGATED if is_negated else FactAssertion.PRESENT
        verbatim_evidence = text[evidence_start:evidence_end].strip()

        provenance = FactProvenance(
            source_id=source_id,
            start_char=evidence_start,
            end_char=evidence_end,
            matched_text=matched_text,
            engine="medscribe-deterministic-nlp",
        )

        fact = ClinicalFact(
            concept_id=concept_id,
            canonical_text=item["canonical_text"],
            category=item["category"],
            assertion=assertion,
            temporality=FactTemporality.CURRENT,
            experiencer=FactExperiencer.PATIENT,
            evidence=verbatim_evidence or matched_text,
            source=FactSource.PATIENT_TRANSCRIPT,
            confidence=0.92 if is_negated else 0.95,
            language=language,
            provenance=provenance,
        )
        extracted_facts.append(fact)

    return extracted_facts


def check_negation_scope(
    text: str, match_start: int, match_end: int
) -> tuple[bool, int, int, Optional[str]]:
    """Checks whether the concept at [match_start:match_end] is negated within its clause."""
    lower_text = text.lower()

    # Define post-window (up to 30 characters after match, stopping at contrastive conjunction or punctuation)
    post_text = lower_text[match_end : match_end + 35]
    pre_text = lower_text[max(0, match_start - 30) : match_start]

    # Check for boundary cutoff in post-text (e.g. "lekin", "but", ",")
    post_limit = len(post_text)
    for conj in CONTRASTIVE_CONJUNCTIONS:
        c_match = re.search(conj, post_text)
        if c_match and c_match.start() < post_limit:
            post_limit = c_match.start()
    bounded_post = post_text[:post_limit]

    # 1. Check post-negation (e.g. "BP ka problem nahi hai")
    for neg_pat in POST_NEGATION_PATTERNS:
        n_match = re.search(neg_pat, bounded_post)
        if n_match:
            ev_start = match_start
            ev_end = match_end + n_match.end()
            return True, ev_start, ev_end, n_match.group(0)

    # 2. Check pre-negation (e.g. "no chest pain", "denies fever")
    pre_limit = 0
    for conj in CONTRASTIVE_CONJUNCTIONS:
        c_matches = list(re.finditer(conj, pre_text))
        if c_matches:
            last_c = c_matches[-1]
            if last_c.end() > pre_limit:
                pre_limit = last_c.end()
    bounded_pre = pre_text[pre_limit:]

    for neg_pat in PRE_NEGATION_PATTERNS:
        n_match = re.search(neg_pat, bounded_pre)
        if n_match:
            ev_start = max(0, match_start - 30) + pre_limit + n_match.start()
            ev_end = match_end
            return True, ev_start, ev_end, n_match.group(0)

    # Clause boundaries for evidence window
    ev_start = match_start
    ev_end = match_end
    # Include up to trailing verb or conjunction
    trailing_verb = re.search(r"^\s*(hai|tha|rehta hai|aa raha hai)", lower_text[match_end : match_end + 20])
    if trailing_verb:
        ev_end = match_end + trailing_verb.end()

    return False, ev_start, ev_end, None
