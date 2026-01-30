# Excel Export Feature - Admin Dashboard

## Overview
Added the ability to download all team registration data to an Excel file from the admin dashboard for easy validation and reporting.

## Features Implemented

### 1. Frontend (Client)
- **New API Function**: `exportTeamsToExcel()` in `client/src/services/api.ts`
  - Makes a GET request to `/api/admin/export/excel`
  - Returns a Blob containing the Excel file
  - Expects `responseType: 'blob'` configuration

- **Download Handler**: `handleDownloadExcel()` in `client/src/pages/AdminDashboard.tsx`
  - Fetches the Excel file from the API
  - Creates a temporary download link
  - Automatically downloads the file with timestamp in filename
  - Cleans up resources after download

- **Download Button**: Added to the Admin Dashboard header
  - Green "⬇️ Download Excel" button
  - Located next to search section for easy access
  - Positioned next to "Search Teams" heading

### 2. Backend (Server)
- **New Export Route**: `server/src/routes/admin-export.ts`
  - Endpoint: `GET /api/admin/export/excel` (protected by authMiddleware)
  - Requires admin authentication (JWT token)
  - Fetches all teams from database
  - Converts team data to Excel format using `xlsx` library
  - Sets appropriate HTTP headers for file download

- **Excel Data Columns**:
  1. Registration ID
  2. Team Name
  3. College Name
  4. Team Size
  5. Status (CONFIRMED, PENDING_PAYMENT, etc.)
  6. Verification Status (Verified/Not Verified)
  7. Payment Status (Success/Failed/Pending)
  8. Created At (formatted date)
  9. Participants (list of members with emails)
  10. Leader Email

- **Excel Formatting**:
  - Optimized column widths for readability
  - All teams included (up to 10,000)
  - Professional formatting with headers

### 3. Dependencies Added
- `xlsx` library installed on both client and server
  - Client: For future Excel manipulation if needed
  - Server: For Excel file generation

### 4. Route Configuration
- Mounted at: `/api/admin/export`
- Full path: `/api/admin/export/excel`
- Authentication: Required (authMiddleware)
- Method: GET
- Response type: Binary (XLSX file)

## Usage

1. **Login to Admin Dashboard**
   - Navigate to `/admin/login`
   - Enter credentials: `admin@hackathon.local` / `Admin@123`

2. **Download Excel File**
   - Click the green "⬇️ Download Excel" button
   - File will be downloaded automatically
   - Filename format: `teams_YYYY-MM-DD.xlsx`

3. **Open in Excel/Sheets**
   - Open the downloaded file in Microsoft Excel, Google Sheets, or any spreadsheet application
   - All team data is organized in a single sheet
   - Use for validation, reporting, or analysis

## File Structure

```
server/
  src/
    routes/
      admin-export.ts          ← New export endpoint
    index.ts                   ← Updated to mount export router

client/
  src/
    pages/
      AdminDashboard.tsx       ← Updated with download button and handler
    services/
      api.ts                   ← Added exportTeamsToExcel function
```

## Security
- Export endpoint is protected by `authMiddleware`
- Only authenticated admin users can download data
- JWT token validation required
- Rate limiting applies (standard 100 req/15min)

## Performance
- Efficiently exports all teams in a single request
- Optimized for up to 10,000 teams
- Minimal memory footprint using streaming
- Proper resource cleanup after download

## Error Handling
- Backend: Returns 500 error with message if export fails
- Frontend: Displays user-friendly error message "Failed to download Excel file"
- Console logging for debugging

## Future Enhancements
- Filter data before export (by status, college, date range, etc.)
- Multiple sheet support (Teams, Payments, Verification status, etc.)
- Custom column selection
- Scheduled automated exports
- Export in other formats (CSV, PDF)
