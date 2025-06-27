# ResNex - Professional Resume Generator

A modern, multi-step resume generator built with Next.js, TypeScript, and Tailwind CSS. Generate professional resumes in PDF or LaTeX format with a beautiful, intuitive interface.

## 🚀 Features

- **Multi-step Form**: Guided form with 6 easy steps
  - Personal Information
  - Work Experience (with dynamic entries)
  - Education (with dynamic entries)
  - Projects (optional, with dynamic entries)
  - Skills (with dynamic categories)
  - Preview & Download

- **Professional UI/UX**: 
  - Modern design with smooth animations
  - Responsive layout for all devices
  - Real-time form validation
  - Progress indicator
  - Smooth transitions between steps

- **PDF Generation**: 
  - High-quality LaTeX-generated PDFs
  - Professional resume templates
  - Download as PDF or LaTeX source

- **Smart Features**:
  - Form data persistence across steps
  - Dynamic field management
  - Input validation with helpful error messages
  - Skill suggestions and categorization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **PDF Generation**: LaTeX with pdflatex

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js 18+ and npm
- LaTeX distribution (for PDF generation):
  ```bash
  # Ubuntu/Debian
  sudo apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-recommended
  
  # macOS
  brew install --cask mactex
  
  # Windows
  # Download and install MiKTeX from https://miktex.org/
  ```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ResNex/front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-resume/
│   │       └── route.ts          # PDF/LaTeX generation API
│   ├── components/
│   │   ├── PersonalInfoForm.tsx  # Step 1: Personal details
│   │   ├── ExperienceForm.tsx    # Step 2: Work experience
│   │   ├── EducationForm.tsx     # Step 3: Education
│   │   ├── ProjectsForm.tsx      # Step 4: Projects (optional)
│   │   ├── SkillsForm.tsx        # Step 5: Skills
│   │   └── PreviewStep.tsx       # Step 6: Preview & download
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
└── ...
```

## 🎯 How to Use

1. **Personal Information**: Fill in your basic details, contact information, and professional summary
2. **Experience**: Add your work experience with detailed descriptions
3. **Education**: Include your educational background and achievements
4. **Projects**: (Optional) Showcase your key projects with links and highlights
5. **Skills**: Organize your skills into categories
6. **Preview**: Review your resume and download as PDF or LaTeX

## 🔧 API Endpoints

### `POST /api/generate-resume`

Generates a resume in the specified format.

**Request Body:**
```json
{
  "data": {
    "personal": { ... },
    "experience": [ ... ],
    "education": [ ... ],
    "projects": [ ... ],
    "skills": { ... }
  },
  "format": "pdf" | "latex"
}
```

**Response:** 
- PDF: Binary file download
- LaTeX: Text file with LaTeX source code

## 🎨 Customization

### Adding New Form Steps
1. Create a new component in `src/app/components/`
2. Add the step to the `steps` array in `page.tsx`
3. Update the `renderStepContent()` switch statement

### Modifying the Resume Template
Edit the LaTeX template in `/api/generate-resume/route.ts` to customize the resume layout and styling.

### Styling Changes
Modify Tailwind classes in components or update `globals.css` for custom styles.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

### Other Platforms
Make sure the deployment environment has LaTeX installed for PDF generation to work.

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Form Validation
All forms use Zod schemas for validation. Schemas are defined in each component file and provide real-time validation feedback.

## 🐛 Troubleshooting

### PDF Generation Issues
- Ensure LaTeX is properly installed
- Check server logs for pdflatex errors
- Verify file permissions in the temp directory

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and TypeScript
