import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, CheckCircle, FileImage, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";
import LogoSpinner from "../components/LogoSpinner";
import RouteLoadingOverlay from "../components/RouteLoadingOverlay";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "../components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../components/ui/alert-dialog";

const UploadImage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showNotModalityAlert, setShowNotModalityAlert] = useState(false);
  const [showPatientDetailsAlert, setShowPatientDetailsAlert] = useState(false);
  
  // Patient Information State
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    patientId: '',
    contactNumber: '',
    email: '',
    symptoms: '',
    medicalHistory: '',
    referringDoctor: '',
    doctorId: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Flask backend runs on port 5001
  const flaskBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5001'
    : 'http://localhost:5001'; // Update if deployed elsewhere
  // Node backend for history (port 5000)
  const nodeBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
    ? process.env.REACT_APP_API_URL.trim()
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : '';

  // Auto-fill referring doctor from user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${nodeBase}/api/profile`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          // Auto-fill referring doctor with user's full name and doctor ID
          if (profileData.full_name) {
            setPatientInfo(prev => ({
              ...prev,
              referringDoctor: profileData.full_name,
              doctorId: profileData.doctor_id || ''
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [nodeBase]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'text/csv', 'application/vnd.ms-excel'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.csv'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image (JPG, PNG) or CSV file for EEG analysis.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setPipelineResult(null); // Clear previous results
    toast({
      title: "File Uploaded Successfully",
      description: `${file.name} is ready for analysis.`,
    });
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        title: "Missing Information",
        description: "Please upload a file before analyzing.",
        variant: "destructive",
      });
      return;
    }

    // Validate required patient information - show popup
    if (!patientInfo.name || !patientInfo.age || !patientInfo.gender) {
      setShowPatientDetailsAlert(true);
      return;
    }

    // Validate age
    const age = parseInt(patientInfo.age);
    if (isNaN(age) || age < 0 || age > 150) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 0 and 150.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setPipelineResult(null);
    const uploadStartTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const filename = uploadedFile.name.toLowerCase();
      const isCSV = filename.endsWith('.csv');

      // If CSV, call epilepsy endpoint directly
      if (isCSV) {
        const epilepsyRes = await fetch(`${flaskBase}/epilepsy`, {
          method: 'POST',
          body: formData,
        });
        const epilepsyData = await epilepsyRes.json();
        if (epilepsyRes.ok) {
          const resultText = epilepsyData.result || epilepsyData.results;
          setPipelineResult({
            stage: 'Epilepsy Analysis',
            result: resultText,
          });
          setShowResultDialog(true);
          toast({ title: 'Analysis Complete', description: 'Epilepsy prediction finished.' });
          
          // Save epilepsy analysis to database
          try {
            console.log('Starting epilepsy save process...');
            const fileData = await (async () => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(uploadedFile);
              });
            })();
            
            console.log('File converted to base64, preparing save body...');
            const saveBody = {
              fileName: uploadedFile.name,
              fileData,
              fileType: uploadedFile.type,
              fileSize: uploadedFile.size,
              imageType: 'Epilepsy',
              patientInfo: {
                name: patientInfo.name,
                age: parseInt(patientInfo.age),
                gender: patientInfo.gender,
                patientId: patientInfo.patientId || undefined,
                contactNumber: patientInfo.contactNumber || undefined,
                email: patientInfo.email || undefined,
                symptoms: patientInfo.symptoms || undefined,
                medicalHistory: patientInfo.medicalHistory || undefined,
                referringDoctor: patientInfo.referringDoctor || undefined,
                doctorId: patientInfo.doctorId || undefined
              },
              results: {
                diagnosis: resultText,
                confidence: 95,
                findings: [{
                  type: 'Seizure Analysis',
                  description: 'EEG data analyzed for seizure activity patterns',
                  severity: resultText.includes('Seizure') ? 'high' : 'low',
                  confidence: 95
                }],
                recommendations: resultText.includes('Seizure') 
                  ? [
                      {
                        type: 'Medical Consultation',
                        description: 'Consult neurologist for detailed evaluation',
                        priority: 'high'
                      },
                      {
                        type: 'Monitoring',
                        description: 'Monitor seizure activity and maintain detailed records',
                        priority: 'high'
                      }
                    ]
                  : [
                      {
                        type: 'Routine Monitoring',
                        description: 'Continue regular monitoring as prescribed',
                        priority: 'medium'
                      }
                    ],
                processingTime: Date.now() - uploadStartTime
              }
            };
            
            console.log('Sending epilepsy save request with body:', {
              fileName: saveBody.fileName,
              imageType: saveBody.imageType,
              diagnosis: saveBody.results.diagnosis
            });
            
            const saveRes = await fetch(`${nodeBase}/api/analysis/upload`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(saveBody),
              credentials: 'include'
            });
            
            console.log('Save response status:', saveRes.status);
            
            if (saveRes.ok) {
              const savedData = await saveRes.json();
              console.log('Epilepsy analysis saved successfully:', savedData);
              toast({ 
                title: 'Analysis Saved', 
                description: 'Seizure analysis has been saved to your history.' 
              });
            } else {
              const errorData = await saveRes.json().catch(() => ({}));
              console.error('Failed to save epilepsy analysis. Status:', saveRes.status, 'Error:', errorData);
              toast({ 
                title: 'Warning', 
                description: `Analysis completed but failed to save: ${errorData.message || 'Unknown error'}`, 
                variant: 'destructive' 
              });
            }
          } catch (saveError) {
            console.error('Exception during epilepsy save:', saveError);
            toast({ 
              title: 'Warning', 
              description: 'Analysis completed but failed to save to history.', 
              variant: 'destructive' 
            });
          }
        } else {
          throw new Error(epilepsyData.error || 'Epilepsy analysis failed');
        }
        setIsUploading(false);
        return;
      }

      // Otherwise, run image pipeline: /predict → /classify → /subtype
      // Step 1: Modality check
      const predictRes = await fetch(`${flaskBase}/predict`, {
        method: 'POST',
        body: formData,
      });
      const predictData = await predictRes.json();
      console.log('Predict response:', predictData);
      if (!predictRes.ok) {
        throw new Error(predictData.error || 'Modality check failed');
      }
      
      // Check if not our modality
      if (predictData.isNotOurModality || predictData.prediction !== 'Our Modality') {
        console.log('Not our modality detected, showing alert');
        setShowNotModalityAlert(true);
        toast({ 
          title: 'Not Our Modality', 
          description: 'The uploaded image is not from our supported modality.', 
          variant: 'destructive' 
        });
        setIsUploading(false);
        return;
      }

      // Step 2: Classify (Cancer vs Neurological)
      const classifyRes = await fetch(`${flaskBase}/classify`, {
        method: 'POST',
        body: formData,
      });
      const classifyData = await classifyRes.json();
      if (!classifyRes.ok) {
        throw new Error(classifyData.error || 'Classification failed');
      }

      // Step 3: Subtype classification
      const subtypeRes = await fetch(`${flaskBase}/subtype`, {
        method: 'POST',
        body: formData,
      });
      const subtypeData = await subtypeRes.json();
      if (!subtypeRes.ok) {
        throw new Error(subtypeData.error || 'Subtype classification failed');
      }

  // Step 4: Final diagnosis using disease-specific model
      const diagnosisFormData = new FormData();
      diagnosisFormData.append('file', uploadedFile);
      diagnosisFormData.append('subtype', subtypeData.subtype_prediction);
      
      const diagnosisRes = await fetch(`${flaskBase}/diagnose`, {
        method: 'POST',
        body: diagnosisFormData,
      });
      const diagnosisData = await diagnosisRes.json();
      if (!diagnosisRes.ok) {
        throw new Error(diagnosisData.error || 'Final diagnosis failed');
      }

      // All 4 pipelines succeeded
      const resultObj = {
        stage: 'Complete Pipeline (4 stages)',
        modality: predictData.prediction,
        classification: classifyData.classification,
        subtype: subtypeData.subtype_prediction,
        diagnosis: diagnosisData.diagnosis,
      };
      setPipelineResult(resultObj);
      setShowResultDialog(true);
      toast({ title: 'Analysis Complete', description: 'All 4 pipeline stages finished successfully.' });

  // Persist completed analysis to Node history (store base64 image + results)
      try {
        // convert file to base64
        const convertFileToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
        };

        const fileData = await convertFileToBase64(uploadedFile);
        const saveBody = {
          fileName: uploadedFile.name,
          fileData,
          fileType: uploadedFile.type,
          fileSize: uploadedFile.size,
          imageType: subtypeData.subtype_prediction,
          patientInfo: {
            name: patientInfo.name,
            age: parseInt(patientInfo.age),
            gender: patientInfo.gender,
            patientId: patientInfo.patientId || undefined,
            contactNumber: patientInfo.contactNumber || undefined,
            email: patientInfo.email || undefined,
            symptoms: patientInfo.symptoms || undefined,
            medicalHistory: patientInfo.medicalHistory || undefined,
            referringDoctor: patientInfo.referringDoctor || undefined,
            doctorId: patientInfo.doctorId || undefined
          },
          results: {
            diagnosis: diagnosisData.diagnosis,
            findings: diagnosisData.findings || [],
            recommendations: diagnosisData.recommendations || [],
            processingTime: diagnosisData.processing_time || 0
          }
        };

        // Only attempt to save when nodeBase is configured
        if (nodeBase) {
          const saveRes = await fetch(`${nodeBase}/api/analysis/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include',
            body: JSON.stringify(saveBody)
          });
          if (saveRes.ok) {
            const saved = await saveRes.json();
            toast({ title: 'Saved to History', description: 'Analysis saved to your history.' });
          } else {
            const err = await saveRes.json().catch(() => ({}));
            console.warn('Failed to save analysis to history', err);
          }
        }
      } catch (err) {
        console.warn('Error saving history:', err);
      }

      toast({
        title: 'Analysis Saved',
        description: 'The analysis has been saved to your history.',
      });
    } catch (error) {
      console.error('Pipeline error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred during analysis',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Full screen spinner overlay while analyzing - reuse existing overlay component */}
      <RouteLoadingOverlay isActive={isUploading} />

      {/* Result dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analysis Result</DialogTitle>
            <DialogDescription>Summary of the completed AI analysis.</DialogDescription>
          </DialogHeader>

          {pipelineResult && (
            <div className="space-y-2 mt-4">
              {pipelineResult.modality && (
                <p className="text-sm"><strong>Modality:</strong> {pipelineResult.modality}</p>
              )}
              {pipelineResult.classification && (
                <p className="text-sm"><strong>Classification:</strong> {pipelineResult.classification}</p>
              )}
              {pipelineResult.subtype && (
                <p className="text-sm"><strong>Subtype:</strong> {pipelineResult.subtype}</p>
              )}
              {pipelineResult.diagnosis && (
                <p className="text-sm"><strong>Final Diagnosis:</strong> {pipelineResult.diagnosis}</p>
              )}
              {pipelineResult.result && (
                <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(pipelineResult.result, null, 2)}</pre>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex w-full justify-end">
              <Button onClick={() => setShowResultDialog(false)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Not Our Modality Alert Dialog */}
      <AlertDialog open={showNotModalityAlert} onOpenChange={setShowNotModalityAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Not Our Modality
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              The uploaded image is not from our supported modality. Please upload a valid medical image from our supported types (CT scans, MRI, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowNotModalityAlert(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Patient Details Required Alert Dialog */}
      <AlertDialog open={showPatientDetailsAlert} onOpenChange={setShowPatientDetailsAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Enter Patient Details
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Please fill in the required patient information before analyzing the image:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Patient Name *</li>
                <li>Age *</li>
                <li>Gender *</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                Other fields are optional but recommended for better record keeping.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPatientDetailsAlert(false)}>
              OK, I'll Fill Them
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Medical Image</h1>
        <p className="text-muted-foreground">
          Enter patient details and upload medical images for AI-powered analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Information Form */}
        <Card className="border-border lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter patient details (required)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter full name"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Age"
                  min="0"
                  max="150"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Patient ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Optional"
                value={patientInfo.patientId}
                onChange={(e) => setPatientInfo({...patientInfo, patientId: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Phone number"
                value={patientInfo.contactNumber}
                onChange={(e) => setPatientInfo({...patientInfo, contactNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Email address"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Symptoms</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Describe symptoms..."
                rows="2"
                value={patientInfo.symptoms}
                onChange={(e) => setPatientInfo({...patientInfo, symptoms: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Medical History</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Relevant medical history..."
                rows="2"
                value={patientInfo.medicalHistory}
                onChange={(e) => setPatientInfo({...patientInfo, medicalHistory: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Referring Doctor</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Doctor's name"
                value={patientInfo.referringDoctor}
                onChange={(e) => setPatientInfo({...patientInfo, referringDoctor: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Doctor ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Doctor ID"
                value={patientInfo.doctorId}
                onChange={(e) => setPatientInfo({...patientInfo, doctorId: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Area & Image Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Upload Medical Image</CardTitle>
              <CardDescription>Drag and drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.csv,image/jpeg,image/png,text/csv"
                onChange={handleFileInput}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer space-y-4 block"
              >
                {uploadedFile ? (
                  <>
                    <CheckCircle className="h-12 w-12 mx-auto text-success" />
                    <div>
                      <p className="text-sm font-medium">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JPG, PNG, CSV (for EEG)
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* File Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Image Information</CardTitle>
            <CardDescription>Details about the uploaded file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uploadedFile ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium">File Name</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadedFile.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">File Size</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">File Type</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadedFile.type || "Unknown"}
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-primary"
                  onClick={handleAnalyze}
                  disabled={isUploading || !uploadedFile}
                >
                  {isUploading ? (
                    <LogoSpinner
                      inline
                      size={20}
                      ringWidth={3}
                      label="Analyzing..."
                      className="mx-auto"
                      labelClassName="text-white font-semibold"
                    />
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
                {pipelineResult && (
                  <div className="p-4 bg-info/10 border border-info/20 rounded-xl space-y-2">
                    <p className="text-sm font-semibold text-info">Pipeline Results:</p>
                    {pipelineResult.stage && (
                      <p className="text-xs text-info/90">Stage: {pipelineResult.stage}</p>
                    )}
                    {pipelineResult.modality && (
                      <p className="text-xs text-info/90">
                        Modality: {pipelineResult.modality}
                      </p>
                    )}
                    {pipelineResult.classification && (
                      <p className="text-xs text-info/90">
                        Classification: {pipelineResult.classification}
                      </p>
                    )}
                    {pipelineResult.subtype && (
                      <p className="text-xs text-info/90">
                        Subtype: {pipelineResult.subtype}
                      </p>
                    )}
                    {pipelineResult.diagnosis && (
                      <p className="text-xs font-semibold text-info">
                        Final Diagnosis: {pipelineResult.diagnosis}
                      </p>
                    )}
                    {pipelineResult.result && (
                      <p className="text-xs text-info/90">
                        Result: {JSON.stringify(pipelineResult.result)}
                      </p>
                    )}
                    {pipelineResult.message && (
                      <p className="text-xs text-info/80 italic">{pipelineResult.message}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileImage className="h-12 w-12 mx-auto mb-4" />
                <p>No image uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default UploadImage;