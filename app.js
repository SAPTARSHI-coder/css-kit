document.addEventListener('DOMContentLoaded', () => {
  const categoryList = document.getElementById('category-list');
  const welcomeView = document.getElementById('welcome-message');
  const categoryView = document.getElementById('category-view');
  const currentCategoryTitle = document.getElementById('current-category-title');
  const previewFrame = document.getElementById('preview-frame');
  const refreshPreviewBtn = document.getElementById('refresh-preview');
  
  const htmlSource = document.getElementById('html-source');
  const cssTabsHeader = document.getElementById('css-tabs-header');
  const htmlTabBtn = document.querySelector('.tab-btn[data-target="html-code"]');
  const tabsContentContainer = document.querySelector('.tabs-content');
  
  let kitsData = null;
  let activeCategory = null;

  // Fetch the kits data dynamically from Express API
  fetch('/api/kits')
    .then(response => response.json())
    .then(data => {
      kitsData = data.categories;
      renderSidebar();
    })
    .catch(error => {
      console.error('Error loading kits data:', error);
      welcomeView.innerHTML = `<div class="glass-card welcome-card"><h2>Error</h2><p>Failed to load API data. Make sure server.js is running.</p></div>`;
    });

  function renderSidebar() {
    kitsData.forEach((category, index) => {
      const li = document.createElement('li');
      li.className = 'category-item';
      li.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        ${category.name}
      `;
      li.addEventListener('click', () => selectCategory(index, li));
      categoryList.appendChild(li);
    });
  }

  function selectCategory(index, listItemElement) {
    // Update active class in sidebar
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    listItemElement.classList.add('active');

    activeCategory = kitsData[index];
    
    // Update view state
    welcomeView.classList.add('hidden');
    categoryView.classList.remove('hidden');
    
    // Update category title
    currentCategoryTitle.textContent = activeCategory.name;

    renderPreview();
    renderSourceCode();
  }

  function renderPreview() {
    if (!activeCategory) return;
    
    // Combine all CSS into one string for the preview
    let combinedCss = '';
    if (activeCategory.cssFiles) {
      activeCategory.cssFiles.forEach(file => {
        combinedCss += `\n/* ${file.name} */\n${file.code}\n`;
      });
    }

    // Modern backdrop for iframe
    const iframeContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #0f172a; /* Same dark theme as parent */
            color: #f8fafc;
            font-family: 'Outfit', sans-serif;
            overflow: hidden;
            box-sizing: border-box;
          }
          * { box-sizing: inherit; }
          
          /* Injected CSS */
          ${combinedCss}
        </style>
      </head>
      <body>
        ${activeCategory.html || '<p>No HTML provided for this kit.</p>'}
      </body>
      </html>
    `;
    
    previewFrame.srcdoc = iframeContent;
  }

  function renderSourceCode() {
    if (!activeCategory) return;
    
    // 1. Setup HTML Tab
    htmlSource.textContent = formatHtml(activeCategory.html || '<!-- No HTML available -->');
    
    // 2. Clear previous specific CSS tabs
    cssTabsHeader.innerHTML = '';
    
    // Remove existing CSS panels
    document.querySelectorAll('.code-panel.css-panel').forEach(el => el.remove());
    
    // Reset active tab to HTML
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.code-panel').forEach(panel => panel.classList.remove('active'));
    htmlTabBtn.classList.add('active');
    document.getElementById('html-code').classList.add('active');

    // 3. Create CSS tabs and panels
    if (activeCategory.cssFiles && activeCategory.cssFiles.length > 0) {
      activeCategory.cssFiles.forEach((cssFile, idx) => {
        const targetId = `css-code-${idx}`;
        
        // Tab Header
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab-btn';
        tabBtn.dataset.target = targetId;
        tabBtn.textContent = cssFile.name;
        cssTabsHeader.appendChild(tabBtn);
        
        // Tab Content Panel
        const panel = document.createElement('div');
        panel.id = targetId;
        panel.className = 'code-panel css-panel';
        panel.innerHTML = `
          <div class="code-utils">
            <button class="copy-btn">Copy CSS</button>
          </div>
          <pre><code class="language-css" id="${targetId}-source"></code></pre>
        `;
        tabsContentContainer.appendChild(panel);
        
        // Set code text securely
        const codeElement = panel.querySelector('code');
        codeElement.textContent = cssFile.code;
      });
    }

    // Attach Tab switching logic
    attachTabListeners();
    
    // Attach Copy logic
    attachCopyListeners();

    // Call Prism to highlight the newly added code blocks
    if (window.Prism) {
      Prism.highlightAll();
    }
  }

  function attachTabListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      // Remove old listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', (e) => {
        // Deactivate all
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
        
        // Activate target
        const targetId = e.target.dataset.target;
        e.target.classList.add('active');
        document.getElementById(targetId).classList.add('active');
      });
    });
  }

  function attachCopyListeners() {
    const codePanels = document.querySelectorAll('.code-panel');
    codePanels.forEach(panel => {
      const copyBtn = panel.querySelector('.copy-btn');
      const codeBlock = panel.querySelector('pre code');
      
      if (copyBtn && codeBlock) {
        // Re-attach fresh listener
        const newBtn = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newBtn, copyBtn);
        
        newBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeBlock.textContent).then(() => {
            const originalText = newBtn.textContent;
            newBtn.textContent = 'Copied!';
            newBtn.classList.add('copied');
            
            setTimeout(() => {
              newBtn.textContent = originalText;
              newBtn.classList.remove('copied');
            }, 2000);
          });
        });
      }
    });
  }

  function formatHtml(html) {
    // Basic formatting if it's jumbled, or just trim
    return html.trim();
  }

  refreshPreviewBtn.addEventListener('click', () => {
    // Quick animation for refresh
    refreshPreviewBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => refreshPreviewBtn.style.transform = '', 300);
    renderPreview();
  });
});
