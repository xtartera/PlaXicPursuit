# Full de ruta del Quiz del Pla Xic

Aquest document recull les premisses de producte, contingut, disseny i desenvolupament per transformar Pla Xic Pursuit en un quiz atractiu, educatiu i fàcil de jugar.

S'ha de mantenir actualitzat durant el desenvolupament. Una tasca només es pot marcar com a completada quan compleix el seu criteri d'acceptació.

## Llegenda

- [ ] Pendent
- [x] Completat
- `Decisió`: punt que cal acordar abans d'implementar-lo
- `Criteri d'acceptació`: condició observable que permet donar una tasca per acabada

## 1. Visió del producte

### Objectiu principal

El quiz ha d'ajudar a descobrir i recordar la història, els llocs, la cultura i les persones del Pla Xic. La recompensa principal no és avançar per un tauler, sinó aprendre alguna cosa del barri després de cada resposta.

### Principis

- [ ] El contingut local és el protagonista de totes les pantalles.
- [ ] Cada pregunta aporta una dada, història, fotografia o testimoni del Pla Xic.
- [ ] Una resposta incorrecta també genera aprenentatge.
- [ ] La partida és curta, directa i comprensible sense instruccions prèvies.
- [ ] La interfície funciona primer en mòbil i després s'adapta a pantalles grans.
- [ ] El llenguatge és proper, inclusiu i no escolar.
- [ ] Els elements lúdics reforcen el contingut i no el tapen.
- [ ] El projecte té una identitat pròpia i no imita visualment un joc comercial.

### Fora d'abast inicial

- [ ] No implementar comptes d'usuari.
- [ ] No implementar classificacions públiques.
- [ ] No implementar multijugador en línia.
- [ ] No implementar un editor de preguntes dins de l'aplicació.
- [ ] No afegir monetització ni publicitat.

## 2. Transformació del joc

### Eliminar la metàfora de Trivial Pursuit

- [x] Retirar el tauler de la portada i de la pantalla de pregunta.
- [x] Retirar el peó, el dau i el recorregut per caselles.
- [x] Retirar els formatgets com a objectiu de partida.
- [x] Retirar les pantalles separades i temporitzades d'encert i error.
- [x] Eliminar la possibilitat d'anar provant opcions fins a encertar.
- [x] Substituir qualsevol text relacionat amb cartes, caselles o formatgets per vocabulari de quiz.
- [x] Substituir “Pla Xic Pursuit” per “Quiz del Pla Xic”, amb “Quant coneixes el Pla Xic?” com a titular.

`Decisió`: nom de la primera versió: **Quiz del Pla Xic**. Titular principal: **Quant coneixes el Pla Xic?**

`Criteri d'acceptació`: una persona que veu la portada per primera vegada identifica l'experiència com un quiz sobre el barri i no com un joc de taula.

### Nou bucle principal

- [x] Seleccionar les preguntes de la partida.
- [x] Mostrar una pregunta amb quatre opcions.
- [x] Permetre una sola resposta.
- [x] Bloquejar totes les opcions després de respondre.
- [x] Marcar visualment la resposta seleccionada.
- [x] Mostrar sempre quina era la resposta correcta.
- [x] Mostrar l'explicació sense canviar de pantalla.
- [x] Avançar automàticament, amb un control per pausar i reprendre.
- [x] Finalitzar la partida automàticament després de l'última explicació.

`Criteri d'acceptació`: l'usuari pot completar una partida sencera sense accionar cap botó de continuació i sense canvis de pantalla que facin perdre el context de la pregunta.

## 3. Modalitats de partida

### Primera versió

- [x] Implementar “Quiz ràpid” amb 6 preguntes aleatòries.
- [ ] Implementar “Partida completa” amb 10 preguntes aleatòries.
- [x] Mostrar la durada aproximada de la modalitat inicial.
- [x] Evitar preguntes duplicades dins de la mateixa partida.

