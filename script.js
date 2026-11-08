"use strict";

window.avrLibrariesReady.then((libraryStatus) => {
  const tool = (id, name, description, category, icon, tone, accept, multiple, fields = [], extra = {}) => ({
    id, name, description, category, icon, tone, accept, multiple, fields, ...extra
  });
  const field = (id, label, type = "text", value = "", options = [], help = "", placeholder = "") => ({ id, label, type, value, options, help, placeholder });

  const tools = [
    tool("merge", "Merge PDF", "Combine documents in the order you choose.", "pdf", "▤", "purple", ".pdf,application/pdf", true),
    tool("split", "Extract PDF pages", "Save selected pages as a new PDF.", "pdf", "⛶", "orange", ".pdf,application/pdf", false, [field("pages", "Pages to extract", "text", "1", [], "Use page numbers and ranges, e.g. 1, 3-5.")]),
    tool("split-all", "Split PDF into pages", "Create a separate PDF for every page.", "pdf", "⫶", "blue", ".pdf,application/pdf", false),
    tool("remove-pages", "Remove PDF pages", "Delete selected pages and keep the rest.", "pdf", "−", "pink", ".pdf,application/pdf", false, [field("pages", "Pages to remove", "text", "1", [], "Use page numbers and ranges, e.g. 1, 3-5.")]),
    tool("reorder-pages", "Reorder PDF pages", "Arrange every page in a custom sequence.", "pdf", "↕", "purple", ".pdf,application/pdf", false, [field("sequence", "New page order", "text", "", [], "Enter every page once, in the order you want.")]),
    tool("rotate-pdf", "Rotate all pages", "Rotate every page in a PDF.", "pdf", "↻", "blue", ".pdf,application/pdf", false, [field("rotation", "Rotation", "select", "90", [["90", "90° clockwise"], ["180", "180°"], ["270", "90° counterclockwise"]])]),
    tool("rotate-selected", "Rotate selected pages", "Rotate just the pages you specify.", "pdf", "⤾", "teal", ".pdf,application/pdf", false, [field("pages", "Pages to rotate", "text", "1", [], "Use page numbers and ranges, e.g. 1, 3-5."), field("rotation", "Rotation", "select", "90", [["90", "90° clockwise"], ["180", "180°"], ["270", "90° counterclockwise"]])]),
    tool("watermark", "Watermark PDF", "Stamp custom text onto every page.", "pdf", "T", "pink", ".pdf,application/pdf", false, [field("text", "Watermark text", "text", "CONFIDENTIAL"), field("opacity", "Opacity", "select", "0.22", [["0.1", "Subtle"], ["0.22", "Medium"], ["0.45", "Bold"]])]),
    tool("page-numbers", "Add page numbers", "Number every page with your chosen starting number.", "pdf", "#", "green", ".pdf,application/pdf", false, [field("start", "Start numbering at", "number", "1"), field("position", "Position", "select", "bottom-center", [["bottom-center", "Bottom center"], ["bottom-right", "Bottom right"], ["top-center", "Top center"]])]),
    tool("pdf-to-images", "PDF to images", "Export each page as a PNG or JPG image.", "pdf", "▧", "green", ".pdf,application/pdf", false, [field("format", "Image format", "select", "png", [["png", "PNG"], ["jpeg", "JPG"]]), field("scale", "Image resolution", "select", "1.5", [["1", "Standard"], ["1.5", "High"], ["2", "Best"]])]),
    tool("images-to-pdf", "Images to PDF", "Combine photos into a single PDF.", "pdf", "▣", "yellow", "image/*", true, [field("page-size", "Page size", "select", "fit", [["fit", "Fit to image"], ["a4", "A4"], ["letter", "Letter"]]), field("fit", "Image placement", "select", "contain", [["contain", "Fit whole image"], ["cover", "Fill page (crop)"]])]),
    tool("compress-pdf", "Compress PDF", "Reduce size by optimizing pages for sharing.", "pdf", "⇣", "orange", ".pdf,application/pdf", false, [field("quality", "Image quality", "select", "0.72", [["0.5", "Smaller file"], ["0.72", "Balanced"], ["0.88", "Higher quality"]]), field("target-size", "Target file size (optional)", "number", "", [], "Attempts to meet this maximum; results depend on document content."), field("size-unit", "Size unit", "select", "mb", [["kb", "KB"], ["mb", "MB"]])], { note: "To reduce size, pages are converted to images; selectable text and links won't be preserved. Target size is best effort." }),
    tool("grayscale-pdf", "Grayscale PDF", "Convert PDF pages to black and white.", "pdf", "◐", "blue", ".pdf,application/pdf", false, [field("quality", "Image quality", "select", "0.88", [["0.5", "Smaller file"], ["0.72", "Balanced"], ["0.88", "Higher quality"]])], { note: "Pages are converted to images; selectable text and links won't be preserved." }),
    tool("extract-text", "Extract PDF text", "Read selectable text and save it as a text file.", "pdf", "≡", "teal", ".pdf,application/pdf", false),
    tool("pdf-info", "PDF information", "View page count, size and document metadata.", "pdf", "ⓘ", "purple", ".pdf,application/pdf", false),
    tool("edit-metadata", "Edit PDF metadata", "Update the title, author and subject.", "pdf", "✎", "yellow", ".pdf,application/pdf", false, [field("title", "Document title", "text", ""), field("author", "Author", "text", ""), field("subject", "Subject", "text", "")]),
    tool("blank-pages", "Add blank pages", "Insert blank pages into your PDF.", "pdf", "＋", "green", ".pdf,application/pdf", false, [field("after", "Insert after page", "number", "0", [], "0 means add to the beginning."), field("count", "Number of blank pages", "number", "1")]),
    tool("duplicate-pages", "Duplicate PDF pages", "Add a copy of selected pages after each original.", "pdf", "▢", "pink", ".pdf,application/pdf", false, [field("pages", "Pages to duplicate", "text", "1", [], "Use page numbers and ranges, e.g. 1, 3-5.")]),
    tool("crop-pdf", "Crop PDF margins", "Trim page margins by setting new printable bounds.", "pdf", "▣", "purple", ".pdf,application/pdf", false, [field("top", "Top (pt)", "number", "18"), field("right", "Right (pt)", "number", "18"), field("bottom", "Bottom (pt)", "number", "18"), field("left", "Left (pt)", "number", "18")], { note: "PDF measurements use points (72 pt = 1 inch). Content outside the crop is hidden, not erased." }),
    tool("reverse-pages", "Reverse page order", "Reverse the order of every page in a PDF.", "pdf", "⇅", "blue", ".pdf,application/pdf", false),
    tool("add-text-pdf", "Add text to PDF", "Place custom text on every page.", "pdf", "Aa", "teal", ".pdf,application/pdf", false, [field("text", "Text to add", "text", "AVR Tech Labs"), field("position", "Position", "select", "bottom-right", [["top-left", "Top left"], ["top-center", "Top center"], ["center", "Center"], ["bottom-left", "Bottom left"], ["bottom-center", "Bottom center"], ["bottom-right", "Bottom right"]]), field("size", "Font size (pt)", "number", "14")]),
    tool("header-footer", "Add header & footer", "Add optional header and footer text to each page.", "pdf", "☷", "green", ".pdf,application/pdf", false, [field("header", "Header text", "text", ""), field("footer", "Footer text", "text", ""), field("size", "Font size (pt)", "number", "9")]),
    tool("page-dimensions", "PDF page dimensions", "List each page's width, height and orientation.", "pdf", "↔", "yellow", ".pdf,application/pdf", false),
    tool("resize-pdf", "Resize PDF pages", "Scale page content to A4, Letter or original size.", "pdf", "⤢", "orange", ".pdf,application/pdf", false, [field("size", "Target page size", "select", "a4", [["a4", "A4 portrait"], ["letter", "US Letter portrait"], ["original", "Keep each original size"]]), field("size-unit", "File size unit", "select", "mb", [["kb", "KB"], ["mb", "MB"]]), field("target-size", "Custom output file size (maximum)", "number", "", [], "Enter your desired maximum file size. The result is best effort; resizing this PDF to a file size rasterizes its pages.", "Enter size")], { note: "Pages are redrawn to the chosen paper size. Setting a custom file size also rasterizes pages, so selectable text and links won't be retained." }),
    tool("flatten-forms", "Flatten PDF forms", "Bake form fields into the page appearance.", "pdf", "▰", "pink", ".pdf,application/pdf", false, [], { note: "Form fields become part of the page and can no longer be edited." }),
    tool("text-to-pdf", "Text to PDF", "Create a clean PDF document from typed text.", "pdf", "Aa", "teal", "", false, [field("text", "Document text", "textarea", "", [], "Enter or paste text to turn into a PDF."), field("size", "Font size", "number", "12")], { noFile: true }),
    tool("booklet-pdf", "Booklet layout", "Arrange pages in print-ready booklet order.", "pdf", "▤", "purple", ".pdf,application/pdf", false, [], { note: "Creates landscape sheets with two reduced pages. Print double-sided and fold the sheets." }),
    tool("two-up-pdf", "2 pages per sheet", "Place two consecutive pages side by side.", "pdf", "Ⅱ", "blue", ".pdf,application/pdf", false, [], { note: "Pages are redrawn on landscape sheets; form fields and links may not be retained." }),
    tool("four-up-pdf", "4 pages per sheet", "Arrange four PDF pages on each landscape sheet.", "pdf", "▦", "orange", ".pdf,application/pdf", false, [], { note: "Pages are redrawn on landscape sheets; form fields and links may not be retained." }),
    tool("odd-pages-pdf", "Extract odd pages", "Create a new PDF with odd-numbered pages.", "pdf", "1·3", "pink", ".pdf,application/pdf", false),
    tool("even-pages-pdf", "Extract even pages", "Create a new PDF with even-numbered pages.", "pdf", "2·4", "green", ".pdf,application/pdf", false),
    tool("border-pdf", "Add page borders", "Draw a neat border around every PDF page.", "pdf", "▣", "yellow", ".pdf,application/pdf", false, [field("inset", "Inset from page edge (pt)", "number", "18"), field("thickness", "Line thickness (pt)", "number", "1"), field("color", "Border color", "color", "#6b5ce7")]),
    tool("date-stamp-pdf", "Date stamp PDF", "Stamp today's date on every page.", "pdf", "◷", "teal", ".pdf,application/pdf", false, [field("date-format", "Date format", "select", "long", [["long", "November 6, 2026"], ["iso", "2026-11-06"], ["short", "06/11/2026"]]), field("position", "Position", "select", "bottom-right", [["top-left", "Top left"], ["top-right", "Top right"], ["bottom-left", "Bottom left"], ["bottom-right", "Bottom right"]])]),
    tool("rotate-odd-pdf", "Rotate odd pages", "Rotate only odd-numbered PDF pages.", "pdf", "↻1", "blue", ".pdf,application/pdf", false, [field("rotation", "Rotation", "select", "90", [["90", "90° clockwise"], ["180", "180°"], ["270", "90° counterclockwise"]])]),
    tool("rotate-even-pdf", "Rotate even pages", "Rotate only even-numbered PDF pages.", "pdf", "↻2", "purple", ".pdf,application/pdf", false, [field("rotation", "Rotation", "select", "90", [["90", "90° clockwise"], ["180", "180°"], ["270", "90° counterclockwise"]])]),

    tool("resize-image", "Resize image", "Change an image's pixel dimensions and optionally target a file size.", "image", "↔", "blue", "image/*", false, [field("width", "Width (px)", "number", "", [], "", "Enter size"), field("height", "Height (px)", "number", "", [], "", "Enter size"), field("fit-mode", "Fit dimensions", "select", "contain", [["contain", "Fit inside"], ["cover", "Fill and crop"], ["stretch", "Stretch"]]), field("background", "Canvas background", "color", "#ffffff"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]]), field("quality", "Quality", "select", "0.9", [["0.65", "Smaller"], ["0.8", "Balanced"], ["0.95", "Best"]]), field("size-unit", "File size unit", "select", "kb", [["kb", "KB"], ["mb", "MB"]]), field("target-size", "Custom output file size (maximum)", "number", "", [], "Enter your desired maximum file size. The result is best effort; JPG/WebP can adjust compression quality.", "Enter size")], { note: "The optional target is best effort. PNG size may not change when quality is adjusted; choose JPG or WebP to control compression quality." }),
    tool("crop-image", "Crop image", "Crop a region using pixel coordinates.", "image", "◩", "purple", "image/*", false, [field("crop", "Crop: x, y, width, height", "text", "", [], "Coordinates are measured from the top-left corner.")]),
    tool("convert-image", "Convert image format", "Convert an image to PNG, JPG or WebP.", "image", "⟳", "teal", "image/*", false, [field("format", "Output format", "select", "image/jpeg", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]]), field("quality", "Quality", "select", "0.9", [["0.65", "Smaller"], ["0.8", "Balanced"], ["0.95", "Best"]])]),
    tool("compress-image", "Compress image", "Export a smaller JPG or WebP image.", "image", "⇣", "orange", "image/*", false, [field("format", "Output format", "select", "image/jpeg", [["image/jpeg", "JPG"], ["image/webp", "WebP"]]), field("quality", "Quality", "select", "0.7", [["0.4", "Smaller"], ["0.7", "Balanced"], ["0.85", "Higher quality"]])]),
    tool("rotate-image", "Rotate & flip image", "Rotate or mirror an image.", "image", "↻", "pink", "image/*", false, [field("rotation", "Rotation", "select", "90", [["0", "No rotation"], ["90", "90° clockwise"], ["180", "180°"], ["270", "90° counterclockwise"]]), field("flip", "Flip", "select", "none", [["none", "No flip"], ["horizontal", "Flip horizontally"], ["vertical", "Flip vertically"]]), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("grayscale-image", "Grayscale image", "Make a grayscale copy of an image.", "image", "◐", "teal", "image/*", false, [field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("image-to-base64", "Image to Base64", "Encode an image as a Base64 data URL.", "image", "⇢", "purple", "image/*", false),
    tool("base64-to-image", "Base64 to image", "Decode an image data URL and download it.", "image", "⇠", "green", "", false, [field("base64", "Image data URL or Base64", "textarea", "", [], "Paste an image data URL or raw Base64 string.")], { noFile: true }),
    tool("image-palette", "Image color palette", "Find the most common colors in an image.", "image", "◉", "yellow", "image/*", false, [field("colors", "Number of colors", "select", "6", [["4", "4 colors"], ["6", "6 colors"], ["8", "8 colors"], ["12", "12 colors"]])]),
    tool("image-watermark", "Watermark image", "Overlay custom text on an image.", "image", "T", "pink", "image/*", false, [field("text", "Watermark text", "text", "AVR TECH LABS"), field("opacity", "Opacity", "select", "0.55", [["0.25", "Subtle"], ["0.55", "Medium"], ["0.8", "Bold"]]), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("image-info", "Image information", "View dimensions, file type and file size.", "image", "ⓘ", "blue", "image/*", false),
    tool("ocr-image", "Image to text (OCR)", "Recognize printed English text in an image.", "image", "Aa", "orange", "image/*", false, [], { note: "OCR loads a language model from the internet; your image is processed in your browser." }),
    tool("blur-image", "Blur image", "Soften an image with an adjustable blur.", "image", "◌", "teal", "image/*", false, [field("blur", "Blur strength (px)", "number", "4"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("pixelate-image", "Pixelate image", "Create a blocky mosaic effect.", "image", "▦", "purple", "image/*", false, [field("pixel-size", "Pixel block size", "number", "12"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("border-image", "Add image border", "Add a custom color frame around an image.", "image", "▣", "orange", "image/*", false, [field("border-width", "Border width (px)", "number", "24"), field("border-color", "Border color", "color", "#6b5ce7"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("sepia-image", "Sepia image", "Give a photo a warm vintage look.", "image", "◉", "orange", "image/*", false, [field("format", "Output format", "select", "image/jpeg", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("invert-image", "Invert image colors", "Create a negative by inverting every color.", "image", "◐", "purple", "image/*", false, [field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("adjust-image", "Brightness & contrast", "Tune brightness and contrast for an image.", "image", "☼", "yellow", "image/*", false, [field("brightness", "Brightness (%)", "number", "110"), field("contrast", "Contrast (%)", "number", "110"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("tint-image", "Color tint image", "Blend a custom color over your image.", "image", "◒", "pink", "image/*", false, [field("tint", "Tint color", "color", "#755fe8"), field("strength", "Tint strength (%)", "number", "25"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("circle-image", "Circular image crop", "Make a centered round PNG avatar.", "image", "◯", "teal", "image/*", false, []),
    tool("rounded-image", "Rounded-corner image", "Clip an image into a rounded rectangle.", "image", "▢", "green", "image/*", false, [field("radius", "Corner radius (px)", "number", "32"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("rotate-angle-image", "Rotate image by angle", "Rotate an image by any angle from 0 to 360°.", "image", "⤾", "blue", "image/*", false, [field("angle", "Angle (degrees)", "number", "15"), field("background", "Background color", "color", "#ffffff"), field("format", "Output format", "select", "image/png", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("thumbnails-image", "Batch thumbnails", "Create small preview images for multiple files.", "image", "▧", "purple", "image/*", true, [field("width", "Thumbnail width (px)", "number", "320"), field("format", "Output format", "select", "image/jpeg", [["image/png", "PNG"], ["image/jpeg", "JPG"], ["image/webp", "WebP"]])]),
    tool("contact-sheet-image", "Image contact sheet", "Combine selected images into a labeled grid.", "image", "▦", "teal", "image/*", true, [field("columns", "Columns", "select", "3", [["2", "2 columns"], ["3", "3 columns"], ["4", "4 columns"]]), field("cell", "Cell size (px)", "number", "220")]),
    tool("favicon-image", "Favicon & app icons", "Generate common favicon and app icon sizes.", "image", "✦", "yellow", "image/*", false, [field("fit", "Icon crop", "select", "cover", [["cover", "Fill and crop"], ["contain", "Fit inside"]]), field("background", "Background color", "color", "#ffffff")]),
    tool("passport-photo", "Passport photo & print sheet", "Create a custom-size ID photo and a multi-photo print sheet.", "image", "▣", "teal", "image/*", false, [field("unit", "Measurement unit", "select", "mm", [["mm", "Millimeters (mm)"], ["cm", "Centimeters (cm)"], ["in", "Inches (in)"]]), field("photo-width", "Photo width", "number", "35"), field("photo-height", "Photo height", "number", "45"), field("dpi", "Print resolution (DPI)", "select", "300", [["150", "150 DPI"], ["300", "300 DPI"], ["600", "600 DPI"]]), field("fit", "Photo fit", "select", "cover", [["cover", "Fill frame and crop"], ["contain", "Fit whole photo"]]), field("background", "Background color", "color", "#ffffff"), field("columns", "Sheet columns", "number", "3"), field("rows", "Sheet rows", "number", "3"), field("photo-gap", "Gap between photos", "number", "3"), field("format", "Image format", "select", "image/jpeg", [["image/jpeg", "JPG"], ["image/png", "PNG"], ["image/webp", "WebP"]]), field("quality", "Image quality", "select", "0.92", [["0.75", "Smaller"], ["0.92", "High"], ["0.98", "Best"]])], { note: "Width, height, and photo gap use your chosen unit. Exports a ZIP with one crop and a print-ready sheet. Background color fills the canvas; it does not remove the photo's existing background." })
  ];

  function loadStoredIds(key, limit) {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(saved)
        ? saved.filter((id) => tools.some((item) => item.id === id)).slice(0, limit)
        : [];
    } catch {
      return [];
    }
  }
  function storeIds(key, ids) {
    try { localStorage.setItem(key, JSON.stringify(ids)); }
    catch { /* Saved tools remain available for this page session. */ }
  }

  const state = {
    active: "merge",
    filter: "all",
    files: [],
    busy: false,
    options: {},
    favorites: loadStoredIds("avr-document-studio-favorites", tools.length),
    recent: loadStoredIds("avr-document-studio-recent", 6),
    passportPreviewUrl: ""
  };
  const $ = (selector) => document.querySelector(selector);
  const byId = (id) => document.getElementById(id);
  const fileInput = byId("file-input");
  const fileList = byId("file-list");
  const dropZone = byId("drop-zone");
  const result = byId("result-message");
  const optionsPanel = byId("options-panel");
  const processButton = byId("process-button");
  const pdfLib = () => {
    if (!window.PDFLib) throw new Error("The PDF toolkit did not load. Check your internet connection and reload.");
    return window.PDFLib;
  };
  if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.PDFJS_WORKER_SRC;
  const engineStatus = byId("engine-status");
  const missingLibraries = [
    !libraryStatus.pdfLib && "PDF editing",
    !libraryStatus.pdfJs && "PDF rendering",
    !libraryStatus.zip && "ZIP exports"
  ].filter(Boolean);
  if (missingLibraries.length) {
    engineStatus.classList.add("engine-warning");
    engineStatus.querySelector("span").textContent = `Unavailable: ${missingLibraries.join(", ")}`;
    engineStatus.title = "Check your internet connection and reload to restore these tools.";
  } else {
    engineStatus.classList.add("engine-ready");
    engineStatus.querySelector("span").textContent = "All tools ready";
    engineStatus.title = "PDF editing, rendering, and ZIP export libraries are loaded.";
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function activeTool() { return tools.find((item) => item.id === state.active); }
  function formatSize(bytes) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }
  function cleanName(name) { return name.replace(/\.[^.]+$/, "").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") || "file"; }
  function value(id) { return byId(id)?.value ?? ""; }

  function renderCards() {
    const query = byId("tool-search").value.trim().toLowerCase();
    const counts = {
      all: tools.length,
      pdf: tools.filter((item) => item.category === "pdf").length,
      image: tools.filter((item) => item.category === "image").length
    };
    document.querySelectorAll("[data-tool-count]").forEach((counter) => {
      counter.textContent = counts[counter.dataset.toolCount];
    });
    const visible = tools.filter((item) => {
      const matchesFilter = state.filter === "all"
        || (state.filter === "favorites" ? state.favorites.includes(item.id) : item.category === state.filter);
      return matchesFilter && (!query || `${item.name} ${item.description}`.toLowerCase().includes(query));
    });
    byId("tool-grid").innerHTML = visible.map((item) =>
      `<article class="tool-card ${state.active === item.id ? "selected" : ""}" data-tool-card="${item.id}"><button class="tool-card-open" type="button" data-open-tool="${item.id}" aria-pressed="${state.active === item.id}" aria-label="Open ${escapeHtml(item.name)}"><span class="tool-icon tone-${item.tone}">${item.icon}</span><span class="tool-arrow" aria-hidden="true">↗</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small></button><button class="favorite-toggle ${state.favorites.includes(item.id) ? "is-favorite" : ""}" type="button" data-favorite="${item.id}" aria-pressed="${state.favorites.includes(item.id)}" aria-label="${state.favorites.includes(item.id) ? "Remove" : "Add"} ${escapeHtml(item.name)} ${state.favorites.includes(item.id) ? "from" : "to"} favorites" title="${state.favorites.includes(item.id) ? "Remove from" : "Add to"} favorites">${state.favorites.includes(item.id) ? "★" : "☆"}</button></article>`
    ).join("");
    byId("results-count").textContent = `${visible.length} ${visible.length === 1 ? "tool" : "tools"}`;
    byId("favorite-count").textContent = state.favorites.length;
    byId("empty-state").textContent = state.filter === "favorites" && !state.favorites.length
      ? "No saved tools yet. Tap the star on any tool to add it here."
      : "No tools match that search. Try another keyword.";
    byId("empty-state").hidden = visible.length > 0;
  }

  function renderRecent() {
    const row = byId("recent-row");
    const recent = state.recent.map((id) => tools.find((item) => item.id === id)).filter(Boolean);
    row.hidden = recent.length === 0;
    byId("recent-tools").innerHTML = recent.map((item) =>
      `<button type="button" class="quick-link" data-recent="${item.id}"><span>${item.icon}</span>${escapeHtml(item.name)}</button>`
    ).join("");
  }

  function renderFields(item) {
    const savedOptions = state.options[item.id] || {};
    const fields = [...item.fields, field("output-name", "Output file name", "text", "", [], "Optional. The tool will keep the correct file extension.")];
    byId("options-panel").innerHTML = `${fields.map((input) => {
      const inputValue = Object.hasOwn(savedOptions, input.id) ? savedOptions[input.id] : input.value;
      const help = input.help ? `<span class="option-help">${escapeHtml(input.help)}</span>` : "";
      let control;
      if (input.type === "select") {
        control = `<select id="${input.id}">${input.options.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === inputValue ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>`;
      } else if (input.type === "textarea") {
        control = `<textarea id="${input.id}" placeholder="${escapeHtml(input.help || "")}">${escapeHtml(inputValue)}</textarea>`;
      } else {
        const numericAttributes = input.type === "number"
          ? input.id === "target-size" ? 'min="0.1" step="0.1"' : 'min="0" step="1"'
          : "";
        control = `<input id="${input.id}" type="${input.type}" value="${escapeHtml(inputValue)}" ${numericAttributes} placeholder="${escapeHtml(input.placeholder || (input.type === "number" ? "Leave blank for original" : ""))}">`;
      }
      return `<label class="option-field"><span class="option-label">${escapeHtml(input.label)}</span>${help}${control}</label>`;
    }).join("")}<button type="button" class="reset-options" id="reset-options">Reset this tool's options</button>`;
    if (item.id === "passport-photo") {
      updatePassportUnitLabels(value("unit") || "mm");
      renderPassportAdjustments();
    }
  }

  function clearPassportPreview() {
    if (state.passportPreviewUrl) URL.revokeObjectURL(state.passportPreviewUrl);
    state.passportPreviewUrl = "";
    byId("passport-editor").hidden = true;
    byId("passport-preview").removeAttribute("src");
    byId("passport-adjustments").replaceChildren();
  }

  function renderPassportAdjustments() {
    const container = byId("passport-adjustments");
    if (activeTool().id !== "passport-photo" || !state.files.length) {
      container.replaceChildren();
      return;
    }
    const savedOptions = state.options[activeTool().id] || {};
    container.innerHTML = [
      ["brightness", "Brightness", 50, 150],
      ["contrast", "Contrast", 50, 150],
      ["saturation", "Colour", 0, 200]
    ].map(([id, label, min, max]) => {
      const current = savedOptions[id] || "100";
      return `<label class="passport-adjustment" for="${id}"><span>${label}<output for="${id}">${escapeHtml(current)}%</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="1" value="${escapeHtml(current)}" aria-valuetext="${escapeHtml(current)}%"></label>`;
    }).join("");
  }

  function updatePassportEditor() {
    const editor = byId("passport-editor");
    if (activeTool().id !== "passport-photo" || !state.files.length) {
      clearPassportPreview();
      return;
    }
    if (state.passportPreviewUrl) URL.revokeObjectURL(state.passportPreviewUrl);
    state.passportPreviewUrl = URL.createObjectURL(state.files[0]);
    const preview = byId("passport-preview");
    preview.src = state.passportPreviewUrl;
    editor.hidden = false;
    updatePassportPreview();
  }

  function updatePassportPreview() {
    const preview = byId("passport-preview");
    const width = Number(value("photo-width")) || 35;
    const height = Number(value("photo-height")) || 45;
    preview.style.aspectRatio = `${width} / ${height}`;
    preview.style.objectFit = value("fit") === "contain" ? "contain" : "cover";
    preview.style.backgroundColor = value("background") || "#ffffff";
    preview.style.filter = `brightness(${value("brightness") || 100}%) contrast(${value("contrast") || 100}%) saturate(${value("saturation") || 100}%)`;
    byId("passport-adjustments").querySelectorAll('input[type="range"]').forEach((input) => {
      input.setAttribute("aria-valuetext", `${input.value}%`);
      const output = byId("passport-adjustments").querySelector(`output[for="${input.id}"]`);
      if (output) output.value = `${input.value}%`;
    });
  }

  function updatePassportUnitLabels(unit) {
    const suffix = unit === "in" ? "in" : unit;
    for (const [id, label] of [["photo-width", "Photo width"], ["photo-height", "Photo height"], ["photo-gap", "Gap between photos"]]) {
      const control = byId(id);
      if (control) control.closest(".option-field").querySelector(".option-label").textContent = `${label} (${suffix})`;
    }
  }

  function renderFiles() {
    fileList.innerHTML = state.files.map((file, index) => {
      const image = file.type.startsWith("image/");
      const sortable = state.active === "merge" || state.active === "images-to-pdf";
      return `<div class="file-row"><span class="file-type">${image ? "IMG" : "PDF"}</span><div class="file-row-info"><div class="file-row-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div><div class="file-row-size">${formatSize(file.size)}</div></div>${sortable ? `<span class="file-order"><button type="button" data-move="${index}" data-step="-1" aria-label="Move up" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" data-move="${index}" data-step="1" aria-label="Move down" ${index === state.files.length - 1 ? "disabled" : ""}>↓</button></span>` : ""}<button type="button" class="remove-file" data-remove="${index}" aria-label="Remove file">×</button></div>`;
    }).join("");
    fileList.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
      state.files.splice(Number(button.dataset.remove), 1);
      renderFiles();
      if (state.active === "passport-photo") {
        renderFields(activeTool());
        updatePassportEditor();
      }
    }));
    fileList.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => {
      const from = Number(button.dataset.move);
      const to = from + Number(button.dataset.step);
      if (to < 0 || to >= state.files.length) return;
      [state.files[from], state.files[to]] = [state.files[to], state.files[from]];
      renderFiles();
    }));
  }

  function selectTool(id, scroll = false) {
    const item = tools.find((entry) => entry.id === id);
    if (!item || state.busy) return;
    state.active = id;
    state.recent = [id, ...state.recent.filter((recentId) => recentId !== id)].slice(0, 6);
    storeIds("avr-document-studio-recent", state.recent);
    renderRecent();
    state.files = [];
    clearPassportPreview();
    fileInput.value = "";
    fileInput.multiple = item.multiple;
    fileInput.accept = item.accept;
    fileInput.hidden = item.noFile === true;
    dropZone.hidden = item.noFile === true;
    byId("workspace-icon").textContent = item.icon;
    byId("workspace-icon").className = `active-tool-icon tone-${item.tone}`;
    byId("workspace-category").textContent = `${item.category.toUpperCase()} TOOL`;
    byId("workspace-title").textContent = item.name;
    byId("workspace-hint").textContent = item.description;
    byId("drop-title").textContent = item.multiple ? `Drop ${item.category === "image" ? "image files" : "PDF files"} here` : `Drop a ${item.category === "image" ? "image" : "PDF"} file here`;
    $("#file-note").textContent = item.note || (item.category === "image" ? "Image files · Up to 25 MB each" : "PDF files · Up to 50 MB each");
    byId("process-label").textContent = item.name;
    result.hidden = true;
    byId("progress-wrap").hidden = true;
    renderFields(item);
    renderFiles();
    updatePassportEditor();
    if (scroll) byId("workspace").scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelectorAll("[data-tool-card]").forEach((card) => {
      const selected = card.dataset.toolCard === id;
      card.classList.toggle("selected", selected);
      card.querySelector("[data-open-tool]").setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll(".quick-link").forEach((button) => button.classList.toggle("quick-active", button.dataset.quick === id));
  }

  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll(".filter-tab").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    document.querySelectorAll(".nav-filter").forEach((button) => button.classList.toggle("active", button.dataset.view === filter));
    renderCards();
  }

  function showMessage(message, isError = false) {
    result.textContent = message;
    result.classList.toggle("error", isError);
    result.hidden = false;
  }
  function showTextOutput(message, text) {
    result.replaceChildren();
    const heading = document.createElement("div");
    heading.textContent = message;
    const area = document.createElement("textarea");
    area.readOnly = true;
    area.value = text;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "browse-button";
    copy.textContent = "Copy text";
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(text); copy.textContent = "Copied"; }
      catch { area.focus(); area.select(); document.execCommand("copy"); copy.textContent = "Copied"; }
    });
    result.append(heading, area, copy);
    result.classList.remove("error");
    result.hidden = false;
  }
  function setProgress(percent, message) {
    byId("progress-wrap").hidden = false;
    byId("progress-message").textContent = message;
    byId("progress-percent").textContent = `${Math.round(percent)}%`;
    byId("progress-bar").style.width = `${percent}%`;
  }
  function downloadBlob(blob, filename) {
    const customName = value("output-name").trim();
    if (customName) {
      const extension = filename.match(/\.[^.]+$/)?.[0] || "";
      const safeBase = customName
        .replace(/\.[^.]+$/, "")
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
        .replace(/[. ]+$/g, "")
        .trim();
      filename = `${safeBase || "output"}${extension}`;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }
  function downloadText(text, filename, mime = "text/plain") {
    downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), filename);
  }
  function getSingleFile() {
    if (!state.files[0]) throw new Error("Choose a file first.");
    return state.files[0];
  }
  function parsePages(text, total) {
    const resultSet = new Set();
    const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
    if (!parts.length) throw new Error("Enter one or more page numbers.");
    for (const part of parts) {
      const match = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
      if (!match) throw new Error(`Invalid page range "${part}". Use values like 1, 3-5.`);
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : start;
      if (start < 1 || end < start || end > total) throw new Error(`Page range "${part}" is outside this PDF. It has ${total} pages.`);
      for (let page = start; page <= end; page++) resultSet.add(page - 1);
    }
    return [...resultSet].sort((a, b) => a - b);
  }
  async function loadPdf(file) {
    const { PDFDocument } = pdfLib();
    return PDFDocument.load(await file.arrayBuffer());
  }
  async function savePdf(document, filename) {
    const bytes = await document.save();
    downloadBlob(new Blob([bytes], { type: "application/pdf" }), filename);
  }
  async function renderPdf(file, { scale = 1.5, grayscale = false } = {}) {
    if (!window.pdfjsLib) throw new Error("The PDF rendering library did not load. Check your internet connection and reload.");
    return window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise.then(async (pdf) => {
      const pages = [];
      for (let number = 1; number <= pdf.numPages; number++) {
        setProgress(((number - 1) / pdf.numPages) * 90, `Rendering page ${number} of ${pdf.numPages}…`);
        const page = await pdf.getPage(number);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (grayscale) context.filter = "grayscale(1)";
        await page.render({ canvasContext: context, viewport }).promise;
        pages.push({ canvas, width: viewport.width, height: viewport.height });
      }
      return pages;
    });
  }
  async function canvasBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The browser could not encode this image.")), type, quality));
  }
  async function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This image could not be opened by your browser.")); };
      image.src = url;
    });
  }
  function extensionFor(type) { return type === "image/jpeg" ? "jpg" : type.split("/")[1] || "png"; }
  function getTargetBytes() {
    const raw = value("target-size").trim();
    if (!raw) return 0;
    const amount = Number(raw);
    const unit = value("size-unit");
    const multiplier = unit === "kb" ? 1024 : unit === "mb" ? 1024 * 1024 : 0;
    const bytes = amount * multiplier;
    if (!Number.isFinite(bytes) || !multiplier || amount <= 0 || bytes < 1024 || bytes > 500 * 1024 * 1024) {
      throw new Error("Target size must be at least 1 KB and no more than 500 MB.");
    }
    return bytes;
  }
  async function encodeCanvas(canvas, type, quality, targetBytes = 0) {
    if (!targetBytes) return { blob: await canvasBlob(canvas, type, quality), metTarget: true };
    const candidates = [...new Set([quality, 0.85, 0.7, 0.55, 0.4, 0.25].filter((candidate) => candidate <= quality))]
      .sort((a, b) => b - a);
    let smallest;
    for (const candidate of candidates) {
      const blob = await canvasBlob(canvas, type, candidate);
      if (!smallest || blob.size < smallest.size) smallest = blob;
      if (blob.size <= targetBytes) return { blob, metTarget: true };
    }
    return { blob: smallest, metTarget: false };
  }
  function dataUrlToBlob(dataUrl) {
    const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([\s\S]+)$/i);
    const mime = match ? match[1].toLowerCase() : "image/png";
    const raw = match ? match[2] : dataUrl.replace(/\s/g, "");
    const binary = atob(raw);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  async function rasterPdf(file, grayscale = false, { targetBytes = 0, suffix } = {}) {
    const { PDFDocument } = pdfLib();
    const quality = Number(value("quality") || 0.72);
    const baseScale = quality <= 0.5 ? 1 : quality <= 0.72 ? 1.25 : 1.5;
    const scales = targetBytes
      ? [...new Set([baseScale, Math.min(baseScale, 1.1), Math.min(baseScale, 0.8), 0.55])]
      : [baseScale];
    const qualities = targetBytes
      ? [...new Set([quality, 0.7, 0.55, 0.4, 0.25].filter((candidate) => candidate <= quality))]
      : [quality];
    let best;
    let metTarget = false;
    for (let scaleIndex = 0; scaleIndex < scales.length && !metTarget; scaleIndex++) {
      const images = await renderPdf(file, { grayscale, scale: scales[scaleIndex] });
      for (const candidateQuality of qualities) {
        const output = await PDFDocument.create();
        for (let i = 0; i < images.length; i++) {
          setProgress(90 + ((i + 1) / images.length) * 9, `Optimizing at ${Math.round(scales[scaleIndex] * 100)}% resolution · page ${i + 1} of ${images.length}…`);
          const blob = await canvasBlob(images[i].canvas, "image/jpeg", candidateQuality);
          const embedded = await output.embedJpg(await blob.arrayBuffer());
          const page = output.addPage([images[i].width, images[i].height]);
          page.drawImage(embedded, { x: 0, y: 0, width: images[i].width, height: images[i].height });
        }
        const bytes = await output.save();
        const candidate = new Blob([bytes], { type: "application/pdf" });
        if (!best || candidate.size < best.size) best = candidate;
        if (targetBytes && candidate.size <= targetBytes) {
          best = candidate;
          metTarget = true;
          break;
        }
      }
      images.forEach(({ canvas }) => { canvas.width = 0; canvas.height = 0; });
    }
    const blob = best;
    downloadBlob(blob, `${cleanName(file.name)}-${suffix || (grayscale ? "grayscale" : "compressed")}.pdf`);
    setProgress(100, "Your PDF is ready.");
    if (grayscale) {
      showMessage("Converted all pages to grayscale. Text selection and links are not retained.");
      return;
    }
    const reduction = Math.round((1 - blob.size / file.size) * 100);
    const sizeMessage = targetBytes
      ? metTarget
        ? `Target reached: ${formatSize(blob.size)} (max ${formatSize(targetBytes)}).`
        : `Could not reach the ${formatSize(targetBytes)} target; smallest result was ${formatSize(blob.size)}.`
      : reduction > 0
        ? `Reduced file size by ${reduction}% (${formatSize(file.size)} → ${formatSize(blob.size)}).`
        : `Created a ${formatSize(blob.size)} re-encoded PDF, but it is ${Math.abs(reduction)}% larger than the original.`;
    showMessage(`${sizeMessage} Text selection and links are not retained.`);
  }

  async function runPdf() {
    const item = activeTool();
    if (item.id === "text-to-pdf") {
      const { PDFDocument } = pdfLib();
      const text = value("text").replace(/\r\n/g, "\n");
      const size = Number(value("size"));
      if (!text.trim()) throw new Error("Enter some text to create a PDF.");
      if (!Number.isFinite(size) || size < 6 || size > 36) throw new Error("Choose a font size between 6 and 36 points.");
      const document = await PDFDocument.create();
      const font = await document.embedFont(pdfLib().StandardFonts.Helvetica);
      const pageSize = [595.28, 841.89];
      const margin = 52;
      const lineHeight = size * 1.45;
      const maxWidth = pageSize[0] - margin * 2;
      const lines = [];
      for (const paragraph of text.split("\n")) {
        if (!paragraph) { lines.push(""); continue; }
        let line = "";
        for (const word of paragraph.split(/\s+/)) {
          const candidate = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) line = candidate;
          else { lines.push(line); line = word; }
        }
        if (line) lines.push(line);
      }
      let page;
      let y;
      for (const line of lines) {
        if (!page || y < margin) {
          page = document.addPage(pageSize);
          y = pageSize[1] - margin - size;
        }
        if (line) page.drawText(line, { x: margin, y, size, font, color: pdfLib().rgb(0.13, 0.14, 0.19) });
        y -= lineHeight;
      }
      await savePdf(document, "text-document.pdf");
      setProgress(100, "Your text PDF is ready.");
      showMessage(`Created a ${document.getPageCount()}-page PDF.`);
      return;
    }
    const file = getSingleFile();
    const name = cleanName(file.name);
    if (item.id === "merge") {
      if (state.files.length < 2) throw new Error("Add at least two PDF files to merge.");
      const { PDFDocument } = pdfLib();
      const output = await PDFDocument.create();
      for (let i = 0; i < state.files.length; i++) {
        setProgress(i / state.files.length * 90, `Adding ${state.files[i].name}…`);
        const source = await loadPdf(state.files[i]);
        (await output.copyPages(source, source.getPageIndices())).forEach((page) => output.addPage(page));
      }
      await savePdf(output, "merged-document.pdf");
      setProgress(100, "Merged PDF is ready.");
      showMessage("PDFs merged successfully. Your download has started.");
      return;
    }
    if (item.id === "split" || item.id === "remove-pages" || item.id === "reorder-pages" || item.id === "split-all" || item.id === "blank-pages" || item.id === "duplicate-pages") {
      const { PDFDocument } = pdfLib();
      const source = await loadPdf(file);
      const total = source.getPageCount();
      if (item.id === "split-all") {
        if (!window.JSZip) throw new Error("The ZIP library did not load. Check your internet connection and reload.");
        const zip = new JSZip();
        for (let i = 0; i < total; i++) {
          setProgress((i / total) * 90, `Creating page ${i + 1} of ${total}…`);
          const output = await PDFDocument.create();
          (await output.copyPages(source, [i])).forEach((page) => output.addPage(page));
          zip.file(`${name}-page-${String(i + 1).padStart(3, "0")}.pdf`, await output.save());
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${name}-pages.zip`);
        setProgress(100, "Page archive is ready.");
        showMessage(`Split the PDF into ${total} individual files.`);
        return;
      }
      const output = await PDFDocument.create();
      let indices;
      if (item.id === "split") indices = parsePages(value("pages"), total);
      if (item.id === "remove-pages") {
        const removed = new Set(parsePages(value("pages"), total));
        indices = Array.from({ length: total }, (_, index) => index).filter((index) => !removed.has(index));
        if (!indices.length) throw new Error("You can't remove every page. Select fewer pages.");
      }
      if (item.id === "reorder-pages") {
        const sequence = value("sequence").split(",").map((part) => Number(part.trim()));
        if (sequence.length !== total || sequence.some((page) => !Number.isInteger(page) || page < 1 || page > total) || new Set(sequence).size !== total) {
          throw new Error(`Enter every page once in the new order. This PDF has ${total} pages.`);
        }
        indices = sequence.map((page) => page - 1);
      }
      if (item.id === "blank-pages") {
        const after = Number(value("after"));
        const count = Number(value("count"));
        if (!Number.isInteger(after) || after < 0 || after > total || !Number.isInteger(count) || count < 1 || count > 100) throw new Error(`Insert after a page from 0 to ${total}, and choose 1–100 blank pages.`);
        for (let i = 0; i <= total; i++) {
          if (i === after) for (let blank = 0; blank < count; blank++) output.addPage();
          if (i < total) (await output.copyPages(source, [i])).forEach((page) => output.addPage(page));
        }
        await savePdf(output, `${name}-with-blank-pages.pdf`);
        setProgress(100, "PDF with blank pages is ready.");
        showMessage(`Inserted ${count} blank page${count === 1 ? "" : "s"}.`);
        return;
      }
      if (item.id === "duplicate-pages") {
        const duplicates = new Set(parsePages(value("pages"), total));
        for (let i = 0; i < total; i++) {
          (await output.copyPages(source, [i])).forEach((page) => output.addPage(page));
          if (duplicates.has(i)) (await output.copyPages(source, [i])).forEach((page) => output.addPage(page));
        }
        await savePdf(output, `${name}-duplicated-pages.pdf`);
        setProgress(100, "PDF with duplicated pages is ready.");
        showMessage(`Duplicated ${duplicates.size} selected page${duplicates.size === 1 ? "" : "s"}.`);
        return;
      }
      (await output.copyPages(source, indices)).forEach((page) => output.addPage(page));
      await savePdf(output, `${name}-${item.id === "split" ? "extracted" : item.id === "remove-pages" ? "pages-removed" : "reordered"}.pdf`);
      setProgress(100, "Your PDF is ready.");
      showMessage(item.id === "split" ? `Extracted ${indices.length} page${indices.length === 1 ? "" : "s"}.` : "PDF pages updated successfully.");
      return;
    }
    if (item.id === "rotate-pdf" || item.id === "rotate-selected") {
      const { degrees } = pdfLib();
      const document = await loadPdf(file);
      const rotation = Number(value("rotation"));
      const pages = item.id === "rotate-pdf" ? document.getPages().map((_, index) => index) : parsePages(value("pages"), document.getPageCount());
      pages.forEach((index) => {
        const page = document.getPage(index);
        page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
      });
      await savePdf(document, `${name}-rotated.pdf`);
      setProgress(100, "Rotated PDF is ready.");
      showMessage(`Rotated ${pages.length} page${pages.length === 1 ? "" : "s"}.`);
      return;
    }
    if (item.id === "rotate-odd-pdf" || item.id === "rotate-even-pdf") {
      const { degrees } = pdfLib();
      const document = await loadPdf(file);
      const rotation = Number(value("rotation"));
      const parity = item.id === "rotate-odd-pdf" ? 0 : 1;
      const pages = document.getPages();
      pages.forEach((page, index) => {
        if (index % 2 === parity) page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
      });
      await savePdf(document, `${name}-${item.id === "rotate-odd-pdf" ? "odd" : "even"}-rotated.pdf`);
      setProgress(100, "Selected pages are rotated.");
      showMessage(`Rotated ${Math.ceil(pages.length / 2)} ${item.id === "rotate-odd-pdf" ? "odd" : "even"} pages.`);
      return;
    }
    if (item.id === "odd-pages-pdf" || item.id === "even-pages-pdf") {
      const { PDFDocument } = pdfLib();
      const source = await loadPdf(file);
      const parity = item.id === "odd-pages-pdf" ? 0 : 1;
      const indices = source.getPageIndices().filter((index) => index % 2 === parity);
      if (!indices.length) throw new Error(`This PDF has no ${item.id === "odd-pages-pdf" ? "odd" : "even"} pages to extract.`);
      const output = await PDFDocument.create();
      (await output.copyPages(source, indices)).forEach((page) => output.addPage(page));
      await savePdf(output, `${name}-${item.id === "odd-pages-pdf" ? "odd" : "even"}-pages.pdf`);
      setProgress(100, "Extracted pages are ready.");
      showMessage(`Extracted ${indices.length} ${item.id === "odd-pages-pdf" ? "odd" : "even"} pages.`);
      return;
    }
    if (item.id === "border-pdf") {
      const { rgb } = pdfLib();
      const document = await loadPdf(file);
      const inset = Number(value("inset"));
      const thickness = Number(value("thickness"));
      if (!Number.isFinite(inset) || inset < 0 || !Number.isFinite(thickness) || thickness <= 0 || thickness > 30) {
        throw new Error("Inset must be 0 or greater and line thickness must be between 0 and 30 points.");
      }
      const hex = value("color").replace("#", "");
      const color = rgb(parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255);
      document.getPages().forEach((page, index) => {
        const { width, height } = page.getSize();
        if (width <= inset * 2 || height <= inset * 2) throw new Error(`Inset is too large for page ${index + 1}.`);
        page.drawRectangle({ x: inset, y: inset, width: width - inset * 2, height: height - inset * 2, borderColor: color, borderWidth: thickness });
      });
      await savePdf(document, `${name}-bordered.pdf`);
      setProgress(100, "PDF borders are ready.");
      showMessage("Added a border to every page.");
      return;
    }
    if (item.id === "date-stamp-pdf") {
      const { rgb } = pdfLib();
      const document = await loadPdf(file);
      const now = new Date();
      const stamp = value("date-format") === "iso"
        ? now.toISOString().slice(0, 10)
        : value("date-format") === "short"
          ? `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`
          : now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      const font = await document.embedFont(pdfLib().StandardFonts.Helvetica);
      document.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const position = value("position");
        const right = position.endsWith("right");
        const top = position.startsWith("top");
        const textWidth = font.widthOfTextAtSize(stamp, 10);
        page.drawText(stamp, { x: right ? width - textWidth - 24 : 24, y: top ? height - 24 : 14, size: 10, font, color: rgb(0.28, 0.3, 0.36) });
      });
      await savePdf(document, `${name}-date-stamped.pdf`);
      setProgress(100, "Date-stamped PDF is ready.");
      showMessage(`Added ${stamp} to every page.`);
      return;
    }
    if (item.id === "booklet-pdf" || item.id === "two-up-pdf" || item.id === "four-up-pdf") {
      const { PDFDocument } = pdfLib();
      const sourceBytes = new Uint8Array(await file.arrayBuffer());
      const source = await loadPdf(file);
      const sourcePages = source.getPages();
      const output = await PDFDocument.create();
      const embeddedPages = await output.embedPdf(sourceBytes);
      const perSheet = item.id === "four-up-pdf" ? 4 : 2;
      let order = sourcePages.map((_, index) => index);
      if (item.id === "booklet-pdf") {
        const paddedCount = Math.ceil(order.length / 4) * 4;
        order = [];
        for (let sheet = 0; sheet < paddedCount / 4; sheet++) {
          order.push(paddedCount - 1 - 2 * sheet, 2 * sheet, 2 * sheet + 1, paddedCount - 2 - 2 * sheet);
        }
        order = order.map((index) => index < sourcePages.length ? index : -1);
      }
      const sheetCount = Math.ceil(order.length / perSheet);
      for (let sheetIndex = 0; sheetIndex < sheetCount; sheetIndex++) {
        setProgress(sheetIndex / sheetCount * 90, `Laying out sheet ${sheetIndex + 1} of ${sheetCount}…`);
        const indices = order.slice(sheetIndex * perSheet, (sheetIndex + 1) * perSheet);
        const pageDimensions = indices.filter((index) => index >= 0).map((index) => embeddedPages[index]);
        const widest = Math.max(...pageDimensions.map((page) => page.width));
        const tallest = Math.max(...pageDimensions.map((page) => page.height));
        const columns = perSheet === 4 ? 2 : 2;
        const rows = perSheet / columns;
        const padding = 18;
        const slotWidth = widest + padding * 2;
        const slotHeight = tallest + padding * 2;
        const outputPage = output.addPage([slotWidth * columns, slotHeight * rows]);
        indices.forEach((index, position) => {
          if (index < 0) return;
          const embedded = embeddedPages[index];
          const column = position % columns;
          const row = Math.floor(position / columns);
          const scale = Math.min((slotWidth - padding * 2) / embedded.width, (slotHeight - padding * 2) / embedded.height);
          const width = embedded.width * scale;
          const height = embedded.height * scale;
          const x = column * slotWidth + (slotWidth - width) / 2;
          const y = outputPage.getHeight() - (row + 1) * slotHeight + (slotHeight - height) / 2;
          outputPage.drawPage(embedded, { x, y, width, height });
        });
      }
      const suffix = item.id === "booklet-pdf" ? "booklet" : `${perSheet}-up`;
      await savePdf(output, `${name}-${suffix}.pdf`);
      setProgress(100, "Print layout PDF is ready.");
      showMessage(`Created ${sheetCount} print-layout sheet${sheetCount === 1 ? "" : "s"}.`);
      return;
    }
    if (item.id === "watermark") {
      const { rgb, degrees } = pdfLib();
      const document = await loadPdf(file);
      const text = value("text").trim();
      if (!text) throw new Error("Enter the watermark text.");
      const font = await document.embedFont(pdfLib().StandardFonts.Helvetica);
      document.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const size = Math.min(42, Math.max(18, Math.min(width, height) * 0.07));
        page.drawText(text, { x: width * 0.08, y: height * 0.48, size, font, color: rgb(0.45, 0.45, 0.52), opacity: Number(value("opacity")), rotate: degrees(35), maxWidth: width * 0.84 });
      });
      await savePdf(document, `${name}-watermarked.pdf`);
      setProgress(100, "Watermarked PDF is ready.");
      showMessage("Watermark added to every page.");
      return;
    }
    if (item.id === "page-numbers") {
      const { rgb } = pdfLib();
      const document = await loadPdf(file);
      const start = Number(value("start"));
      if (!Number.isInteger(start) || start < 0) throw new Error("Enter a page number of 0 or greater.");
      const font = await document.embedFont(pdfLib().StandardFonts.Helvetica);
      document.getPages().forEach((page, index) => {
        const { width, height } = page.getSize();
        const text = String(start + index);
        const textWidth = font.widthOfTextAtSize(text, 10);
        const position = value("position");
        const x = position.endsWith("right") ? width - textWidth - 28 : (width - textWidth) / 2;
        const y = position.startsWith("top") ? height - 23 : 16;
        page.drawText(text, { x, y, size: 10, font, color: rgb(0.35, 0.36, 0.42) });
      });
      await savePdf(document, `${name}-numbered.pdf`);
      setProgress(100, "Numbered PDF is ready.");
      showMessage(`Added page numbers to ${document.getPageCount()} pages.`);
      return;
    }
    if (item.id === "pdf-to-images") {
      if (!window.JSZip) throw new Error("The ZIP library did not load. Check your internet connection and reload.");
      const format = value("format");
      const rendered = await renderPdf(file, { scale: Number(value("scale")) });
      const zip = new JSZip();
      for (let i = 0; i < rendered.length; i++) {
        const blob = await canvasBlob(rendered[i].canvas, `image/${format}`, 0.92);
        zip.file(`${name}-page-${String(i + 1).padStart(3, "0")}.${format === "jpeg" ? "jpg" : "png"}`, blob);
        rendered[i].canvas.width = 0;
        rendered[i].canvas.height = 0;
      }
      setProgress(95, "Creating image archive…");
      downloadBlob(await zip.generateAsync({ type: "blob" }), `${name}-images.zip`);
      setProgress(100, "Images are ready.");
      showMessage(`Exported ${rendered.length} page images into a ZIP file.`);
      return;
    }
    if (item.id === "images-to-pdf") {
      const { PDFDocument } = pdfLib();
      const output = await PDFDocument.create();
      for (let i = 0; i < state.files.length; i++) {
        setProgress(i / state.files.length * 90, `Adding ${state.files[i].name}…`);
        const image = await loadImage(state.files[i]);
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        const embedded = await output.embedPng(await (await canvasBlob(canvas, "image/png")).arrayBuffer());
        const dimensions = embedded.scale(1);
        const format = value("page-size");
        const pageSize = format === "a4" ? [595.28, 841.89] : format === "letter" ? [612, 792] : [dimensions.width, dimensions.height];
        const page = output.addPage(pageSize);
        const scale = value("fit") === "cover" ? Math.max(pageSize[0] / dimensions.width, pageSize[1] / dimensions.height) : Math.min(pageSize[0] / dimensions.width, pageSize[1] / dimensions.height);
        const width = dimensions.width * scale;
        const height = dimensions.height * scale;
        page.drawImage(embedded, { x: (pageSize[0] - width) / 2, y: (pageSize[1] - height) / 2, width, height });
        canvas.width = 0;
        canvas.height = 0;
      }
      await savePdf(output, "images-document.pdf");
      setProgress(100, "Your PDF is ready.");
      showMessage(`Created a PDF with ${state.files.length} image${state.files.length === 1 ? "" : "s"}.`);
      return;
    }
    if (item.id === "compress-pdf" || item.id === "grayscale-pdf") {
      await rasterPdf(file, item.id === "grayscale-pdf", { targetBytes: item.id === "compress-pdf" ? getTargetBytes() : 0 });
      return;
    }
    if (item.id === "extract-text") {
      if (!window.pdfjsLib) throw new Error("The PDF text library did not load. Check your internet connection and reload.");
      const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const output = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress((i - 1) / pdf.numPages * 90, `Reading page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        output.push(`--- Page ${i} ---\n${content.items.map((item) => "str" in item ? item.str : "").join(" ")}`);
      }
      const text = output.join("\n\n");
      if (!text.replace(/--- Page \d+ ---/g, "").trim()) throw new Error("No selectable text was found. This may be a scanned PDF; use Image to text (OCR) on page images instead.");
      downloadText(text, `${name}-text.txt`);
      setProgress(100, "Extracted text is ready.");
      showTextOutput("Extracted text (also downloaded as a .txt file):", text);
      return;
    }
    if (item.id === "pdf-info") {
      const document = await loadPdf(file);
      const info = {
        fileName: file.name,
        fileSize: formatSize(file.size),
        pageCount: document.getPageCount(),
        title: document.getTitle() || "(not set)",
        author: document.getAuthor() || "(not set)",
        subject: document.getSubject() || "(not set)",
        creator: document.getCreator() || "(not set)",
        producer: document.getProducer() || "(not set)"
      };
      const text = Object.entries(info).map(([key, val]) => `${key}: ${val}`).join("\n");
      downloadText(text, `${name}-info.txt`);
      setProgress(100, "PDF information is ready.");
      showTextOutput("PDF details (also downloaded as a .txt file):", text);
      return;
    }
    if (item.id === "edit-metadata") {
      const document = await loadPdf(file);
      document.setTitle(value("title"));
      document.setAuthor(value("author"));
      document.setSubject(value("subject"));
      await savePdf(document, `${name}-metadata.pdf`);
      setProgress(100, "Updated PDF is ready.");
      showMessage("PDF metadata updated successfully.");
      return;
    }
    if (item.id === "crop-pdf") {
      const document = await loadPdf(file);
      const margins = {
        top: Number(value("top")),
        right: Number(value("right")),
        bottom: Number(value("bottom")),
        left: Number(value("left"))
      };
      if (Object.values(margins).some((margin) => !Number.isFinite(margin) || margin < 0)) throw new Error("Enter non-negative crop margins in points.");
      document.getPages().forEach((page, index) => {
        const box = page.getMediaBox();
        const width = box.width - margins.left - margins.right;
        const height = box.height - margins.top - margins.bottom;
        if (width <= 0 || height <= 0) throw new Error(`Crop margins are too large for page ${index + 1}.`);
        page.setCropBox(box.x + margins.left, box.y + margins.bottom, width, height);
      });
      await savePdf(document, `${name}-cropped.pdf`);
      setProgress(100, "Cropped PDF is ready.");
      showMessage("Applied crop bounds to every page. Original content outside the bounds remains in the file.");
      return;
    }
    if (item.id === "reverse-pages") {
      const { PDFDocument } = pdfLib();
      const source = await loadPdf(file);
      const output = await PDFDocument.create();
      const order = source.getPageIndices().reverse();
      (await output.copyPages(source, order)).forEach((page) => output.addPage(page));
      await savePdf(output, `${name}-reversed.pdf`);
      setProgress(100, "Reversed PDF is ready.");
      showMessage(`Reversed the order of ${order.length} pages.`);
      return;
    }
    if (item.id === "add-text-pdf" || item.id === "header-footer") {
      const { rgb } = pdfLib();
      const document = await loadPdf(file);
      const size = Number(value("size"));
      if (!Number.isFinite(size) || size < 4 || size > 100) throw new Error("Choose a font size between 4 and 100 points.");
      const font = await document.embedFont(pdfLib().StandardFonts.Helvetica);
      const text = value("text").trim();
      const header = value("header").trim();
      const footer = value("footer").trim();
      if (item.id === "add-text-pdf" && !text) throw new Error("Enter the text to add.");
      if (item.id === "header-footer" && !header && !footer) throw new Error("Enter header text, footer text, or both.");
      const drawCentered = (page, content, y) => {
        const { width } = page.getSize();
        const measured = font.widthOfTextAtSize(content, size);
        page.drawText(content, { x: Math.max(12, (width - measured) / 2), y, size, font, color: rgb(0.2, 0.22, 0.3), maxWidth: width - 24 });
      };
      document.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        if (item.id === "add-text-pdf") {
          const position = value("position");
          const measured = font.widthOfTextAtSize(text, size);
          const x = position.endsWith("left") ? 24 : position.endsWith("right") ? Math.max(12, width - measured - 24) : Math.max(12, (width - measured) / 2);
          const y = position.startsWith("top") ? height - size - 24 : position === "center" ? (height - size) / 2 : 20;
          page.drawText(text, { x, y, size, font, color: rgb(0.2, 0.22, 0.3), maxWidth: width - 48 });
        } else {
          if (header) drawCentered(page, header, height - size - 18);
          if (footer) drawCentered(page, footer, 16);
        }
      });
      await savePdf(document, `${name}-${item.id === "add-text-pdf" ? "with-text" : "with-header-footer"}.pdf`);
      setProgress(100, "Updated PDF is ready.");
      showMessage(item.id === "add-text-pdf" ? "Added text to every page." : "Added the selected header and footer to every page.");
      return;
    }
    if (item.id === "page-dimensions") {
      const document = await loadPdf(file);
      const lines = document.getPages().map((page, index) => {
        const { width, height } = page.getSize();
        return `Page ${index + 1}: ${width.toFixed(2)} × ${height.toFixed(2)} pt (${(width / 72).toFixed(2)} × ${(height / 72).toFixed(2)} in), ${width > height ? "landscape" : width < height ? "portrait" : "square"}`;
      });
      const report = [`${file.name} — ${document.getPageCount()} pages`, ...lines].join("\n");
      downloadText(report, `${name}-page-dimensions.txt`);
      setProgress(100, "Page dimensions are ready.");
      showTextOutput("Page dimensions (also downloaded as a .txt file):", report);
      return;
    }
    if (item.id === "resize-pdf") {
      const targetBytes = getTargetBytes();
      const { PDFDocument } = pdfLib();
      const source = await loadPdf(file);
      const output = await PDFDocument.create();
      const embeddedPages = await output.embedPdf(new Uint8Array(await file.arrayBuffer()));
      const target = value("size");
      for (let index = 0; index < embeddedPages.length; index++) {
        setProgress(index / embeddedPages.length * 90, `Resizing page ${index + 1} of ${embeddedPages.length}…`);
        const embedded = embeddedPages[index];
        const original = source.getPage(index).getSize();
        const pageSize = target === "a4" ? [595.28, 841.89] : target === "letter" ? [612, 792] : [original.width, original.height];
        const page = output.addPage(pageSize);
        const scale = Math.min(pageSize[0] / embedded.width, pageSize[1] / embedded.height);
        const width = embedded.width * scale;
        const height = embedded.height * scale;
        page.drawPage(embedded, { x: (pageSize[0] - width) / 2, y: (pageSize[1] - height) / 2, width, height });
      }
      if (targetBytes) {
        const resizedBlob = new Blob([await output.save()], { type: "application/pdf" });
        await rasterPdf(resizedBlob, false, { targetBytes, suffix: `${target}-pages` });
        return;
      }
      await savePdf(output, `${name}-${target}-pages.pdf`);
      setProgress(100, "Resized PDF is ready.");
      showMessage("Resized all pages. The PDF has been redrawn, so interactive fields and links may not be retained.");
      return;
    }
    if (item.id === "flatten-forms") {
      const document = await loadPdf(file);
      const form = document.getForm();
      const fieldCount = form.getFields().length;
      if (!fieldCount) throw new Error("No interactive form fields were found in this PDF.");
      form.flatten();
      await savePdf(document, `${name}-flattened.pdf`);
      setProgress(100, "Flattened PDF is ready.");
      showMessage(`Flattened ${fieldCount} form field${fieldCount === 1 ? "" : "s"}.`);
      return;
    }
    throw new Error(`The "${item.name}" operation is not connected to a processor yet.`);
  }

  async function runImage() {
    const item = activeTool();
    if (item.id === "base64-to-image") {
      const input = value("base64").trim();
      if (!input) throw new Error("Paste an image data URL or Base64 string first.");
      if (input.length > 45_000_000) throw new Error("The pasted image data is too large to decode in this browser.");
      const blob = dataUrlToBlob(input);
      if (blob.size > 30 * 1024 * 1024) throw new Error("The decoded image is larger than 30 MB.");
      const image = await loadImage(blob);
      downloadBlob(blob, `decoded-image.${extensionFor(blob.type)}`);
      setProgress(100, "Decoded image is ready.");
      showMessage(`Decoded image: ${image.naturalWidth} × ${image.naturalHeight} pixels.`);
      return;
    }
    if (item.id === "thumbnails-image" || item.id === "contact-sheet-image") {
      if (!window.JSZip) throw new Error("The ZIP library did not load. Check your internet connection and reload.");
      if (!state.files.length) throw new Error("Choose one or more images first.");
      if (state.files.length > 40) throw new Error("For reliable browser performance, select no more than 40 images at a time.");
      if (item.id === "thumbnails-image") {
        const width = Number(value("width"));
        if (!Number.isInteger(width) || width < 32 || width > 2000) throw new Error("Thumbnail width must be between 32 and 2,000 pixels.");
        const format = value("format");
        const zip = new JSZip();
        for (let index = 0; index < state.files.length; index++) {
          setProgress(index / state.files.length * 90, `Making thumbnail ${index + 1} of ${state.files.length}…`);
          const file = state.files[index];
          const image = await loadImage(file);
          const height = Math.max(1, Math.round(width * image.naturalHeight / image.naturalWidth));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          const blob = await canvasBlob(canvas, format, 0.88);
          zip.file(`${cleanName(file.name)}-thumbnail.${extensionFor(blob.type)}`, blob);
          canvas.width = 0;
          canvas.height = 0;
        }
        downloadBlob(await zip.generateAsync({ type: "blob" }), "image-thumbnails.zip");
        setProgress(100, "Thumbnail archive is ready.");
        showMessage(`Created ${state.files.length} thumbnails.`);
        return;
      }
      const columns = Number(value("columns"));
      const cell = Number(value("cell"));
      if (!Number.isInteger(cell) || cell < 80 || cell > 800) throw new Error("Cell size must be between 80 and 800 pixels.");
      const rows = Math.ceil(state.files.length / columns);
      const canvas = document.createElement("canvas");
      canvas.width = columns * cell;
      canvas.height = rows * (cell + 34);
      if (canvas.width * canvas.height > 36_000_000) throw new Error("This contact sheet would be too large. Reduce the cell size or select fewer images.");
      const context = canvas.getContext("2d");
      context.fillStyle = "#f3f4f8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < state.files.length; index++) {
        setProgress(index / state.files.length * 90, `Placing image ${index + 1} of ${state.files.length}…`);
        const image = await loadImage(state.files[index]);
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = column * cell;
        const y = row * (cell + 34);
        const scale = Math.min(cell / image.naturalWidth, cell / image.naturalHeight);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        context.fillStyle = "#fff";
        context.fillRect(x + 5, y + 5, cell - 10, cell - 10);
        context.drawImage(image, x + (cell - width) / 2, y + (cell - height) / 2, width, height);
        context.fillStyle = "#252940";
        context.font = "12px sans-serif";
        context.textAlign = "center";
        const label = state.files[index].name.length > 28 ? `${state.files[index].name.slice(0, 25)}…` : state.files[index].name;
        context.fillText(label, x + cell / 2, y + cell + 22, cell - 12);
      }
      const blob = await canvasBlob(canvas, "image/png");
      downloadBlob(blob, "image-contact-sheet.png");
      setProgress(100, "Contact sheet is ready.");
      showMessage(`Created a contact sheet with ${state.files.length} images.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    const file = getSingleFile();
    const name = cleanName(file.name);
    if (item.id === "image-to-base64") {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
      downloadText(dataUrl, `${name}-base64.txt`);
      setProgress(100, "Base64 data is ready.");
      showTextOutput("Base64 data URL (also downloaded as a .txt file):", dataUrl);
      return;
    }
    const image = await loadImage(file);
    if (item.id === "passport-photo") {
      if (!window.JSZip) throw new Error("The ZIP library did not load. Check your internet connection and reload.");
      const unit = value("unit");
      const mmPerUnit = { mm: 1, cm: 10, in: 25.4 }[unit];
      if (!mmPerUnit) throw new Error("Choose millimeters, centimeters, or inches for photo dimensions.");
      const widthMm = Number(value("photo-width")) * mmPerUnit;
      const heightMm = Number(value("photo-height")) * mmPerUnit;
      const dpi = Number(value("dpi"));
      const columns = Number(value("columns"));
      const rows = Number(value("rows"));
      const gapMm = Number(value("photo-gap")) * mmPerUnit;
      const validDimension = (number) => Number.isFinite(number) && number > 0;
      if (!validDimension(widthMm) || widthMm > 150 || !validDimension(heightMm) || heightMm > 200) {
        throw new Error(`Photo width must be greater than 0 and at most ${150 / mmPerUnit} ${unit}; height must be greater than 0 and at most ${200 / mmPerUnit} ${unit}.`);
      }
      if (!Number.isInteger(dpi) || ![150, 300, 600].includes(dpi)) throw new Error("Choose a supported print resolution.");
      if (!Number.isInteger(columns) || columns < 1 || columns > 10 || !Number.isInteger(rows) || rows < 1 || rows > 10) {
        throw new Error("Choose between 1 and 10 rows and columns.");
      }
      if (!Number.isFinite(gapMm) || gapMm < 0 || gapMm > 20) throw new Error(`Photo gap must be between 0 and ${20 / mmPerUnit} ${unit}.`);
      const mmToPixels = (millimeters) => Math.round(millimeters * dpi / 25.4);
      const photoWidth = mmToPixels(widthMm);
      const photoHeight = mmToPixels(heightMm);
      const sheetGap = mmToPixels(gapMm);
      const sheetWidth = columns * photoWidth + (columns + 1) * sheetGap;
      const sheetHeight = rows * photoHeight + (rows + 1) * sheetGap;
      const sheetWidthMm = columns * widthMm + (columns + 1) * gapMm;
      const sheetHeightMm = rows * heightMm + (rows + 1) * gapMm;
      if (photoWidth * photoHeight > 18_000_000 || sheetWidth > 12000 || sheetHeight > 12000 || sheetWidth * sheetHeight > 36_000_000) {
        throw new Error("The selected print size and DPI create an oversized image. Reduce the size, DPI, or sheet rows and columns.");
      }
      const format = value("format");
      const quality = Number(value("quality"));
      const background = value("background");
      const photoCanvas = document.createElement("canvas");
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const photoContext = photoCanvas.getContext("2d");
      const brightness = Number(value("brightness") || 100);
      const contrast = Number(value("contrast") || 100);
      const saturation = Number(value("saturation") || 100);
      if (!Number.isFinite(brightness) || brightness < 50 || brightness > 150
        || !Number.isFinite(contrast) || contrast < 50 || contrast > 150
        || !Number.isFinite(saturation) || saturation < 0 || saturation > 200) {
        throw new Error("Brightness and contrast must be 50–150%, and colour must be 0–200%.");
      }
      photoContext.fillStyle = background;
      photoContext.fillRect(0, 0, photoWidth, photoHeight);
      photoContext.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      if (value("fit") === "cover") {
        const targetRatio = photoWidth / photoHeight;
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        let sx = 0, sy = 0, sourceWidth = image.naturalWidth, sourceHeight = image.naturalHeight;
        if (sourceRatio > targetRatio) {
          sourceWidth = image.naturalHeight * targetRatio;
          sx = (image.naturalWidth - sourceWidth) / 2;
        } else {
          sourceHeight = image.naturalWidth / targetRatio;
          sy = (image.naturalHeight - sourceHeight) / 2;
        }
        photoContext.drawImage(image, sx, sy, sourceWidth, sourceHeight, 0, 0, photoWidth, photoHeight);
      } else {
        const scale = Math.min(photoWidth / image.naturalWidth, photoHeight / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        photoContext.drawImage(image, (photoWidth - drawWidth) / 2, (photoHeight - drawHeight) / 2, drawWidth, drawHeight);
      }
      photoContext.filter = "none";
      const photoBlob = await canvasBlob(photoCanvas, format, quality);
      const extension = extensionFor(photoBlob.type);
      const pdfImageBlob = photoBlob.type === "image/png" ? photoBlob : await canvasBlob(photoCanvas, "image/png");
      const { PDFDocument } = pdfLib();
      const printPdf = await PDFDocument.create();
      const embeddedPhoto = photoBlob.type === "image/jpeg"
        ? await printPdf.embedJpg(await photoBlob.arrayBuffer())
        : await printPdf.embedPng(await pdfImageBlob.arrayBuffer());
      const pointsPerMm = 72 / 25.4;
      const sheetPage = printPdf.addPage([sheetWidthMm * pointsPerMm, sheetHeightMm * pointsPerMm]);
      const photoWidthPt = widthMm * pointsPerMm;
      const photoHeightPt = heightMm * pointsPerMm;
      const gapPt = gapMm * pointsPerMm;
      for (let row = 0; row < rows; row++) {
        setProgress(70 + ((row + 1) / rows) * 20, `Building print sheet row ${row + 1} of ${rows}…`);
        for (let column = 0; column < columns; column++) {
          sheetPage.drawImage(embeddedPhoto, {
            x: gapPt + column * (photoWidthPt + gapPt),
            y: sheetPage.getHeight() - gapPt - photoHeightPt - row * (photoHeightPt + gapPt),
            width: photoWidthPt,
            height: photoHeightPt
          });
        }
      }
      const zip = new JSZip();
      zip.file(`passport-photo.${extension}`, photoBlob);
      zip.file("passport-print-sheet.pdf", await printPdf.save());
      const archive = await zip.generateAsync({ type: "blob" });
      downloadBlob(archive, `${name}-passport-photos.zip`);
      setProgress(100, "Passport photo files are ready.");
      showMessage(`Created a ${photoWidth} × ${photoHeight} px photo at ${dpi} DPI (${value("photo-width")} × ${value("photo-height")} ${unit}) and a ${columns} × ${rows} print-ready PDF sheet (${sheetWidthMm} × ${sheetHeightMm} mm).`);
      photoCanvas.width = 0;
      photoCanvas.height = 0;
      return;
    }
    if (item.id === "image-info") {
      const details = {
        fileName: file.name,
        fileType: file.type || "Unknown",
        fileSize: formatSize(file.size),
        width: image.naturalWidth,
        height: image.naturalHeight,
        aspectRatio: (image.naturalWidth / image.naturalHeight).toFixed(3)
      };
      const text = JSON.stringify(details, null, 2);
      downloadText(text, `${name}-info.json`, "application/json");
      setProgress(100, "Image information is ready.");
      showTextOutput("Image details (also downloaded as a .json file):", text);
      return;
    }
    if (item.id === "ocr-image") {
      if (!window.Tesseract) {
        setProgress(10, "Loading English OCR engine…");
        const sources = [
          "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js",
          "https://unpkg.com/tesseract.js@5.1.1/dist/tesseract.min.js"
        ];
        for (const source of sources) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            let settled = false;
            const finish = (loaded) => {
              if (settled) return;
              settled = true;
              clearTimeout(timeout);
              resolve(loaded);
            };
            const timeout = setTimeout(() => { script.remove(); finish(false); }, 12000);
            script.src = source;
            script.onload = () => finish(Boolean(window.Tesseract));
            script.onerror = () => { script.remove(); finish(false); };
            document.head.appendChild(script);
          });
          if (window.Tesseract) break;
        }
        if (!window.Tesseract) throw new Error("Could not load the OCR engine from either source. Check your internet connection and try again.");
      }
      setProgress(15, "Recognizing text…");
      const worker = await window.Tesseract.createWorker("eng");
      try {
        const { data } = await worker.recognize(file);
        if (!data.text.trim()) throw new Error("No readable text was found in this image.");
        downloadText(data.text, `${name}-recognized.txt`);
        setProgress(100, "Recognized text is ready.");
        showTextOutput("Recognized text (also downloaded as a .txt file):", data.text);
      } finally {
        await worker.terminate();
      }
      return;
    }
    if (item.id === "favicon-image") {
      if (!window.JSZip) throw new Error("The ZIP library did not load. Check your internet connection and reload.");
      const sizes = [16, 32, 48, 180, 192, 512];
      const zip = new JSZip();
      for (let index = 0; index < sizes.length; index++) {
        const size = sizes[index];
        setProgress(index / sizes.length * 90, `Generating ${size}×${size} icon…`);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        const scale = value("fit") === "cover"
          ? Math.max(size / image.naturalWidth, size / image.naturalHeight)
          : Math.min(size / image.naturalWidth, size / image.naturalHeight);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        if (value("fit") === "contain") {
          context.fillStyle = value("background");
          context.fillRect(0, 0, size, size);
        }
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        zip.file(`icon-${size}.png`, await canvasBlob(canvas, "image/png"));
        canvas.width = 0;
        canvas.height = 0;
      }
      downloadBlob(await zip.generateAsync({ type: "blob" }), `${name}-icons.zip`);
      setProgress(100, "Icon pack is ready.");
      showMessage("Generated 16, 32, 48, 180, 192 and 512 pixel PNG icons.");
      return;
    }
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (item.id === "image-palette") {
      canvas.width = Math.min(180, image.naturalWidth);
      canvas.height = Math.max(1, Math.round(canvas.width * image.naturalHeight / image.naturalWidth));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const counts = new Map();
      const quantize = (channel) => Math.round(channel / 32) * 32;
      for (let i = 0; i < pixels.length; i += 4 * 12) {
        if (pixels[i + 3] < 128) continue;
        const channels = [quantize(pixels[i]), quantize(pixels[i + 1]), quantize(pixels[i + 2])].map((channel) => Math.min(255, channel));
        const hex = `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
        counts.set(hex, (counts.get(hex) || 0) + 1);
      }
      const palette = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, Number(value("colors"))).map(([hex, count]) => `${hex}  (${count} samples)`);
      const text = palette.join("\n");
      downloadText(text, `${name}-palette.txt`);
      setProgress(100, "Color palette is ready.");
      showTextOutput("Most common sampled colors:", text);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "blur-image") {
      const blur = Number(value("blur"));
      if (!Number.isFinite(blur) || blur < 0 || blur > 50) throw new Error("Choose a blur strength between 0 and 50 pixels.");
      const padding = Math.ceil(blur * 2);
      canvas.width = image.naturalWidth + padding * 2;
      canvas.height = image.naturalHeight + padding * 2;
      context.filter = `blur(${blur}px)`;
      context.drawImage(image, padding, padding);
      const format = value("format");
      const blob = await canvasBlob(canvas, format, 0.9);
      downloadBlob(blob, `${name}-blurred.${extensionFor(blob.type)}`);
      setProgress(100, "Blurred image is ready.");
      showMessage(`Applied ${blur}px blur to the image.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "pixelate-image") {
      const blockSize = Number(value("pixel-size"));
      if (!Number.isInteger(blockSize) || blockSize < 2 || blockSize > 100) throw new Error("Choose a pixel block size between 2 and 100.");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const sample = document.createElement("canvas");
      sample.width = Math.max(1, Math.ceil(image.naturalWidth / blockSize));
      sample.height = Math.max(1, Math.ceil(image.naturalHeight / blockSize));
      const sampleContext = sample.getContext("2d");
      sampleContext.drawImage(image, 0, 0, sample.width, sample.height);
      context.imageSmoothingEnabled = false;
      context.drawImage(sample, 0, 0, sample.width, sample.height, 0, 0, canvas.width, canvas.height);
      const format = value("format");
      const blob = await canvasBlob(canvas, format, 0.9);
      downloadBlob(blob, `${name}-pixelated.${extensionFor(blob.type)}`);
      setProgress(100, "Pixelated image is ready.");
      showMessage(`Applied a ${blockSize}px mosaic effect.`);
      sample.width = 0;
      sample.height = 0;
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "border-image") {
      const border = Number(value("border-width"));
      if (!Number.isInteger(border) || border < 0 || border > 1000) throw new Error("Choose a border width between 0 and 1,000 pixels.");
      canvas.width = image.naturalWidth + border * 2;
      canvas.height = image.naturalHeight + border * 2;
      context.fillStyle = value("border-color");
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, border, border);
      const format = value("format");
      const blob = await canvasBlob(canvas, format, 0.9);
      downloadBlob(blob, `${name}-framed.${extensionFor(blob.type)}`);
      setProgress(100, "Framed image is ready.");
      showMessage(`Added a ${border}px border around the image.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "circle-image") {
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      canvas.width = size;
      canvas.height = size;
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.clip();
      const cropX = (image.naturalWidth - size) / 2;
      const cropY = (image.naturalHeight - size) / 2;
      context.drawImage(image, cropX, cropY, size, size, 0, 0, size, size);
      const blob = await canvasBlob(canvas, "image/png");
      downloadBlob(blob, `${name}-circle.png`);
      setProgress(100, "Circular image is ready.");
      showMessage(`Created a ${size}×${size} circular PNG with a transparent background.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "rotate-angle-image") {
      const angle = Number(value("angle"));
      if (!Number.isFinite(angle) || angle < 0 || angle > 360) throw new Error("Angle must be between 0 and 360 degrees.");
      const radians = angle * Math.PI / 180;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      canvas.width = Math.ceil(Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)));
      canvas.height = Math.ceil(Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians)));
      if (canvas.width > 12000 || canvas.height > 12000 || canvas.width * canvas.height > 60_000_000) {
        canvas.width = 0;
        canvas.height = 0;
        throw new Error("Rotated output exceeds the browser's safe image size. Use a smaller source image.");
      }
      if (value("format") !== "image/png") {
        context.fillStyle = value("background");
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(radians);
      context.drawImage(image, -width / 2, -height / 2);
      const format = value("format");
      const blob = await canvasBlob(canvas, format, 0.9);
      downloadBlob(blob, `${name}-rotated.${extensionFor(blob.type)}`);
      setProgress(100, "Rotated image is ready.");
      showMessage(`Rotated by ${angle}°. Output: ${canvas.width} × ${canvas.height} pixels.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (item.id === "rounded-image") {
      const radius = Number(value("radius"));
      if (!Number.isInteger(radius) || radius < 0 || radius > 1000) throw new Error("Corner radius must be between 0 and 1,000 pixels.");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const format = value("format");
      if (format === "image/jpeg") {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      const r = Math.min(radius, canvas.width / 2, canvas.height / 2);
      context.beginPath();
      context.moveTo(r, 0);
      context.arcTo(canvas.width, 0, canvas.width, canvas.height, r);
      context.arcTo(canvas.width, canvas.height, 0, canvas.height, r);
      context.arcTo(0, canvas.height, 0, 0, r);
      context.arcTo(0, 0, canvas.width, 0, r);
      context.closePath();
      context.clip();
      context.drawImage(image, 0, 0);
      const blob = await canvasBlob(canvas, format, 0.9);
      downloadBlob(blob, `${name}-rounded.${extensionFor(blob.type)}`);
      setProgress(100, "Rounded-corner image is ready.");
      showMessage(`Applied ${radius}px rounded corners.`);
      canvas.width = 0;
      canvas.height = 0;
      return;
    }

    const canvasTools = new Set([
      "resize-image", "crop-image", "convert-image", "compress-image", "rotate-image",
      "grayscale-image", "sepia-image", "invert-image", "adjust-image", "tint-image",
      "image-watermark"
    ]);
    if (!canvasTools.has(item.id)) throw new Error(`The "${item.name}" operation is not connected to a processor yet.`);

    let crop = { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
    if (item.id === "crop-image") {
      const parts = value("crop").split(",").map((part) => Number(part.trim()));
      if (parts.length !== 4 || parts.some((number) => !Number.isInteger(number)) || parts[0] < 0 || parts[1] < 0 || parts[2] < 1 || parts[3] < 1 || parts[0] + parts[2] > image.naturalWidth || parts[1] + parts[3] > image.naturalHeight) {
        throw new Error(`Enter a valid crop within this image (${image.naturalWidth} × ${image.naturalHeight}): x, y, width, height.`);
      }
      [crop.x, crop.y, crop.width, crop.height] = parts;
    }
    const widthValue = Number(value("width"));
    const heightValue = Number(value("height"));
    let width = item.id === "resize-image" && widthValue > 0 ? Math.round(widthValue) : crop.width;
    let height = item.id === "resize-image" && heightValue > 0 ? Math.round(heightValue) : crop.height;
    if (item.id === "resize-image" && widthValue > 0 && !heightValue) height = Math.round(width * crop.height / crop.width);
    if (item.id === "resize-image" && heightValue > 0 && !widthValue) width = Math.round(height * crop.width / crop.height);
    if (item.id === "resize-image" && widthValue > 0 && heightValue > 0 && value("fit-mode") !== "stretch") {
      width = Math.round(widthValue);
      height = Math.round(heightValue);
    }
    if (width < 1 || height < 1 || width > 12000 || height > 12000) throw new Error("Image output dimensions must be between 1 and 12,000 pixels.");
    const rotation = item.id === "rotate-image" ? Number(value("rotation")) : 0;
    const flip = item.id === "rotate-image" ? value("flip") : "none";
    const swapped = rotation === 90 || rotation === 270;
    canvas.width = swapped ? height : width;
    canvas.height = swapped ? width : height;
    if (item.id === "resize-image") {
      const fitMode = value("fit-mode");
      if (value("format") === "image/jpeg") {
        context.fillStyle = value("background");
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else if (fitMode === "contain") {
        context.fillStyle = value("background");
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (fitMode === "stretch") {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      } else {
        const scale = fitMode === "cover"
          ? Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
          : Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
      }
    } else {
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(rotation * Math.PI / 180);
      context.scale(flip === "horizontal" ? -1 : 1, flip === "vertical" ? -1 : 1);
      if (item.id === "grayscale-image") context.filter = "grayscale(1)";
      if (item.id === "sepia-image") context.filter = "sepia(1)";
      if (item.id === "invert-image") context.filter = "invert(1)";
      if (item.id === "adjust-image") {
        const brightness = Number(value("brightness"));
        const contrast = Number(value("contrast"));
        if (!Number.isFinite(brightness) || brightness < 0 || brightness > 300 || !Number.isFinite(contrast) || contrast < 0 || contrast > 300) {
          throw new Error("Brightness and contrast must be between 0% and 300%.");
        }
        context.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      }
      context.drawImage(image, crop.x, crop.y, crop.width, crop.height, -width / 2, -height / 2, width, height);
    }
    if (item.id === "tint-image") {
      const strength = Number(value("strength"));
      if (!Number.isFinite(strength) || strength < 0 || strength > 100) throw new Error("Tint strength must be between 0% and 100%.");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "source-atop";
      context.globalAlpha = strength / 100;
      context.fillStyle = value("tint");
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    }
    if (item.id === "image-watermark") {
      const text = value("text").trim();
      if (!text) throw new Error("Enter the watermark text.");
      const fontSize = Math.max(14, Math.min(canvas.width, canvas.height) * 0.045);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.font = `600 ${fontSize}px sans-serif`;
      context.textAlign = "right";
      context.textBaseline = "bottom";
      context.fillStyle = `rgba(255,255,255,${value("opacity")})`;
      context.shadowColor = "rgba(0,0,0,.35)";
      context.shadowBlur = fontSize * 0.15;
      context.fillText(text, canvas.width - fontSize * 0.6, canvas.height - fontSize * 0.6, canvas.width * 0.85);
    }
    const format = value("format") || (item.id === "compress-image" ? "image/jpeg" : "image/png");
    const quality = Number(value("quality") || 0.9);
    const targetBytes = item.id === "resize-image" ? getTargetBytes() : 0;
    const { blob, metTarget } = await encodeCanvas(canvas, format, quality, targetBytes);
    downloadBlob(blob, `${name}-${item.id}.${extensionFor(blob.type)}`);
    setProgress(100, "Your image is ready.");
    const sizeMessage = targetBytes
      ? metTarget
        ? `Target reached: ${formatSize(blob.size)} (max ${formatSize(targetBytes)}).`
        : `Could not reach the ${formatSize(targetBytes)} target with this format and resolution; output is ${formatSize(blob.size)}.`
      : `Output size: ${formatSize(blob.size)}.`;
    showMessage(`Processed image: ${canvas.width} × ${canvas.height} pixels. ${sizeMessage}`);
    canvas.width = 0;
    canvas.height = 0;
  }

  async function process() {
    if (state.busy) return;
    state.busy = true;
    processButton.disabled = true;
    result.hidden = true;
    setProgress(3, "Preparing your files…");
    try {
      const item = activeTool();
      if (item.category === "pdf") await runPdf();
      else await runImage();
    } catch (error) {
      byId("progress-wrap").hidden = true;
      showMessage(error instanceof Error ? error.message : "Something went wrong while processing this file.", true);
    } finally {
      state.busy = false;
      processButton.disabled = false;
    }
  }

  function addFiles(fileCollection) {
    const item = activeTool();
    const selected = Array.from(fileCollection);
    if (!selected.length) return;
    const isImage = item.category === "image" || item.id === "images-to-pdf";
    const valid = selected.filter((file) => isImage
      ? file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name)
      : file.type === "application/pdf" || /\.pdf$/i.test(file.name));
    if (valid.length !== selected.length) showMessage(`Some files were skipped. Select ${isImage ? "image" : "PDF"} files only.`, true);
    const maxSize = isImage ? 25 : 50;
    const sized = valid.filter((file) => file.size > 0 && file.size <= maxSize * 1048576);
    if (sized.length !== valid.length) showMessage(`Empty files or files larger than ${maxSize} MB were skipped.`, true);
    if (!item.multiple && sized.length > 1) showMessage("This tool processes one file at a time; only the first valid file was selected.", true);
    state.files = item.multiple ? [...state.files, ...sized] : sized.slice(0, 1);
    renderFiles();
    if (item.id === "passport-photo") {
      renderFields(item);
      updatePassportEditor();
    }
    byId("progress-wrap").hidden = true;
    if (!result.classList.contains("error")) result.hidden = true;
  }

  function rememberToolOptions() {
    state.options[state.active] = Object.fromEntries(
      Array.from(document.querySelectorAll("#options-panel input, #options-panel select, #options-panel textarea, #passport-adjustments input"), (control) => [control.id, control.value])
    );
  }
  optionsPanel.addEventListener("input", (event) => {
    rememberToolOptions();
    if (activeTool().id === "passport-photo") updatePassportPreview();
  });
  byId("passport-adjustments").addEventListener("input", () => {
    rememberToolOptions();
    updatePassportPreview();
  });
  optionsPanel.addEventListener("change", (event) => {
    if (event.target.id === "unit" && activeTool().id === "passport-photo") {
      const previousUnit = state.options[state.active]?.unit || "mm";
      const nextUnit = event.target.value;
      const mmPerUnit = { mm: 1, cm: 10, in: 25.4 };
      const conversion = mmPerUnit[previousUnit] / mmPerUnit[nextUnit];
      for (const id of ["photo-width", "photo-height", "photo-gap"]) {
        const input = byId(id);
        const converted = Number(input.value) * conversion;
        input.value = Number.isFinite(converted) ? String(Number(converted.toFixed(3))) : "";
      }
      updatePassportUnitLabels(nextUnit);
    }
    rememberToolOptions();
    if (activeTool().id === "passport-photo") updatePassportPreview();
  });
  optionsPanel.addEventListener("click", (event) => {
    if (!event.target.closest("#reset-options")) return;
    delete state.options[state.active];
    renderFields(activeTool());
  });

  document.addEventListener("click", (event) => {
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) {
      const id = favorite.dataset.favorite;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((favoriteId) => favoriteId !== id)
        : [...state.favorites, id];
      storeIds("avr-document-studio-favorites", state.favorites);
      renderCards();
      return;
    }
    const open = event.target.closest("[data-open-tool]");
    if (open) selectTool(open.dataset.openTool, true);
    const quick = event.target.closest("[data-quick]");
    if (quick) selectTool(quick.dataset.quick, true);
    const recent = event.target.closest("[data-recent]");
    if (recent) selectTool(recent.dataset.recent, true);
    const view = event.target.closest("[data-view]");
    if (view) setFilter(view.dataset.view);
    const filter = event.target.closest("[data-filter]");
    if (filter) setFilter(filter.dataset.filter);
  });
  document.addEventListener("pointermove", (event) => {
    const hero = event.target.closest(".hero");
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
    }
    const card = event.target.closest(".tool-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }, { passive: true });
  byId("tool-search").addEventListener("input", renderCards);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      byId("tool-search").focus();
    }
    if (event.key === "Escape" && document.activeElement === byId("tool-search")) {
      byId("tool-search").value = "";
      renderCards();
      byId("tool-search").blur();
    }
  });
  byId("browse-button").addEventListener("click", (event) => { event.stopPropagation(); fileInput.click(); });
  dropZone.addEventListener("click", (event) => { if (!event.target.closest(".browse-button")) fileInput.click(); });
  dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("drag-over"); }));
  ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("drag-over"); }));
  dropZone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));
  byId("clear-button").addEventListener("click", () => {
    state.files = [];
    clearPassportPreview();
    fileInput.value = "";
    if (activeTool().id === "passport-photo") renderFields(activeTool());
    renderFiles();
    result.hidden = true;
    byId("progress-wrap").hidden = true;
  });
  processButton.addEventListener("click", process);
  const themeToggle = byId("theme-toggle");
  function applyTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
    byId("theme-icon").textContent = dark ? "☀" : "☾";
    themeToggle.querySelector(".theme-label").textContent = dark ? "Light mode" : "Dark mode";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#10121c" : "#f6f7fb";
    try { localStorage.setItem("avr-document-studio-theme", dark ? "dark" : "light"); }
    catch { /* Theme still works for this page when storage is unavailable. */ }
  }
  themeToggle.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  byId("year").textContent = new Date().getFullYear();

  const quick = ["merge", "split", "compress-pdf", "images-to-pdf", "resize-image", "passport-photo"];
  byId("quick-tools").innerHTML = quick.map((id) => {
    const item = tools.find((entry) => entry.id === id);
    return `<button type="button" class="quick-link" data-quick="${id}"><span>${item.icon}</span>${escapeHtml(item.name)}</button>`;
  }).join("");
  renderCards();
  renderRecent();
  selectTool("merge");
});
