# Publicar a Vercel

## Opcio recomanada: panell de Vercel

1. Entra a [vercel.com](https://vercel.com) i inicia sessio amb GitHub.
2. Selecciona `Add New Project` i importa `xtartera/PlaXicPursuit`.
3. Mantingues la configuracio detectada per Vite.
4. Prem `Deploy`.

El repositori ja inclou `vercel.json` amb aquesta configuracio:

- Instal·lacio: `npm ci`
- Build: `npm run build`
- Sortida: `dist`

## Amb la CLI

```bash
npm install --global vercel
vercel login
vercel
```

Per publicar a produccio:

```bash
vercel --prod
```

Abans de publicar, comprova localment:

```bash
npm run build
npm run preview
```
