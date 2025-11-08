import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Eye, RefreshCw, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import LogoSpinner from "../components/LogoSpinner";
import { generateMedicalReport } from "../utils/pdfReportGenerator";

const UploadHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 0 });
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Resolve API base URL
  const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
    ? process.env.REACT_APP_API_URL.trim()
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : '';

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(page === 1);
      setRefreshing(page > 1);
      
      const response = await fetch(`${apiBase}/api/analysis/history?page=${page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses);
        setPagination(data.pagination);
      } else {
        toast({
          title: "Failed to load history",
          description: "Could not fetch your analysis history",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const getResultBadge = (analysis) => {
    if (analysis.status === 'processing') {
      return <Badge variant="secondary">Processing...</Badge>;
    }
    if (analysis.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    if (analysis.status === 'uploaded') {
      return <Badge variant="outline">Uploaded</Badge>;
    }
    
    const diagnosis = analysis.results?.diagnosis || 'Unknown';
    if (diagnosis.toLowerCase().includes('normal')) {
      return <Badge className="bg-success text-success-foreground">Normal</Badge>;
    }
    if (diagnosis.toLowerCase().includes('abnormal')) {
      return <Badge variant="destructive">Abnormal</Badge>;
    }
    return <Badge variant="secondary">{diagnosis}</Badge>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleView = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowDialog(true);
  };

  const handleDownloadCSV = (analysis) => {
    try {
      // Convert base64 fileData back to CSV blob
      if (analysis.fileData && analysis.imageType === 'Epilepsy') {
        // Extract base64 data (remove data:text/csv;base64, prefix)
        const base64Data = analysis.fileData.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'text/csv' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = analysis.originalName || 'seizure_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download Started",
          description: "Your CSV file is being downloaded.",
        });
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = (analysis) => {
    try {
      generateMedicalReport(analysis, user);
      toast({
        title: "Report Downloaded",
        description: "Medical report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
  <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload History</h1>
        <p className="text-muted-foreground">
          View and manage all your previous medical image analyses.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6 h-32 flex items-center justify-center text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Uploads</p>
              <p className="text-3xl font-bold">{pagination.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6 h-32 flex items-center justify-center text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold">
                {analyses.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6 h-32 flex items-center justify-center text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Processing</p>
              <p className="text-3xl font-bold">
                {analyses.filter(a => a.status === 'processing').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>List of recently analyzed medical images</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistory(pagination.page)}
              disabled={refreshing}
            >
              {refreshing ? (
                <LogoSpinner inline size={16} ringWidth={2} className="mx-auto" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LogoSpinner label="Fetching history..." />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No analyses found. Upload your first medical image to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SerNo</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis, index) => (
                  <TableRow key={analysis._id}>
                    <TableCell className="font-medium">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {analysis.patientInfo?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {analysis.patientInfo?.age || 'N/A'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {analysis.patientInfo?.gender || 'N/A'}
                    </TableCell>
                    <TableCell>{analysis.originalName}</TableCell>
                    <TableCell>{analysis.imageType}</TableCell>
                    <TableCell>{getResultBadge(analysis)}</TableCell>
                    <TableCell>
                      {formatDate(analysis.createdAt)}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(analysis.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleView(analysis)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadReport(analysis)}
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Result dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
            <DialogDescription>View patient details, uploaded image, and AI results.</DialogDescription>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="mt-4 space-y-6">
              {/* Patient Information Section */}
              {selectedAnalysis.patientInfo && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-sm">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Name:</strong> {selectedAnalysis.patientInfo.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Age:</strong> {selectedAnalysis.patientInfo.age || 'N/A'}
                    </div>
                    <div>
                      <strong>Gender:</strong> <span className="capitalize">{selectedAnalysis.patientInfo.gender || 'N/A'}</span>
                    </div>
                    {selectedAnalysis.patientInfo.patientId && (
                      <div>
                        <strong>Patient ID:</strong> {selectedAnalysis.patientInfo.patientId}
                      </div>
                    )}
                    {selectedAnalysis.patientInfo.contactNumber && (
                      <div>
                        <strong>Contact:</strong> {selectedAnalysis.patientInfo.contactNumber}
                      </div>
                    )}
                    {selectedAnalysis.patientInfo.email && (
                      <div>
                        <strong>Email:</strong> {selectedAnalysis.patientInfo.email}
                      </div>
                    )}
                    {selectedAnalysis.patientInfo.referringDoctor && (
                      <div className="col-span-2">
                        <strong>Referring Doctor:</strong> {selectedAnalysis.patientInfo.referringDoctor}
                      </div>
                    )}
                    {selectedAnalysis.patientInfo.symptoms && (
                      <div className="col-span-2">
                        <strong>Symptoms:</strong> {selectedAnalysis.patientInfo.symptoms}
                      </div>
                    )}
                    {selectedAnalysis.patientInfo.medicalHistory && (
                      <div className="col-span-2">
                        <strong>Medical History:</strong> {selectedAnalysis.patientInfo.medicalHistory}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Section or CSV Download */}
              {selectedAnalysis.imageType === 'Epilepsy' ? (
                <div className="flex flex-col items-center justify-center p-8 border rounded bg-muted/20">
                  <div className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground">
                      CSV File: {selectedAnalysis.originalName}
                    </div>
                    <Button 
                      onClick={() => handleDownloadCSV(selectedAnalysis)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                </div>
              ) : selectedAnalysis.fileData ? (
                <img src={selectedAnalysis.fileData} alt={selectedAnalysis.originalName} className="max-h-64 mx-auto rounded border" />
              ) : (
                <div className="text-sm text-muted-foreground text-center p-8 border rounded">No image data available</div>
              )}

              {/* Analysis Results Section */}
              <div className="space-y-2">
                <div><strong>File:</strong> {selectedAnalysis.originalName}</div>
                <div><strong>Status:</strong> <span className="capitalize">{selectedAnalysis.status}</span></div>
                <div><strong>Diagnosis:</strong> {selectedAnalysis.results?.diagnosis || '-'}</div>
                {selectedAnalysis.results?.findings && selectedAnalysis.results.findings.length > 0 && (
                  <div>
                    <strong>Findings:</strong>
                    <ul className="list-disc ml-5 text-sm">
                      {selectedAnalysis.results.findings.map((f, idx) => (
                        <li key={idx}>{f.description || f.type}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex w-full justify-end">
              <Button onClick={() => setShowDialog(false)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadHistory;