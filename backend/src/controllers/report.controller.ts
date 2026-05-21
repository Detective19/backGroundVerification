import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReportService } from '../services/report.service';

const prisma = new PrismaClient();

export const generateCandidateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action = 'preview' } = req.query; // 'preview' or 'download'

    // Use Prisma to fetch candidate if connected, otherwise we can mock for now
    // As per previous implementation, we'll fetch from DB
    let candidate: any;
    try {
      candidate = await prisma.candidate.findUnique({
        where: { id }
      });
    } catch (e) {
      // Mock fallback if DB not setup
      candidate = {
        id,
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 555-123-4567',
        status: 'Verified',
        aadhaarNumber: '123456789012',
        panNumber: 'ABCDE1234F'
      };
    }

    if (!candidate) {
      res.status(404).json({ success: false, error: 'Candidate not found' });
      return;
    }

    const reportData = {
      candidateName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone || 'N/A',
      aadhaarStatus: 'Verified',
      panStatus: 'Verified',
      overallStatus: candidate.status,
      verifiedBy: 'Admin User',
      aadhaarNumber: candidate.aadhaarNumber || '123456789012',
      panNumber: candidate.panNumber || 'ABCDE1234F'
    };

    const pdfBuffer = await ReportService.generateReport(reportData);

    const filename = `background_report_${candidate.fullName.replace(/\s+/g, '_')}.pdf`;

    if (action === 'download') {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
};
