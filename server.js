const express = require('express');
const path = require('path');
const compression = require('compression');
const history = require('connect-history-api-fallback');

const app = express();
const PORT = process.env.PORT || 3001;

// Compresión gzip
app.use(compression());

// Middleware para SPA - debe ir ANTES de static
app.use(history({
  verbose: true,
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: function(context) {
        return context.parsedUrl.path;
      }
    }
  ]
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
