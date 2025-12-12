"""
UNIFIED ADVANCED RAG SYSTEM
Integrates: Parametric RAG + Ontology-Grounded + HiRAG + Instruction-Tuning

This is the cutting-edge system combining all advanced RAG techniques
"""

import sys
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
import time
from dotenv import load_dotenv

# Add parent directories to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

load_dotenv(project_root / "config" / ".env")

from openai import OpenAI
from rag_system.core.hybrid_chroma_store import HybridChromaStore
from rag_system.core.enhanced_retriever import EnhancedRetriever

# Import all advanced components
from kaanoon_test.system_adapters.ontology_grounded_rag import OntologyGroundedRAG
from kaanoon_test.system_adapters.hierarchical_thought_rag import HierarchicalThoughtRAG
from kaanoon_test.system_adapters.instruction_tuning_rag import InstructionTuningRAG, QueryIntent
from kaanoon_test.system_adapters.parametric_rag_system import ParametricRAGSystem


class UnifiedAdvancedRAG:
    """
    🚀 STATE-OF-THE-ART RAG SYSTEM
    
    Combines:
    1. Parametric RAG - Domain-specific parameter-driven retrieval
    2. Ontology-Grounded RAG - Legal knowledge graph integration
    3. Hierarchical-Thought RAG (HiRAG) - Multi-level reasoning
    4. Instruction-Tuning RAG - Query-specific optimized instructions
    """
    
    def __init__(self):
        print("\n" + "="*80)
        print("INITIALIZING UNIFIED ADVANCED RAG SYSTEM")
        print("="*80)
        
        # Initialize OpenAI client
        self.client = OpenAI(
            api_key=os.getenv("NVIDIA_API_KEY"),
            base_url="https://integrate.api.nvidia.com/v1"
        )
        self.model = os.getenv("NVIDIA_MODEL_NAME", "nvidia/llama-3.1-nemotron-70b-instruct")
        
        # Initialize base RAG components
        print("[1/6] Initializing base retrieval system...")
        self.store = HybridChromaStore()
        self.retriever = EnhancedRetriever(self.store)
        
        # Initialize advanced components
        print("[2/6] Loading Ontology-Grounded RAG...")
        self.ontology_rag = OntologyGroundedRAG()
        
        print("[3/6] Loading Hierarchical-Thought RAG (HiRAG)...")
        self.hirag = HierarchicalThoughtRAG(self.client)
        
        print("[4/6] Loading Instruction-Tuning RAG...")
        self.instruction_tuning = InstructionTuningRAG()
        
        print("[5/6] Loading Parametric RAG...")
        self.parametric_rag = ParametricRAGSystem()
        
        print("[6/6] Initializing greeting detection...")
        self._init_greeting_detection()
        
        print("\n✓ UNIFIED ADVANCED RAG SYSTEM READY")
        print("="*80 + "\n")
    
    def _init_greeting_detection(self):
        """Initialize simple greeting detection"""
        self.greetings = [
            'hi', 'hello', 'hey', 'hii', 'hell', 'hell ai',
            'good morning', 'good afternoon', 'good evening',
            'thanks', 'thank you', 'bye', 'namaste'
        ]
    
    def query(self, user_query: str, target_language: str = None) -> Dict[str, Any]:
        """
        Process query through unified advanced RAG pipeline
        
        Pipeline:
        1. Greeting detection → Skip RAG if greeting
        2. Ontology grounding → Identify domains and entities
        3. Complexity analysis → Decide if HiRAG needed
        4. Instruction tuning → Generate optimized instructions
        5. Parametric retrieval → Domain-specific retrieval
        6. Answer generation → Structured response
        
        Args:
            user_query: User's question
            target_language: Optional language code
        
        Returns:
            Dict with answer and comprehensive metadata
        """
        start_time = time.time()
        
        print("\n" + "="*80)
        print(f"QUERY: {user_query}")
        print("="*80)
        
        try:
            # STEP 1: Greeting Detection
            if self._is_greeting(user_query):
                return self._handle_greeting(user_query, start_time)
            
            # STEP 2: Ontology Grounding
            print("\n[STEP 1] Ontology Grounding...")
            grounding = self.ontology_rag.ground_query(user_query)
            domains = grounding['identified_domains']
            entities = grounding['entities']
            print(f"  → Domains: {domains}")
            print(f"  → Entities: Sections={entities['sections']}, Acts={entities['acts']}")
            
            # STEP 3: Complexity Analysis & HiRAG Decision
            print("\n[STEP 2] Analyzing Complexity...")
            complexity_analysis = self.hirag.analyze_complexity(user_query)
            needs_hirag = complexity_analysis['needs_decomposition']
            print(f"  → Complexity Score: {complexity_analysis['complexity_score']}")
            print(f"  → Needs HiRAG: {needs_hirag}")
            
            # STEP 4: Intent Identification & Instruction Tuning
            print("\n[STEP 3] Identifying Intent & Tuning Instructions...")
            intents = self.instruction_tuning.identify_intent(user_query)
            print(f"  → Intents: {[i.value for i in intents]}")
            
            # STEP 5: HiRAG or Direct Retrieval
            if needs_hirag:
                print("\n[STEP 4] Hierarchical Decomposition (HiRAG)...")
                result = self._process_with_hirag(
                    user_query, grounding, complexity_analysis, intents, start_time
                )
            else:
                print("\n[STEP 4] Direct Parametric Retrieval...")
                result = self._process_direct(
                    user_query, grounding, complexity_analysis, intents, start_time
                )
            
            print(f"\n✓ Complete in {time.time() - start_time:.2f}s")
            return result
            
        except Exception as e:
            print(f"\n[ERROR] Query processing failed: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                'answer': "I encountered an error processing your query. Please try rephrasing.",
                'sources': [],
                'latency': time.time() - start_time,
                'error': str(e)
            }
    
    def _is_greeting(self, query: str) -> bool:
        """Check if query is a greeting"""
        query_lower = query.lower().strip()
        if len(query_lower.split()) <= 5:
            return any(g in query_lower for g in self.greetings)
        return False
    
    def _handle_greeting(self, query: str, start_time: float) -> Dict[str, Any]:
        """Handle greeting without RAG"""
        responses = {
            'hi': "Hello! I'm your AI legal assistant. How can I help you today?",
            'hello': "Hello! I'm here to assist with legal questions. What would you like to know?",
            'hey': "Hey! I'm your legal assistant. Ask me any legal question!",
            'hell': "Hello! I'm your legal assistant. How can I help you today?",
            'hell ai': "Hello! I'm your AI legal assistant. What legal question do you have?",
            'good morning': "Good morning! Ready to assist with your legal queries!",
            'thanks': "You're welcome! Happy to help with more questions.",
            'namaste': "Namaste! I'm your legal assistant. How may I assist you?"
        }
        
        query_lower = query.lower().strip()
        response = responses.get(query_lower, "Hello! I'm your AI legal assistant. How can I help?")
        
        print(f"[GREETING] Instant response ({(time.time() - start_time)*1000:.0f}ms)")
        
        return {
            'answer': response,
            'sources': [],
            'latency': time.time() - start_time,
            'complexity': 'trivial',
            'query_type': 'greeting',
            'used_hirag': False,
            'used_ontology': False
        }
    
    def _process_with_hirag(
        self,
        query: str,
        grounding: Dict,
        complexity_analysis: Dict,
        intents: List[QueryIntent],
        start_time: float
    ) -> Dict[str, Any]:
        """Process complex query with hierarchical decomposition"""
        
        # Decompose into hierarchy
        thought_levels = self.hirag.decompose_hierarchically(query)
        
        # Retrieve for each level (bottom-up)
        for level in reversed(thought_levels):
            if level.level > 0:  # Skip main question, retrieve for sub-questions
                print(f"  → Retrieving for: {level.question[:60]}...")
                
                # Build parametric RAG params for this sub-question
                sub_grounding = self.ontology_rag.ground_query(level.question)
                rag_params = {
                    'search_domain': sub_grounding['identified_domains'][0] if sub_grounding['identified_domains'] else 'general',
                    'specific_sections': sub_grounding['entities']['sections'],
                    'keywords': sub_grounding['related_concepts'][:5],
                    'complexity': 'simple'  # Sub-questions are simpler
                }
                
                # Retrieve
                retrieval_result = self.parametric_rag.retrieve_with_params(level.question, rag_params)
                context = retrieval_result.get('context', '')
                
                # Generate answer for this level with instruction tuning
                sub_intents = self.instruction_tuning.identify_intent(level.question)
                prompt = self.instruction_tuning.generate_prompt_with_instructions(
                    level.question,
                    context,
                    sub_intents,
                    sub_grounding['identified_domains'],
                    'simple'
                )
                
                # Generate
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    max_tokens=300
                )
                
                level.answer = response.choices[0].message.content.strip()
        
        # Synthesize hierarchical answer
        print("\n[STEP 5] Synthesizing Hierarchical Answer...")
        final_answer = self.hirag.synthesize_hierarchical_answer(thought_levels, query)
        
        return {
            'answer': final_answer,
            'sources': [],
            'latency': time.time() - start_time,
            'complexity': complexity_analysis['complexity_score'],
            'query_type': 'complex_hierarchical',
            'used_hirag': True,
            'used_ontology': True,
            'thought_levels': len(thought_levels),
            'domains': grounding['identified_domains']
        }
    
    def _process_direct(
        self,
        query: str,
        grounding: Dict,
        complexity_analysis: Dict,
        intents: List[QueryIntent],
        start_time: float
    ) -> Dict[str, Any]:
        """Process simple query with direct parametric retrieval"""
        
        # Build RAG parameters from ontology grounding
        rag_params = {
            'search_domain': grounding['identified_domains'][0] if grounding['identified_domains'] else 'general',
            'specific_sections': grounding['entities']['sections'],
            'case_names': [],
            'keywords': grounding['related_concepts'][:5],
            'complexity': 'simple' if complexity_analysis['complexity_score'] < 4 else 'medium'
        }
        
        # Parametric retrieval
        print(f"  → Domain: {rag_params['search_domain']}")
        print(f"  → Sections: {rag_params['specific_sections']}")
        
        retrieval_result = self.parametric_rag.retrieve_with_params(query, rag_params)
        context = retrieval_result.get('context', '')
        documents = retrieval_result.get('documents', [])
        
        print(f"  → Retrieved {len(documents)} documents")
        
        # Generate with instruction tuning
        print("\n[STEP 5] Generating Answer with Instruction Tuning...")
        
        complexity_str = 'simple' if complexity_analysis['complexity_score'] < 4 else 'moderate'
        prompt = self.instruction_tuning.generate_prompt_with_instructions(
            query,
            context,
            intents,
            grounding['identified_domains'],
            complexity_str
        )
        
        token_budget = self.instruction_tuning.get_token_budget(intents, complexity_str)
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=token_budget
        )
        
        answer = response.choices[0].message.content.strip()
        
        # Extract sources
        sources = [
            {
                'rank': i+1,
                'score': doc.get('score', 0),
                'source': doc.get('metadata', {}).get('source', 'Unknown')
            }
            for i, doc in enumerate(documents[:5])
        ]
        
        return {
            'answer': answer,
            'sources': sources,
            'latency': time.time() - start_time,
            'complexity': complexity_analysis['complexity_score'],
            'query_type': 'direct_parametric',
            'used_hirag': False,
            'used_ontology': True,
            'intents': [i.value for i in intents],
            'domains': grounding['identified_domains'],
            'retrieval_time': retrieval_result.get('metadata', {}).get('retrieval_time', 0)
        }


# Factory function
def create_unified_advanced_rag() -> UnifiedAdvancedRAG:
    """Create unified advanced RAG system"""
    return UnifiedAdvancedRAG()


# Test runner
if __name__ == "__main__":
    system = create_unified_advanced_rag()
    
    test_queries = [
        "hi",
        "What is IPC Section 302?",
        "GST for IT professionals earning 10 LPA and how to file returns",
        "DPDP Act consent requirements for data processing"
    ]
    
    for query in test_queries:
        print("\n" + "#"*80)
        result = system.query(query)
        print(f"\n**ANSWER:**\n{result['answer']}")
        print(f"\n**Metadata:**")
        print(f"  - Type: {result.get('query_type')}")
        print(f"  - Time: {result.get('latency'):.2f}s")
        print(f"  - HiRAG: {result.get('used_hirag', False)}")
        print(f"  - Ontology: {result.get('used_ontology', False)}")
