const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Root directory for everything
const ROOT_DIR = __dirname;
const IGNORE_DIRS = ['.git', '.vscode', 'node_modules'];

// Function to extract body content from index.html (same as before)
function extractBodyContent(htmlContent) {
    const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return htmlContent.trim();
}

// Build the array of kits dynamically
function getKitsData() {
    const categories = [];
    const items = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory() && !IGNORE_DIRS.includes(item.name)) {
            const categoryDir = path.join(ROOT_DIR, item.name);
            const categoryObj = {
                name: item.name,
                html: '',
                cssFiles: []
            };

            const files = fs.readdirSync(categoryDir);
            
            for (const file of files) {
                const filePath = path.join(categoryDir, file);
                const fileStat = fs.statSync(filePath);

                if (fileStat.isFile()) {
                    if (file === 'index.html') {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        categoryObj.html = extractBodyContent(content);
                    } else if (file.endsWith('.css')) {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        categoryObj.cssFiles.push({
                            name: file,
                            code: content
                        });
                    }
                }
            }

            // Only add if there is actual content
            if (categoryObj.html || categoryObj.cssFiles.length > 0) {
                categories.push(categoryObj);
            }
        }
    }
    return categories;
}

// API endpoint to serve kits data dynamically
app.get('/api/kits', (req, res) => {
    try {
        const categories = getKitsData();
        res.json({
            lastUpdated: new Date().toISOString(),
            categories: categories
        });
    } catch (error) {
        console.error('Error reading kits data:', error);
        res.status(500).json({ error: 'Failed to read kits data' });
    }
});

// Serve static files from the root (index.html, style.css, app.js, images)
// This must come AFTER the API route so it doesn't conflict
app.use(express.static(ROOT_DIR));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CSS Kits Registry server running at http://localhost:${PORT}`);
    console.log(`Data API available at http://localhost:${PORT}/api/kits`);
});
