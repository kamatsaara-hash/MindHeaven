import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import { jsPDF } from 'jspdf'

export default function Analytics() {
  const data = [
    { name: 'Mon', logins: 4000, newSignups: 2400 },
    { name: 'Tue', logins: 3000, newSignups: 1398 },
    { name: 'Wed', logins: 2000, newSignups: 9800 },
    { name: 'Thu', logins: 2780, newSignups: 3908 },
    { name: 'Fri', logins: 1890, newSignups: 4800 },
    { name: 'Sat', logins: 2390, newSignups: 3800 },
    { name: 'Sun', logins: 3490, newSignups: 4300 },
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(139, 92, 246); // Lavender/Violet theme color (#8b5cf6)
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("MindHaven Platform Analytics", 15, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 34);

    // Section 1: Weekly Engagement
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Weekly User Engagement Metrics", 15, 55);
    
    // Draw lines & table headers
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, 58, 195, 58);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Day", 20, 66);
    doc.text("Daily Logins", 70, 66);
    doc.text("New Signups", 140, 66);
    doc.line(15, 69, 195, 69);
    
    doc.setFont("helvetica", "normal");
    let y = 76;
    data.forEach((item) => {
      doc.text(item.name, 20, y);
      doc.text(item.logins.toLocaleString(), 70, y);
      doc.text(item.newSignups.toLocaleString(), 140, y);
      doc.line(15, y + 3, 195, y + 3);
      y += 8;
    });

    // Section 2: Engagement Insights
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Content & Session Insights", 15, y);
    doc.line(15, y + 3, 195, y + 3);
    
    y += 10;
    doc.setFontSize(11);
    doc.text("Most Viewed Resources", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const resources = [
      'Understanding Panic Attacks (3,420 views)',
      'Guided Meditation: Sleep (1,850 views)',
      'Dealing with Burnout (2,910 views)'
    ];
    resources.forEach((res, index) => {
      y += 6;
      doc.text(`${index + 1}. ${res}`, 25, y);
    });

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Session Duration Summary", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 6;
    doc.text("Average Time Spent (per session): 14m 22s", 25, y);
    y += 6;
    doc.text("Weekly Trend: +2m from last week", 25, y);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("MindHaven Admin Panel - Confidential", 15, 285);
    doc.text("Page 1 of 1", 180, 285);

    // Save/Download PDF and open in a new window/tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Automatically trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'platform_analytics_report.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also open in a new window/tab as requested by the user
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Platform Analytics" 
        description="Deep dive into user engagement, retention, and time spent."
        action={
          <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900" onClick={exportToPDF}>
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        }
      />

      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Weekly Engagement</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="logins" name="Daily Logins" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newSignups" name="New Signups" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Most Viewed Resources</h3>
          <ul className="space-y-4">
            {['Understanding Panic Attacks', 'Guided Meditation: Sleep', 'Dealing with Burnout'].map((item, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">{i+1}. {item}</span>
                <span className="font-medium text-slate-900 dark:text-white">{(Math.random() * 5000).toFixed(0)} views</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Avg. Time Spent (per session)</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <span className="text-4xl font-bold text-lavender-600 dark:text-lavender-400">14m 22s</span>
              <p className="text-sm text-green-600 mt-2">+2m from last week</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