### Evolució posterior

- [ ] Afegir partida per categoria.
- [ ] Afegir una modalitat sense puntuació orientada només a descobrir històries.
- [ ] Valorar una modalitat per jugar en grup durant activitats del barri.

`Decisió`: la primera versió té una única modalitat ràpida de 6 preguntes. La partida completa queda per a una evolució posterior.

`Criteri d'acceptació`: començar una partida requereix com a màxim dues decisions i un clic final.

## 4. Preguntes i contingut

### Qualitat editorial

- [ ] Revisar ortografia, puntuació i estil de totes les preguntes.
- [ ] Eliminar o reescriure preguntes que podrien correspondre a qualsevol barri.
- [ ] Prioritzar fets, persones, espais i records específics del Pla Xic.
- [ ] Evitar respostes ambigües o basades només en opinions.
- [ ] Comprovar que totes les opcions siguin plausibles.
- [ ] Fer que les explicacions siguin comprensibles sense context addicional.
- [ ] Limitar les explicacions a una extensió adequada per a mòbil.
- [ ] Indicar la font quan la dada sigui històrica o atribuïda a una persona.
- [ ] Demanar consentiment abans de publicar testimonis o fotografies personals.

### Camps de contingut

Cada pregunta hauria de poder incloure:

- [ ] Identificador únic.
- [ ] Categoria.
- [ ] Dificultat.
- [ ] Enunciat.
- [ ] Quatre opcions.
- [ ] Resposta correcta.
- [ ] Explicació.
- [ ] Imatge i text alternatiu, quan aportin context.
- [ ] Font o testimoni.
- [ ] Any o període, si escau.
- [ ] Lloc o ubicació, si escau.
- [ ] Enllaç per ampliar informació, si existeix.

### Categories

- [ ] Mantenir les sis categories: Història, Llocs, Cultura, Memòria, Gent i Futur.
- [ ] Definir clarament què pertany a cada categoria.
- [ ] Garantir un mínim de preguntes per categoria.
- [ ] Utilitzar les categories com a filtres i indicadors de resultats, no com a premis.

`Decisió`: establir el mínim de preguntes publicables per categoria. Recomanació inicial: 8.

`Criteri d'acceptació`: totes les preguntes publicades han estat revisades, tenen una explicació útil i es poden atribuir inequívocament a una categoria.

## 5. Selecció i ordre de preguntes

- [x] Barrejar les preguntes a cada partida.
- [x] Barrejar les opcions mantenint correctament la resposta vàlida.
- [ ] Equilibrar la selecció entre categories disponibles.
- [ ] Evitar repetir preguntes jugades recentment.
- [ ] Evitar que una partida comenci amb una pregunta especialment difícil.
- [x] Limitar automàticament la partida quan no hi ha prou preguntes disponibles.
- [x] Fer que l'aleatorietat sigui comprovable mitjançant proves automatitzades.

`Criteri d'acceptació`: dues partides consecutives no presenten sistemàticament les mateixes preguntes ni les mateixes opcions en el mateix ordre.

## 6. Sistema de puntuació

### Proposta inicial

- [x] Donar 100 punts per resposta correcta.
- [x] Donar 0 punts per resposta incorrecta.
- [x] No permetre puntuacions negatives.
- [x] Mostrar per separat puntuació i nombre d'encerts.
- [ ] Registrar la millor ratxa d'encerts.
- [ ] Mostrar el rendiment per categoria.

### Bonificacions opcionals

- [ ] Valorar un bonus de dificultat: +25 mitjana i +50 difícil.
- [ ] Valorar un bonus de rapidesa amb un màxim de 25 punts.
- [ ] Valorar un petit bonus per ratxa de tres encerts.

`Decisió`: la primera versió utilitza només 100 punts per encert i 0 per error, sense bonus ni penalitzacions.

`Criteri d'acceptació`: l'usuari entén per què té aquella puntuació sense consultar unes instruccions externes.

## 7. Experiència de resposta i aprenentatge

- [x] Mostrar feedback immediat a la mateixa targeta.
- [ ] Diferenciar encert i error amb color, icona i text, no només amb color.
- [x] Mantenir visibles l'enunciat i totes les opcions durant el feedback.
- [x] Destacar la resposta correcta després de qualsevol resposta.
- [x] Mostrar l'explicació just sota les opcions.
- [ ] Mostrar la font, fotografia o testimoni quan existeixin.
- [x] Avançar automàticament al cap de 4 segons en un encert i de 7–10 segons en un error.
- [x] Mostrar una barra de temps restant i un control de pausa, sense botó d'avanç.
- [x] Pausar el compte enrere amb cursor, focus o quan la pestanya queda oculta.
- [x] Passar automàticament al resultat després de l'última pregunta.
- [ ] Evitar sons automàtics o proporcionar un control per silenciar-los.

`Criteri d'acceptació`: després de fallar una pregunta, l'usuari pot explicar quina era la resposta correcta i per què.

## 8. Pantalla principal

- [x] Fer que el nom del quiz sigui el primer element visual.
- [x] Explicar el valor del quiz amb una frase breu.
- [x] Mostrar nombre de preguntes i durada aproximada.
- [ ] Mostrar les modalitats disponibles sense sobrecarregar la pantalla.
- [ ] Destacar una única acció principal per començar.
- [ ] Mantenir “Proposa una pregunta” com a acció secundària.
- [ ] Mostrar l'últim resultat només si aporta valor i hi ha dades guardades.
- [ ] Utilitzar una fotografia real i recognoscible del Pla Xic com a actiu visual principal.

`Criteri d'acceptació`: una persona entén què aprendrà, quant durarà i com començar en menys de cinc segons.

## 9. Direcció visual

### Identitat

- [ ] Abandonar l'estètica de tauler comercial, dau, peó i formatgets.
- [ ] Construir una identitat basada en el Pla Xic i la seva memòria visual.
- [ ] Utilitzar fotografies reals del barri sempre que aportin informació.
- [ ] Fer servir els sis colors de categoria com a accents, no com a decoració dominant.
- [ ] Definir una paleta base clara, llegible i amb contrast suficient.
- [ ] Definir una jerarquia tipogràfica estable.
- [ ] Unificar estats, botons, espaiats i amplades en un petit sistema de disseny.

### Pantalla de pregunta

- [ ] Prioritzar l'enunciat i les opcions dins del primer viewport.
- [ ] Mostrar progrés, puntuació i categoria sense competir amb la pregunta.
- [ ] Garantir zones tàctils d'almenys 44 píxels.
- [ ] Evitar que textos llargs modifiquin o trenquin el layout.
- [ ] Reservar dimensions estables per a fotografies i feedback.

### Moviment

- [ ] Utilitzar animacions breus per confirmar respostes.
- [ ] Evitar animacions que retardin la partida.
- [ ] Respectar `prefers-reduced-motion`.
- [ ] Evitar canvis de layout quan apareix el feedback.

`Criteri d'acceptació`: portada, pregunta, feedback i resultat semblen parts del mateix producte i funcionen sense solapaments a 320 px, 390 px, 768 px i 1440 px.

## 10. Pantalla final

- [ ] Mostrar puntuació total.
- [ ] Mostrar encerts sobre el total.
- [ ] Mostrar percentatge d'encert.
- [ ] Mostrar millor ratxa.
- [ ] Mostrar resultats per categoria.
- [ ] Generar una valoració breu segons el resultat.
- [ ] Oferir “Tornar a jugar”.
- [ ] Oferir una nova modalitat o categoria, quan sigui pertinent.
- [ ] Valorar una targeta compartible sense revelar respostes.

### Proposta de valoracions

- [ ] 0–30%: “Acabes d'arribar al barri.”
- [ ] 40–60%: “Ja coneixes uns quants racons.”
- [ ] 70–80%: “Portes el Pla Xic ben après.”
- [ ] 90–100%: “Memòria viva del barri.”

`Criteri d'acceptació`: el resultat explica què ha passat, què domina l'usuari i què pot continuar descobrint.

## 11. Persistència i rejugabilitat

- [ ] Guardar localment la millor puntuació.
- [ ] Guardar l'últim resultat.
- [ ] Guardar un historial limitat de preguntes recents.
- [ ] Permetre reiniciar les dades guardades.
- [ ] No guardar informació personal.
- [ ] Fer que el quiz continuï funcionant si l'emmagatzematge local no està disponible.

`Criteri d'acceptació`: tornar a obrir el quiz conserva els resultats útils sense exigir registre ni comprometre dades personals.

## 12. Accessibilitat

- [ ] Poder completar tota la partida amb teclat.
- [ ] Mantenir el focus visible.
- [ ] Traslladar el focus al feedback després de respondre quan sigui necessari.
- [ ] Anunciar encert, error i resposta correcta als lectors de pantalla.
- [ ] Proporcionar text alternatiu útil a totes les imatges informatives.
- [ ] No dependre exclusivament del color.
- [ ] Complir contrast WCAG AA en text i controls.
- [ ] Respectar les preferències de reducció de moviment.
- [ ] Provar ampliació de text al 200%.

`Criteri d'acceptació`: el flux principal es pot completar sense ratolí i sense perdre informació essencial.

## 13. Rendiment i compatibilitat

- [ ] Mantenir el JavaScript inicial lleuger.
- [ ] Optimitzar i dimensionar les fotografies.
- [ ] Evitar salts de layout durant la càrrega d'imatges.
- [ ] Mostrar un estat adequat quan una imatge no es pot carregar.
- [ ] Provar les versions recents de Chrome, Edge, Firefox i Safari.
- [ ] Provar Android i iOS en pantalles petites.
- [ ] Garantir que el quiz sigui utilitzable amb connexions lentes.

`Criteri d'acceptació`: cap actiu visual bloqueja l'inici de la partida i no hi ha desbordaments ni solapaments als viewports acordats.

## 14. Analítica i aprenentatge del producte

- [ ] Definir quines dades són realment necessàries abans d'afegir analítica.
- [ ] Mesurar partides iniciades i completades.
- [ ] Mesurar abandonaments per pregunta sense identificar persones.
- [ ] Detectar preguntes amb percentatges d'error anormalment elevats.
- [ ] Detectar preguntes que poden ser massa fàcils o ambigües.
- [ ] Documentar privacitat i consentiment si s'utilitza un servei extern.

`Decisió`: no afegir analítica fins que existeixi una necessitat concreta i una opció respectuosa amb la privacitat.

## 15. Proves i qualitat

### Proves unitàries

- [ ] Selecció aleatòria sense duplicats.
- [ ] Barreja d'opcions conservant la resposta correcta.
- [ ] Resposta única per pregunta.
- [ ] Càlcul de puntuació.
- [ ] Ratxes i bonus, si s'implementen.
- [ ] Resultats per categoria.
- [ ] Persistència local.
- [ ] Validació del contingut Markdown.

### Proves de flux

- [ ] Completar una partida amb totes les respostes correctes.
- [ ] Completar una partida amb totes les respostes incorrectes.
- [ ] Completar una partida combinant encerts i errors.
- [ ] Arribar al resultat des de l'última explicació.
- [ ] Reiniciar una partida.
- [ ] Sortir d'una partida i començar-ne una altra.
- [ ] Recuperar preferències o resultats guardats.

### Proves visuals

- [ ] Captura de portada a 390 × 844.
- [ ] Captura de pregunta curta i llarga a 390 × 844.
- [ ] Captura de feedback correcte i incorrecte a 390 × 844.
- [ ] Captura de resultat a 390 × 844.
- [ ] Repetir les captures a 1440 × 1000.
- [ ] Comprovar que cap text, botó o imatge se solapa o queda tallat.

`Criteri d'acceptació`: build, proves automatitzades i revisió visual passen abans de cada publicació.

## 16. Fases d'implementació

### Fase 0 — Decisions

- [x] Confirmar el canvi definitiu de Trivial Pursuit a quiz.
- [x] Escollir el nom de treball.
- [x] Escollir la modalitat inicial.
- [x] Acordar el sistema de puntuació mínim.
- [ ] Acordar la quantitat mínima de contingut publicable.

### Fase 1 — Nucli funcional

- [x] Simplificar el model a resposta única.
- [x] Eliminar intents successius i formatgets.
- [x] Implementar selecció aleatòria de preguntes.
- [x] Implementar barreja d'opcions.
- [x] Implementar puntuació i encerts.
- [x] Afegir proves unitàries.

### Fase 2 — Flux de quiz

- [x] Redissenyar la pantalla principal.
- [x] Redissenyar la pantalla de pregunta.
- [x] Integrar el feedback dins de la pregunta.
- [x] Redissenyar la pantalla final.
- [x] Eliminar les pantalles transitòries i implementar avanç automàtic pausable.

### Fase 3 — Contingut

- [ ] Revisar totes les preguntes existents.
- [ ] Completar explicacions i fonts.
- [ ] Equilibrar categories.
- [ ] Incorporar fotografies reals.
- [ ] Actualitzar l'importador i la documentació del format.

### Fase 4 — Rejugabilitat

- [ ] Afegir modalitats.
- [ ] Afegir persistència local.
- [ ] Afegir resultats per categoria.
- [ ] Evitar repeticions recents.

### Fase 5 — Poliment i publicació

- [ ] Auditoria d'accessibilitat.
- [ ] Proves responsive i entre navegadors.
- [ ] Optimització d'imatges i rendiment.
- [ ] Revisió editorial final.
- [ ] Prova amb persones del barri.
- [ ] Incorporar el feedback prioritari de la prova.
- [ ] Publicar la nova versió.

## 17. Definició global de “fet”

La transformació es considerarà completada quan:

- [x] No quedin mecàniques ni textos propis del Trivial Pursuit.
- [x] Cada pregunta només admeti una resposta.
- [x] El feedback educatiu aparegui immediatament i sense canviar de pantalla.
- [x] Hi hagi com a mínim una modalitat curta rejugable.
- [x] Les preguntes i opcions es presentin en ordre variable.
- [ ] El resultat mostri puntuació, encerts i rendiment per categoria.
- [ ] El contingut estigui revisat i equilibrat.
- [ ] El flux sigui accessible amb teclat i lector de pantalla.
- [x] Totes les proves automatitzades passin.
- [ ] Les captures de mòbil i escriptori no mostrin solapaments.
- [ ] Una prova amb usuaris confirmi que s'aprèn alguna cosa nova del Pla Xic.

## 18. Registre de decisions

Afegir aquí les decisions a mesura que es tanquin:

| Data | Decisió | Motiu | Impacte |
|---|---|---|---|
| 2026-08-25 | Quiz ràpid de 6 preguntes | Primera versió curta i fàcil de validar | Selecció aleatòria limitada a 6 preguntes |
| 2026-08-25 | Una resposta per pregunta | Evitar intents fins a encertar | Totes les opcions es bloquegen després de respondre |
| 2026-08-25 | 100 punts per encert i 0 per error | Puntuació fàcil d'entendre | Sense penalitzacions ni bonus inicials |
| 2026-08-25 | Avanç automàtic pausable | Mantenir ritme sense botó “Següent” | 4 s en encert i 7–10 s en error |

## 19. Notes de seguiment

Utilitzar aquest espai per registrar bloquejos, observacions de proves i canvis de prioritat:

- Cap nota registrada.
