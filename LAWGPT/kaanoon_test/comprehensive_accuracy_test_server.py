"""
Comprehensive Accuracy Test Server
- Tests Enhanced RAG System against kaanoon_qa_dataset_cleaned.json
- Serves REST API for frontend integration
- Provides real-time testing interface
"""

import sys
import json
import time
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime
import logging

# Add parent to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from enhanced_rag_with_caching import EnhancedRAGSystem
from testing_framework import MetricsCalculator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize systems
print("\n" + "="*80)
print("INITIALIZING COMPREHENSIVE TEST SERVER")
print("="*80)

try:
    system = EnhancedRAGSystem()
    metrics_calc = MetricsCalculator()
    
    # Load ground truth dataset
    with open('kaanoon_qa_dataset_cleaned.json', 'r', encoding='utf-8') as f:
        ground_truth = json.load(f)
    
    print(f"[OK] Loaded {len(ground_truth)} ground truth Q&A pairs")
    print("[OK] Enhanced RAG System ready")
    print("="*80)
    
    # Global variables
    test_results = []
    is_system_ready = True
except Exception as e:
    logger.error(f"Initialization failed: {e}")
    is_system_ready = False
    ground_truth = []
    system = None
    metrics_calc = None


@app.route('/')
def home():
    """Serve simple testing interface"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>LAW-GPT Comprehensive Test Server</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                margin-bottom: 30px;
            }
            .status {
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .ready {
                background: #d4edda;
                color: #155724;
            }
            .not-ready {
                background: #f8d7da;
                color: #721c24;
            }
            .test-section {
                margin: 30px 0;
                padding: 20px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
            }
            input[type="text"], textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #ccc;
                border-radius: 5px;
                font-size: 16px;
                margin: 10px 0;
            }
            button {
                background: #667eea;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                margin: 5px;
            }
            button:hover {
                background: #5568d3;
            }
            .result {
                margin-top: 20px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 5px;
                border-left: 4px solid #667eea;
            }
            .metric {
                display: inline-block;
                margin: 10px 15px;
                padding: 10px 20px;
                background: #e9ecef;
                border-radius: 5px;
                font-weight: bold;
            }
            .success { color: #28a745; }
            .warning { color: #ffc107; }
            .danger { color: #dc3545; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏛️ LAW-GPT Comprehensive Test Server</h1>
            
            <div class="status {{ 'ready' if is_ready else 'not-ready' }}">
                Status: {{ '🟢 System Ready' if is_ready else '🔴 System Not Ready' }}
            </div>
            
            {% if is_ready %}
            <div class="test-section">
                <h2>📝 Quick Test Query</h2>
                <form onsubmit="testSingleQuery(event)">
                    <textarea id="query" placeholder="Enter your legal question here..." rows="3"></textarea>
                    <br>
                    <button type="submit">Test Query</button>
                    <button type="button" onclick="runFullTest()">Run Complete Test Suite</button>
                </form>
                <div id="singleResult"></div>
            </div>
            
            <div class="test-section">
                <h2>📊 System Information</h2>
                <p><strong>Database:</strong> 155,998 documents</p>
                <p><strong>Ground Truth:</strong> {{ ground_truth_count }} Q&A pairs</p>
                <p><strong>Features:</strong> Caching, Multi-language, Analytics</p>
            </div>
            
            <div class="test-section">
                <h2>🔗 API Endpoints</h2>
                <ul>
                    <li><code>POST /api/query</code> - Test single query</li>
                    <li><code>GET /api/test/all</code> - Run full test suite</li>
                    <li><code>GET /api/stats</code> - Get system statistics</li>
                    <li><code>GET /api/examples</code> - Get example queries</li>
                </ul>
            </div>
            {% else %}
            <div class="not-ready">
                Error: System failed to initialize. Please check server logs.
            </div>
            {% endif %}
        </div>
        
        <script>
            function testSingleQuery(event) {
                event.preventDefault();
                const query = document.getElementById('query').value;
                if (!query.trim()) {
                    alert('Please enter a question');
                    return;
                }
                
                fetch('/api/query', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: query})
                })
                .then(r => r.json())
                .then(data => {
                    const resultDiv = document.getElementById('singleResult');
                    resultDiv.innerHTML = `
                        <div class="result">
                            <h3>Response:</h3>
                            <p>${data.response.answer}</p>
                            <div>
                                <span class="metric">Latency: ${data.response.latency}s</span>
                                <span class="metric">Language: ${data.response.system_info.detected_language}</span>
                                <span class="metric">Accuracy: ${(data.metrics.accuracy_score * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    `;
                })
                .catch(err => {
                    document.getElementById('singleResult').innerHTML = 
                        '<div class="result"><p style="color: red;">Error: ' + err.message + '</p></div>';
                });
            }
            
            function runFullTest() {
                alert('Running full test suite... This will take a few minutes.');
                window.location.href = '/api/test/all';
            }
        </script>
    </body>
    </html>
    """
    return render_template_string(html, is_ready=is_system_ready, ground_truth_count=len(ground_truth))


