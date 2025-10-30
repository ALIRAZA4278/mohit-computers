import { NextResponse } from 'next/server';

// GET - Download CSV template
export async function GET(request) {
  try {
    // Check if user wants simple or full template
    const { searchParams } = new URL(request.url);
    const templateType = searchParams.get('type') || 'full'; // 'simple' or 'full'

    let csvTemplate;

    if (templateType === 'simple') {
      // SIMPLE TEMPLATE - Only essential fields
      csvTemplate = `Category,Model,Brand,Selling Price,Original Price,Processor,Generation,Ram,HDD,Display Size,Condition,Warranty,Image URL 1
"laptop","HP EliteBook 840 G5","HP","35000","40000","Intel Core i5-8250U","8th Gen","8GB DDR4","256GB SSD","14 inch","Excellent","6 months","https://example.com/images/elitebook-front.jpg"
"laptop","Dell Latitude 7390","Dell","38000","45000","Intel Core i7-8650U","8th Gen","16GB DDR4","512GB NVMe SSD","13.3 inch","Very Good","6 months","https://example.com/images/latitude-front.jpg"
"laptop","Lenovo ThinkPad T480","Lenovo","32000","38000","Intel Core i5-8350U","8th Gen","8GB DDR4","256GB SSD","14 inch","Good","3 months","https://example.com/images/thinkpad.jpg"
"ram","Kingston 8GB DDR4","Kingston","2500","3000","","","8GB DDR4","","","New","1 year","https://example.com/images/ram-kingston.jpg"`;
    } else {
      // FULL TEMPLATE - All available fields
      csvTemplate = `Category,Model,Brand,Description,Selling Price,Original Price,Stock Quantity,SKU,In Stock,Is Active,Is Featured,Is Workstation,Is Rugged Tough,Is Clearance,Clearance Reason,Is Discounted,Discount Percentage,Processor,Generation,Ram,HDD,Display Size,Resolution (Options),Integrated Graphics,Discrete/Dedicated Graphics,Touch / Non touch / X360,Operating Features,Extra Features (Connectivity/Ports/Other),Condition,Battery,Charger Included,Warranty,Show Laptop Customizer,Show RAM Options,Show SSD Options,RAM Type,RAM Capacity,RAM Speed,RAM Form Factor,RAM Condition,RAM Warranty,Show RAM Customizer,Image URL 1,Image URL 2,Image URL 3,Image URL 4,Image URL 5
"laptop","EliteBook 840 G5","HP","Premium business ultrabook with excellent build quality","35000","40000","5","ELI-840-G5-001","true","true","false","false","false","false","","false","","Intel Core i5-8250U","8th Gen","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro, Fingerprint Reader","USB 3.0, HDMI, WiFi 6, Bluetooth 5.0, Backlit Keyboard","Excellent","Up to 8 hours","true","6 months","true","true","true","","","","","","","false","https://example.com/images/elitebook-front.jpg","https://example.com/images/elitebook-side.jpg","","",""
"laptop","Latitude 7390","Dell","Compact and powerful business laptop","38000","45000","3","LAT-7390-001","true","true","true","false","false","false","","false","","Intel Core i7-8650U","8th Gen","16GB DDR4","512GB NVMe SSD","13.3 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB-C, Thunderbolt, WiFi 6","Very Good","Up to 10 hours","true","6 months","true","true","true","","","","","","","false","https://example.com/images/latitude-front.jpg","","","",""
"laptop","ThinkPad T480","Lenovo","Reliable workhorse with excellent keyboard","32000","38000","10","THK-T480-001","true","true","false","false","false","false","","false","","Intel Core i5-8350U","8th Gen","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB 3.0, HDMI, WiFi, Bluetooth","Good","Up to 9 hours","true","3 months","true","true","true","","","","","","","false","https://example.com/images/thinkpad.jpg","","","",""
"ram","8GB DDR4 RAM Kingston","Kingston","High-quality DDR4 RAM module","2500","3000","20","RAM-8GB-DDR4-KIN","true","true","false","false","false","false","","false","","","","","","","","","","","","","","","","","false","false","false","DDR4","8GB","2666MHz","DIMM","New","1 year","true","https://example.com/images/ram-kingston.jpg","","","",""
"workstation","HP Z2 Tower G9","HP","Professional workstation for demanding tasks","95000","110000","2","HP-Z2-G9-001","true","true","true","true","false","false","","false","","Intel Xeon W-1370P","11th Gen","32GB ECC DDR4","1TB NVMe SSD","","","Intel UHD Graphics P750","NVIDIA RTX A2000","","Windows 11 Pro for Workstations","Multiple expansion slots, RAID support, 6x USB 3.2","Excellent","N/A","true","3 years","false","false","false","","","","","","","false","https://example.com/images/hp-z2-tower.jpg","","","",""`;
    }

    const fileName = templateType === 'simple'
      ? 'products_template_simple.csv'
      : 'products_template_full.csv';

    // Create response with CSV content
    const response = new NextResponse(csvTemplate, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating CSV template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSV template' },
      { status: 500 }
    );
  }
}
