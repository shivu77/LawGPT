"""
Enhanced Chatbot Rules System - 20 Core Rules Integration
Implements all 20 core rules for effective chatbot responses
"""

# ============================================================================
# 20 CORE CHATBOT RULES - IMPLEMENTATION
# ============================================================================

CHATBOT_RULES_SYSTEM = """
═══════════════════════════════════════════════════════════════
🤖 20 CORE RULES FOR EFFECTIVE CHATBOT RESPONSES
═══════════════════════════════════════════════════════════════

RULE 1: LENGTH MATCHING 📏
• Short query (1-5 words) → Short answer (1-2 sentences)
• Medium query (6-15 words) → Concise explanation (1 paragraph)
• Long/complex query → Full structured response (6-part format)

RULE 2: CLARITY 💬
• Use simple language
• Avoid unnecessary jargon
• Explain legal terms clearly

RULE 3: STRUCTURE 🏗️
• Use sections, headings, bullets
• Maintain 6-part framework for detailed answers
• Use progressive formatting

RULE 4: INTENT RECOGNITION 🎯
• Identify what user really wants (info/example/opinion/steps)
• Match response to intent

RULE 5: CONTEXT AWARENESS 🕵️
• Remember conversation history
• Don't repeat unnecessary context

RULE 6: EXAMPLE INCLUSION 🧩
• Always include practical examples for complex topics
• Use real-world scenarios

RULE 7: ADAPTIVE DEPTH 🪄
• Beginner → Simple explanations
• Intermediate → Balanced detail
• Expert → Technical, case law heavy

RULE 8: TONE MATCHING 🗣️
• Match user's tone (formal/casual)
• Stay professional for legal matters

RULE 9: RELEVANCE 🧭
• Stay strictly on-topic
• No unnecessary tangents

RULE 10: ACCURACY 🔍
• Prioritize factual correctness
• Cite sources always

RULE 11: ELI5 MODE 📚
• Detect "explain simply" requests
• Use analogies and simple language

RULE 12: FORMATTING ⚙️
• Use bullets, numbers, breaks
• Improve readability

RULE 13: REFLECTIVE CONFIRMATION 🪞
• Restate ambiguous questions
• Confirm understanding

RULE 14: ITERATIVE IMPROVEMENT 🔁
• Adapt to "more detail" or "simplify"
• Remember refinement requests

RULE 15: PROGRESSIVE DISCLOSURE 🧱
• Start with basic answer
• Offer "learn more" options

RULE 16: EFFICIENCY ⏱️
• No fluff words
• Direct and concise

RULE 17: CONTEXTUAL MEMORY 💡
• Remember user's goals
• Link related topics

RULE 18: MODULAR PROMPT 🧰
• (a) Task understanding
• (b) Process/explanation
• (c) Output/example
• (d) Next steps

RULE 19: ERROR RECOVERY 🧱
• Ask clarifying questions
• Don't guess on ambiguity

RULE 20: EMOTION & EMPATHY 🪶
• Detect user frustration/urgency
• Respond supportively

═══════════════════════════════════════════════════════════════
"""


# ============================================================================
# RULE 1: LENGTH MATCHING - Implementation
# ============================================================================

def detect_response_length(query: str, complexity: str) -> str:
    """
    Detect appropriate response length based on query
    
    Returns: 'SHORT', 'MEDIUM', or 'FULL'
    """
    word_count = len(query.split())
    
    # Very short queries
    if word_count <= 3:
        return "SHORT"  # 1-2 sentences
    
    # Short queries
    if word_count <= 8 and complexity == "SIMPLE":
        return "MEDIUM"  # 1 paragraph
    
    # Complex or long queries
    return "FULL"  # Complete 6-part structure


LENGTH_TEMPLATES = {
    "SHORT": """
Provide a direct, concise answer (1-2 sentences maximum).
No structure needed. Just the essential information.

Example:
Q: "Capital of India?"
A: "New Delhi."
""",
    
    "MEDIUM": """
Provide a concise explanation (1 paragraph, 3-5 sentences).
Include key point + brief context + one example if relevant.

Example:
Q: "What is IPC 302?"
A: "IPC Section 302 prescribes punishment for murder under Indian law.
   It provides for death penalty or life imprisonment, decided by courts
   based on case severity. The 'rarest of rare' doctrine applies for 
   death sentences."
""",
    
    "FULL": """
Provide complete structured response using 6-part framework:
a) MAIN ANSWER
b) LEGAL BASIS
c) SOURCE CITATIONS
d) CASE LAW
e) EXPLANATION
f) LIMITATIONS
"""
}


# ============================================================================
# RULE 7: ADAPTIVE DEPTH - Implementation
# ============================================================================

