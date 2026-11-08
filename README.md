# AVR Tech Labs — Document Studio 📄✨

> **61 Free, Private, Browser-Based PDF & Image Tools.**  
> Zero server uploads. Fast client-side processing using WebAssembly and Web APIs.

![AVR Tech Labs Document Studio](https://via.placeholder.com/1200x630.png?text=AVR+Tech+Labs+Document+Studio)

---

## 🚀 Overview

**AVR Tech Labs Document Studio** is an all-in-one, privacy-first web workspace offering 61 practical utilities for handling PDFs and images directly inside the user's browser. Built without backend processing dependencies, all computations occur locally on the user's machine, ensuring documents never leave the client environment.

---

## ✨ Features & Highlights

- **🔒 100% Client-Side Privacy:** No document or image uploads to any remote server. Zero risk of data leaks.
- **⚡ Fast Processing:** Powered by HTML5 Canvas API, PDF-Lib, PDF.js, JSZip, and Tesseract.js.
- **🎨 Modern Responsive UI:** Built with custom vanilla CSS variables, interactive drag-and-drop workspace, light/dark themes, and quick-search navigation.
- **📂 Zero-Install & Lightweight:** Runs out of the box with static files; easily deployable to GitHub Pages, Netlify, or Vercel.
- **★ Favorites & Recent Tools:** Browser `localStorage` integration keeps your frequent workflow ready.

---

## 🛠️ Complete Toolkit Breakdown (61 Tools)

### ▤ PDF Tools (35)
- **Document Management:** Merge PDF, Extract PDF Pages, Split PDF into Pages, Remove Pages, Reorder Pages, Reverse Pages.
- **Page Layout & Transformation:** Rotate All Pages, Rotate Selected, Rotate Odd/Even, Crop Margins, Resize Pages (A4/Letter), 2-Up & 4-Up Sheets, Booklet Layout.
- **Content & Annotation:** Add Text, Header & Footer, Add Blank Pages, Duplicate Pages, Draw Borders, Date Stamp, Watermark PDF, Add Page Numbers.
- **Conversion & Compression:** Images to PDF, Text to PDF, PDF to Images (ZIP), Compress PDF, Grayscale PDF, Flatten PDF Forms.
- **Inspection & Data:** Extract Selectable Text, PDF Document Information, Edit Metadata, Inspect Page Dimensions.

### ▧ Image Tools (26)
- **Formatting & Sizing:** Resize Image, Crop by Pixels, Convert Format (PNG/JPG/WebP), Compress Quality, Rotate & Mirror, Rotate by Custom Angle.
- **Creative Effects & Filters:** Grayscale, Sepia, Invert Colors, Brightness & Contrast, Color Tint, Blur, Pixelate Mosaic, Add Border Frame.
- **Shapes & Avatar Framing:** Circular PNG Crop, Rounded Corner Framing.
- **Utility & Productivity:** Watermark Overlay, Extract Color Palette, Image to Base64, Base64 to Image, Image Information Inspector.
- **Advanced Tools:** Passport Photo Maker & PDF Print Sheet, Batch Thumbnails (ZIP), Image Contact Sheet Grid, Favicon & App Icon Generator (ZIP), In-Browser OCR (Image to Text via Tesseract.js).

---

## 🏗️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, Modern JavaScript (ES6+)
- **Typography:** DM Sans, Manrope (Google Fonts)
- **Client-Side Engines & Libraries:**
  - [pdf-lib](https://github.com/Hopding/pdf-lib) – Local PDF creation and modification
  - [pdf.js](https://github.com/mozilla/pdf.js) – PDF parsing, rasterization, and text rendering
  - [JSZip](https://github.com/Stuk/jszip) – In-memory ZIP archive generation
  - [Tesseract.js](https://github.com/naptha/tesseract.js) – Pure client-side Optical Character Recognition (OCR)
  - HTML5 Canvas & Web API – Fast 2D raster image transformations

---

## 📁 Project Structure

```text
avr-document-studio/
├── index.html       # Application shell, layout, and library loader
├── style.css        # Responsive layouts, workbench grids, and theme variables
├── script.js        # Core tool registry, Canvas pipelines, and PDF workflows
└── README.md        # Documentation
