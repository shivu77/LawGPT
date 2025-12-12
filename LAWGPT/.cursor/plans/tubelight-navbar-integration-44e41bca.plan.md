<!-- 44e41bca-3b76-4a93-afc6-3690685ca686 6490bc30-6186-4036-89f5-042dd9d3503f -->
# Advanced Complexity Analysis and Time Management System

## Problem Analysis

The query "Tell about full form of ipc" took 42.71 seconds when it should be <2 seconds. Issues:

1. No fast lookup for definition/acronym questions
2. Complexity analysis doesn't detect definition patterns
3. Time limits are warnings only, not enforced
4. Only 2 complexity levels (simple/complex) - too coarse
5. Question type detection misses definition/acronym patterns

## Solution Overview

Create a multi-tier complexity system with fast lookups, strict time enforcement, and intelligent time budgeting.

## Implementation Plan

### 1. Add Fast Lookup Dictionary for Legal Acronyms/Definitions

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`

Add `LEGAL_DEFINITIONS_FAST_LOOKUP` dictionary after `IPC_SECTIONS_FAST_LOOKUP`:

- Common acronyms: IPC, CPC, CrPC, FIR, NCLT, RERA, CAT, SC, HC, etc.
- Each entry: full form, brief definition (2-3 sentences), year enacted, key sections
- Pattern matching for: "full form of X", "what is X", "meaning of X", "define X", "X stands for"

### 2. Enhance Question Type Detection

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `analyze_question_structure()`

Add detection for:

- Definition questions: "what is", "full form", "meaning of", "define", "stands for", "abbreviation"
- Acronym questions: Pattern matching for common legal acronyms
- Ultra-simple indicators: <=6 words + definition pattern = instant lookup

### 3. Implement 5-Tier Complexity System

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `analyze_query_complexity()`

Replace binary (simple/complex) with 5 levels:

- **ultra_simple**: Definition/acronym questions, <=6 words, fast lookup available → 1-2s target
- **simple**: Basic questions, <=10 words, no complex patterns → 2-5s target
- **moderate**: Standard questions, 10-25 words, some complexity → 5-10s target
- **complex**: Multi-part, procedural, comparison → 10-20s target
- **very_complex**: Very long, multiple sub-questions, extensive analysis → 20-60s target

### 4. Add Fast Lookup Check Before Complexity Analysis

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `query()`

After IPC section fast lookup, add:

- Check for definition/acronym patterns
- Match against `LEGAL_DEFINITIONS_FAST_LOOKUP`
- Return instantly if match found (<0.1s)

### 5. Implement Strict Time Enforcement

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `query()`

Replace warnings with strict enforcement:

- Track time at each stage (retrieval, context selection, LLM generation)
- If stage exceeds budget, use fallback (cached answer, truncated context, reduced tokens)
- If total time exceeds limit, return partial answer with note
- For ultra_simple: Hard limit 2s, return fast lookup or error

### 6. Intelligent Time Budgeting

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `query()`

Allocate time per complexity level:

- **ultra_simple**: 0.1s retrieval, 0.1s processing, 0.8s LLM (if needed), 1s total
- **simple**: 0.5s retrieval, 0.5s processing, 3s LLM, 4s total
- **moderate**: 1.5s retrieval, 1s processing, 6s LLM, 8s total
- **complex**: 3s retrieval, 2s processing, 12s LLM, 17s total
- **very_complex**: 5s retrieval, 3s processing, 40s LLM, 48s total

### 7. Early Termination Logic

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `query()`

Add checks:

- After retrieval: If time > 50% budget, skip reranking
- After context selection: If time > 70% budget, reduce context size
- Before LLM call: If time > 80% budget, use minimal tokens
- During LLM call: Monitor time, abort if exceeding

### 8. Enhanced Question Pattern Matching

**File**: `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`
**Function**: `analyze_query_complexity()`

Add patterns:

- Definition patterns: `r'\b(full form|what is|meaning of|define|stands for|abbreviation)\b'`
- Acronym patterns: Extract capitalized words (IPC, CPC, etc.)
- Ultra-simple score: -5 for definition + <=6 words
- Simple score: -3 for basic question words + <=10 words

## Files to Modify

1. `kaanoon_test/system_adapters/rag_system_adapter_ULTIMATE.py`

- Add `LEGAL_DEFINITIONS_FAST_LOOKUP` dictionary (~50 common acronyms)
- Enhance `analyze_question_structure()` for definition detection
- Rewrite `analyze_query_complexity()` for 5-tier system
- Add fast lookup check in `query()` before complexity analysis
- Implement strict time enforcement throughout `query()`
- Add time budgeting per complexity level
- Add early termination checks

## Expected Results

- "full form of IPC" queries: <1 second (fast lookup)
- Simple definition questions: <2 seconds
- Standard queries: 2-5 seconds (was 10-21s)
- Complex queries: 5-15 seconds (was 30-60s)
- Time limits strictly enforced
- 10x better complexity detection accuracy

## Testing

- Test "full form of IPC" → should be <1s
- Test "what is FIR" → should be <2s
- Test "define CPC" → should be <1s
- Test complex multi-part → should complete in <20s
- Verify time limits are enforced (not just warnings)

### To-dos

- [ ] make simler all 100+ different type of all angle Q and maneg all Q to maneg time completiy