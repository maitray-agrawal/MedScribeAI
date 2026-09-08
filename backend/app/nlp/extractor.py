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
    {
        "concept_id": "COND_ASTHMA",
        "canonical_text": "asthma",
        "category": FactCategory.CONDITION,
        "patterns": [
            r"\basthma\b",
            r"\bdama\b",
            r"\bdame\s+ki\s+bimari\b",
            r"\bदमा\b",
            r"\bअस्थमा\b",
        ],
    },
    {
        "concept_id": "COND_KIDNEY_STONE",
        "canonical_text": "kidney stones (nephrolithiasis)",
        "category": FactCategory.CONDITION,
        "patterns": [
            r"\bpathri\b",
            r"\bgurde\s+ki\s+pathri\b",
            r"\bkidney\s+stones?\b",
            r"\bnephrolithiasis\b",
            r"\bपथरी\b",
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
    seen_facts: set[tuple[str, str, str, str]] = set()

    # 1. Vital Signs: Blood pressure extraction (e.g. "Blood pressure 148/92")
    bp_match = re.search(r"\b(?:blood\s+pressure|bp|raktchap)?\s*[:=]?\s*(\d{2,3})\s*/\s*(\d{2,3})\s*(?:mm\s*hg)?\b", lower_text)
    if bp_match and bp_match.group(1) and bp_match.group(2):
        sys_val = int(bp_match.group(1))
        dia_val = int(bp_match.group(2))
        if 50 <= sys_val <= 300 and 30 <= dia_val <= 200:
            start_c, end_c = bp_match.span()
            matched_bp = text[start_c:end_c]
            # Systolic
            sys_fact = ClinicalFact(
                concept_id="VITAL_BP_SYSTOLIC",
                canonical_text="systolic blood pressure",
                category=FactCategory.VITAL,
                assertion=FactAssertion.PRESENT,
                temporality=FactTemporality.CURRENT,
                experiencer=FactExperiencer.PATIENT,
                evidence=matched_bp,
                source=FactSource.PATIENT_TRANSCRIPT,
                confidence=0.98,
                language=language,
                provenance=FactProvenance(
                    source_id=source_id,
                    start_char=start_c,
                    end_char=end_c,
                    matched_text=matched_bp,
                    engine="medscribe-deterministic-nlp",
                ),
            )
            extracted_facts.append(sys_fact)
            seen_facts.add(("VITAL_BP_SYSTOLIC", sys_fact.assertion.value, sys_fact.temporality.value, sys_fact.experiencer.value))

            # Diastolic
            dia_fact = ClinicalFact(
                concept_id="VITAL_BP_DIASTOLIC",
                canonical_text="diastolic blood pressure",
                category=FactCategory.VITAL,
                assertion=FactAssertion.PRESENT,
                temporality=FactTemporality.CURRENT,
                experiencer=FactExperiencer.PATIENT,
                evidence=matched_bp,
                source=FactSource.PATIENT_TRANSCRIPT,
                confidence=0.98,
                language=language,
                provenance=FactProvenance(
                    source_id=source_id,
                    start_char=start_c,
                    end_char=end_c,
                    matched_text=matched_bp,
                    engine="medscribe-deterministic-nlp",
                ),
            )
            extracted_facts.append(dia_fact)
            seen_facts.add(("VITAL_BP_DIASTOLIC", dia_fact.assertion.value, dia_fact.temporality.value, dia_fact.experiencer.value))

    # Experiencer check (e.g. "Mother had asthma")
    has_family = bool(re.search(r"\b(mother|mummy|maa|father|papa|brother|bhai|sister|behan|family)\b", lower_text))
    default_experiencer = FactExperiencer.FAMILY_MEMBER if has_family else FactExperiencer.PATIENT

    # Uncertainty / Conditional checks
    is_suspected = bool(re.search(r"\b(shayad|lagta\s+hai|ho\s+sakta\s+hai|suspect|maybe|perhaps)\b", lower_text))
    is_conditional = bool(re.search(r"\b(agar|yadi|jab|if|whenever)\b", lower_text))

    # Check for historical past markers and current negation
    has_historical_marker = bool(re.search(r"\b(pehle|past\s+me|earlier|previously|history\s+of|had\b|tha|thi)\b", lower_text))
    has_current_negation = bool(re.search(r"\b(ab\s+nahi|ab\s+nahin|now\s+no|not\s+anymore|ab\s+theek|now\s+resolved)\b", lower_text)) or bool(re.search(r"\bab\b.*\bnahi\b", lower_text))

    for item in CLINICAL_DICTIONARY:
        concept_id = item["concept_id"]

        best_match = None
        for pattern_str in item["patterns"]:
            match = re.search(pattern_str, lower_text, re.IGNORECASE)
            if match:
                best_match = match
                break

        if not best_match:
            continue

        start_char, end_char = best_match.span()
        matched_text = text[start_char:end_char]

        # Case: Contrastive past affirmed + current negated: "Pehle diabetes tha, ab nahi hai"
        if has_historical_marker and has_current_negation:
            # 1. Historical Fact
            hist_match = re.search(r"(?:pehle|earlier|previously)[\w\s]+(?:tha|thi|had)?", lower_text)
            hist_span_text = text[hist_match.start():hist_match.end()] if hist_match else matched_text
            hist_start = hist_match.start() if hist_match else start_char
            hist_end = hist_match.end() if hist_match else end_char

            hist_key = (concept_id, FactAssertion.PRESENT.value, FactTemporality.HISTORICAL.value, default_experiencer.value)
            if hist_key not in seen_facts:
                seen_facts.add(hist_key)
                hist_fact = ClinicalFact(
                    concept_id=concept_id,
                    canonical_text=item["canonical_text"],
                    category=item["category"],
                    assertion=FactAssertion.PRESENT,
                    temporality=FactTemporality.HISTORICAL,
                    experiencer=default_experiencer,
                    evidence=hist_span_text.strip() or matched_text,
                    source=FactSource.PATIENT_TRANSCRIPT,
                    confidence=0.95,
                    language=language,
                    provenance=FactProvenance(
                        source_id=source_id,
                        start_char=hist_start,
                        end_char=hist_end,
                        matched_text=matched_text,
                        engine="medscribe-deterministic-nlp",
                    ),
                )
                extracted_facts.append(hist_fact)

            # 2. Current Negated Fact
            curr_match = re.search(r"(?:ab\s+nahi\s+hai|ab\s+nahin|now\s+no|not\s+anymore|ab\s+theek)", lower_text)
            curr_span_text = text[curr_match.start():curr_match.end()] if curr_match else "ab nahi hai"
            curr_start = curr_match.start() if curr_match else end_char
            curr_end = curr_match.end() if curr_match else len(text)

            curr_key = (concept_id, FactAssertion.NEGATED.value, FactTemporality.CURRENT.value, default_experiencer.value)
            if curr_key not in seen_facts:
                seen_facts.add(curr_key)
                curr_fact = ClinicalFact(
                    concept_id=concept_id,
                    canonical_text=item["canonical_text"],
                    category=item["category"],
                    assertion=FactAssertion.NEGATED,
                    temporality=FactTemporality.CURRENT,
                    experiencer=default_experiencer,
                    evidence=curr_span_text.strip(),
                    source=FactSource.PATIENT_TRANSCRIPT,
                    confidence=0.95,
                    language=language,
                    provenance=FactProvenance(
                        source_id=source_id,
                        start_char=curr_start,
                        end_char=curr_end,
                        matched_text=curr_span_text.strip(),
                        engine="medscribe-deterministic-nlp",
                    ),
                )
                extracted_facts.append(curr_fact)

            continue

        # Standard non-contrastive case:
        is_negated, evidence_start, evidence_end, trigger_word = check_negation_scope(
            text, start_char, end_char
        )

        assertion = FactAssertion.NEGATED if is_negated else (
            FactAssertion.SUSPECTED if is_suspected else (
                FactAssertion.CONDITIONAL if is_conditional else FactAssertion.PRESENT
            )
        )
        temporality = FactTemporality.HISTORICAL if has_historical_marker else FactTemporality.CURRENT
        verbatim_evidence = text[evidence_start:evidence_end].strip() or matched_text

        fact_key = (concept_id, assertion.value, temporality.value, default_experiencer.value)
        if fact_key in seen_facts:
            continue
        seen_facts.add(fact_key)

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
            temporality=temporality,
            experiencer=default_experiencer,
            evidence=verbatim_evidence,
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
