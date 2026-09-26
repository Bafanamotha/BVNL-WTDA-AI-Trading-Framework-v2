import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInvoiceJsPdfDoc } from './src/utils/pdfGenerator';
import { DEFAULT_INVOICE_SETTINGS, INITIAL_TRIPS } from './src/data/logbookData';
import { InvoicePricingMode } from './src/types/invoice';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON and URL-encoded body parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Direct Server Download PDF Endpoint (immune to iframe sandbox restrictions)
  app.get('/api/download-invoice-pdf', (req, res) => {
    try {
      const pricingMode = (req.query.pricingMode as InvoicePricingMode) || 'raw_trips';
      const viewMode = (req.query.viewMode as 'detailed' | 'daily') || 'detailed';

      const customSettings = {
        ...DEFAULT_INVOICE_SETTINGS,
        invoiceNumber: (req.query.invoiceNumber as string) || DEFAULT_INVOICE_SETTINGS.invoiceNumber,
        invoiceDate: (req.query.invoiceDate as string) || DEFAULT_INVOICE_SETTINGS.invoiceDate,
      };

      const { doc, filename } = createInvoiceJsPdfDoc(
        customSettings,
        INITIAL_TRIPS,
        pricingMode,
        viewMode
      );

      const arrayBuffer = doc.output('arraybuffer');
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      return res.end(buffer);
    } catch (err: any) {
      console.error('Error generating PDF on server:', err);
      return res.status(500).send(`Failed to generate PDF document: ${err?.message || err}`);
    }
  });

  // POST endpoint for custom invoice settings
  app.post('/api/download-pdf', (req, res) => {
    try {
      const { settings, pricingMode = 'raw_trips', viewMode = 'detailed', pdfBase64, filename: customFilename } = req.body;

      if (pdfBase64) {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const filename = (customFilename || 'INVOICE_NO_5.pdf').replace(/[^a-zA-Z0-9_.-]/g, '_');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        return res.end(buffer);
      }

      const activeSettings = {
        ...DEFAULT_INVOICE_SETTINGS,
        ...(settings || {}),
      };

      const { doc, filename } = createInvoiceJsPdfDoc(
        activeSettings,
        INITIAL_TRIPS,
        pricingMode,
        viewMode
      );

      const arrayBuffer = doc.output('arraybuffer');
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      return res.end(buffer);
    } catch (err) {
      console.error('Error handling download-pdf POST:', err);
      return res.status(500).send('Failed to handle PDF download');
    }
  });

  // Serve public static folder
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Direct route to view the BVNL/WTDA arena project
  app.get(['/arena-project', '/arena-framework'], (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'arena-project.html'));
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
