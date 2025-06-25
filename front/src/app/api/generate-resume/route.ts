import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { data, format } = await request.json();

    console.log('Received request for format:', format);
    console.log('Data:', JSON.stringify(data, null, 2));

    // Transform the data to match the Python backend format
    const transformedData = {
      name: data.name || '',
      email: data.email || '',
      location: data.location || '', 
      linkedin_url: data.linkedin_url || '',
      github_url: data.github_url || '',
      experiences: data.experiences || [],
      education: data.education || [],
      projects: (data.projects || []).map((project: any) => ({
        title: project.title || '',
        technologies: project.technologies || '',
        descriptions: Array.isArray(project.description) ? project.description : [project.description || '']
      })),
      skills: data.skills || {}
    };

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    // Path to the Python API script
    const pythonScriptPath = path.join(process.cwd(), '..', 'app', 'api.py');
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [pythonScriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      // Send data to Python script
      pythonProcess.stdin.write(JSON.stringify({
        data: transformedData,
        format: format
      }));
      pythonProcess.stdin.end();

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', stderr);
          resolve(NextResponse.json(
            { error: 'Failed to generate resume', details: stderr },
            { status: 500 }
          ));
          return;
        }

        try {
          console.log('Raw Python output:', stdout);
          const result = JSON.parse(stdout);
          console.log('Parsed result:', result);
          
          if (result.error) {
            console.error('Python script returned error:', result.error);
            resolve(NextResponse.json(
              { error: result.error },
              { status: 500 }
            ));
            return;
          }

          if (format === 'latex') {
            resolve(new NextResponse(result.content, {
              headers: {
                'Content-Type': 'application/x-latex',
                'Content-Disposition': 'attachment; filename="resume.tex"',
              },
            }));
          } else if (format === 'pdf') {
            console.log('Processing PDF response, content length:', result.content?.length);
            // Convert base64 to buffer
            const pdfBuffer = Buffer.from(result.content, 'base64');
            console.log('PDF buffer size:', pdfBuffer.length);
            resolve(new NextResponse(pdfBuffer, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"',
              },
            }));
          }
        } catch (parseError) {
          console.error('Failed to parse Python script output:', parseError);
          console.error('Raw output:', stdout);
          resolve(NextResponse.json(
            { error: 'Failed to parse response from resume generator' },
            { status: 500 }
          ));
        }
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        resolve(NextResponse.json(
          { error: 'Failed to start resume generator' },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
