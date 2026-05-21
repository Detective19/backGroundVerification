import puppeteer from 'puppeteer';

interface ReportData {
  candidateName: string;
  email: string;
  phone: string;
  aadhaarStatus: string;
  panStatus: string;
  overallStatus: string;
  verifiedBy: string;
  aadhaarNumber?: string;
  panNumber?: string;
}

export class ReportService {
  /**
   * Masks Aadhaar number to only show last 4 digits
   */
  private static maskAadhaar(aadhaar?: string): string {
    if (!aadhaar || aadhaar.length < 12) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  }

  /**
   * Masks PAN number
   */
  private static maskPan(pan?: string): string {
    if (!pan || pan.length !== 10) return 'XXXXX0000X';
    return `${pan.slice(0, 2)}XXX${pan.slice(5, 9)}${pan.slice(-1)}`;
  }

  private static generateHtmlTemplate(data: ReportData, generatedTime: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Background Verification Report</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0ea5e9;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #0ea5e9;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            font-weight: 600;
            color: #64748b;
            width: 40%;
          }
          .status {
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .status.verified { color: #16a34a; background-color: #f0fdf4; }
          .status.pending { color: #ca8a04; background-color: #fffbeb; }
          .status.failed { color: #dc2626; background-color: #fef2f2; }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          .signature-box {
            margin-top: 40px;
            width: 200px;
            border-bottom: 1px dashed #94a3b8;
            height: 40px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Background Verification Report</h1>
          <p>Confidential Document</p>
        </div>

        <div class="section">
          <div class="section-title">Candidate Information</div>
          <table>
            <tr>
              <th>Candidate Name</th>
              <td>${data.candidateName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${data.email}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>${data.phone}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Verification Results</div>
          <table>
            <tr>
              <th>Aadhaar Number (Masked)</th>
              <td>${this.maskAadhaar(data.aadhaarNumber)}</td>
            </tr>
            <tr>
              <th>Aadhaar Status</th>
              <td><span class="status ${data.aadhaarStatus.toLowerCase()}">${data.aadhaarStatus}</span></td>
            </tr>
            <tr>
              <th>PAN Number (Masked)</th>
              <td>${this.maskPan(data.panNumber)}</td>
            </tr>
            <tr>
              <th>PAN Status</th>
              <td><span class="status ${data.panStatus.toLowerCase()}">${data.panStatus}</span></td>
            </tr>
            <tr>
              <th>Overall Status</th>
              <td><span class="status ${data.overallStatus.toLowerCase()}">${data.overallStatus}</span></td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <table>
            <tr>
              <th>Generated Time</th>
              <td>${generatedTime}</td>
            </tr>
            <tr>
              <th>Verified By</th>
              <td>${data.verifiedBy}</td>
            </tr>
          </table>
          
          <div class="signature-box"></div>
          <p style="font-size: 12px; color: #64748b;">Authorized Signature</p>
        </div>
      </body>
      </html>
    `;
  }

  public static async generateReport(data: ReportData): Promise<Buffer> {
    const generatedTime = new Date().toLocaleString();
    const htmlContent = this.generateHtmlTemplate(data, generatedTime);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();
    
    // Puppeteer 22+ returns a Uint8Array, we convert to Buffer for Express
    return Buffer.from(pdfBuffer);
  }
}
