import { PDFDocument } from "pdf-lib";

export const mergeBookingAndStripePdf = async (
  confirmationPdfBuffer: Uint8Array,
  stripeReceiptUrl: string // kept for future use
) => {
  const confirmationPdf = await PDFDocument.load(confirmationPdfBuffer);
  const mergedPdf = await PDFDocument.create();

  // Add the confirmation PDF page(s)
  const confirmationPages = await mergedPdf.copyPages(
    confirmationPdf,
    confirmationPdf.getPageIndices()
  );
  confirmationPages.forEach((page) => mergedPdf.addPage(page));

  // 🔒 Temporarily disable Stripe receipt merging due to CORS issue
  /*
  const stripePdfBytes = await fetch(stripeReceiptUrl).then(res => res.arrayBuffer());
  const stripePdf = await PDFDocument.load(stripePdfBytes);
  const stripePages = await mergedPdf.copyPages(stripePdf, stripePdf.getPageIndices());
  stripePages.forEach(page => mergedPdf.addPage(page));
  */

  return await mergedPdf.save(); // Returns merged (just booking) PDF
};
