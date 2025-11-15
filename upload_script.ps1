param(
    [string]$filePath,
    [string]$repoPath,
    [string]$commitMessage
)

# Convert to absolute path if relative
if (-not [System.IO.Path]::IsPathRooted($filePath)) {
    $filePath = Join-Path (Get-Location) $filePath
}

# Read file content
$content = Get-Content -Path $filePath -Raw -Encoding UTF8
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$base64 = [System.Convert]::ToBase64String($bytes)

# Create JSON payload
$payload = @{
    message = $commitMessage
    content = $base64
} | ConvertTo-Json

# Save to temp file
$tempFile = [System.IO.Path]::GetTempFileName()
$payload | Out-File -FilePath $tempFile -Encoding UTF8

# Use gh api with file input
gh api repos/mathwaksu-byte/MATHWA-Project/contents/$repoPath --method PUT --input $tempFile

# Clean up
Remove-Item $tempFile