"""
Indian Legal RAG System
Multi-Model Retrieval Augmented Generation for 156K+ Legal Records
"""

__version__ = "1.0.0"
__author__ = "Legal Chatbot Project"

from rag_system.core.hybrid_chroma_store import HybridChromaStore

__all__ = [
    "HybridChromaStore"
]
