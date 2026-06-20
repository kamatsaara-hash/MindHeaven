import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileSpreadsheet, Download, FileText, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'

export default function Reports() {
  const reports = [
    { title: 'Monthly Platform Summary (April 2024)', type: 'PDF', date: 'May 1, 2024', size: '2.4 MB' },
    { title: 'User Engagement Analytics Q1', type: 'Excel', date: 'Apr 5, 2024', size: '1.1 MB' },
    { title: 'Counselor Session Logs (March)', type: 'CSV', date: 'Apr 1, 2024', size: '450 KB' },
  ]

  const downloadReport = (title: string) => {
    const doc = new jsPDF();
    
    // Header banner
    doc.setFillColor(139, 92, 246); // Lavender theme
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, 15, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Report Generated on: ${new Date().toLocaleDateString()}`, 15, 34);

    doc.setTextColor(15, 23, 42); // slate-900

    if (title.includes('Monthly Platform Summary')) {
      // Monthly Platform Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("1. Executive Summary", 15, 55);
      doc.line(15, 58, 195, 58);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let y = 66;
      doc.text("Total Registered Users: 12,480", 20, y); y += 8;
      doc.text("Monthly Active Users: 8,920", 20, y); y += 8;
      doc.text("New User Registrations: +1,240 (11% growth from last month)", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. Counselor Support Services", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("Active Certified Counselors: 45", 20, y); y += 8;
      doc.text("Sessions Booked: 1,840", 20, y); y += 8;
      doc.text("Completed Sessions: 1,620", 20, y); y += 8;
      doc.text("Average Session Rating: 4.85 / 5", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. Safe Space Moderation", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("Flagged Posts: 112", 20, y); y += 8;
      doc.text("Resolved Reports: 108", 20, y); y += 8;
      doc.text("Warnings Issued to Users: 14", 20, y);
      
    } else if (title.includes('User Engagement Analytics')) {
      // User Engagement Analytics
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("1. Platform Traffic Overview", 15, 55);
      doc.line(15, 58, 195, 58);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let y = 66;
      doc.text("Total Sessions: 42,800", 20, y); y += 8;
      doc.text("Unique Visitors: 18,300", 20, y); y += 8;
      doc.text("Page Views: 154,200", 20, y); y += 8;
      doc.text("Average Session Duration: 14 minutes 22 seconds", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. Popular Discussion Categories", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("- Anxiety & Stress Management (45% of posts)", 20, y); y += 8;
      doc.text("- Depression & Mood Support (25% of posts)", 20, y); y += 8;
      doc.text("- Work Burnout & Academic Pressure (15% of posts)", 20, y); y += 8;
      doc.text("- Relationships & Family Support (15% of posts)", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. Time of Day Activity Distribution", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("Morning (6 AM - 12 PM): 15%", 20, y); y += 8;
      doc.text("Afternoon (12 PM - 6 PM): 30%", 20, y); y += 8;
      doc.text("Evening (6 PM - 12 AM): 40% (Peak hours)", 20, y); y += 8;
      doc.text("Late Night (12 AM - 6 AM): 15%", 20, y);
      
    } else {
      // Counselor Session Logs
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("1. Session Volume Overview", 15, 55);
      doc.line(15, 58, 195, 58);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let y = 66;
      doc.text("Total Scheduled Sessions: 1,510", 20, y); y += 8;
      doc.text("Completed Sessions: 1,390", 20, y); y += 8;
      doc.text("Cancelled / Rescheduled: 120", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. Counselor Metrics & Performance", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("- Dr. Sarah Mitchell: 147 completed sessions, 4.90 average rating", 20, y); y += 8;
      doc.text("- James Chen, MD: 203 completed sessions, 4.80 average rating", 20, y); y += 8;
      doc.text("- Emily Johnson: 189 completed sessions, 4.90 average rating", 20, y); y += 8;
      doc.text("- Michael Rodriguez: 165 completed sessions, 4.70 average rating", 20, y); y += 8;
      doc.text("- Dr. Priya Patel: 124 completed sessions, 4.95 average rating", 20, y);
      
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. Client Feedback Summary", 15, y);
      doc.line(15, y + 3, 195, y + 3);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 11;
      doc.text("- Positive consultation rating (helpful/validated): 92%", 20, y); y += 8;
      doc.text("- Audio/Video connection stability: 88%", 20, y); y += 8;
      doc.text("- Booking ease of use: 95%", 20, y);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("MindHaven Admin Panel - Generated Report", 15, 285);
    doc.text("Page 1 of 1", 180, 285);

    // Save and open in PDF format
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Automatically trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Open in a new tab/window as PDF
    window.open(pdfUrl, '_blank');
    
    toast.success('PDF report generated and opened successfully');
  };

  const generateNewReport = () => {
    downloadReport('Platform Activity & Engagement Report (Live)');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Generated Reports" 
        description="Download historical data, summaries, and analytics reports."
        action={
          <Button className="bg-lavender-600 hover:bg-lavender-700 text-white border-none gap-2" onClick={generateNewReport}>
            <FileSpreadsheet className="w-4 h-4" />
            Generate New Report
          </Button>
        }
      />

      <div className="grid gap-4">
        {reports.map((report, idx) => (
          <Card key={idx} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                {report.type === 'PDF' ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{report.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                  <span>{report.type}</span>
                  <span>{report.size}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadReport(report.title)}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
