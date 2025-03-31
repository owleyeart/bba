#######################################################
### Bob Baker - Owl Eye Art Institute, March 2025   ###
#######################################################

import msal

# Replace with your actual values
CLIENT_ID = "474ea4f7-cd7b-4f18-8b25-d9a43e641e6c"
TENANT_ID = "00f4eed6-a609-4590-b9be-886970f8c541"
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
SCOPES = ["https://graph.microsoft.com/.default"]
CLIENT_SECRET = "<your-client-secret>"  # Only if using confidential client (like daemon app)

def get_access_token():
    app = msal.PublicClientApplication(
        CLIENT_ID,
        authority=AUTHORITY
    )

    result = None

    # Try silent login first
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])

    # If silent fails, do interactive login
    if not result:
        result = app.acquire_token_interactive(scopes=SCOPES)

    if "access_token" in result:
        print("✅ Access token:")
        print(result["access_token"])
        return result["access_token"]
    else:
        print("❌ Failed to get token")
        print(result.get("error"))
        print(result.get("error_description"))

if __name__ == "__main__":
    get_access_token()
