"""
Legal Reasoning Engine (LRE) - PROFESSIONAL EDITION
The core brain of LAW-GPT that enforces:
1. Contextual Mode Switching
2. Mandatory Structured Reasoning (IRAC + Professional Enhancements)
3. Precedent Prioritization
4. Hallucination Firewall
5. Executive Summary
6. Practical Remedies & Litigation Strategy
"""

import re
from typing import Dict, List, Optional, Tuple
from .law_revision_monitor import get_law_revision_monitor

class LegalReasoningEngine:
    """
    Orchestrates the legal reasoning process with professional enhancements.
    """
    
    MODES = {
        "CONSTITUTIONAL": "Constitutional Analysis",
        "CRIMINAL": "Criminal Law Analysis",
        "CIVIL": "Civil Law Analysis",
        "DRAFTING": "Legal Drafting",
        "GENERAL": "General Legal Query"
    }
    
    def __init__(self):
        self.revision_monitor = get_law_revision_monitor()
        
    def detect_mode(self, query: str) -> str:
        """Detect the legal domain/mode of the query."""
        q = query.lower()
        
        if any(w in q for w in ["article", "constitution", "fundamental right", "sedition", "liberty", "equality", "internet", "platform", "shutdown"]):
            return "CONSTITUTIONAL"
        elif any(w in q for w in ["ipc", "bns", "murder", "theft", "arrest", "bail", "police", "fir"]):
            return "CRIMINAL"
        elif any(w in q for w in ["contract", "property", "divorce", "marriage", "suit", "damages"]):
            return "CIVIL"
        elif any(w in q for w in ["draft", "notice", "affidavit", "agreement", "application"]):
            return "DRAFTING"
        else:
            return "GENERAL"
    
    def _calculate_complexity(self, query: str) -> int:
        """Estimate query complexity on 1-10 scale."""
        score = 5  # default
        
        # Multi-part questions
        if query.count('?') > 1:
            score += 2
            
        # Dispute indicators
        if any(w in query.lower() for w in ['challenge', 'defend', 'litigation', 'argue', 'file', 'appeal']):
            score += 1
            
        # Complex legal terms
        if any(w in query.lower() for w in ['proportionality', 'jurisdiction', 'arbitration', 'constitutional']):
            score += 1
            
        return min(score, 10)

    def get_reasoning_framework(self, mode: str) -> str:
        """Return the specific reasoning steps for the mode."""
        if mode == "CONSTITUTIONAL":
            return (
                "1. **Identify the Right:** Which Fundamental Right is at stake?\n"
                "2. **Legality Test:** Is there a valid law restricting it?\n"
                "3. **Legitimate Aim:** Does the law serve a valid purpose?\n"
                "4. **Proportionality Test:** Is the restriction the least intrusive measure?\n"
                "5. **Safeguards:** Are there procedural checks?"
            )
        elif mode == "CRIMINAL":
            return (
                "1. **Elements of Offense:** Break down the section into ingredients (Actus Reus + Mens Rea).\n"
                "2. **Fact Application:** Map each ingredient to the user's facts.\n"
                "3. **Exceptions:** Do any General Exceptions (self-defense, accident) apply?\n"
                "4. **Punishment:** State the cognizable/bailable nature and quantum."
            )
        elif mode == "CIVIL":
            return (
                "1. **Cause of Action:** What is the legal basis for the claim?\n"
                "2. **Jurisdiction:** Which court has the power to hear this?\n"
                "3. **Limitation:** Is the claim within the limitation period?\n"
                "4. **Remedy:** What relief can be granted (injunction, damages)?"
            )
        else:
            return "Apply standard legal interpretation: Facts -> Law -> Application -> Conclusion."

    def _prioritize_precedents(self, context: str) -> str:
        """
        Analyzes context for case hierarchy and returns prioritization instructions.
        """
        instructions = []
        lower_context = context.lower()
        
        # Constitution Bench detection
        if "constitution bench" in lower_context:
            instructions.append("CRITICAL: A Constitution Bench judgment is cited. This overrides all smaller bench decisions.")
            
        # Supreme Court vs High Court
        if "supreme court" in lower_context and "high court" in lower_context:
            instructions.append("HIERARCHY: Supreme Court judgments (Article 141) override High Court rulings.")
            
        # Recent vs Old
        instructions.append("RECENCY: Prefer recent judgments (2020-2025) over older ones if law has evolved.")
        
        return "\n".join(instructions)

    def _detect_conflicts(self, context: str) -> str:
        """
        Detects potential conflicts in the retrieved case law.
        """
        lower_context = context.lower()
        conflict_keywords = ["overruled", "dissenting", "distinguished", "per incuriam", "conflict", "contrary view"]
        
        if any(w in lower_context for w in conflict_keywords):
            return "CONFLICT ALERT: Conflicting judgments detected. You must explicitly resolve this by citing Article 141 and identifying the binding precedent."
        return ""

    def construct_structured_prompt(self, query: str, context: str, history: str) -> str:
        """
        Builds the ENHANCED dynamic prompt with professional features.
        """
        mode = self.detect_mode(query)
        framework = self.get_reasoning_framework(mode)
        complexity = self._calculate_complexity(query)
        revisions = self.revision_monitor.get_revision_context(query)
        precedent_instructions = self._prioritize_precedents(context)
        conflict_instructions = self._detect_conflicts(context)
        
        revision_text = "\n".join(revisions) if revisions else ""
        
        # Detect if needs executive summary
        needs_summary = any([
            complexity > 5,
            any(word in query.lower() for word in ['can', 'should', 'will', 'liable', 'penalty', 'whether']),
            '?' in query
        ])
        
        # Detect if needs practical remedies
        needs_remedies = any([
            any(word in query.lower() for word in ['can i', 'should i', 'how to', 'remedy', 'relief', 'appeal', 'file', 'challenge', 'defend']),
            'what should' in query.lower(),
            complexity > 6
        ])
        
        # Detect if litigation strategy needed
        needs_strategy = (
            complexity > 7 and
            any(word in query.lower() for word in ['challenge', 'defend', 'argue', 'litigation', 'court', 'file'])
        )
        
        # Base prompt
        prompt = f"""
You are an expert Senior Advocate of the Supreme Court of India.
Your task is to provide a **legally reasoned, professional opinion** on the following query.

**QUERY:** "{query}"

**LEGAL CONTEXT (Retrieved Data):**
{context}

**CRITICAL LEGAL UPDATES (Mandatory Application):**
{revision_text}

**REASONING FRAMEWORK TO USE ({mode}):**
{framework}

**PRECEDENT HIERARCHY & CONFLICTS:**
{precedent_instructions}
{conflict_instructions}

**STRICT RESPONSE STRUCTURE (Mandatory):**
You must structure your response exactly as follows. Use bullet points for readability.

"""

        # Add Executive Summary if needed
        if needs_summary:
            prompt += """
### ⚡ EXECUTIVE SUMMARY
(Provide a direct, concise answer in 1-2 sentences. Start with "Yes/No/It depends" followed by the core legal position. Cite the key statute/precedent.)

"""
        
        prompt += """
### ⚖️ I. Legal Issue
(Briefly state the core legal question in 1-2 sentences)

### 📜 II. Relevant Law & Principles
(Cite specific Sections/Articles using bullet points)
*   **Statutes:** Cite specific sections. **CRITICAL:** Use this mapping for BNS/BNSS:
    - CrPC 482 -> **BNSS 528**
    - CrPC 161 -> **BNSS 180**
    - CrPC 154 -> **BNSS 173**
    - IPC 302 -> **BNS 103**
    - IPC 420 -> **BNS 318**
    - IPC 304A -> **BNS 106**
    - Evidence Act -> **Bharatiya Sakshya Adhiniyam (BSA)**
    *Always mention if the new provision changes the procedure or remains same.*
*   **Rules:** Mention procedural rules (e.g., "IT Rules 2021").
*   **Doctrines:** Mention relevant legal doctrines (e.g., "Doctrine of Proportionality").
*   **Definitions:** Define key legal terms used (e.g., "Cognizable", "Prima Facie").

### 🔍 III. Analysis & Application
(Apply law to facts. Use the Reasoning Framework. Use bullet points for clarity.)
*   **Principle Tests:** Apply specific legal tests.
    - **For Quashing (482/528):** Apply *Bhajan Lal* BUT also cite *Neeharika Infrastructure v. Maharashtra (2021)*: **"Courts generally DO NOT consider defense evidence (like eyewitness statements) at the quashing stage."**
*   **Evidence Analysis:** Connect facts to Evidence Act/BSA principles.
    - **Section 161/180 Statements:** Explicitly state: "Not substantive evidence. Can only be used for contradiction."
    - **Forensic Evidence:** Mention importance of mechanical inspection, skid marks, etc. over oral testimony.
*   **Case Law:** Cite at least **1 Supreme Court** and **1 High Court** case. Explain the *Ratio Decidendi*.
"""
        
        # Add domain-specific enhancements
        if mode == "CONSTITUTIONAL":
            # Check for platform/internet cases
            if any(kw in context.lower() for kw in ['internet', 'platform', 'social media', 'blocking', 'shutdown', 'section 69a']):
                prompt += """
**📱 Platform vs Content Analysis:**
*   **Proportionality:** Explain why blocking the entire platform is disproportionate vs targeted removal.
*   **Least Restrictive Measure:** Discuss if less intrusive options existed.

**🛡️ Intermediary Liability & Compliance:**
*   **Section 69A Procedure:** Was the blocking procedure followed?
*   **Safe Harbor:** Discuss intermediary protection under Section 79/Shreya Singhal.

"""
        
        prompt += """
### ⚖️ IV. Risks & Counter-Arguments
(Professional legal opinions must show both sides.)
*   **Prosecution/Opposing Argument:** What will the other side argue? (e.g., "Defense material cannot be looked into at this stage").
*   **Risks:** What are the limitations or situations where relief might be denied?
*   **Rebuttal:** How to counter these arguments.

### 📝 V. Conclusion
(Provide a clear, authoritative conclusion.)
*   **Short Conclusion:** 1-line direct answer.
*   **Detailed Conclusion:** 5-6 lines summarizing the legal reasoning.

"""
        
        # Add Practical Remedies if needed
        if needs_remedies:
            prompt += """
### 🛠️ VI. PRACTICAL REMEDIES (Roadmap)
(Provide actionable legal remedies in a numbered list:)
1.  **Primary Remedy:** Step-by-step filing approach (e.g., "File 482 Petition in HC").
2.  **Secondary/Alternative Remedy:**
    - **Further Investigation:** Application under **Section 173(8) BNSS**.
    - **Supervisory Review:** Application to SP/CP under **Section 175 BNSS**.
    - **Summoning Records:** Section 349 BNSS.
3.  **Forum Hierarchy:** Where to go first?
4.  **Interim Measures:** Urgent reliefs (Stay, Status Quo).
5.  **Document Checklist:** List specific documents needed (e.g., "Certified copy of FIR", "Vakalatnama").

"""
        
        # Add Litigation Strategy if needed (high complexity only)
        if needs_strategy:
            prompt += """
### ♟️ VII. LITIGATION STRATEGY (Professional Guidance)
1.  **Expected Court Approach:** How courts view this issue.
2.  **Key Arguments:** Strongest points to argue.
3.  **Evidence Required:** Proof needed.
4.  **Precedents to Rely On:** Key case law to cite.
5.  **Example Scenario:** Give a mini-example or hypothetical variation to illustrate.

"""
        
        prompt += """
**STRICT PROHIBITIONS (Hallucination Firewall):**
1. DO NOT invent case names or citations.
2. DO NOT use emotional language.
3. DO NOT make up Section numbers.
4. DO NOT cite statutes generically (cite "Section 69A", not just "IT Act").
5. **BNS/BNSS Rule:** Always compare with old IPC/CrPC. State if "Same as old law" or "Changed".
6. Use **Bold** for key terms and *Italics* for case names.

**TONE:** Crisp, Lawyer-like, Confident. Avoid academic fluff.
"""
        
        if "WEB SEARCH RESULTS" in context:
            prompt += "\n**SPECIAL INSTRUCTION:** You are using LIVE WEB SEARCH results. Cite the source title/URL for your claims.\n"
            
        return prompt

    def validate_response(self, response: str) -> Dict[str, bool]:
        """
        Hallucination Firewall: Checks the generated response for safety.
        """
        issues = []
        
        # Check 1: Structure
        if "### I. Legal Issue" not in response:
            issues.append("Missing 'Legal Issue' section")
        
        # Check 2: Fake Citations (Basic heuristic)
        if "as an ai language model" in response.lower():
            issues.append("AI disclaimer found (should be professional)")
            
        # Check 3: Empty placeholders
        if "[Insert Section]" in response or "[Case Name]" in response:
            issues.append("Placeholder text found")
            
        # Check 4: Legal Reasoning Depth
        if "### III. Analysis & Application" in response:
            try:
                analysis_section = response.split("### III. Analysis & Application")[1].split("###")[0]
                if len(analysis_section.split()) < 30:
                    issues.append("Analysis section is too shallow (<30 words)")
            except:
                pass

        # Check 5: Ambiguous Conclusion
        if "### IV. Conclusion" in response:
            try:
                conclusion = response.split("### IV. Conclusion")[1]
                if "it depends" in conclusion.lower() and "unless" not in conclusion.lower() and "subject to" not in conclusion.lower():
                    issues.append("Ambiguous conclusion ('It depends' without conditions)")
            except:
                pass
        
        # Check 6: Generic statutory citations
        if "IT Act" in response and "Section 69A" not in response and "section 69" not in response.lower():
            issues.append("Generic statutory citation (should cite specific section)")
            
        return {
            "valid": len(issues) == 0,
            "issues": issues
        }

# Singleton
_engine = None

def get_legal_reasoning_engine() -> LegalReasoningEngine:
    global _engine
    if _engine is None:
        _engine = LegalReasoningEngine()
    return _engine
