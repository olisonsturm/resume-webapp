import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, RotateCcw, Loader2, ArrowLeft } from 'lucide-react';
import { EditorLayout } from './components/Editor';
import { ResumePreview } from './components/Preview';
import { useResumeStore, useActiveResume } from './store/resumeStore';
import { generatePDF } from './utils/pdfGenerator';
import { SaveIndicator } from './components/common/SaveIndicator';
import './App.css';

import { useCloudSync } from './hooks/useCloudSync';

function App() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { cvList, loadCV, resetCurrentCV } = useResumeStore();
  const resume = useActiveResume();
  const { flushPendingSaves, isLoading } = useCloudSync();
  const [isGenerating, setIsGenerating] = useState(false);

  // Load the CV when component mounts
  useEffect(() => {
    if (isLoading) return; // Wait for cloud sync to finish

    if (id) {
      const cvExists = cvList.some(cv => cv.id === id);
      if (cvExists) {
        loadCV(id);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, cvList, loadCV, navigate, isLoading]);

  // Flush pending saves on unmount
  useEffect(() => {
    return () => {
      flushPendingSaves();
    };
  }, [flushPendingSaves]);

  const currentCV = cvList.find(cv => cv.id === id);

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;

    setIsGenerating(true);
    try {
      const pagesContainer = resumeRef.current.querySelector('.pages-container') as HTMLElement;
      if (pagesContainer) {
        const filename = `${resume.header.name.replace(/\s+/g, '_') || 'Resume'}.pdf`;
        await generatePDF(pagesContainer, filename);
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    flushPendingSaves();
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!currentCV) {
    return null;
  }

  return (
    <div className="app">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="btn btn-ghost" onClick={handleBack}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="navbar-brand">
            <h1>{currentCV.name}</h1>
          </div>
          <SaveIndicator watchData={resume} />
        </div>
        <div className="navbar-actions">
          <button className="btn btn-ghost" onClick={resetCurrentCV}>
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExportPDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Export PDF
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content - Split View */}
      <main className="main-content">
        <div className="editor-pane">
          <EditorLayout />
        </div>
        <div className="preview-pane">
          <ResumePreview ref={resumeRef} />
        </div>
      </main>
    </div>
  );
}

export default App;