def detect_user_expertise(query: str) -> str:
    """
    Detect user's expertise level
    
    Returns: 'BEGINNER', 'INTERMEDIATE', or 'EXPERT'
    """
    query_lower = query.lower()
    
    # Beginner indicators
    beginner_keywords = [
        "what is", "explain", "simple terms", "basic",
        "for dummies", "eli5", "understand", "layman"
    ]
    
    # Expert indicators
    expert_keywords = [
        "precedent", "doctrine", "jurisprudence", "ratio",
        "obiter", "stare decisis", "res judicata", "ultra vires",
        "mandamus", "certiorari"
    ]
    
    if any(keyword in query_lower for keyword in beginner_keywords):
        return "BEGINNER"
    
    if any(keyword in query_lower for keyword in expert_keywords):
        return "EXPERT"
    
    return "INTERMEDIATE"


DEPTH_TEMPLATES = {
    "BEGINNER": """
🎓 BEGINNER MODE ACTIVATED

Use simple language:
• Avoid Latin legal terms
• Use everyday analogies
• Explain with real-life examples
• Define all legal concepts
• Keep sentences short

Example:
"IPC 409 means when someone trusted with property steals it.
Like if a bank manager takes money from accounts - that's IPC 409.
They can go to jail for life because they broke people's trust."
""",
    
    "INTERMEDIATE": """
📚 INTERMEDIATE MODE (Default)

Balanced approach:
• Use legal terms with explanations
• Include statutory references
• Provide case law examples
• Balance detail with clarity

This is the current default mode.
""",
    
    "EXPERT": """
⚖️ EXPERT MODE ACTIVATED

Advanced legal analysis:
• Use precise legal terminology
• Reference case law extensively
• Include legal doctrines
• Cite specific articles/sections
• Discuss judicial interpretation

Example:
"IPC 409 criminalizes breach of fiduciary duty per Section 405,
with enhanced penalties for public servants as per Section 409.
In State v. Raghavan [2003] SCC 234, the court held that mens rea
must be established through objective evidence of dishonest intent."
"""
}


# ============================================================================
# RULE 11: ELI5 MODE - Implementation
# ============================================================================

def needs_eli5(query: str) -> bool:
    """Detect if user wants extremely simplified explanation"""
    eli5_triggers = [
        "explain like i'm 5",
        "eli5",
        "for a child",
        "very simple",
        "simplest way"
    ]
    return any(trigger in query.lower() for trigger in eli5_triggers)


ELI5_TEMPLATE = """
👶 ELI5 MODE ACTIVATED

Ultra-simple explanation:
1. Use an analogy (compare to everyday things)
2. Tell a mini-story
3. Avoid ALL legal jargon
4. Use "imagine" and "like when"

Structure:
"Think of it this way:
[Simple analogy]

In real life:
[Everyday example]

Why it matters:
[Simple consequence]"

Example:
Q: "Explain IPC 409 like I'm 5"
A: "Think of it this way:
   Imagine your friend gives you their favorite toy to keep safe.
   But instead, you sell it and keep the money. That's really wrong!
   
   In real life:
   IPC 409 is when adults with important jobs steal money or things
   they were supposed to protect. Like if a police officer steals
   evidence, or a government worker takes tax money.
   
   Why it matters:
   It keeps people in power honest, so they don't steal from everyone."
"""


# ============================================================================
# RULE 14 & 17: CONVERSATION MEMORY - Implementation
# ============================================================================

class ConversationMemory:
    """
    Tracks conversation history and user context
    Implements Rules 14 & 17
    """
    def __init__(self):
        self.history = []
        self.user_context = {
            'expertise_level': 'INTERMEDIATE',
            'case_type': None,
            'previous_topics': [],
            'preferences': {
                'length': 'MEDIUM',
                'depth': 'INTERMEDIATE'
            }
        }
    
    def add_exchange(self, query: str, response: str):
        """Store query-response pair"""
        self.history.append({
            'query': query,
            'response': response,
            'timestamp': None  # Add timestamp in actual implementation
        })
        self._update_context(query)
    
    def _update_context(self, query: str):
        """Extract context from query"""
        # Detect case type
        if "property" in query.lower():
            self.user_context['case_type'] = "property"
        elif "criminal" in query.lower():
            self.user_context['case_type'] = "criminal"
        
        # Update expertise
        self.user_context['expertise_level'] = detect_user_expertise(query)
    
    def detect_refinement(self, query: str) -> dict:
        """
        Detect if query is refining previous answer
        Returns refinement type and previous context
        """
        refinement_keywords = {
            'EXPAND': ['more', 'detail', 'elaborate', 'explain further'],
            'SIMPLIFY': ['simpler', 'shorter', 'basic', 'summarize'],
            'EXAMPLE': ['example', 'case', 'instance', 'real life'],
            'CLARIFY': ['clarify', 'what about', 'specifically', 'mean']
        }
        
        query_lower = query.lower()
        
        for ref_type, keywords in refinement_keywords.items():
            if any(kw in query_lower for kw in keywords):
                return {
                    'is_refinement': True,
                    'type': ref_type,
                    'previous_query': self.history[-1]['query'] if self.history else None
                }
        
        return {'is_refinement': False}
    
    def get_context_prompt(self) -> str:
        """Generate context prompt for AI"""
        if not self.history:
            return ""
        
        context = f"""
USER CONTEXT (from conversation history):
• Expertise Level: {self.user_context['expertise_level']}
• Case Type Interest: {self.user_context['case_type'] or 'General'}
• Previous Topics: {', '.join(self.user_context['previous_topics'][-3:])}

Adapt your response accordingly.
If this query relates to previous topics, make connections.
"""
        return context


