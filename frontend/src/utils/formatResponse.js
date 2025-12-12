/**
 * Response Formatting Utility
 * Parses backend responses and adds structure (titles, bullets, sections)
 * Handles legal references formatting (cases, sections, articles)
 */

/**
 * Parse plain text response and structure it
 * @param {string} text - Plain text response
 * @param {string} question - Original question
 * @returns {Object} Structured response with sections
 */
export function parseResponse(text, question = '') {
  try {
    if (!text) return { title: '', sections: [] };

    // PRIORITY 1: Check for professional legal format with emoji sections
    if (text.includes('🟩') || text.includes('🟨') || text.includes('🟦') || text.includes('🟧')) {
      return parseProfessionalLegalFormat(text, question);
    }

    const structured = {
      title: extractTitle(text, question),
      sections: []
    };

    // Try to detect existing structure (markdown-style)
    if (text.includes('##') || text.includes('**') || text.includes('- ')) {
      return parseMarkdown(text, question);
    }

    // Extract sections from plain text
    const sections = extractSections(text);
    structured.sections = sections;

    return structured;
  } catch (error) {
    console.error('[FORMAT ERROR]', error);
    // Return safe fallback
    return {
      title: null,
      sections: [{
        type: 'paragraph',
        content: [text || 'An error occurred while formatting the response.']
      }]
    };
  }
}

/**
 * Extract title from text or generate from question
 * Note: LLM-generated titles from backend take priority
 * This is only fallback for when backend doesn't provide title
 */
