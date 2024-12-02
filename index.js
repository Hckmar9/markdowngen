document.addEventListener("DOMContentLoaded", function () {
  // Initialize CodeMirror
  const editor = CodeMirror.fromTextArea(
    document.getElementById("markdown-input"),
    {
      mode: "markdown",
      theme: "monokai",
      lineWrapping: true,
      lineNumbers: true,
    }
  );

  // Preview element
  const preview = document.getElementById("preview");

  // Update preview with marked
  function updatePreview() {
    const markdown = editor.getValue();
    preview.innerHTML = marked.parse(markdown);
  }

  // Add change listener
  editor.on("change", updatePreview);

  // Markdown formatting functions
  const actions = {
    h1: () => wrapText("# ", ""),
    h2: () => wrapText("## ", ""),
    h3: () => wrapText("### ", ""),
    bold: () => wrapText("**", "**"),
    italic: () => wrapText("*", "*"),
    strikethrough: () => wrapText("~~", "~~"),
    quote: () => wrapText("> ", ""),
    code: () => wrapText("`", "`"),
    codeblock: () => wrapText("```\n", "\n```"),
    link: () => {
      const url = prompt("Enter URL:");
      if (url) wrapText("[", `](${url})`);
    },
    image: () => {
      const url = prompt("Enter image URL:");
      if (url) wrapText("![", `](${url})`);
    },
    ul: () => wrapText("- ", ""),
    ol: () => wrapText("1. ", ""),
    hr: () => insertText("\n---\n"),
  };

  // Helper function to wrap text with markdown syntax
  function wrapText(before, after) {
    const doc = editor.getDoc();
    const selection = doc.getSelection();

    if (selection) {
      doc.replaceSelection(before + selection + after);
    } else {
      const cursor = doc.getCursor();
      doc.replaceRange(before + after, cursor);
      doc.setCursor({
        line: cursor.line,
        ch: cursor.ch + before.length,
      });
    }
    editor.focus();
  }

  // Helper function to insert text at cursor
  function insertText(text) {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
    editor.focus();
  }

  // Add click handlers for toolbar buttons
  document.querySelectorAll(".toolbar button").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      if (actions[action]) {
        actions[action]();
      }
    });
  });

  // Copy button functionality
  document.getElementById("copy-btn").addEventListener("click", () => {
    const markdown = editor.getValue();
    navigator.clipboard.writeText(markdown).then(() => {
      alert("Content copied to clipboard!");
    });
  });

  // Theme switch functionality
  let isDark = true;
  document.getElementById("theme-switch").addEventListener("click", () => {
    isDark = !isDark;
    editor.setOption("theme", isDark ? "monokai" : "default");
  });

  // Fullscreen functionality
  document.getElementById("fullscreen-btn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
});
