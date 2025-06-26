#!/usr/bin/env python3
"""
Test script for the resume generation service
"""

import os
import sys
from controllers.resume_generator import ResumeController

# Sample user data for testing
TEST_USER_DATA = {
    "name": "Shivam Sourav",
    "email": "shivamsourav2003@gmail.com", 
    "location": "Banka, Bihar, India",
    "linkedin_url": "linkedin.com/in/shivam-sourav-b889aa204/",
    "github_url": "github.com/Shivam5560",
    "experiences": [
        {
            "title": "Associate Software Engineer",
            "dates": "Aug 2024 -- Present",
            "company": "Nomura Research Institute and Financial Technology",
            "location": "On site - Kolkata",
            "responsibilities": [
                "Automated release deployments via \\textbf{Jenkins CI/CD}, reducing manual effort by \\textbf{70\\%} with pipelines.",
                "Designed \\textbf{Python}-based data generation utility using \\textbf{YAML} schemas and configurable column definitions, supporting \\textbf{OracleDB}, and enabling \\textbf{60\\% faster} high-volume data creation with advanced formatting and mapping logic.",
                "Implemented \\textbf{LLM-based ATS} with \\textbf{LlamaIndex}, \\textbf{Cohere}, and \\textbf{Pinecone}, enabling \\textbf{90\\%+ accurate} resume matching, real-time scoring, and \\textbf{AI-driven recommendations} via \\textbf{Next.js} and \\textbf{Flask}."
            ]
        },
        {
            "title": "Data Scientist", 
            "dates": "Nov 2023 -- Jun 2024",
            "company": "Omdena",
            "location": "Remote",
            "responsibilities": [
                "Designed \\textbf{time-series models} using \\textbf{XGBoost} for COVID-19 forecasting and \\textbf{LSTM} for flood prediction, achieving \\textbf{92–95\\% accuracy} via feature engineering and \\textbf{GridSearchCV} tuning.",
                "Spearheaded a cross-functional team of 10 in \\textbf{data preprocessing} and \\textbf{model deployment}, streamlining processes that enhanced collaboration among 40 colleagues by improving workflow efficiency by 50\\% through targeted training sessions on \\textbf{Pandas} and \\textbf{Scikit-learn usage}."
            ]
        }
    ],
    "education": [
        {
            "institution": "Sikkim Manipal Institute of Technology",
            "graduation_date": "May 2025", 
            "degree": "B.Tech in Artificial Intelligence and Data Science",
            "gpa": "CGPA: 9.7"
        }
    ],
    "projects": [
        {
            "title": "Nepali LLM - Tuned Language Model",
            "subtitle": "",
            "descriptions": [
                "Trained a \\textbf{SentencePiece tokenizer} on Nepali corpus, reducing token count by \\textbf{80\\%} and fine-tuned \\textbf{Gemma-2B} via \\textbf{LoRA}, achieving \\textbf{25\\% higher accuracy} on NLU tasks.",
                "Deployed \\textbf{Nepali chatbot} with \\textbf{Streamlit}, increasing user engagement by \\textbf{30\\%}."
            ]
        },
        {
            "title": "Vitalis - Clinical AI Dashboard",
            "subtitle": "",
            "descriptions": [
                "Engineered \\textbf{Flask API} implementing \\textbf{clinical algorithms} (ASCVD/CKD-EPI) processing \\textbf{50+ biomarkers/sec}, achieving \\textbf{92\\% concordance} with clinician judgments through \\textbf{NumPy-optimized} calculations.",
                "Deployed \\textbf{Qwen2.5 3B} via \\textbf{Ollama} (4-bit GGUF) to produce \\textbf{JSON} outputs including \\textbf{NLP summaries} (95\\% Score), \\textbf{trend alerts}, and \\textbf{clinical recommendations}, with optimal inference speed.",
                "Architected \\textbf{React} dashboard with \\textbf{Chart.js/D3.js} visualizations (risk heatmaps, trend graphs) connected to \\textbf{Flask API}, displaying real-time clinical data with 200ms refresh intervals."
            ]
        },
        {
            "title": "Brainy-Buddy - RAG Document Chatbot",
            "subtitle": "",
            "descriptions": [
                "Formulated a \\textbf{RAG-based Q\\&A system} using \\textbf{LlamaIndex}, \\textbf{Cohere embeddings}, and \\textbf{Pinecone}, with \\textbf{Groq-powered LLM inference}, achieving \\textbf{85\\% top-3 retrieval precision} and real-time semantic justifications via \\textbf{Streamlit}."
            ]
        },
        {
            "title": "News Headline Generator",
            "subtitle": "",
            "descriptions": [
                "Devised fine-tuning for \\textbf{Mistral-7B} on news summarization using \\textbf{QLoRA (rank=64)} and \\textbf{Unsloth}, achieving \\textbf{80\\% headline relevance} with \\textbf{50\\% faster training}."
            ]
        }
    ],
    "skills": {
        "languages_tools": "Python, Java, R, SQL, Git, GitHub, Jenkins, Puppet, Apache Tomcat, ActiveMQ",
        "frameworks_libraries": "TensorFlow, PyTorch, Keras, Scikit-Learn, XGBoost, Prophet, Hugging Face, NLTK, LlamaIndex, Flask, Streamlit, Gradio",
        "data_visualization": "Pandas, NumPy, MongoDB, OracleDB, Power BI, Tableau, Looker, Plotly, Matplotlib, Seaborn, Chart.js",
        "concepts_soft_skills": "Machine Learning, Deep Learning, NLP, Computer Vision, Time Series, Statistics, Big Data, Team Collaboration, Leadership"
    }
}

