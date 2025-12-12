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
      csvTemplate = `Category,Model,Brand,Selling Price,Original Price,Processor,Generation,Supported RAM Type,Ram,HDD,Display Size,Condition,Warranty,SEO Only,Image URL 1
"laptop","HP EliteBook 840 G5","HP","35000","40000","Intel Core i5-8250U","8th Gen","","8GB DDR4","256GB SSD","14 inch","Excellent","6 months","false","https://example.com/images/elitebook-front.jpg"
"laptop","Dell Latitude 7390","Dell","38000","45000","Intel Core i7-8650U","8th Gen","","16GB DDR4","512GB NVMe SSD","13.3 inch","Very Good","6 months","false","https://example.com/images/latitude-front.jpg"
"chromebook","Dell Chromebook 3100","Dell","22000","25000","Intel Celeron N4020","","","4GB","32GB eMMC","11.6 inch","Excellent","3 months","false","https://example.com/images/chromebook-dell.jpg"
"chromebook","HP Chromebook 14","HP","28000","32000","Intel Pentium Silver","","","8GB","64GB eMMC","14 inch","Very Good","6 months","false","https://example.com/images/chromebook-hp.jpg"
"laptop","Lenovo ThinkPad T480","Lenovo","32000","38000","Intel Core i5-8350U","8th Gen","","8GB DDR4","256GB SSD","14 inch","Good","3 months","false","https://example.com/images/thinkpad.jpg"`;
    } else {
      // FULL TEMPLATE - All available fields
      csvTemplate = `Category,Model,Brand,Description,Selling Price,Original Price,Stock Quantity,SKU,In Stock,Is Active,Is Featured,Is New Arrival,On Sale,Discount Percentage,Is Workstation,Is Rugged Tough,Is Clearance,Clearance Reason,SEO Only,Processor,Generation,Supported RAM Type,Ram,HDD,Display Size,Resolution (Options),Integrated Graphics,Discrete/Dedicated Graphics,Touch / Non touch / X360,Operating Features,Extra Features (Connectivity/Ports/Other),Condition,Battery,Charger Included,Warranty,Show Laptop Customizer,Show RAM Options,Show SSD Options,RAM Type,RAM Capacity,RAM Speed,RAM Form Factor,RAM Condition,RAM Warranty,Show RAM Customizer,Image URL 1,Image URL 2,Image URL 3,Image URL 4,Image URL 5
"laptop","EliteBook 840 G5","HP","Premium business ultrabook with excellent build quality","35000","40000","5","ELI-840-G5-001","true","true","false","false","false","false","false","","false","","false","Intel Core i5-8250U","8th Gen","","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro, Fingerprint Reader","USB 3.0, HDMI, WiFi 6, Bluetooth 5.0, Backlit Keyboard","Excellent","Up to 8 hours","true","6 months","true","true","true","","","","","","","false","https://example.com/images/elitebook-front.jpg","https://example.com/images/elitebook-side.jpg","","",""
"laptop","Latitude 7390","Dell","Compact and powerful business laptop","38000","45000","3","LAT-7390-001","true","true","true","true","false","false","false","","false","","false","Intel Core i7-8650U","8th Gen","","16GB DDR4","512GB NVMe SSD","13.3 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB-C, Thunderbolt, WiFi 6","Very Good","Up to 10 hours","true","6 months","true","true","true","","","","","","","false","https://example.com/images/latitude-front.jpg","","","",""
"laptop","ThinkPad T480","Lenovo","Reliable workhorse with excellent keyboard","32000","38000","10","THK-T480-001","true","true","false","false","false","false","false","","false","","false","Intel Core i5-8350U","8th Gen","","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB 3.0, HDMI, WiFi, Bluetooth","Good","Up to 9 hours","true","3 months","true","true","true","","","","","","","false","https://example.com/images/thinkpad.jpg","","","",""
"chromebook","Dell Chromebook 3100","Dell","Durable Chromebook ideal for students and light users","22000","25000","8","CHR-DELL-3100","true","true","false","true","false","false","false","","false","","false","Intel Celeron N4020","","","4GB","32GB eMMC","11.6 inch","HD (1366x768)","Intel UHD Graphics 600","","Touch","Chrome OS, Built-in virus protection","USB-C, WiFi 6, Long battery life","Excellent","Up to 12 hours","true","3 months","false","false","false","","","","","","","false","https://example.com/images/chromebook-dell.jpg","","","",""
"chromebook","HP Chromebook 14","HP","Fast and reliable Chromebook for everyday computing","28000","32000","5","CHR-HP-14","true","true","true","true","false","false","false","","false","","false","Intel Pentium Silver N5030","","","8GB","64GB eMMC","14 inch","Full HD (1920x1080)","Intel UHD Graphics 605","","Non-touch","Chrome OS, Google Play Store","USB-C, microSD card reader, WiFi","Very Good","Up to 13 hours","true","6 months","false","false","false","","","","","","","false","https://example.com/images/chromebook-hp.jpg","","","",""
"workstation","HP Z2 Tower G9","HP","Professional workstation for demanding tasks","95000","110000","2","HP-Z2-G9-001","true","true","true","false","true","false","false","","false","","false","Intel Xeon W-1370P","11th Gen","","32GB ECC DDR4","1TB NVMe SSD","","","Intel UHD Graphics P750","NVIDIA RTX A2000","","Windows 11 Pro for Workstations","Multiple expansion slots, RAID support, 6x USB 3.2","Excellent","N/A","true","3 years","false","false","false","","","","","","","false","https://example.com/images/hp-z2-tower.jpg","","","",""
"laptop","HP EliteBook 850 G6 (SEO Only Example)","HP","This product is hidden from catalog but visible to Google search","42000","48000","1","ELI-850-G6-SEO","true","true","false","false","false","false","false","","false","","true","Intel Core i7-8565U","8th Gen","","16GB DDR4","512GB SSD","15.6 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB-C, HDMI","Excellent","Up to 9 hours","true","6 months","true","true","true","","","","","","","false","https://example.com/images/elitebook850.jpg","","","",""`;
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