function extractTitle(text, question) {
  // Look for existing title patterns in the text itself
  const titleMatch = text.match(/^(#+\s*.+|^[A-Z][^.!?]+(?:Section|Law|Act|Rights|Procedure)[^.!?]*)/m);
  if (titleMatch) {
    return titleMatch[1].replace(/^#+\s*/, '').trim();
  }

  // Fallback: Look for first meaningful sentence from long responses
  if (text && text.length > 300) {
    const firstSentence = text.match(/^[^.!?]+/);
    if (firstSentence && firstSentence[0].length > 50 && firstSentence[0].length < 100) {
      return firstSentence[0].trim();
    }
  }

  // No title by default (let LLM decide)
  return null;
}

/**
 * Extract sections from plain text
 */
function extractSections(text) {
  const sections = [];
  const lines = text.split(/\n+/).filter(line => line.trim());

  let currentSection = {
    type: 'paragraph',
    content: []
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect legal references (cases, sections)
    if (isLegalReference(line)) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({
        type: 'reference',
        content: [line]
      });
      currentSection = {
        type: 'paragraph',
        content: []
      };
      continue;
    }

    // Detect list items (bullets)
    if (line.match(/^[-•*]\s+|^\d+\.\s+/)) {
      if (currentSection.type !== 'list' && currentSection.content.length > 0) {
        sections.push(currentSection);
        currentSection = {
          type: 'list',
          content: []
        };
      }
      currentSection.type = 'list';
      currentSection.content.push(line.replace(/^[-•*]\s+|^\d+\.\s+/, '').trim());
      continue;
    }

    // Regular paragraph
    if (currentSection.type === 'list') {
      sections.push(currentSection);
      currentSection = {
        type: 'paragraph',
        content: []
      };
    }

    currentSection.content.push(line);
  }

  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  // Convert long paragraphs to bullet points if appropriate
  sections.forEach((section, index) => {
    if (section.type === 'paragraph' && section.content.length > 0) {
      const paragraph = section.content.join(' ');
      // If paragraph has multiple sentences with key terms, try to extract bullets
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 20);
      
      if (sentences.length >= 3 && paragraph.length > 150) {
        // Extract key points
        const keyPoints = extractKeyPoints(sentences);
        if (keyPoints.length >= 2) {
          sections[index] = {
            type: 'list',
            content: keyPoints
          };
        }
      }
    }
  });

  return sections;
}

/**
 * Parse markdown-style formatted text
 */
function parseMarkdown(text, question) {
  const structured = {
    title: extractTitle(text, question),
    sections: []
  };

  const lines = text.split(/\n+/);
  let currentSection = { type: 'paragraph', content: [] };

  for (const line of lines) {
    // Headings
    if (line.startsWith('##')) {
      if (currentSection.content.length > 0) {
        structured.sections.push(currentSection);
      }
      structured.sections.push({
        type: 'heading',
        content: [line.replace(/^#+\s*/, '').trim()]
      });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Bold text (treat as emphasis)
    if (line.includes('**')) {
      currentSection.content.push(line);
      continue;
    }

    // List items
    if (line.match(/^[-•*]\s+|^\d+\.\s+/)) {
      if (currentSection.type !== 'list') {
        if (currentSection.content.length > 0) {
          structured.sections.push(currentSection);
        }
        currentSection = { type: 'list', content: [] };
      }
      currentSection.content.push(line.replace(/^[-•*]\s+|^\d+\.\s+/, '').trim());
      continue;
    }

    // Regular paragraph
    if (line.trim()) {
      if (currentSection.type === 'list') {
        structured.sections.push(currentSection);
        currentSection = { type: 'paragraph', content: [] };
      }
      currentSection.content.push(line.trim());
    }
  }

  if (currentSection.content.length > 0) {
    structured.sections.push(currentSection);
  }

  return structured;
}

/**
 * Check if line contains legal reference
 */
function isLegalReference(line) {
  const patterns = [
    /Section \d+/i,
    /Article \d+/i,
    /IPC Section \d+/i,
    /CrPC Section \d+/i,
    /v\.\s+[A-Z]/i,  // Case names like "X v. Y"
    /\(20\d{2}\)/,    // Years in parentheses (cases)
    /Supreme Court/i,
    /High Court/i,
    /Constitution of India/i
  ];

  return patterns.some(pattern => pattern.test(line));
}

/**
 * Extract key points from sentences
 */
function extractKeyPoints(sentences) {
  const keyPoints = [];
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    // Look for sentences with legal terms or important information
    if (
      trimmed.length > 30 && 
      (trimmed.match(/Section|Article|Act|Law|rights?|procedure|court|case/i) || 
       trimmed.length < 200)
    ) {
      keyPoints.push(trimmed);
    }
  }

  return keyPoints.slice(0, 5); // Limit to 5 key points
}

/**
 * Parse professional legal format with emoji sections
 * Format: 🟩 Answer, 🟨 Analysis, 🟦 Legal Basis, 🟧 Conclusion
 */
function parseProfessionalLegalFormat(text, question) {
  try {
    const structured = {
      title: null, // No title for this format
      sections: []
    };

    // Split by emoji section markers
    const sectionMarkers = [
      { emoji: '🟩', name: 'Answer', type: 'answer' },
      { emoji: '🟨', name: 'Analysis', type: 'analysis' },
      { emoji: '🟦', name: 'Legal Basis / References', type: 'legal-basis' },
      { emoji: '🟧', name: 'Conclusion', type: 'conclusion' }
    ];

    // Find all sections
    sectionMarkers.forEach((marker, index) => {
      try {
        const regex = new RegExp(`${marker.emoji}\\s*\\*\\*${marker.name}.*?\\*\\*:?\\s*([\\s\\S]*?)(?=${sectionMarkers[index + 1]?.emoji}|$)`, 'i');
        const match = text.match(regex);
        
        if (match && match[1]) {
          const content = match[1].trim();
          const formattedContent = formatMarkdownAndReferences(content);
          
          structured.sections.push({
            type: marker.type,
            emoji: marker.emoji,
            heading: marker.name,
            content: formattedContent
          });
        }
      } catch (err) {
        console.error(`[FORMAT ERROR] Section ${marker.name}:`, err);
      }
    });

    // If no sections found, return fallback
    if (structured.sections.length === 0) {
      return {
        title: null,
        sections: [{
          type: 'paragraph',
          content: [text]
        }]
      };
    }

    return structured;
  } catch (error) {
    console.error('[FORMAT ERROR] Professional format:', error);
    // Fallback to simple paragraph
    return {
      title: null,
      sections: [{
        type: 'paragraph',
        content: [text]
      }]
    };
  }
}

/**
 * Remove blue circle emojis and other unwanted bullet emojis
 */
function removeEmojisBullets(text) {
  if (!text) return text;
  
  // Remove blue circle emoji (🔵) and similar
  text = text.replace(/🔵\s*/g, '');
  text = text.replace(/\u{1F535}\s*/gu, ''); // Unicode for blue circle
  
  // Remove other common emoji bullets
  text = text.replace(/[🟦🟧🟩🟨]\s*(?=[A-Z])/g, ''); // Keep section markers but remove if followed by regular text
  
  // Remove emoji at the start of list items
  text = text.replace(/^[\u{1F300}-\u{1F9FF}]\s*/gmu, ''); // All emojis at line start
  
  return text;
}

/**
 * Format markdown (bold, italic) and legal references
 */
function formatMarkdownAndReferences(text) {
  try {
    if (!text) return '<div class="legal-content"></div>';
    
    // FIRST: Remove blue circle and other emoji bullets
    text = removeEmojisBullets(text);
    
    // Split into lines for better processing
    const lines = text.split('\n');
    const processedLines = [];
    let inList = false;
    let listItems = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (!line) {
        // Empty line - end list if in one
        if (inList) {
          processedLines.push('<ul class="legal-bullet-list space-y-2 ml-6 my-4">' + listItems.join('') + '</ul>');
          listItems = [];
          inList = false;
        }
        processedLines.push(''); // Preserve spacing
        continue;
      }
      
      // Check if line is a main bullet point (•, *, -)
      const mainBulletMatch = line.match(/^[•*]\s+(.+)$/);
      // Check if line is a sub-bullet (–, two spaces + -, tab + -)
      const subBulletMatch = line.match(/^(?:–|\s{2,}[\-–]|^\s+[\-–])\s+(.+)$/);
      
      if (mainBulletMatch) {
        inList = true;
        let content = mainBulletMatch[1];
        
        // Convert bold (**text**) to HTML
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
        
        // Convert italic (*text*) to HTML
        content = content.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
        
        listItems.push(`<li class="text-gray-700 dark:text-gray-300 leading-relaxed">${content}</li>`);
      } else if (subBulletMatch) {
        inList = true;
        let content = subBulletMatch[1];
        
        // Convert bold (**text**) to HTML
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
        
        // Convert italic (*text*) to HTML
        content = content.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
        
        // Sub-bullet with indentation
        listItems.push(`<li class="text-gray-600 dark:text-gray-400 leading-relaxed ml-6 text-sm">${content}</li>`);
      } else {
        // Not a bullet - end list if in one
        if (inList) {
          processedLines.push('<ul class="legal-bullet-list space-y-2 ml-6 my-4">' + listItems.join('') + '</ul>');
          listItems = [];
          inList = false;
        }
        
        // Convert bold (**text**) to HTML
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
        
        // Convert italic (*text*) to HTML
        line = line.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
        
        // Add as paragraph
        processedLines.push(`<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">${line}</p>`);
      }
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
      processedLines.push('<ul class="legal-bullet-list space-y-2 ml-6 my-4">' + listItems.join('') + '</ul>');
    }
    
    return '<div class="legal-content space-y-2">' + processedLines.join('\n') + '</div>';
  } catch (error) {
    console.error('[FORMAT ERROR] Markdown formatting:', error);
    // Return plain text wrapped in div
    return `<div class="legal-content"><p class="text-gray-700 dark:text-gray-300">${text || ''}</p></div>`;
  }
}

/**
 * Format legal references nicely
 */
export function formatLegalReference(text) {
  // Already formatted in formatMarkdownAndReferences
  return text;
}

/**
 * Format structured response for display
 */
export function formatForDisplay(structured) {
  if (!structured || !structured.sections) {
    return '';
  }

  let html = '';

  if (structured.title) {
    html += `<h3 class="legal-title">${structured.title}</h3>`;
  }

  structured.sections.forEach(section => {
    if (section.type === 'heading') {
      html += `<h4 class="legal-heading">${section.content[0]}</h4>`;
    } else if (section.type === 'list') {
      html += '<ul class="legal-bullet-list">';
      section.content.forEach(item => {
        html += `<li class="legal-bullet">${formatLegalReference(item)}</li>`;
      });
      html += '</ul>';
    } else if (section.type === 'reference') {
      html += `<div class="legal-reference">${formatLegalReference(section.content[0])}</div>`;
    } else {
      // Paragraph
      html += `<p class="legal-body">${formatLegalReference(section.content.join(' '))}</p>`;
    }
  });

  return html;
}

