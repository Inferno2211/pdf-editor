import React, { useState, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import jsPDF from 'jspdf';
import { pdfjs } from 'react-pdf';

// Dynamically import the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
    const [pdfFile, setPdfFile] = useState(null);
    const [textToAdd, setTextToAdd] = useState('');
    const canvasRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(URL.createObjectURL(file));
        }
    };

    const handleBlur = (x, y, width, height) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.filter = 'blur(5px)';
        context.fillRect(x, y, width, height);
    };

    const handleErase = (x, y, width, height) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(x, y, width, height);
    };

    const handleAddText = (x, y, text) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.font = '16px Arial';
        context.fillText(text, x, y);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('modified.pdf');
    };

    return (
        <div>
            <h1>PDF Editor</h1>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />

            {pdfFile && (
                <div style={{ position: 'relative' }}>
                    <Worker workerUrl={`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}>
                        <Viewer fileUrl={pdfFile} />
                    </Worker>

                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={1000}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            )}

            <div>
                <button onClick={() => handleBlur(100, 100, 200, 50)}>Blur Area</button>
                <button onClick={() => handleErase(150, 150, 200, 50)}>Erase Area</button>
                <input
                    type="text"
                    placeholder="Add text"
                    value={textToAdd}
                    onChange={(e) => setTextToAdd(e.target.value)}
                />
                <button onClick={() => handleAddText(200, 200, textToAdd)}>Add Text</button>
                <button onClick={handleSave}>Save PDF</button>
            </div>
        </div>
    );
}

export default App;