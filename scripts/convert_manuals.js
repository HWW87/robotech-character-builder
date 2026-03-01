#!/usr/bin/env node
/*
  Simple preprocessor: convierte PDFs en JSON con texto por página.
  - Lee `public/manuals/*.pdf`
  - Extrae texto por página usando `pdf2json`
  - Escribe `src/data/manuals_parsed.json`

  Nota: este script corre en Node (requiere dependencia `pdf2json`).
*/

const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const manualsDir = path.resolve(__dirname, '..', 'public', 'manuals');
const outFile = path.resolve(__dirname, '..', 'src', 'data', 'manuals_parsed.json');

async function extractTextFromPdf(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
    
    parser.on('pdfParser_dataError', errData => {
      console.error('PDF parser error:', errData.parserError);
      reject(errData.parserError);
    });
    
    parser.on('pdfParser_dataReady', pdfData => {
      try {
        // Extract text from all pages
        const pages = [];
        if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
          for (const page of pdfData.Pages) {
            let pageText = '';
            if (page.Texts && Array.isArray(page.Texts)) {
              pageText = page.Texts.map(t => {
                // Decode text (pdf2json encodes some chars)
                if (t.R && Array.isArray(t.R)) {
                  return t.R.map(r => r.T || '').join('');
                }
                return '';
              }).join(' ');
            }
            pages.push(pageText);
          }
        }
        resolve(pages);
      } catch (e) {
        reject(e);
      }
    });
    
    // Parse the PDF file
    parser.loadPDF(filePath);
  });
}

async function main() {
  if (!fs.existsSync(manualsDir)) {
    console.warn('No manuals directory found at', manualsDir);
    process.exit(0);
  }

  const files = fs.existsSync(manualsDir)
    ? fs.readdirSync(manualsDir).filter(f => f.toLowerCase().endsWith('.pdf'))
    : [];
  const result = {};

  for (const f of files) {
    const full = path.join(manualsDir, f);
    console.log('Processing', f);
    try {
      const pages = await extractTextFromPdf(full);
      result[f] = { name: f, pages, numPages: pages.length };
      console.log(`  ✓ Extracted ${pages.length} pages`);
    } catch (e) {
      console.error('Failed to process', f, ':', e.message || e);
      result[f] = { name: f, pages: [], error: e.message };
    }
  }

  // Ensure output dir exists
  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
  console.log('✓ Wrote parsed manuals to', outFile);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
