"""
HIERARCHICAL-THOUGHT RAG (HiRAG) - Multi-Level Reasoning
Implements hierarchical decomposition and reasoning for complex queries
"""

from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
import re

@dataclass
class ThoughtLevel:
    """Represents one level of hierarchical thought"""
    level: int
    question: str
    sub_questions: List[str]
    reasoning: str
    answer: str
    confidence: float


class HierarchicalThoughtRAG:
    """
    HiRAG: Hierarchical-thought Instruction-tuning RAG
    
    Decomposes complex queries into hierarchical sub-questions,
    retrieves for each level, and synthesizes answers bottom-up
    """
    
    def __init__(self, llm_client):
        self.llm_client = llm_client
        self.model = "nvidia/llama-3.1-nemotron-70b-instruct"
    
    def analyze_complexity(self, query: str) -> Dict[str, Any]:
        """Analyze query complexity and decomposition needs"""
        
        # Complexity indicators
        complexity_score = 0
        
        # Multi-part questions
        if any(marker in query.lower() for marker in ['and', 'also', 'furthermore', 'additionally']):
            complexity_score += 2
        
        # Conditional/hypothetical
        if any(marker in query.lower() for marker in ['if', 'when', 'suppose', 'assuming']):
            complexity_score += 2
        
        # Multiple legal domains
        domain_keywords = ['ipc', 'gst', 'dpdp', 'contract', 'property', 'tax', 'corporate']
        domain_count = sum(1 for keyword in domain_keywords if keyword in query.lower())
        complexity_score += domain_count
        
        # Procedural questions
        if any(marker in query.lower() for marker in ['how to', 'procedure', 'process', 'steps']):
            complexity_score += 1
        
        # Length-based
        word_count = len(query.split())
        if word_count > 20:
            complexity_score += 2
        elif word_count > 10:
            complexity_score += 1
        
        # Determine if decomposition needed
        needs_decomposition = complexity_score >= 4
        
        return {
            'complexity_score': complexity_score,
            'needs_decomposition': needs_decomposition,
            'estimated_levels': min((complexity_score // 2) + 1, 3),  # Max 3 levels
            'is_multi_part': any(marker in query.lower() for marker in ['and', 'also']),
            'is_procedural': any(marker in query.lower() for marker in ['how to', 'procedure'])
        }
    
    def decompose_hierarchically(self, query: str) -> List[ThoughtLevel]:
        """
        Decompose query into hierarchical thought levels
        
        Returns hierarchy from high-level to specific sub-questions
        """
        
        decomposition_prompt = f"""You are a legal reasoning expert. Decompose this complex query into a hierarchy of simpler sub-questions.

USER QUERY: "{query}"

Instructions:
1. Identify the main question (Level 0)
2. Break it into 2-4 foundational sub-questions (Level 1)
3. If needed, break Level 1 into even simpler questions (Level 2)
4. Each sub-question should be answerable independently
5. Sub-questions should cover all aspects of the main question

Respond in JSON format:
{{
    "main_question": "reformulated main question",
    "level_1_questions": [
        "sub-question 1",
        "sub-question 2",
        ...
    ],
    "level_2_questions": {{
        "sub-question 1": ["detailed question 1a", "detailed question 1b"],
        "sub-question 2": ["detailed question 2a"]
    }},
    "reasoning": "why this decomposition makes sense"
}}

Example:
Query: "What are the GST implications for IT professionals earning 10 LPA and how to file returns?"

{{
    "main_question": "GST obligations for IT professionals with 10 LPA income",
    "level_1_questions": [
        "Is GST registration required for IT professionals?",
        "What is the GST threshold for professionals?",
        "How to file GST returns?",
        "What are the penalties for non-compliance?"
    ],
    "level_2_questions": {{
        "How to file GST returns?": [
            "What is GSTR-1?",
            "What is GSTR-3B?",
            "What are the filing deadlines?"
        ]
    }},
    "reasoning": "Query involves registration eligibility AND return filing procedure, requiring hierarchical breakdown"
}}

Now decompose the user query:"""

        try:
            response = self.llm_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": decomposition_prompt}],
                temperature=0.1,
                max_tokens=600
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON
            import json
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            decomposition = json.loads(response_text)
            
            # Build thought levels
            levels = []
            
            # Level 0: Main question
            levels.append(ThoughtLevel(
                level=0,
                question=decomposition['main_question'],
                sub_questions=decomposition['level_1_questions'],
                reasoning=decomposition['reasoning'],
                answer="",
                confidence=1.0
            ))
            
            # Level 1: Sub-questions
            for sub_q in decomposition['level_1_questions']:
                level_2_subs = decomposition.get('level_2_questions', {}).get(sub_q, [])
                levels.append(ThoughtLevel(
                    level=1,
                    question=sub_q,
                    sub_questions=level_2_subs,
                    reasoning="",
                    answer="",
                    confidence=0.9
                ))
            
            # Level 2: Detailed questions
            for sub_questions in decomposition.get('level_2_questions', {}).values():
                for detail_q in sub_questions:
                    levels.append(ThoughtLevel(
                        level=2,
                        question=detail_q,
                        sub_questions=[],
                        reasoning="",
                        answer="",
                        confidence=0.8
                    ))
            
            print(f"[HiRAG] Decomposed into {len(levels)} thought levels")
            return levels
            
        except Exception as e:
            print(f"[ERROR] Decomposition failed: {e}")
            # Fallback: simple decomposition
            return [ThoughtLevel(
                level=0,
                question=query,
                sub_questions=[],
                reasoning="Simple query, no decomposition needed",
                answer="",
                confidence=1.0
            )]
    
    def retrieve_for_level(self, level: ThoughtLevel, retriever) -> str:
        """Retrieve context for specific thought level"""
        # This will be called by the main system with appropriate retriever
        # Returns context string for this level
        pass
    
    def synthesize_hierarchical_answer(
        self,
        levels: List[ThoughtLevel],
        query: str
    ) -> str:
        """
        Synthesize final answer from hierarchical thought levels
        Bottom-up: Start from most specific, build up to main answer
        """
        
        synthesis_prompt = f"""You are synthesizing a comprehensive legal answer from hierarchical analysis.

ORIGINAL QUERY: {query}

HIERARCHICAL ANALYSIS:
"""
        
        # Add each level's answer
        for level in reversed(levels):  # Bottom-up
            if level.answer:
                synthesis_prompt += f"\n\nLevel {level.level} - {level.question}:\n{level.answer}"
        
        synthesis_prompt += f"""

Now synthesize these into ONE comprehensive, well-structured answer to the original query.

Requirements:
1. Integrate all sub-answers coherently
2. Maintain logical flow from general to specific
3. Use clear headings and structure
4. Cite relevant sections/acts mentioned in sub-answers
5. Provide practical guidance

Generate the final synthesized answer:"""

        try:
            response = self.llm_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": synthesis_prompt}],
                temperature=0.2,
                max_tokens=800
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"[ERROR] Synthesis failed: {e}")
            # Fallback: concatenate answers
            return "\n\n".join([f"**{l.question}**\n{l.answer}" for l in levels if l.answer])