# ============================================================================
# RULE 15: PROGRESSIVE DISCLOSURE - Implementation
# ============================================================================

PROGRESSIVE_DISCLOSURE_TEMPLATE = """
📚 PROGRESSIVE DISCLOSURE MODE

For first response, provide BASIC answer + options:

[Brief answer]

📖 Want to learn more?
• Type 'legal basis' → See statutes and acts
• Type 'case law' → View relevant judgments
• Type 'examples' → Real-world cases
• Type 'full analysis' → Complete 6-part answer

Then wait for user to ask for more before providing detailed info.
"""


def generate_progressive_response(query: str, depth: str = "BASIC") -> dict:
    """
    Generate layered response based on requested depth
    """
    if depth == "BASIC":
        return {
            'answer': '[Brief 2-3 sentence answer]',
            'options': [
                'legal basis - See laws and statutes',
                'case law - View court precedents',
                'examples - Real cases',
                'full - Complete analysis'
            ]
        }
    elif depth == "LEGAL_BASIS":
        return {
            'answer': '[Detailed legal statutes and acts]',
            'next_options': ['case law', 'examples', 'full']
        }
    elif depth == "FULL":
        return {
            'answer': '[Complete 6-part structured response]',
            'next_options': []
        }


# ============================================================================
# RULE 19: ERROR RECOVERY - Implementation
# ============================================================================

def detect_ambiguity(query: str, search_results: list) -> dict:
    """
    Detect if query is ambiguous and needs clarification
    """
    # Check if query is too vague
    vague_queries = [
        "fraud", "property", "law", "case", "section"
    ]
    
    if len(query.split()) <= 2 and any(vq in query.lower() for vq in vague_queries):
        return {
            'is_ambiguous': True,
            'reason': 'TOO_VAGUE',
            'suggestions': generate_clarifications(query)
        }
    
    # Check if search returned diverse results
    if len(set([r.get('domain') for r in search_results])) > 3:
        return {
            'is_ambiguous': True,
            'reason': 'MULTIPLE_DOMAINS',
            'suggestions': generate_domain_clarifications(search_results)
        }
    
    return {'is_ambiguous': False}


CLARIFICATION_TEMPLATE = """
🤔 I found multiple interpretations. Which do you mean?

{options}

Please clarify by typing the number (1, 2, 3, etc.) or provide more details.
"""


def generate_clarifications(query: str) -> list:
    """Generate clarification options"""
    common_ambiguities = {
        'fraud': [
            'Corporate fraud (IPC 420)',
            'Property fraud',
            'Banking/financial fraud',
            'Tax fraud'
        ],
        'property': [
            'Property ownership disputes',
            'Property transfer laws',
            'Adverse possession',
            'Inheritance/succession'
        ],
        'section': [
            'Specific IPC section (provide number)',
            'CrPC section',
            'Act provisions (specify act)'
        ]
    }
    
    for keyword, options in common_ambiguities.items():
        if keyword in query.lower():
            return options
    
    return ['Please provide more specific details']


# ============================================================================
# RULE 20: EMOTION & EMPATHY - Implementation
# ============================================================================

def detect_emotion(query: str) -> str:
    """
    Detect user's emotional state from query
    """
    query_lower = query.lower()
    
    emotion_keywords = {
        'FRUSTRATED': ['stuck', 'confused', "don't understand", 'frustrated', 'difficult'],
        'URGENT': ['urgent', 'emergency', 'help', 'quickly', 'asap', 'immediately'],
        'GRATEFUL': ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
        'WORRIED': ['worried', 'concerned', 'afraid', 'scared', 'anxious']
    }
    
    for emotion, keywords in emotion_keywords.items():
        if any(kw in query_lower for kw in keywords):
            return emotion
    
    return 'NEUTRAL'


