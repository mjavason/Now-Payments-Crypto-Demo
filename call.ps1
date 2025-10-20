$url = "https://sandbox.nowpayments.io/payment/?iid=4606599474"
$attempts = 50

for ($i = 1; $i -le $attempts; $i++) {
    Write-Host "Attempt $i of $attempts"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        Write-Host "Status Code: $($response.StatusCode)"
    } catch {
        Write-Host "Request failed on attempt $i"
    }
    Start-Sleep -Seconds 1
}
