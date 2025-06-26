"""
LaTeX template for resume generation
"""

LATEX_TEMPLATE = r"""
%-------------------------
% Resume in Latex
% Author : Shivam Sourav (adapted from Jake Gutierrez's template)
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

% Use geometry instead of fullpage for BasicTeX compatibility
\usepackage[empty]{geometry}
\geometry{
    letterpaper,
    left=0.5in,
    right=0.5in,
    top=0.5in,
    bottom=0.5in
}

\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item \small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-5pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-5pt}
}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape {{NAME}}} \\ \vspace{1pt}
     \href{mailto:{{EMAIL}}}{\underline{{{EMAIL}}}} $|$ {{LOCATION}} \\
     \href{https://{{LINKEDIN_URL}}}{\underline{{{LINKEDIN_URL}}}} $|$
     \href{https://{{GITHUB_URL}}}{\underline{{{GITHUB_URL}}}}
\end{center}

%-----------EXPERIENCE-----------
\section{Professional Experience}
  \resumeSubHeadingListStart
{{EXPERIENCES_SECTION_CONTENT}}
  \resumeSubHeadingListEnd

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
{{EDUCATION_SECTION_CONTENT}}
  \resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{University Projects}
  \resumeSubHeadingListStart
{{PROJECTS_SECTION_CONTENT}}
  \resumeSubHeadingListEnd

\section{Additional}
\begin{itemize}[itemsep=-2pt]
{{SKILLS_SECTION_CONTENT}}
\end{itemize}

\end{document}
"""
