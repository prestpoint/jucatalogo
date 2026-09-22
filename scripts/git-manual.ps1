param(
    [ValidateSet('catalogo', 'admin', 'conjunto', 'projeto', 'atualizar')]
    [string]$Acao
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$env:GIT_PAGER = 'cat'

function Git-Run {
    param([string[]]$Arguments)
    & git @Arguments
    if ($LASTEXITCODE -ne 0) { throw "O Git falhou. Operacao interrompida; nenhum reset foi executado." }
}

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        $bundled = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd'
        if (Test-Path (Join-Path $bundled 'git.exe')) { $env:PATH = "$bundled;$env:PATH" }
        else { throw 'Instale o Git para Windows para continuar.' }
    }
    Git-Run @('rev-parse', '--is-inside-work-tree')
    $branch = & git branch --show-current
    if ($branch -ne 'main') { throw 'Execute na branch main.' }
    $remote = & git remote get-url origin
    if ($remote -notin @('https://github.com/prestpoint/jucatalogo.git', 'https://github.com/prestpoint/jucatalogo', 'git@github.com:prestpoint/jucatalogo.git')) {
        throw 'O remoto origin nao corresponde a prestpoint/jucatalogo.'
    }
    $pushRemote = & git remote get-url --push origin
    if ($pushRemote -ne $remote) { throw 'O endereco de envio difere do origin. Revise a configuracao.' }

    if ($Acao -eq 'atualizar') {
        $changes = @(Git-Run @('status', '--porcelain'))
        if ($changes.Count) { throw 'Existem alteracoes locais. Salve seus commits antes de atualizar.' }
        Git-Run @('pull', '--ff-only', 'origin', 'main')
        Write-Host '[SUCESSO] Pasta atualizada.'
        exit 0
    }

    foreach ($field in @('name', 'email')) {
        $value = & git config "user.$field"
        if (-not $value) {
            $label = if ($field -eq 'name') { 'Nome do autor' } else { 'E-mail do autor (pode usar o noreply do GitHub)' }
            $value = Read-Host $label
            if ([string]::IsNullOrWhiteSpace($value)) { throw 'A autoria nao pode ficar vazia.' }
            Git-Run @('config', '--local', "user.$field", $value)
        }
    }

    $groups = switch ($Acao) {
        'catalogo' { @{ Label = 'CATALOGO'; Paths = @('catalogo') } }
        'admin' { @{ Label = 'ADMIN'; Paths = @('admin') } }
        'conjunto' {
            @{ Label = 'CATALOGO'; Paths = @('catalogo') }
            @{ Label = 'ADMIN'; Paths = @('admin') }
        }
        'projeto' { @{ Label = 'PROJETO'; Paths = @('.', ':(exclude)catalogo/**', ':(exclude)admin/**') } }
    }
    $pending = @()
    foreach ($group in $groups) {
        $changes = @(Git-Run (@('status', '--porcelain', '--') + $group.Paths))
        if ($changes.Count) {
            $pending += $group
            Write-Host "`nAlteracoes de $($group.Label):"
            Git-Run (@('status', '--short', '--') + $group.Paths)
        }
    }
    if ($pending.Count) {
        $message = Read-Host 'Mensagem do commit'
        if ([string]::IsNullOrWhiteSpace($message)) { throw 'A mensagem nao pode ficar vazia.' }
        foreach ($group in $pending) {
            Git-Run (@('add', '--') + $group.Paths)
            Git-Run (@('commit', '--only', '-m', "[$($group.Label)] $message", '--') + $group.Paths)
        }
    } else {
        Write-Host 'Sem novas alteracoes nesta area. Tentando enviar commits locais pendentes.'
    }
    & git rev-parse --verify HEAD 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Ainda nao existem commits. Execute commit_projeto.bat primeiro.' }
    Write-Host 'Enviando os commits pendentes da branch main...'
    Git-Run @('push', '-u', 'origin', 'main')
    Write-Host '[SUCESSO] Envio concluido.'
} catch {
    Write-Host "[ERRO] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Se houve commits antes da falha, eles permanecem locais. Voce pode executar novamente para tentar enviar.'
    exit 1
}
