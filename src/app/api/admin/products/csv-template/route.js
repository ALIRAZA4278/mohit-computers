import { NextResponse } from 'next/server';

// GET - Download CSV template
export async function GET() {
  try {
    // CSV template with exact field names as specified
    const csvTemplate = `Model,Processor,Generation,Ram,HDD,Display Size,Resolution (Options),Integrated Graphics,Discrete/Dedicated Graphics,Touch / Non touch / X360,Operating Features,Extra Features (Connectivity/Ports/Other),Condition,Battery,Charger Included,Warranty,Selling Price
"EliteBook 840 G5","Intel Core i5-8250U","8th Gen","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro, Fingerprint Reader","USB 3.0, HDMI, WiFi 6, Bluetooth 5.0, Backlit Keyboard","Excellent","Up to 8 hours","true","6 months","35000"
"Latitude 7390","Intel Core i7-8650U","8th Gen","16GB DDR4","512GB NVMe SSD","13.3 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB-C, Thunderbolt, WiFi 6","Very Good","Up to 10 hours","true","6 months","38000"
"ThinkPad T480","Intel Core i5-8350U","8th Gen","8GB DDR4","256GB SSD","14 inch","Full HD (1920x1080)","Intel UHD Graphics 620","","Non-touch","Windows 11 Pro","USB 3.0, HDMI, WiFi, Bluetooth","Good","Up to 9 hours","true","3 months","32000"`;

    // Create response with CSV content
    const response = new NextResponse(csvTemplate, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="products_template.csv"'
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

