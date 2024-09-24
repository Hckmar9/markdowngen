let editor;

document.addEventListener("DOMContentLoaded", function () {
  const preview = document.getElementById("preview");

  editor = CodeMirror.fromTextArea(document.getElementById("markdown-input"), {
    mode: "markdown",
    lineNumbers: true,
    theme: "default",
    lineWrapping: true,
  });

  function updatePreview() {
    const markdownText = editor.getValue();
    const htmlText = marked.parse(markdownText);
    preview.innerHTML = htmlText;
  }

  editor.on("change", updatePreview);

  // Initial preview update
  updatePreview();

  // Toolbar functionality
  document.querySelectorAll(".toolbar button").forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      let selection = editor.getSelection();

      switch (action) {
        case "bold":
          editor.replaceSelection(`**${selection}**`);
          break;
        case "italic":
          editor.replaceSelection(`*${selection}*`);
          break;
        case "link":
          if (selection) {
            editor.replaceSelection(`[${selection}](url)`);
          } else {
            editor.replaceSelection("[Link text](url)");
          }
          break;
        case "image":
          editor.replaceSelection(`![alt text](image-url)`);
          break;
        case "code":
          if (selection.indexOf("\n") !== -1) {
            editor.replaceSelection("```\n" + selection + "\n```");
          } else {
            editor.replaceSelection("`" + selection + "`");
          }
          break;
      }
      editor.focus();
    });
  });

  // Fullscreen functionality
  document
    .getElementById("fullscreen-btn")
    .addEventListener("click", function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

  // Theme switch functionality
  let isDarkTheme = false;
  document
    .getElementById("theme-switch")
    .addEventListener("click", function () {
      isDarkTheme = !isDarkTheme;
      if (isDarkTheme) {
        document.body.classList.add("dark-theme");
        editor.setOption("theme", "monokai");
      } else {
        document.body.classList.remove("dark-theme");
        editor.setOption("theme", "default");
      }
    });

  // Resize editor on window resize
  function resizeEditor() {
    const editorElement = editor.getWrapperElement();
    const availableHeight = editorElement.parentElement.clientHeight;
    const toolbarHeight = document.querySelector(".toolbar").offsetHeight;
    const editorHeight = availableHeight - toolbarHeight - 20; // 20px for padding
    editorElement.style.height = `${editorHeight}px`;
    editor.refresh();
  }

  window.addEventListener("resize", resizeEditor);
  resizeEditor(); // Initial resize

  // Copy button functionality
  document.getElementById("copy-btn").addEventListener("click", function () {
    const previewText = preview.innerText;

    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = previewText;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");

    document.body.removeChild(tempTextArea);

    this.textContent = "Copied!";
    setTimeout(() => {
      this.textContent = "Copy";
    }, 2000);
  });
});
