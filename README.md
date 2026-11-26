# Partner Precificação SaaS

Sistema de Precificação de Softwares e Módulos (SaaS) — funciona no navegador e pode ser instalado como aplicativo.

## Como instalar

| Aparelho | Como instalar |
|---|---|
| **Windows** | Baixe o `Precificacao-SaaS-x.y.z-win-x64.exe` na página **Releases** e execute. Também há a versão `portable.exe`, que roda sem instalar. |
| **Linux (Ubuntu/Debian/Mint)** | Baixe o `.deb` e instale com `sudo apt install ./Precificacao-SaaS-*.deb` (ou dois cliques). |
| **Linux (qualquer distro)** | Baixe o `.AppImage`, dê permissão (`chmod +x`) e abra. |
| **Android (celular/tablet)** | Abra o sistema no **Chrome** → menu ⋮ → **Instalar app**. |
| **iPhone / iPad** | Abra no **Safari** → **Compartilhar** → **Adicionar à Tela de Início**. |
| **PC pelo navegador** | No Chrome/Edge, clique no ícone de instalar na barra de endereço, ou em *Segurança → Aplicativo e Backup → Instalar aplicativo*. |

## Sem conflito com outros aplicativos

- **Desktop:** ID próprio (`br.com.partner.precificacaosaas`), GUID próprio no instalador do Windows, pacote Linux `partner-precificacao-saas` e pasta de dados exclusiva (`partner-precificacao-saas`). Instala só para o usuário atual (não exige administrador), não altera nada do sistema e abre uma única janela (instância única).
- **Celular/navegador:** o service worker fica limitado à pasta do app (`/precificacao-saas/`) e usa caches com prefixo próprio — não interfere em outros sites/apps do mesmo domínio.
- Os dados ficam no aparelho. Para levar os cadastros do navegador para o app (ou para outro aparelho), use **Segurança → Aplicativo e Backup → Exportar / Importar backup**.

## Gerar os instaladores

Automático (GitHub Actions): crie uma tag de versão — `git tag v1.0.0 && git push --tags` — ou use **Actions → Gerar instaladores → Run workflow**. Os arquivos aparecem em **Releases** (com tag) ou nos *artifacts* da execução.

Manual (precisa de Node.js 20+):

```bash
cd desktop
npm install
npm start            # testar
npm run dist:win     # gerar .exe (rodar no Windows)
npm run dist:linux   # gerar .deb e .AppImage (rodar no Linux)
```

Para lançar uma nova versão, altere `"version"` em `desktop/package.json` e, se mudar arquivos do app, a constante `VERSAO` em `sw.js`.