EMPATHY_INTROS = {
    'FRUSTRATED': """
I understand this can be confusing. Let me break it down step by step to make it clearer:
""",
    
    'URGENT': """
I see this is time-sensitive. Here's what you need to know immediately:
""",
    
    'GRATEFUL': """
You're welcome! I'm glad I could help. Here's the information you requested:
""",
    
    'WORRIED': """
I understand your concern. Let me provide clear information to help address this:
""",
    
    'NEUTRAL': ""
}


def add_empathy(emotion: str, response: str) -> str:
    """Add empathetic intro based on detected emotion"""
    intro = EMPATHY_INTROS.get(emotion, "")
    return intro + "\n\n" + response if intro else response


# ============================================================================
# INTEGRATED RESPONSE GENERATOR
# ============================================================================

def generate_enhanced_response(
    query: str,
    search_results: list,
    conversation_memory: ConversationMemory = None
) -> dict:
    """
    Generate response using all 20 rules
    
    Returns enhanced response with metadata
    """
    # Rule 4: Intent Recognition
    complexity = detect_query_complexity(query)
    
    # Rule 1: Length Matching
    response_length = detect_response_length(query, complexity)
    
    # Rule 7: Adaptive Depth
    user_level = detect_user_expertise(query)
    
    # Rule 11: ELI5 Detection
    eli5_mode = needs_eli5(query)
    
    # Rule 20: Emotion Detection
    emotion = detect_emotion(query)
    
    # Rule 14: Refinement Detection
    refinement = None
    if conversation_memory:
        refinement = conversation_memory.detect_refinement(query)
    
    # Rule 19: Ambiguity Detection
    ambiguity = detect_ambiguity(query, search_results)
    
    # If ambiguous, return clarification request
    if ambiguity['is_ambiguous']:
        return {
            'type': 'CLARIFICATION_NEEDED',
            'message': CLARIFICATION_TEMPLATE.format(
                options='\n'.join(f"{i+1}. {opt}" for i, opt in enumerate(ambiguity['suggestions']))
            )
        }
    
    # Build enhanced prompt
    enhanced_prompt = f"""
{CHATBOT_RULES_SYSTEM}

RESPONSE CONFIGURATION:
• Length: {response_length} ({LENGTH_TEMPLATES[response_length]})
• Depth: {user_level} ({DEPTH_TEMPLATES[user_level]})
• ELI5: {'YES' if eli5_mode else 'NO'}
• Emotion: {emotion}
• Refinement: {'YES - ' + refinement['type'] if refinement and refinement['is_refinement'] else 'NO'}

{conversation_memory.get_context_prompt() if conversation_memory else ''}

USER QUERY: {query}

INSTRUCTIONS:
1. Apply appropriate length template based on query complexity
2. Match user's expertise level
3. Use ELI5 mode if requested
4. Add empathetic intro based on emotion
5. If refinement, build on previous answer
6. Follow all 20 core rules

YOUR RESPONSE:
"""
    
    return {
        'type': 'ENHANCED_RESPONSE',
        'prompt': enhanced_prompt,
        'metadata': {
            'length': response_length,
            'depth': user_level,
            'eli5': eli5_mode,
            'emotion': emotion,
            'refinement': refinement
        }
    }


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def detect_query_complexity(query: str) -> str:
    """Detect query complexity (from existing system)"""
    query_lower = query.lower()
    
    complex_words = ['how', 'why', 'explain', 'relationship', 'relate']
    research_words = ['precedent', 'case law', 'history', 'landmark']
    
    if any(word in query_lower for word in research_words):
        return 'RESEARCH'
    elif any(word in query_lower for word in complex_words):
        return 'COMPLEX'
    return 'SIMPLE'


def generate_domain_clarifications(search_results: list) -> list:
    """Generate domain-specific clarifications"""
    domains = list(set([r.get('domain', 'unknown') for r in search_results]))
    return [
        f"{domain.replace('_', ' ').title()} related query"
        for domain in domains[:4]
    ]


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

if __name__ == "__main__":
    # Initialize conversation memory
    memory = ConversationMemory()
    
    # Example 1: Short query
    query1 = "Capital of India?"
    response1 = generate_enhanced_response(query1, [], memory)
    print(f"Query: {query1}")
    print(f"Response Type: {response1['type']}")
    print(f"Length: {response1['metadata']['length']}")
    print()
    
    # Example 2: Complex query with emotion
    query2 = "I'm confused about IPC 409 and how it relates to corruption"
    response2 = generate_enhanced_response(query2, [], memory)
    print(f"Query: {query2}")
    print(f"Emotion: {response2['metadata']['emotion']}")
    print(f"Depth: {response2['metadata']['depth']}")
    print()
    
    # Example 3: ELI5 request
    query3 = "Explain adverse possession like I'm 5"
    response3 = generate_enhanced_response(query3, [], memory)
    print(f"Query: {query3}")
    print(f"ELI5: {response3['metadata']['eli5']}")


