"""
FastAPI Backend for Advanced Agentic RAG System
Production-ready API server with async support, metrics, and feedback
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import asyncio
import json
from datetime import datetime

# Import the advanced agentic system
import sys
from pathlib import Path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from kaanoon_test.system_adapters.rag_system_adapter_ULTIMATE import UltimateRAGAdapter

# Initialize FastAPI app
app = FastAPI(
    title="Advanced Agentic RAG API",
    description="Production-ready RAG system with async, memory, Redis, and metrics",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag_system = None

@app.on_event("startup")
async def startup_event():
    """Initialize RAG system on startup"""
    global rag_system
    print("\n[STARTUP] Initializing Advanced Agentic RAG System...")
    
    # Check if Redis is available
    use_redis = False  # Set to True if Redis is configured
    redis_url = "redis://localhost:6379"
    
    try:
        rag_system = UltimateRAGAdapter()
        print("[OK] RAG System ready")
    except Exception as e:
        print(f"[ERROR] Failed to initialize RAG system: {e}")
        raise


# Request/Response Models
class QueryRequest(BaseModel):
    question: str = Field(..., description="User question")
    session_id: Optional[str] = Field(None, description="Conversation session ID")
    target_language: Optional[str] = Field(None, description="Target language")
    category: Optional[str] = Field(None, description="Question category (for compatibility)")
    stream: bool = Field(False, description="Stream response")
    web_search_mode: bool = Field(False, description="Enable deep web search")  # NEW



class FeedbackRequest(BaseModel):
    query: str = Field(..., description="Original query")
    answer: str = Field(..., description="Answer provided")
    rating: int = Field(..., ge=1, le=5, description="Rating 1-5")
    session_id: str = Field(..., description="Session ID")
    feedback_text: Optional[str] = Field(None, description="Optional feedback text")


class QueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    citations: Optional[Dict[str, Any]] = Field(None, description="Extracted citations")
    citation_validation: Optional[Dict[str, Any]] = Field(None, description="Citation validation results")
    reasoning_analysis: Optional[Dict[str, Any]] = Field(None, description="Legal reasoning analysis")
    latency: float
    complexity: str
    query_type: str
    retrieval_time: float
    synthesis_time: Optional[float]
    confidence: float
    session_id: str
    from_cache: bool
    validation: Dict[str, Any]


# API Endpoints
@app.post("/api/query")
async def query_endpoint(request: QueryRequest):
    """
    Main query endpoint with async support
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        if request.stream:
            # Return streaming response
            return StreamingResponse(
                rag_system.query_async(
                    question=request.question,
                    session_id=request.session_id,
                    target_language=request.target_language,
                    stream=True
                ),
                media_type="text/event-stream"
            )
        else:
            # Return complete response
            # Generate session_id if not provided
            session_id = request.session_id or f"session_{datetime.now().timestamp()}"
            
            result = rag_system.query(
                question=request.question,
                target_language=request.target_language,
                session_id=session_id,
                web_search_mode=request.web_search_mode  # NEW
            )
            
            # Build response dict with safe access to all fields
            response_dict = {
                'answer': result.get('answer', 'No answer generated'),
                'sources': result.get('sources', []),
                'citations': result.get('citations'),
                'citation_validation': result.get('citation_validation'),
                'reasoning_analysis': result.get('reasoning_analysis'),
                'latency': result.get('latency', 0),
                'complexity': result.get('complexity', 'medium'),
                'query_type': result.get('query_type', 'general'),
                'retrieval_time': result.get('retrieval_time', 0),
                'synthesis_time': result.get('synthesis_time', 0),
                'confidence': result.get('confidence', 0.8),
                'session_id': session_id,
                'from_cache': result.get('from_cache', False),
                'validation': result.get('validation', {}),
                'system_info': {
                    'detected_language': result.get('detected_language', 'en'),
                    'query_type': result.get('query_type', 'general'),
                    'complexity': result.get('complexity', 'medium')
                }
            }
            
            # Wrap in 'response' object for frontend compatibility
            return {
                "response": response_dict
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/api/feedback")
async def feedback_endpoint(request: FeedbackRequest):
    """
    Collect user feedback for continuous improvement
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        rag_system.collect_feedback(
            query=request.query,
            answer=request.answer,
            rating=request.rating,
            session_id=request.session_id,
            feedback_text=request.feedback_text
        )
        
        return {
            "status": "success",
            "message": "Feedback collected successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback collection failed: {str(e)}")


@app.get("/api/metrics")
async def metrics_endpoint():
    """
    Get system performance metrics
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        metrics = rag_system.get_metrics()
        feedback_stats = rag_system.get_feedback_stats()
        
        return {
            "metrics": metrics,
            "feedback": feedback_stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics retrieval failed: {str(e)}")


@app.delete("/api/conversation/{session_id}")
async def clear_conversation_endpoint(session_id: str):
    """
    Clear conversation history for a session
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        rag_system.clear_conversation(session_id)
        return {
            "status": "success",
            "message": f"Conversation {session_id} cleared"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clear conversation failed: {str(e)}")


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "rag_system_initialized": rag_system is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/examples")
async def examples_endpoint():
    """
    Get example queries (for compatibility with frontend)
    """
    return {
        "examples": [
            "What is IPC Section 302?",
            "How to file for divorce under Hindu law?",
            "What is the procedure for filing FIR?",
            "Explain the principle of res judicata",
            "What are the rights of property owners in India?",
            "How to apply for bail?",
            "What is the difference between murder and culpable homicide?",
            "Explain Order 18 Rule 9 of CPC"
        ]
    }


@app.get("/health")
async def health_check_legacy():
    """
    Health check endpoint (without /api prefix for compatibility)
    """
    return {
        "status": "healthy",
        "rag_system_initialized": rag_system is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/stats")
async def stats_endpoint():
    """
    Get system statistics (compatibility with existing endpoints)
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    try:
        metrics = rag_system.get_metrics()
        return {
            "total_queries": metrics.get('total_queries', 0),
            "average_latency": metrics.get('average_latency', 0),
            "cache_hit_rate": metrics.get('cache_hit_rate', 0),
            "uptime_seconds": metrics.get('uptime_seconds', 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats retrieval failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "advanced_rag_api_server:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )

