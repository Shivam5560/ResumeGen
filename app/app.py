#!/usr/bin/env python3
"""
Streamlit web application for Resume Generation Service
"""

import streamlit as st
import os
import tempfile
import time
from controllers.resume_generator import ResumeController

# Page configuration
st.set_page_config(
    page_title="Resume Generator",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Cleanup function for temporary files
def cleanup_temp_files():
    """Remove any leftover temporary files from previous sessions."""
    try:
        current_dir = os.getcwd()
        for file in os.listdir(current_dir):
            if file.startswith('temp_resume_') and (file.endswith('.pdf') or file.endswith('.tex') or file.endswith('.aux') or file.endswith('.log') or file.endswith('.out')):
                try:
                    os.remove(file)
                except Exception:
                    pass  # Ignore cleanup errors
    except Exception:
        pass  # Ignore if directory listing fails

# Run cleanup on app start
cleanup_temp_files()

# Initialize session state
if 'current_section' not in st.session_state:
    st.session_state.current_section = 1
if 'user_data' not in st.session_state:
    st.session_state.user_data = {}

# Navigation functions
def next_section():
    if st.session_state.current_section < 6:
        st.session_state.current_section += 1

def prev_section():
    if st.session_state.current_section > 1:
        st.session_state.current_section -= 1

def go_to_section(section_num):
    st.session_state.current_section = section_num

# Sidebar navigation
st.sidebar.title("📄 Resume Generator")
st.sidebar.markdown("---")

sections = [
    "1. Personal Info",
    "2. Experience",
    "3. Education", 
    "4. Projects",
    "5. Skills",
    "6. Generate Resume"
]

for i, section in enumerate(sections, 1):
    if st.sidebar.button(section, key=f"nav_{i}", use_container_width=True):
        with st.spinner(f"Loading {section}..."):
            go_to_section(i)

# Main content area
st.title("🎯 Professional Resume Generator")

# Progress bar
progress = (st.session_state.current_section - 1) / 5
st.progress(progress)

# Section 1: Personal Information
if st.session_state.current_section == 1:
    st.header("👤 Personal Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        name = st.text_input("Full Name *", value=st.session_state.user_data.get('name', ''))
        email = st.text_input("Email Address *", value=st.session_state.user_data.get('email', ''))
        location = st.text_input("Location *", value=st.session_state.user_data.get('location', ''))
    
    with col2:
        linkedin_url = st.text_input("LinkedIn URL *", value=st.session_state.user_data.get('linkedin_url', ''))
        github_url = st.text_input("GitHub URL *", value=st.session_state.user_data.get('github_url', ''))
    
    # Save data to session state
    st.session_state.user_data.update({
        'name': name,
        'email': email,
        'location': location,
        'linkedin_url': linkedin_url,
        'github_url': github_url
    })
    
    st.markdown("---")
    col1, col2, col3 = st.columns([2, 1, 1])
    with col3:
        if st.button("Next ➡️", use_container_width=True):
            if name and email and location and linkedin_url and github_url:
                with st.spinner("Loading next section..."):
                    next_section()
            else:
                st.error("Please fill all required fields marked with *")

# Section 2: Experience
elif st.session_state.current_section == 2:
    st.header("💼 Work Experience")
    
    if 'experiences' not in st.session_state.user_data:
        st.session_state.user_data['experiences'] = []
    
    # Add new experience
    with st.expander("➕ Add New Experience", expanded=len(st.session_state.user_data['experiences']) == 0):
        exp_title = st.text_input("Job Title")
        exp_company = st.text_input("Company Name")
        exp_dates = st.text_input("Employment Dates (e.g., Aug 2024 -- Present)")
        exp_location = st.text_input("Work Location")
        
        st.subheader("Responsibilities")
        responsibilities = []
        
        # Dynamic responsibility inputs
        if 'temp_responsibilities' not in st.session_state:
            st.session_state.temp_responsibilities = ['']
        
        for i, resp in enumerate(st.session_state.temp_responsibilities):
            responsibility = st.text_area(f"Responsibility {i+1}", value=resp, key=f"resp_{i}")
            st.session_state.temp_responsibilities[i] = responsibility
            if responsibility:
                responsibilities.append(responsibility)
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("➕ Add Another Responsibility"):
                st.session_state.temp_responsibilities.append('')
                st.rerun()
        with col2:
            if len(st.session_state.temp_responsibilities) > 1:
                if st.button("➖ Remove Last"):
                    st.session_state.temp_responsibilities.pop()
                    st.rerun()
        
        if st.button("💾 Save Experience"):
            if exp_title and exp_company and exp_dates and responsibilities:
                new_exp = {
                    'title': exp_title,
                    'company': exp_company,
                    'dates': exp_dates,
                    'location': exp_location,
                    'responsibilities': [r for r in responsibilities if r.strip()]
                }
                st.session_state.user_data['experiences'].append(new_exp)
                st.session_state.temp_responsibilities = ['']
                st.success("Experience added successfully!")
                st.rerun()
            else:
                st.error("Please fill all required fields")
    
    # Display saved experiences
    if st.session_state.user_data['experiences']:
        st.subheader("📝 Saved Experiences")
        for i, exp in enumerate(st.session_state.user_data['experiences']):
            with st.expander(f"{exp['title']} at {exp['company']}", expanded=False):
                st.write(f"**Dates:** {exp['dates']}")
                st.write(f"**Location:** {exp['location']}")
                st.write("**Responsibilities:**")
                for resp in exp['responsibilities']:
                    st.write(f"• {resp}")
                if st.button(f"🗑️ Delete", key=f"del_exp_{i}"):
                    st.session_state.user_data['experiences'].pop(i)
                    st.rerun()
    
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("⬅️ Previous", use_container_width=True):
            with st.spinner("Loading previous section..."):
                prev_section()
    with col3:
        if st.button("Next ➡️", use_container_width=True):
            if st.session_state.user_data['experiences']:
                with st.spinner("Loading next section..."):
                    next_section()
            else:
                st.error("Please add at least one work experience")

# Section 3: Education
elif st.session_state.current_section == 3:
    st.header("🎓 Education")
    
    if 'education' not in st.session_state.user_data:
        st.session_state.user_data['education'] = []
    
    # Add new education
    with st.expander("➕ Add Education", expanded=len(st.session_state.user_data['education']) == 0):
        edu_institution = st.text_input("Institution Name")
        edu_degree = st.text_input("Degree/Program")
        edu_graduation = st.text_input("Graduation Date (e.g., May 2025)")
        edu_gpa = st.text_input("GPA/Grade (optional)")
        
        if st.button("💾 Save Education"):
            if edu_institution and edu_degree and edu_graduation:
                new_edu = {
                    'institution': edu_institution,
                    'degree': edu_degree,
                    'graduation_date': edu_graduation,
                    'gpa': edu_gpa
                }
                st.session_state.user_data['education'].append(new_edu)
                st.success("Education added successfully!")
                st.rerun()
            else:
                st.error("Please fill all required fields")
    
    # Display saved education
    if st.session_state.user_data['education']:
        st.subheader("📚 Saved Education")
        for i, edu in enumerate(st.session_state.user_data['education']):
            with st.expander(f"{edu['degree']} - {edu['institution']}", expanded=False):
                st.write(f"**Institution:** {edu['institution']}")
                st.write(f"**Degree:** {edu['degree']}")
                st.write(f"**Graduation:** {edu['graduation_date']}")
                if edu['gpa']:
                    st.write(f"**GPA/Grade:** {edu['gpa']}")
                if st.button(f"🗑️ Delete", key=f"del_edu_{i}"):
                    st.session_state.user_data['education'].pop(i)
                    st.rerun()
    
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("⬅️ Previous", use_container_width=True):
            with st.spinner("Loading previous section..."):
                prev_section()
    with col3:
        if st.button("Next ➡️", use_container_width=True):
            if st.session_state.user_data['education']:
                with st.spinner("Loading next section..."):
                    next_section()
            else:
                st.error("Please add at least one education entry")

# Section 4: Projects
elif st.session_state.current_section == 4:
    st.header("🚀 Projects")
    
    if 'projects' not in st.session_state.user_data:
        st.session_state.user_data['projects'] = []
    
    # Add new project
    with st.expander("➕ Add New Project", expanded=len(st.session_state.user_data['projects']) == 0):
        proj_title = st.text_input("Project Title")
        proj_subtitle = st.text_input("Project Subtitle (optional)")
        
        st.subheader("Project Descriptions")
        descriptions = []
        
        # Dynamic description inputs
        if 'temp_descriptions' not in st.session_state:
            st.session_state.temp_descriptions = ['']
        
        for i, desc in enumerate(st.session_state.temp_descriptions):
            description = st.text_area(f"Description {i+1}", value=desc, key=f"desc_{i}")
            st.session_state.temp_descriptions[i] = description
            if description:
                descriptions.append(description)
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("➕ Add Another Description"):
                st.session_state.temp_descriptions.append('')
                st.rerun()
        with col2:
            if len(st.session_state.temp_descriptions) > 1:
                if st.button("➖ Remove Last"):
                    st.session_state.temp_descriptions.pop()
                    st.rerun()
        
        if st.button("💾 Save Project"):
            if proj_title and descriptions:
                new_proj = {
                    'title': proj_title,
                    'subtitle': proj_subtitle,
                    'descriptions': [d for d in descriptions if d.strip()]
                }
                st.session_state.user_data['projects'].append(new_proj)
                st.session_state.temp_descriptions = ['']
                st.success("Project added successfully!")
                st.rerun()
            else:
                st.error("Please fill project title and at least one description")
    
    # Display saved projects
    if st.session_state.user_data['projects']:
        st.subheader("📂 Saved Projects")
        for i, proj in enumerate(st.session_state.user_data['projects']):
            with st.expander(f"{proj['title']}", expanded=False):
                if proj['subtitle']:
                    st.write(f"**Subtitle:** {proj['subtitle']}")
                st.write("**Descriptions:**")
                for desc in proj['descriptions']:
                    st.write(f"• {desc}")
                if st.button(f"🗑️ Delete", key=f"del_proj_{i}"):
                    st.session_state.user_data['projects'].pop(i)
                    st.rerun()
    
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("⬅️ Previous", use_container_width=True):
            with st.spinner("Loading previous section..."):
                prev_section()
    with col3:
        if st.button("Next ➡️", use_container_width=True):
            if st.session_state.user_data['projects']:
                with st.spinner("Loading next section..."):
                    next_section()
            else:
                st.error("Please add at least one project")

# Section 5: Skills
elif st.session_state.current_section == 5:
    st.header("💡 Skills")
    
    if 'skills' not in st.session_state.user_data:
        st.session_state.user_data['skills'] = {}
    
    # Add new skill category
    with st.expander("➕ Add New Skill Category", expanded=len(st.session_state.user_data['skills']) == 0):
        skill_category = st.text_input("Skill Category Title", placeholder="e.g., Programming Languages, Frameworks, Tools...")
        
        st.subheader("Skills in this category")
        skills_list = []
        
        # Dynamic skill inputs
        if 'temp_skills' not in st.session_state:
            st.session_state.temp_skills = ['']
        
        for i, skill in enumerate(st.session_state.temp_skills):
            skill_item = st.text_input(f"Skill {i+1}", value=skill, key=f"skill_{i}", placeholder="e.g., Python, JavaScript, Machine Learning...")
            st.session_state.temp_skills[i] = skill_item
            if skill_item:
                skills_list.append(skill_item)
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("➕ Add Another Skill"):
                st.session_state.temp_skills.append('')
                st.rerun()
        with col2:
            if len(st.session_state.temp_skills) > 1:
                if st.button("➖ Remove Last"):
                    st.session_state.temp_skills.pop()
                    st.rerun()
        
        if st.button("💾 Save Skill Category"):
            if skill_category and skills_list:
                # Convert skills list to comma-separated string
                skills_string = ', '.join([s for s in skills_list if s.strip()])
                st.session_state.user_data['skills'][skill_category.lower().replace(' ', '_')] = skills_string
                st.session_state.temp_skills = ['']
                st.success(f"Skill category '{skill_category}' added successfully!")
                st.rerun()
            else:
                st.error("Please fill category title and at least one skill")
    
    # Display saved skill categories
    if st.session_state.user_data['skills']:
        st.subheader("📚 Saved Skill Categories")
        for category, skills in st.session_state.user_data['skills'].items():
            with st.expander(f"{category.replace('_', ' ').title()}", expanded=False):
                st.write(f"**Skills:** {skills}")
                if st.button(f"🗑️ Delete", key=f"del_skill_{category}"):
                    del st.session_state.user_data['skills'][category]
                    st.rerun()
    
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("⬅️ Previous", use_container_width=True):
            with st.spinner("Loading previous section..."):
                prev_section()
    with col3:
        if st.button("Next ➡️", use_container_width=True):
            if st.session_state.user_data['skills']:
                with st.spinner("Loading next section..."):
                    next_section()
            else:
                st.error("Please add at least one skill category")

# Section 6: Generate Resume
elif st.session_state.current_section == 6:
    st.header("🎯 Generate Your Resume")
    
    # Preview data
    with st.expander("📋 Preview Your Data", expanded=False):
        st.json(st.session_state.user_data)
    
    st.subheader("Ready to generate your professional resume?")
    
    filename = st.text_input("Resume filename (without extension)", value="my_resume")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📄 Generate Resume", type="primary", use_container_width=True):
            try:
                # Initialize controller
                controller = ResumeController()
                
                # Validate data
                with st.spinner("Validating your data..."):
                    validation_result = controller.validate_user_data(st.session_state.user_data)
                
                if not validation_result["valid"]:
                    st.error("❌ Data validation failed:")
                    for error in validation_result["errors"]:
                        st.error(f"• {error}")
                else:
                    # Generate resume with temporary filename
                    with st.spinner("Generating your resume... This may take a moment."):
                        # Create a unique temporary filename to avoid conflicts
                        temp_filename = f"temp_resume_{int(time.time())}"
                        result = controller.generate_resume(st.session_state.user_data, temp_filename)
                    
                    if result["success"]:
                        st.success("✅ Resume generated successfully!")
                        
                        # Get the generated file paths
                        temp_pdf_path = result["pdf_path"]
                        temp_tex_path = temp_pdf_path.replace('.pdf', '.tex')
                        
                        # Read files and provide download buttons
                        pdf_data = None
                        tex_data = None
                        
                        try:
                            if os.path.exists(temp_pdf_path):
                                with open(temp_pdf_path, "rb") as pdf_file:
                                    pdf_data = pdf_file.read()
                                
                                st.download_button(
                                    label="📥 Download PDF",
                                    data=pdf_data,
                                    file_name=f"{filename}.pdf",
                                    mime="application/pdf"
                                )
                            
                            if os.path.exists(temp_tex_path):
                                with open(temp_tex_path, "r", encoding="utf-8") as tex_file:
                                    tex_data = tex_file.read()
                                
                                st.download_button(
                                    label="📥 Download LaTeX Source",
                                    data=tex_data,
                                    file_name=f"{filename}.tex",
                                    mime="text/plain"
                                )
                            
                            st.info("💡 Your resume has been generated! Click the download buttons above to save your files.")
                            
                        finally:
                            # Clean up temporary files
                            try:
                                if os.path.exists(temp_pdf_path):
                                    os.remove(temp_pdf_path)
                                if os.path.exists(temp_tex_path):
                                    os.remove(temp_tex_path)
                                # Also clean up any auxiliary files that LaTeX might have created
                                for ext in ['.aux', '.log', '.out']:
                                    aux_file = temp_pdf_path.replace('.pdf', ext)
                                    if os.path.exists(aux_file):
                                        os.remove(aux_file)
                            except Exception as cleanup_error:
                                # Don't show cleanup errors to user, just log them
                                print(f"Cleanup warning: {cleanup_error}")
                        
                    else:
                        st.error(f"❌ Resume generation failed: {result['message']}")
            
            except Exception as e:
                st.error(f"❌ An error occurred: {str(e)}")
    
    with col2:
        if st.button("🔄 Start Over", use_container_width=True):
            # Clear all session state data
            for key in list(st.session_state.keys()):
                if key != 'current_section':
                    del st.session_state[key]
            st.session_state.current_section = 1
            st.rerun()
    
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("⬅️ Previous", use_container_width=True):
            with st.spinner("Loading previous section..."):
                prev_section()

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #666;'>
        <p>💼 Professional Resume Generator | Built with Streamlit & LaTeX</p>
    </div>
    """, 
    unsafe_allow_html=True
)
