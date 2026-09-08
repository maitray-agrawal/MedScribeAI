"""Clinical domain models and provenance tracking."""

from .models import (
    ClinicalFact,
    ClinicalExtractionRequest,
    ClinicalExtractionResponse,
    FactCategory,
    FactAssertion,
    FactTemporality,
    FactExperiencer,
    FactSource,
)
from .provenance import FactProvenance
from .evidence import ClinicalEvidence
from .facts import get_affirmed_facts, get_negated_facts, get_facts_by_category

__all__ = [
    "ClinicalFact",
    "ClinicalExtractionRequest",
    "ClinicalExtractionResponse",
    "FactCategory",
    "FactAssertion",
    "FactTemporality",
    "FactExperiencer",
    "FactSource",
    "FactProvenance",
    "ClinicalEvidence",
    "get_affirmed_facts",
    "get_negated_facts",
    "get_facts_by_category",
]
