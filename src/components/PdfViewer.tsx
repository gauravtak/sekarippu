import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { pdfjs, Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { readFile } from "@tauri-apps/plugin-fs";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PdfViewer = () => {
  const { pdfPath } = useParams();
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const decodedPath = decodeURIComponent(String(pdfPath));

  useEffect(() => {
    async function loadPdf() {
      const bytes = await readFile(decodedPath ?? "");
      setPdfData(bytes);
    }
    loadPdf();
  }, [pdfPath]);

  const fileObject = useMemo(() => (pdfData ? { data: pdfData } : null), [pdfData]);

  if (!fileObject) {
    return <div>Loading...</div>;
  }

  return (
    <Document file={fileObject}>
      <Page pageNumber={1} />
    </Document>
  );
};
