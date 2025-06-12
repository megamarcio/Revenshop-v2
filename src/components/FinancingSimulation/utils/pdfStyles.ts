
export const PDF_STYLES = `
  @page {
    size: A4;
    margin: 15mm;
  }
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  body { 
    font-family: 'Segoe UI', 'Arial', sans-serif; 
    color: #1a1a1a;
    line-height: 1.3;
    background: #ffffff;
    font-size: 12px;
  }
  .header { 
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  .logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .logo {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 20px;
  }
  .company-info h1 {
    color: #1f2937;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .company-info p {
    color: #6b7280;
    font-size: 14px;
  }
  .document-info {
    text-align: right;
    color: #6b7280;
    font-size: 11px;
  }
  .document-info h2 {
    color: #1f2937;
    margin-bottom: 5px;
    font-size: 16px;
  }
  .highlight-section {
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    padding: 20px;
    margin: 15px 0;
    text-align: center;
    border-radius: 8px;
  }
  .highlight-section h3 {
    color: #0369a1;
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .payment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    max-width: 500px;
    margin: 0 auto;
  }
  .payment-item {
    background: white;
    padding: 15px;
    border-radius: 6px;
  }
  .payment-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .payment-value {
    color: #0f172a;
    font-size: 20px;
    font-weight: 700;
  }
  .section { 
    margin: 15px 0;
    background: #fafafa;
    padding: 15px;
    border-radius: 6px;
  }
  .section h3 {
    color: #1f2937;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .vehicle-image {
    max-width: 200px;
    max-height: 120px;
    border-radius: 6px;
    margin: 10px auto;
    display: block;
  }
  .no-image {
    width: 200px;
    height: 100px;
    background: #f1f5f9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    color: #64748b;
    font-style: italic;
    font-size: 11px;
  }
  .breakdown-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .breakdown-table tr {
    border-bottom: 1px solid #e5e7eb;
  }
  .breakdown-table td {
    padding: 6px 0;
    font-size: 11px;
  }
  .breakdown-table td:first-child {
    color: #6b7280;
    font-weight: 500;
  }
  .breakdown-table td:last-child {
    text-align: right;
    color: #1f2937;
    font-weight: 600;
  }
  .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  .compact-section {
    margin: 10px 0;
    background: #fafafa;
    padding: 10px;
    border-radius: 4px;
  }
  .compact-section h3 {
    font-size: 12px;
    margin-bottom: 8px;
    color: #1f2937;
  }
`;
