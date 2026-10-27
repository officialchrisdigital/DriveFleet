/**
 * DriveFleet Official Voucher PDF Generator
 * Pure, deterministic PDF-1.4 generation without third-party runtime bloat.
 */

export interface VoucherPdfData {
  displayRef: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  vehicleName: string;
  vehicleCategory: string;
  vehicleSeats: number;
  vehicleTransmission: string;
  vehiclePlate: string;
  pickupStation: string;
  pickupAddress: string;
  pickupDateTime: string;
  returnStation: string;
  returnDateTime: string;
  subtotalMinor: number;
  promoDiscountMinor?: number;
  totalMinor: number;
}

function escapePdfText(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function generateVoucherPdfString(data: VoucherPdfData): string {
  const ops: string[] = [];

  // Color Palette
  const cBlueFill = '0.145 0.388 0.921 rg';
  const cSlateDark = '0.059 0.09 0.165 rg';
  const cSlateMuted = '0.392 0.455 0.545 rg';
  const cCardBg = '0.973 0.98 0.988 rg';
  const cCardBorder = '0.886 0.906 0.941 RG';
  const cEmeraldFill = '0.086 0.396 0.204 rg';
  const cAmberBg = '0.996 0.988 0.910 rg';
  const cAmberBorder = '0.996 0.941 0.541 RG';
  const cAmberText = '0.522 0.302 0.055 rg';

  // 1. Top Royal Blue Header
  ops.push(cBlueFill);
  ops.push('0 760 595.28 82 re f');
  ops.push('1 1 1 rg');
  ops.push('BT /F1 16 Tf 40 812 Td (DRIVEFLEET MOBILITY SOLUTIONS) Tj ET');
  ops.push('BT /F2 8.5 Tf 40 794 Td (OFFICIAL RESERVATION VOUCHER & FAST-TRACK DISPATCH PASS) Tj ET');
  ops.push('BT /F2 8.5 Tf 400 794 Td (24/7 SUPPORT: +234 1 290 8400) Tj ET');

  // 2. Voucher ID Bar
  ops.push(cCardBg);
  ops.push(cCardBorder);
  ops.push('1 w');
  ops.push('40 684 515.28 62 re B');

  ops.push(cSlateMuted);
  ops.push('BT /F1 8 Tf 55 726 Td (OFFICIAL MASTER VOUCHER ID) Tj ET');
  ops.push(cSlateDark);
  ops.push(`BT /F1 16 Tf 55 702 Td (#${escapePdfText(data.displayRef)}) Tj ET`);

  // Status badge
  ops.push('0.863 0.988 0.906 rg');
  ops.push('340 714 200 20 re f');
  ops.push(cEmeraldFill);
  ops.push('BT /F1 8.5 Tf 352 721 Td (CONFIRMED  -  FAST-TRACK BAY 2) Tj ET');

  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  ops.push(cSlateMuted);
  ops.push(`BT /F2 8 Tf 340 696 Td (Issue Date: ${escapePdfText(issueDate)}  |  Auth: DF-AUTH-9812-SYNC) Tj ET`);

  // 3. Two columns: Renter Info (left) & Vehicle Info (right)
  // Left Box: Primary Renter
  ops.push(cCardBg);
  ops.push(cCardBorder);
  ops.push('40 540 248 132 re B');
  ops.push('0.937 0.965 1 rg');
  ops.push('40 648 248 24 re f');
  ops.push(cBlueFill);
  ops.push('BT /F1 9 Tf 50 656 Td (1. PRIMARY RENTER & IDENTITY) Tj ET');

  ops.push(cSlateDark);
  ops.push(`BT /F1 11 Tf 50 630 Td (${escapePdfText(data.renterName)}) Tj ET`);
  ops.push(cSlateMuted);
  ops.push(`BT /F2 8.5 Tf 50 612 Td (Email: ${escapePdfText(data.renterEmail)}) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 50 596 Td (Phone: ${escapePdfText(data.renterPhone)}) Tj ET`);
  ops.push('BT /F2 8.5 Tf 50 580 Td (Driver License: Online Verified) Tj ET');
  ops.push('BT /F2 8.5 Tf 50 564 Td (Required at Desk: Physical Driver License) Tj ET');
  ops.push(cEmeraldFill);
  ops.push('BT /F1 8 Tf 50 548 Td (Identity Verified & Cleared for Handover) Tj ET');

  // Right Box: Reserved Vehicle
  ops.push(cCardBg);
  ops.push(cCardBorder);
  ops.push('307.28 540 248 132 re B');
  ops.push('0.937 0.965 1 rg');
  ops.push('307.28 648 248 24 re f');
  ops.push(cBlueFill);
  ops.push('BT /F1 9 Tf 317.28 656 Td (2. RESERVED FLEET ASSET) Tj ET');

  ops.push(cSlateDark);
  ops.push(`BT /F1 11 Tf 317.28 630 Td (${escapePdfText(data.vehicleName)}) Tj ET`);
  ops.push(cSlateMuted);
  ops.push(`BT /F2 8.5 Tf 317.28 612 Td (Class: ${escapePdfText(data.vehicleCategory)} - ${data.vehicleSeats} Passenger Seats) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 317.28 596 Td (Transmission: ${escapePdfText(data.vehicleTransmission)}) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 317.28 580 Td (License Plate: ${escapePdfText(data.vehiclePlate)}) Tj ET`);
  ops.push('BT /F2 8.5 Tf 317.28 564 Td (Fuel Policy: Full-to-Full  [8/8]) Tj ET');
  ops.push(cBlueFill);
  ops.push('BT /F1 8 Tf 317.28 548 Td (Status: Staged & Reserved at Bay 2) Tj ET');

  // 4. Schedule & Dispatch Box
  ops.push(cCardBg);
  ops.push(cCardBorder);
  ops.push('40 420 515.28 108 re B');
  ops.push('0.937 0.965 1 rg');
  ops.push('40 504 515.28 24 re f');
  ops.push(cBlueFill);
  ops.push('BT /F1 9 Tf 50 512 Td (3. RENTAL SCHEDULE & STATION DISPATCH) Tj ET');

  ops.push(cSlateDark);
  ops.push('BT /F1 9 Tf 50 488 Td (PICKUP SCHEDULE) Tj ET');
  ops.push(cSlateMuted);
  ops.push(`BT /F2 8.5 Tf 50 472 Td (Date & Time: ${escapePdfText(data.pickupDateTime)}) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 50 456 Td (Depot: ${escapePdfText(data.pickupStation)}) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 50 440 Td (Address: ${escapePdfText(data.pickupAddress)}) Tj ET`);
  ops.push('BT /F2 8.5 Tf 50 426 Td (Fast-Track Handover: Desk Bay 2) Tj ET');

  ops.push(cSlateDark);
  ops.push('BT /F1 9 Tf 317.28 488 Td (RETURN SCHEDULE) Tj ET');
  ops.push(cSlateMuted);
  ops.push(`BT /F2 8.5 Tf 317.28 472 Td (Date & Time: ${escapePdfText(data.returnDateTime)}) Tj ET`);
  ops.push(`BT /F2 8.5 Tf 317.28 456 Td (Depot: ${escapePdfText(data.returnStation)}) Tj ET`);
  ops.push('BT /F2 8.5 Tf 317.28 440 Td (Grace Period: 30 minutes complimentary grace) Tj ET');
  ops.push('BT /F2 8.5 Tf 317.28 426 Td (Key Drop: Express Drop Box or Bay 2 Attendant) Tj ET');

  // 5. Financial Ledger Box
  ops.push(cCardBg);
  ops.push(cCardBorder);
  ops.push('40 286 515.28 122 re B');
  ops.push('0.937 0.965 1 rg');
  ops.push('40 384 515.28 24 re f');
  ops.push(cBlueFill);
  ops.push('BT /F1 9 Tf 50 392 Td (4. FINANCIAL LEDGER & SETTLEMENT RECEIPT) Tj ET');

  const subtotalStr = `NGN ${(data.subtotalMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const totalStr = `NGN ${(data.totalMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  ops.push(cSlateDark);
  ops.push('BT /F2 8.5 Tf 50 368 Td (Vehicle Base Rental Rate:) Tj ET');
  ops.push(`BT /F2 8.5 Tf 450 368 Td (${subtotalStr}) Tj ET`);

  ops.push('BT /F2 8.5 Tf 50 352 Td (Comprehensive Collision & Damage Protection:) Tj ET');
  ops.push('BT /F2 8.5 Tf 450 352 Td (INCLUDED) Tj ET');

  ops.push('BT /F2 8.5 Tf 50 336 Td (All Value Added Tax [VAT 7.5%] & Station Surcharges:) Tj ET');
  ops.push('BT /F2 8.5 Tf 450 336 Td (INCLUDED) Tj ET');

  // Divider line
  ops.push(cCardBorder);
  ops.push('50 326 495.28 0.5 re f');

  ops.push(cBlueFill);
  ops.push('BT /F1 10.5 Tf 50 308 Td (NET TOTAL PAID & SETTLED IN FULL:) Tj ET');
  ops.push(`BT /F1 12 Tf 430 308 Td (${totalStr}) Tj ET`);

  ops.push(cSlateMuted);
  ops.push('BT /F2 7.5 Tf 50 292 Td (Payment Method: Visa  -  Ending 4242  |  Auth Hash: AUTH_SIM_981249A  |  Status: Paid in Full) Tj ET');

  // 6. Station Counter Instructions Box
  ops.push(cAmberBg);
  ops.push(cAmberBorder);
  ops.push('40 178 515.28 96 re B');

  ops.push(cAmberText);
  ops.push('BT /F1 8.5 Tf 50 258 Td (MANDATORY KEY HANDOVER INSTRUCTIONS AT THE STATION:) Tj ET');

  ops.push(cSlateDark);
  ops.push('BT /F2 7.5 Tf 50 242 Td (1. Walk directly to Fast-Track Lane Bay 2. Show this voucher PDF on your mobile or physical printout.) Tj ET');
  ops.push('BT /F2 7.5 Tf 50 228 Td (2. Present your original Driver License and valid National ID / International Passport for physical verification.) Tj ET');
  ops.push('BT /F2 7.5 Tf 50 214 Td (3. Vehicle is released with a 100% full fuel tank [8/8]. Please return full to avoid refueling convenience fees.) Tj ET');
  ops.push('BT /F2 7.5 Tf 50 200 Td (4. Complimentary 3-hour flight delay protection active. Station hotline: +234 1 290 8400) Tj ET');
  ops.push('BT /F2 7.5 Tf 50 186 Td (5. DriveFleet 24/7 Roadside Assistance dispatch team is on-call throughout your entire rental period.) Tj ET');

  // 7. Footer
  ops.push(cCardBorder);
  ops.push('40 150 515.28 0.5 re f');
  ops.push(cSlateMuted);
  ops.push('BT /F2 7.5 Tf 40 138 Td (DriveFleet Mobility Nigeria Ltd  -  Incorporated RC 1892841  -  support@drivefleet.com  -  www.drivefleet.com) Tj ET');
  ops.push('BT /F2 7.5 Tf 420 138 Td (Official Reservation Voucher  -  Page 1 of 1) Tj ET');

  const stream = ops.join('\n');
  const streamEncoder = new TextEncoder();
  const streamLength = streamEncoder.encode(stream).length;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj`
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(streamEncoder.encode(pdf).length);
    pdf += obj + '\n';
  }

  const startxref = streamEncoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += String(offset).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  return pdf;
}

export function downloadVoucherPdf(data: VoucherPdfData) {
  const pdfString = generateVoucherPdfString(data);
  const blob = new Blob([pdfString], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanRef = data.displayRef.replace(/[^a-zA-Z0-9_-]/g, '');
  a.download = `DriveFleet-Voucher-${cleanRef || 'RESERVATION'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