def test_resume_generation():
    """Test the resume generation functionality."""
    print("Starting resume generation test...")
    
    # Initialize controller
    controller = ResumeController()
    
    # Test data validation
    print("\n1. Testing data validation...")
    validation_result = controller.validate_user_data(TEST_USER_DATA)
    if validation_result["valid"]:
        print("✅ Data validation passed!")
    else:
        print("❌ Data validation failed:")
        for error in validation_result["errors"]:
            print(f"   - {error}")
        return
    
    # Test resume generation
    print("\n2. Testing resume generation...")
    output_filename = "test_resume"
    result = controller.generate_resume(TEST_USER_DATA, output_filename)
    
    if result["success"]:
        print("✅ Resume generated successfully!")
        print(f"📄 PDF Path: {result['pdf_path']}")
        
        # Check if file exists
        if os.path.exists(result['pdf_path']):
            print("✅ PDF file exists on disk!")
            file_size = os.path.getsize(result['pdf_path'])
            print(f"📊 File size: {file_size} bytes")
        else:
            print("❌ PDF file not found on disk!")
    else:
        print("❌ Resume generation failed!")
        print(f"Error: {result['message']}")

def test_invalid_data():
    """Test with invalid data to check error handling."""
    print("\n\n🧪 Testing with invalid data...")
    
    controller = ResumeController()
    
    # Test with missing required fields
    invalid_data = {
        "name": "Test User",
        # Missing email, location, etc.
    }
    
    print("\n1. Testing with missing required fields...")
    validation_result = controller.validate_user_data(invalid_data)
    if not validation_result["valid"]:
        print("✅ Correctly identified invalid data!")
        print("   Errors found:")
        for error in validation_result["errors"]:
            print(f"   - {error}")
    else:
        print("❌ Should have failed validation!")
    
    # Test with empty data
    print("\n2. Testing with empty data...")
    empty_data = {}
    validation_result = controller.validate_user_data(empty_data)
    if not validation_result["valid"]:
        print("✅ Correctly identified empty data as invalid!")
    else:
        print("❌ Should have failed validation!")
    
    # Test resume generation with invalid data
    print("\n3. Testing resume generation with invalid data...")
    result = controller.generate_resume(invalid_data, "invalid_test")
    if not result["success"]:
        print("✅ Resume generation correctly failed with invalid data!")
        print(f"   Error: {result['message']}")
    else:
        print("❌ Resume generation should have failed!")

def main():
    """Main test function."""
    print("=" * 60)
    print("RESUME GENERATION SERVICE TEST")
    print("=" * 60)
    
    # Test valid data
    test_resume_generation()
    
    # Test invalid data
    test_invalid_data()
    
    print("\n" + "=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    main()