@app.route('/api/query', methods=['POST'])
def query_endpoint():
    """Handle single query"""
    if not is_system_ready:
        return jsonify({'error': 'System not initialized'}), 500
    
    data = request.json
    question = data.get('question', '')
    category = data.get('category', 'general')
    
    if not question.strip():
        return jsonify({'error': 'Question required'}), 400
    
    try:
        # Query the system
        start_time = time.time()
        result = system.query(question, category=category)
        latency = time.time() - start_time
        
        # FAST RESPONSE: Skip ground truth matching for fast lookups (saves ~1-2 seconds)
        if result.get('response', {}).get('fast_response') or result.get('fast_response'):
            return jsonify({
                'success': True,
                'response': result,
                'metrics': {},
                'matching_qa': None,
                'latency': latency
            })
        
        # Find matching ground truth if available (only for non-fast responses)
        matching_qa = None
        metrics = None
        for qa in ground_truth:
            if 'Q5' in qa.get('id', ''):
                continue
            if question.lower() in qa.get('question_summary', '').lower():
                matching_qa = qa
                break
        
        # Calculate metrics if we have ground truth
        if matching_qa:
            expected = matching_qa.get('answer_summary', '')
            if isinstance(expected, dict):
                expected = str(expected.get('q1', '')) + " " + str(expected.get('q2', ''))
            metrics = metrics_calc.calculate_all_metrics(result['answer'], expected, [])
        
        return jsonify({
            'success': True,
            'response': result,
            'metrics': metrics or {},
            'matching_qa': matching_qa.get('id') if matching_qa else None,
            'latency': latency
        })
    except Exception as e:
        logger.error(f"Query error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/test/all', methods=['GET'])
def test_all():
    """Run comprehensive test against all ground truth"""
    if not is_system_ready:
        return jsonify({'error': 'System not initialized'}), 500
    
    results = []
    start_time = time.time()
    
    # Test all Q&A (except Q5 which is reference)
    for qa in ground_truth:
        qa_id = qa.get('id')
        if 'Q5' in qa_id:
            continue
        
        question = qa.get('question_summary', '')
        expected = qa.get('answer_summary', '')
        
        # Handle multi-part answers
        if isinstance(expected, dict):
            expected = str(expected.get('q1', '')) + " " + str(expected.get('q2', ''))
        
        if not question or not expected:
            continue
        
        logger.info(f"Testing {qa_id}: {question[:50]}...")
        
        try:
            # Query system
            result = system.query(question, category=qa.get('category', 'general'))
            
            # Calculate metrics
            metrics = metrics_calc.calculate_all_metrics(result['answer'], expected, [])
            
            results.append({
                'id': qa_id,
                'question': question,
                'expected': expected,
                'actual': result['answer'],
                'metrics': metrics,
                'latency': result.get('latency', 0),
                'used_kaanoon': result.get('used_kaanoon', False),
                'category': qa.get('category', 'unknown')
            })
        except Exception as e:
            logger.error(f"Error testing {qa_id}: {e}")
            results.append({
                'id': qa_id,
                'error': str(e)
            })
    
    total_time = time.time() - start_time
    
    # Calculate summary statistics
    success_results = [r for r in results if 'error' not in r]
    avg_accuracy = sum(r['metrics']['accuracy_score'] for r in success_results) / len(success_results) if success_results else 0
    
    summary = {
        'total_tests': len(results),
        'successful': len(success_results),
        'failed': len(results) - len(success_results),
        'avg_accuracy': float(avg_accuracy),
        'total_time': float(total_time),
        'timestamp': datetime.now().isoformat()
    }
    
    # Save results
    with open('comprehensive_test_results.json', 'w', encoding='utf-8') as f:
        json.dump({
            'summary': summary,
            'results': results
        }, f, indent=2, ensure_ascii=False)
    
    return jsonify({
        'summary': summary,
        'results': results
    })


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get system statistics"""
    if not is_system_ready:
        return jsonify({'error': 'System not initialized'}), 500
    
    dashboard = system.get_dashboard()
    cache_stats = system.get_cache_stats()
    
    return jsonify({
        'dashboard': dashboard,
        'cache_stats': cache_stats,
        'ground_truth_count': len(ground_truth),
        'database_docs': 155998
    })


@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Get example queries"""
    examples = []
    for qa in ground_truth[:4]:  # Skip Q5
        if 'Q5' not in qa.get('id', ''):
            examples.append({
                'id': qa.get('id'),
                'question': qa.get('question_summary', ''),
                'category': qa.get('category', 'unknown')
            })
    
    return jsonify({'examples': examples})


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if is_system_ready else 'unhealthy',
        'database_ready': system is not None,
        'ground_truth_loaded': len(ground_truth) > 0
    })


if __name__ == '__main__':
    print("\n" + "="*80)
    print("🚀 STARTING COMPREHENSIVE TEST SERVER")
    print("="*80)
    print("\n📍 Server starting on: http://0.0.0.0:5000")
    print("📍 Web Interface: http://localhost:5000")
    print("📍 API Endpoints:")
    print("   - POST http://localhost:5000/api/query")
    print("   - GET http://localhost:5000/api/test/all")
    print("   - GET http://localhost:5000/api/stats")
    print("   - GET http://localhost:5000/api/examples")
    print("="*80 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)

