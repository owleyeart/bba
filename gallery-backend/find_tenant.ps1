# Script to find your SharePoint tenant ID
# This will help you get the correct Azure AD tenant ID for your SharePoint

Write-Host "`n🔍 Finding your SharePoint Tenant Information...`n" -ForegroundColor Cyan

# Method 1: Check OneDrive folder path
Write-Host "Method 1: OneDrive Folder Path" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$oneDrivePath = "D:\OneDrive - Owl Eye Art"
if (Test-Path $oneDrivePath) {
    Write-Host "✓ OneDrive folder found: $oneDrivePath" -ForegroundColor Green
    
    # Check for tenant info in OneDrive settings
    $settingsPath = "$env:LOCALAPPDATA\Microsoft\OneDrive\settings"
    if (Test-Path $settingsPath) {
        Write-Host "✓ OneDrive settings found" -ForegroundColor Green
        
        # Look for tenant-specific folders
        $tenantFolders = Get-ChildItem -Path $settingsPath -Directory -ErrorAction SilentlyContinue
        if ($tenantFolders) {
            Write-Host "`nPossible Tenant IDs from OneDrive:" -ForegroundColor Cyan
            foreach ($folder in $tenantFolders) {
                if ($folder.Name -match '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') {
                    Write-Host "   $($folder.Name)" -ForegroundColor White
                }
            }
        }
    }
}

Write-Host "`n" -ForegroundColor Gray

# Method 2: SharePoint URL
Write-Host "Method 2: SharePoint Site URL" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Open your SharePoint site in a browser and look at the URL." -ForegroundColor White
Write-Host "It should look like one of these:" -ForegroundColor Cyan
Write-Host "   https://[tenant].sharepoint.com/..." -ForegroundColor Gray
Write-Host "   https://[company]-my.sharepoint.com/..." -ForegroundColor Gray
Write-Host "`nThe [tenant] or [company] part is your SharePoint tenant name." -ForegroundColor Cyan

Write-Host "`n" -ForegroundColor Gray

# Method 3: Get from Azure AD
Write-Host "Method 3: Azure AD Portal" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "1. Go to https://portal.azure.com" -ForegroundColor White
Write-Host "2. Click on 'Microsoft Entra ID' (formerly Azure Active Directory)" -ForegroundColor White
Write-Host "3. Look for 'Tenant ID' in the overview page" -ForegroundColor White

Write-Host "`n" -ForegroundColor Gray

# Method 4: Check existing credentials
Write-Host "Method 4: Your Existing Credentials" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

$getPyPath = "D:\OneDrive - Owl Eye Art\bobbakerart\get_token.py"
if (Test-Path $getPyPath) {
    Write-Host "✓ Found get_token.py with credentials:" -ForegroundColor Green
    $content = Get-Content $getPyPath -Raw
    
    if ($content -match 'CLIENT_ID\s*=\s*"([^"]+)"') {
        Write-Host "   Client ID: $($Matches[1])" -ForegroundColor Cyan
    }
    if ($content -match 'TENANT_ID\s*=\s*"([^"]+)"') {
        Write-Host "   Tenant ID: $($Matches[1])" -ForegroundColor Cyan
    }
}

Write-Host "`n" -ForegroundColor Gray

# Method 5: Try to get from Windows
Write-Host "Method 5: Windows Registry" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

try {
    $oneDriveAccounts = Get-ItemProperty -Path "HKCU:\Software\Microsoft\OneDrive\Accounts\*" -ErrorAction SilentlyContinue
    
    if ($oneDriveAccounts) {
        Write-Host "✓ Found OneDrive accounts:" -ForegroundColor Green
        foreach ($account in $oneDriveAccounts) {
            if ($account.DisplayName -and $account.UserFolder) {
                Write-Host "`n   Display Name: $($account.DisplayName)" -ForegroundColor Cyan
                Write-Host "   Folder: $($account.UserFolder)" -ForegroundColor Gray
                if ($account.SPOResourceId) {
                    Write-Host "   SPO Resource ID: $($account.SPOResourceId)" -ForegroundColor Yellow
                }
            }
        }
    }
} catch {
    Write-Host "✗ Could not read registry" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "RECOMMENDED ACTIONS:" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n1. Use the credentials from get_token.py:" -ForegroundColor Yellow
Write-Host "   AZURE_CLIENT_ID=474ea4f7-cd7b-4f18-8b25-d9a43e641e6c" -ForegroundColor White
Write-Host "   AZURE_TENANT_ID=00f4eed6-a609-4590-b9be-886970f8c541" -ForegroundColor White

Write-Host "`n2. OR get the tenant ID from Azure Portal:" -ForegroundColor Yellow
Write-Host "   - Visit https://portal.azure.com" -ForegroundColor White
Write-Host "   - Go to Microsoft Entra ID" -ForegroundColor White
Write-Host "   - Copy the 'Tenant ID'" -ForegroundColor White

Write-Host "`n3. Update your gallery-backend\.env file with the correct values" -ForegroundColor Yellow

Write-Host "`nPress Enter to continue..." -ForegroundColor Cyan
Read-Host
