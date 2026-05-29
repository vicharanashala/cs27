$log = "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server_run.log"
$err = "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server_run.err"
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "node"
$psi.Arguments = "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server\server.js"
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$p = [System.Diagnostics.Process]::Start($psi)
$p.Id | Out-File -LiteralPath "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server_pid.txt"
Start-Sleep -Seconds 5
if (!$p.HasExited) {
  "Running PID: $($p.Id)" | Out-File -LiteralPath "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server_status.txt"
} else {
  "Exited with code: $($p.ExitCode)" | Out-File -LiteralPath "C:\Users\beldh\OneDrive\Desktop\FAQ_SYSTEM\server_status.txt"
  $p.StandardError.ReadToEnd() | Out-File -LiteralPath $err
}
