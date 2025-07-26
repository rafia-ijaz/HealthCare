import React, { useState } from 'react';
import { Send, Code, User, FileText } from 'lucide-react';

const SnippetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'javascript',
    author: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'xml', label: 'XML' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.trim().length < 10) {
      newErrors.code = 'Code must be at least 10 characters';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit(formData);
      if (success) {
        // Reset form on successful submission
        setFormData({
          title: '',
          code: '',
          language: 'javascript',
          author: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderCode = () => {
    const placeholders = {
      javascript: `function greetUser(name) {
  return \`Hello, \${name}! Welcome to our platform!\`;
}

console.log(greetUser('Developer'));`,
      python: `def fibonacci(n):
    """Generate fibonacci sequence"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Print first 10 fibonacci numbers
for num in fibonacci(10):
    print(num, end=' ')`,
      java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        for (int num : numbers) {
            System.out.println(num);
        }
    }
}`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
      python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)`
    };
    
    return placeholders[formData.language] || 'Write your amazing code here...';
  };

  return (
    <form onSubmit={handleSubmit} className="snippet-form">
      <div className="form-group">
        <label htmlFor="title">
          <FileText size={16} style={{ marginRight: '8px' }} />
          Snippet Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., React Custom Hook for API Calls"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="author">
          <User size={16} style={{ marginRight: '8px' }} />
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Anonymous Developer"
        />
      </div>

      <div className="form-group">
        <label htmlFor="language">
          <Code size={16} style={{ marginRight: '8px' }} />
          Programming Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className={errors.language ? 'error' : ''}
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {errors.language && <div className="error-message">{errors.language}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="code">
          <Code size={16} style={{ marginRight: '8px' }} />
          Code Snippet
        </label>
        <textarea
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder={getPlaceholderCode()}
          rows={12}
          className={errors.code ? 'error' : ''}
        />
        {errors.code && <div className="error-message">{errors.code}</div>}
      </div>

      <button 
        type="submit" 
        className="btn btn-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="spinner" style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid transparent', 
              borderTop: '2px solid currentColor', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            Sharing...
          </>
        ) : (
          <>
            <Send size={16} />
            Share Snippet
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </form>
  );
};

export default SnippetForm;