import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './react-pdf-viewer.module.scss';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ReactPdfViewerProps {
  fileUrl?: string;
  width?: number;
  height?: number;
  enableTextLayer?: boolean;
}

export function ReactPdfViewer({
  fileUrl = '',
  width = 800,
  height = 600,
  enableTextLayer = false
}: ReactPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Reset state when fileUrl changes
  useEffect(() => {
    if (fileUrl) {
      setError('');
      // Don't reset numPages and pageNumber here to prevent flashing
    } else {
      setError('');
      setNumPages(0);
      setPageNumber(1);
    }
  }, [fileUrl]);

  // Memoize callbacks to prevent unnecessary re-renders
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError('');
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Error loading PDF: ${error.message}`);
  }, []);

  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }, []);

  const previousPage = useCallback(() => {
    changePage(-1);
  }, [changePage]);

  const nextPage = useCallback(() => {
    changePage(1);
  }, [changePage]);

  // Memoize loading component to prevent recreation
  const loadingComponent = useMemo(() => (
    <div className={styles.loading}>Loading PDF...</div>
  ), []);

  // Calculate responsive width
  const getResponsiveWidth = useCallback(() => {
    if (typeof window === 'undefined') return width;
    const containerWidth = Math.min(width, window.innerWidth - 100);
    return Math.max(300, containerWidth); // Minimum width of 300px
  }, [width]);

  if (!fileUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p>No PDF file provided</p>
          <p>Please provide a valid PDF URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>PDF Viewer</h3>
        <div className={styles.controls}>
          <button
            className={styles.button}
            disabled={pageNumber <= 1}
            onClick={previousPage}
            title="Go to previous page"
          >
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pageNumber} of {numPages}
          </span>
          <button
            className={styles.button}
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            title="Go to next page"
          >
            Next →
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.pdfContainer} style={{ height, minHeight: height }}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={loadingComponent}
        >
          <Page
            pageNumber={pageNumber}
            width={getResponsiveWidth()}
            renderTextLayer={enableTextLayer}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}

export default ReactPdfViewer;
