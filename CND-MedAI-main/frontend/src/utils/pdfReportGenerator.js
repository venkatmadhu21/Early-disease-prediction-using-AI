import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateMedicalReport = (analysis, user) => {
  const doc = new jsPDF();
  
  // Hospital Header
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // White background for logo area (left side)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 40, 40, 'F');
  
  // Header background - using medical teal gradient (matching your brand)
  // RGB for teal: #14B8A6 (20, 184, 166)
  doc.setFillColor(20, 184, 166); // Medical Teal
  doc.rect(40, 0, pageWidth - 40, 40, 'F');
  
  // Add Logo in white area (top left) - with padding
  try {
    const logoImg = new Image();
    logoImg.src = '/Logo.png';
    // Center logo in white box with padding
    doc.addImage(logoImg, 'PNG', 10, 10, 20, 20);
  } catch (error) {
    console.log('Logo not loaded, continuing without it');
  }
  
  // Hospital/App Name (on teal background)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MedAI Assist', 45, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Medical Diagnostics', 45, 21);
  
  // Report Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL DIAGNOSTIC REPORT', 45, 32);
  
  // Hospital Information (right side)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const hospitalInfo = user?.hospitalName || 'Medical Diagnostics Center';
  // Split address into two lines if possible
  let addressLine1 = '';
  let addressLine2 = '';
  if (user?.area) {
    // Try to split at first comma, else split in half
    const areaParts = user.area.split(',');
    if (areaParts.length > 1) {
      addressLine1 = areaParts[0].trim();
      addressLine2 = areaParts.slice(1).join(',').trim();
    } else if (user.area.length > 40) {
      addressLine1 = user.area.slice(0, Math.floor(user.area.length/2)).trim();
      addressLine2 = user.area.slice(Math.floor(user.area.length/2)).trim();
    } else {
      addressLine1 = user.area;
      addressLine2 = '';
    }
  }
  doc.text(hospitalInfo, pageWidth - 14, 12, { align: 'right' });
  if (addressLine1) doc.text(addressLine1, pageWidth - 14, 17, { align: 'right' });
  if (addressLine2) doc.text(addressLine2, pageWidth - 14, 20, { align: 'right' });
  
  // Contact info
  doc.setFontSize(7);
  doc.text('Email: cndproject31@gmail.com', pageWidth - 14, 24, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Report Details Section
  let yPos = 50;
  
  // Report Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166); // Medical Teal for headers
  doc.text('REPORT INFORMATION', 14, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 1;
  doc.setDrawColor(20, 184, 166); // Medical Teal line
  doc.setLineWidth(0.5);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const reportDate = new Date(analysis.createdAt);
  const formattedDate = reportDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = reportDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  // Two column layout for report info
  const leftCol = 14;
  const rightCol = 120;
  
  doc.text(`Report ID:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis._id.substring(0, 16)}...`, leftCol + 25, yPos);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Date of Report:`, rightCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formattedDate, rightCol + 30, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  
  doc.text(`Report Status:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.text(analysis.status.toUpperCase(), leftCol + 25, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Time:`, rightCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formattedTime, rightCol + 30, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  
  doc.text(`Reporting Physician:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(user?.fullName || 'AI Diagnostic System', leftCol + 38, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 12;
  
  // Patient Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 184, 166); // Medical Teal for headers
  doc.text('PATIENT INFORMATION', 14, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 1;
  doc.setDrawColor(20, 184, 166);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  if (analysis.patientInfo) {
    doc.text(`Full Name:`, leftCol, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(analysis.patientInfo.name || 'N/A', leftCol + 25, yPos);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Gender:`, rightCol, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(analysis.patientInfo.gender || 'N/A', rightCol + 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    
    doc.text(`Age:`, leftCol, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(`${analysis.patientInfo.age || 'N/A'} years`, leftCol + 25, yPos);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Date of Birth:`, rightCol, yPos);
    doc.setFont('helvetica', 'bold');
    // Calculate DOB from age if available
    if (analysis.patientInfo.age) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - analysis.patientInfo.age;
      doc.text(`Approx. ${birthYear}`, rightCol + 28, yPos);
    } else {
      doc.text('N/A', rightCol + 28, yPos);
    }
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    
    if (analysis.patientInfo.patientId) {
      doc.text(`Patient ID:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(analysis.patientInfo.patientId, leftCol + 25, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    }
    
    if (analysis.patientInfo.contactNumber) {
      doc.text(`Contact Number:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(analysis.patientInfo.contactNumber, leftCol + 35, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    }
    
    if (analysis.patientInfo.email) {
      doc.text(`Email:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(analysis.patientInfo.email, leftCol + 25, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    }
    
    if (analysis.patientInfo.address) {
      doc.text(`Address:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      const addressLines = doc.splitTextToSize(analysis.patientInfo.address, pageWidth - 50);
      doc.text(addressLines, leftCol + 25, yPos);
      yPos += addressLines.length * 5;
    }
    
    if (analysis.patientInfo.referringDoctor) {
      doc.text(`Referring Physician:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(analysis.patientInfo.referringDoctor, leftCol + 40, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    }
    
    if (analysis.patientInfo.doctorId) {
      doc.text(`Doctor ID:`, leftCol, yPos);
      doc.setFont('helvetica', 'bold');
      doc.text(analysis.patientInfo.doctorId, leftCol + 40, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
    }
  }
  
  yPos += 6;
  
  // Study Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 184, 166); // Medical Teal for headers
  doc.text('STUDY INFORMATION', 14, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 1;
  doc.setDrawColor(20, 184, 166);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text(`Modality:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.imageType || 'Medical Image', leftCol + 25, yPos);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Study Date:`, rightCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(analysis.createdAt).toLocaleDateString(), rightCol + 25, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  
  doc.text(`File Name:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  const studyFileName = analysis.originalName.length > 40 
    ? analysis.originalName.substring(0, 37) + '...' 
    : analysis.originalName;
  doc.text(studyFileName, leftCol + 25, yPos);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`File Size:`, rightCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(analysis.fileSize / 1024).toFixed(2)} KB`, rightCol + 25, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 6;
  
  doc.text(`Acquisition Time:`, leftCol, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(analysis.createdAt).toLocaleTimeString(), leftCol + 35, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 12;
  
  // Add Uploaded Image Section
  if (analysis.fileData) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 184, 166);
    doc.text('UPLOADED IMAGE', 14, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 1;
    doc.setDrawColor(20, 184, 166);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 8;
    
    try {
      // Add image with border
      const imgWidth = 80;
      const imgHeight = 80;
      const imgX = (pageWidth - imgWidth) / 2; // Center the image
      
      // Draw border
      doc.setDrawColor(20, 184, 166);
      doc.setLineWidth(0.5);
      doc.rect(imgX - 2, yPos - 2, imgWidth + 4, imgHeight + 4);
      
      // Add image
      doc.addImage(analysis.fileData, 'JPEG', imgX, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10;
      
      // Image caption
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Figure 1: ${analysis.imageType || 'Medical Image'} - ${analysis.originalName}`, pageWidth / 2, yPos, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      yPos += 12;
    } catch (error) {
      console.log('Error adding image to PDF:', error);
      doc.setFontSize(9);
      doc.text('Image could not be displayed', pageWidth / 2, yPos, { align: 'center' });
      yPos += 12;
    }
  }

  // Analysis Results
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 184, 166); // Medical Teal for headers
  doc.text('ANALYSIS RESULTS', 14, yPos);
  doc.setTextColor(0, 0, 0);
  yPos += 1;
  doc.setDrawColor(20, 184, 166);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 8;
  
  if (analysis.results) {
    // Diagnosis box with teal accent
    doc.setFillColor(240, 253, 250); // Very light teal background
    doc.setDrawColor(20, 184, 166); // Teal border
    doc.setLineWidth(0.5);
    doc.roundedRect(14, yPos - 2, pageWidth - 28, 16, 2, 2, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 184, 166); // Medical Teal
    doc.text('Diagnosis:', 18, yPos + 4);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(analysis.results.diagnosis || 'N/A', 18, yPos + 10);
    
    yPos += 20;
    
    // Confidence Score
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Confidence Level: ${analysis.results.confidence || 0}%`, 14, yPos);
    yPos += 6;
    
    if (analysis.results.processingTime) {
      doc.text(`Processing Time: ${analysis.results.processingTime}ms`, 14, yPos);
      yPos += 6;
    }
    
    yPos += 6;
    
    // Findings
    if (analysis.results.findings && analysis.results.findings.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 184, 166); // Medical Teal
      doc.text('FINDINGS', 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 1;
      doc.setDrawColor(20, 184, 166);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 6;
      
      const findingsData = analysis.results.findings.map((finding, index) => [
        index + 1,
        finding.type || 'N/A',
        finding.description || 'N/A',
        finding.severity || 'N/A',
        `${finding.confidence || 0}%`
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['#', 'Type', 'Description', 'Severity', 'Confidence']],
        body: findingsData,
        theme: 'grid',
        headStyles: { 
          fillColor: [20, 184, 166], // Medical Teal
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 80 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Recommendations
    if (analysis.results.recommendations && analysis.results.recommendations.length > 0) {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 184, 166); // Medical Teal
      doc.text('RECOMMENDATIONS', 14, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 1;
      doc.setDrawColor(20, 184, 166);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 6;
      
      const recsData = analysis.results.recommendations.map((rec, index) => [
        index + 1,
        rec.type || 'N/A',
        rec.description || 'N/A',
        rec.priority || 'N/A'
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['#', 'Type', 'Description', 'Priority']],
        body: recsData,
        theme: 'grid',
        headStyles: { 
          fillColor: [20, 184, 166], // Medical Teal
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 100 },
          3: { cellWidth: 25 }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }
  }
  
  // Additional Notes Section
  if (analysis.patientInfo?.symptoms || analysis.patientInfo?.medicalHistory) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 184, 166); // Medical Teal
    doc.text('CLINICAL NOTES', 14, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 1;
    doc.setDrawColor(20, 184, 166);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    if (analysis.patientInfo.symptoms) {
      doc.text('Symptoms:', 14, yPos);
      yPos += 5;
      const symptomLines = doc.splitTextToSize(analysis.patientInfo.symptoms, pageWidth - 28);
      doc.text(symptomLines, 14, yPos);
      yPos += symptomLines.length * 5 + 5;
    }
    
    if (analysis.patientInfo.medicalHistory) {
      doc.text('Medical History:', 14, yPos);
      yPos += 5;
      const historyLines = doc.splitTextToSize(analysis.patientInfo.medicalHistory, pageWidth - 28);
      doc.text(historyLines, 14, yPos);
      yPos += historyLines.length * 5;
    }
  }
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is an AI-generated report. Please consult with a qualified medical professional for diagnosis and treatment.', pageWidth / 2, footerY, { align: 'center' });
  doc.setTextColor(20, 184, 166); // Medical Teal
  doc.setFont('helvetica', 'bold');
  doc.text('Generated by MedAI Assist', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`| ${new Date().toLocaleDateString()}`, pageWidth / 2 + 28, footerY + 5);
  
  // Page numbers with teal accent
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(20, 184, 166); // Medical Teal
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }
  
  // Save the PDF
  const pdfFileName = `Medical_Report_${analysis.patientInfo?.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(pdfFileName);
};
