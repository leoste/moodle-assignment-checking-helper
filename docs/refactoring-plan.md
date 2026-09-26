# Refaktoreerimise tegevusplaan

See dokument on iseseisev tegevusplaan Moodle Assignment Checking Helperi koodibaasi korrastamiseks. Selle lugemiseks ei ole vaja varasemat arutelu. Kõik algse analüüsi leiud, autori otsused ja otsuste järel tehtud lisaanalüüs on siin kirjas.

---

## Taust

Projektis on kaks laiendust, millel on osaliselt ühine koodibaas:

- **Google Chrome'i laiendus** ([google-chrome-extension/](../google-chrome-extension/)) lisab Moodle'i hindamislehtedele abipaneeli ja nuppe. Sellel on kolm käituskonteksti: *content-script* (Moodle'i lehel), *service-worker* (taustal) ja *popup*.
- **Visual Studio Code'i laiendus** ([visual-studio-code-extension/](../visual-studio-code-extension/)) saab Chrome'ilt WebSocketi kaudu teate, millist õpilast hinnatakse, ja avab tema failid. Lisaks lisab see Pythoni käivitamise käsu.
- **Juure `shared/`** ([shared/](../shared/)) sisaldab koodi, mis peab olemuslikult olema mõlemas laienduses sama. Chrome'i `src/shared/` ja VS Code'i `src/shared/` on sama laienduse kontekstide vahel jagatud kood. Mitu `shared` kausta on **tahtlik** ja nii see jääb.

Algne analüüs käsitles nelja teemat: (1) topeltdefineerimised ja käitumise lahknemise oht, (2) magic stringid ja numbrid, (3) koodistruktuuride eesmärgi selgus ja ühe vastutuse põhimõte, (4) util-megamoodulid ja lehe haldamise workflow. Lisaks hinnati robustsust (ainult tõsised asjad) ja seda, mis `shared/` struktuurist puudu on.

## Kuidas seda dokumenti lugeda

Tegevused on kolmes grupis:

1. **Väikesed muudatused (V)**: ühe- või kahefailised muudatused, mida on mõistlik teha **ühe korraga**.
2. **Keskmised muudatused (K)**: mahukamad, aga mitte eraldiseisvaks teemaks kuulutatud. Need tehakse **ükshaaval** ja soovitatud järjekorras.
3. **Eraldiseisvad teemad (E)**: autor on märkinud need täiesti eraldi käsitletavaks. Kui autor on mitu punkti omavahel sidunud, on need samas grupis. Neid **praeguse refaktoreerimise käigus ei tehta**.

Iga punkti juures on algse analüüsi number (näiteks `[1.1]`), et seoseid oleks lihtne jälgida. Tabelis 2 kasutatakse autori numeratsiooni 2.1–2.16. Autori kommentaarides on read 2.15 ja 2.16 kirjutatud kui „1.15“ ja „1.16“. Autori kommentaarid on tsiteeritud **sõna-sõnalt**.

**Töötsükkel iga sammu jaoks:**
1. Lahendaja lahendab sammu oma nägemuse järgi.
2. Lahendaja esitab lahenduse autorile ja autor hindab seda.
3. Kui on puudusi, parandab lahendaja need. Autori sõna jääb peale, aga lahendaja selgitab vajadusel tagamaid ja neid saab arutada. Samme 2–3 korratakse, kuni osa on valmis.
4. Samm märgitakse selles failis tehtuks. Kui töö käigus tehti otsuseid või muudatusi, uuendatakse sammu kirjeldust nende põhjal.

**Olekumärgid:** ✅ tähendab, et samm on tehtud ja autori poolt heaks kiidetud. Tehtud sammu juures olev plokk **„Tehtud“** kirjeldab, kuidas samm tegelikult lahendati ja kus see plaanist erines.

**Kuidas plaani sisu tõlgendada (reeglid lahendajale):**
- **Plaan põhineb ülevaatlikul, üldisel uurimisel.** Iga sammu mõte on käsitleda oma teemat põhjalikumalt, kui algses üldvaates võimalik oli. Kõik, mis plaanis on kirjas, tuleb sammu alguses koodi põhjal üle kontrollida.
- **„Eesmärk“** kirjeldab, mida samm peab saavutama, ja selle piiranguid. Konkreetset lahendust see ette ei anna.
- **„Esialgne soovitus (üldise plaani põhjal)“** on algse analüüsi lahendaja pakutud võimalik lahendus. See **ei ole autori otsus ega kohustuslik.** Lahendaja hindab selle põhjalikumalt ümber ja võib valida teise lahenduse.
- **„Lahendaja analüüs“ / „Lisaanalüüs“** on algse lahendaja hinnang, mitte kontrollitud tõde. Need võivad olla aegunud, sest vahepeal tehtud sammud on koodi muutnud (ka reanumbreid).
- **Autori nõusolek („nõus“, „ok“ jms) tähendab nõusolekut probleemi olemasoluga, mitte pakutud lahendusega,** kui autor pole lahendust eraldi kinnitanud. Kui lahenduse on välja pakkunud autor ise (näiteks K9 generaatorid ja K8 payload/message mudel), on see autori suunis.
- **Probleemi raamistus tuleb autori sõnadest** (tsitaadid), mitte lahendaja leiust. Kui need erinevad, kehtib autori raamistus.
- **Enne lahendamist vaata, milline muster projektis juba olemas on.** Kui olemasolev muster sobib, kasuta seda. Uut mustrit ära leiuta. Kui uus muster on siiski vajalik, põhjenda seda autorile.
- **„Leid“ osad** on algse ülevaatliku analüüsi väited ja **„Kui ignoreerida“** osad on algse lahendaja riskihinnangud. Need võivad olla ebatäpsed või üle hinnatud, seega kontrolli neid koodi põhjal.
- **Viited ja reanumbrid** võivad olla aegunud: tehtud sammud on faile muutnud, ümber nimetanud ja kustutanud. Tehtud sammude viited on ajaloolised. Otsi õige koht koodist nime järgi üles.
- **Autentne on ainult tsitaat.** Kõik autori seisukohtade ümbersõnastused (näiteks „Suund“, „Tehtud“ kokkuvõtted) on lahendaja tõlgendus. Kahtluse korral lähtu tsitaadist või küsi autorilt.
- **Teistesse sammudesse lükatud asjad** („lahendatakse K9-s“, „kuulub E2 alla“ jms) põhinevad esialgsetel lahendustel. Kui sammu lahendus muutub, kontrolli, et ükski selle sammuga seotud asi sammude vahele kaotsi ei läheks. Kui asi jääb katmata, ütle seda autorile ja lisa see plaani.
- **Kommentaarid:** koodi ei kommenteerita, kui kommentaar ei lisa midagi väga väärtuslikku. Kommentaari, mis kordab seda, mida kood (nimed, struktuur, tüübid) juba ise ütleb, ei lisata, sest see on sisuliselt koodiduplikatsioon.
- **Skoop:** refaktoreerimine ei muuda käitumist. Kui lahendus muudaks käitumist, küsi autorilt. Kui töö käigus leitakse skoobiväline probleem, seda sammus ei lahendata, vaid see lisatakse plaani eraldi punktina (näiteks E12).

Algse analüüsi soovitatud järjekorra jättis autor kõrvale:
> seda kõike arvestades, ma praegu disregardiksin sinu soovitatud järjekorra, kuna ma mõtlesin kõige su öeldu üle nii nagu üleval näed ja see muudab pilti kõvasti.

(Algne järjekord oli: 1) jagatud lepingud ja konstandid, 2) dispetšeri baasklass ja AsyncInitialisable, 3) page objectid ja FeedbackComposer, 4) service- ja repository-kihtide vastutus, 5) nimed ja surnud kood.)

---

# 1. Väikesed muudatused (V): tehakse koos ✅

> **Tehtud:** kõik punktid V1–V15 tehti ühe sammuna ja autor kiitis need korraga heaks. Plaanist ei otsustatud midagi ümber. Täpsustused:
> - **V1 + V15** tehti koos: luuakse uus fail `executeOnPageReady.ts` koos konstantidega. Vana faili `executeOnPageLoad.ts` kustutas autor käsitsi.
> - **V8:** tehti WeakMap'i parandus, JSDoc ja kahe dispetšeri klassikommentaarid. Vabatahtlikke ümbernimetusi (`onSharedInit`, `static #sharedHandlerMap`) ei tehtud.
> - **V9:** lisandus tüüp `FileEntry = [dirUri, fileName]`. Varasem `#collectFiles` sai nimeks `#collectFilesRecursively`.
> - **V11:** lisaks eemaldati `#calculateAndSetTotalPoints` parameeter `overrideEnabledTrue`, mida kasutas ainult `setPointsMax`. Paneeli CSS gridi teine veerg (`1fr auto`) jäi alles, kuigi see on nüüd tühi.
> - **V13:** repository saab ainult failide sisu, mitte nimesid, seega logitakse vea juures faili sisu esimesed 200 märki.
> - **V14:** README sektsioon „Future concerns“ on inglise keeles, nagu ülejäänud README.
> - Typecheck'i ei jooksutatud, sest shell'i ei kasutatud.

### V1. `executeOnPageLoad` ajakonstandid `[2.2]` ✅
**Leid:** [executeOnPageLoad.ts](../google-chrome-extension/src/content-script/pagemanager/executeOnPageLoad.ts) sisaldab nimeta numbreid `1200` (debounce, rida 8) ja `100` (URL-i pollingu intervall, rida 41).
**Autori otsus:**
> pageload intervallidel otseselt nime praegu pole, aga neil on täitsa eesmärk olemas. minu arust 1200 on mingi "minimumPracticalDelayBeforePageCanBeExpectedToBeLoaded" ja 100 on kiire kuid mitte spammav refresh rate.

**Tegevus:** failitasemel konstandid, mis kannavad autori kirjeldatud tähendust:
```ts
// Minimaalne praktiline viide pärast viimast DOM-muutust, mille järel võib eeldada, et leht on kasutatav.
const MIN_PRACTICAL_PAGE_READY_DELAY_MS = 1200
// Kiire, kuid mitte spämmiv URL-i muutuse kontrollimise sagedus.
const URL_CHANGE_POLL_INTERVAL_MS = 100
```
Loogikat ei muudeta, sest see on eraldi teema E6.

### V2. WebSocketi päringu timeout `[2.3]` ✅
**Leid:** [VsCodeConnectionProvider.ts:13](../google-chrome-extension/src/service-worker/provider/VsCodeConnectionProvider.ts#L13) kasutab `5000` ms. See on küll nimega väli, aga mitte konstant.
**Autori otsus:**
> see 5000 ma ei mäleta miks sai just nimetatud, aga jah. piisab faili tasemel constantist praegu.

**Tegevus:** failitasemel `const REQUEST_TIMEOUT_MS = 5000`.

### V3. Asset'i tee `[2.7]` ✅
**Leid:** [ClickableListItemRenderer.ts:50](../google-chrome-extension/src/content-script/renderer/ClickableListItemRenderer.ts#L50) kasutab inline väärtust `'images/double-thumbs-up-emoji.png'`.
**Autori otsus:**
> asseti teed võiks ka olla constantid kuskil, kasvõi sams failis

**Tegevus:** samas failis `const ADD_BUTTON_IMAGE_PATH = 'images/double-thumbs-up-emoji.png'`.

### V4. Moodle'i ID parsimise indeksid `[2.8]` ✅
**Leid:** [quiz-moodle-helper.ts:22-25](../google-chrome-extension/src/content-script/pagemanager/quiz-moodle-helper.ts#L22-L25) teeb `box.id.split('-')` ja kasutab indekseid `1` ja `2` ilma selgituseta. Moodle'i elemendi ID on kujul `question-<usage id>-<slot>`.
**Autori otsus:**
> moodle id parseimisel mingi loogika oli, aga ma ei mäleta mis. aga 1 ja 2 indeksid võiks teha muutujatena, constantitena tegelt, ja nimedeks panna siis kas selle järgi kus neid kasutatakse midagi mis annab aimu mis nad on ja et keegi kogemata vale nr ei pane

**Tegevus:** failitasemel konstandid, mis on nimetatud kasutuskoha järgi. Kommentaaris on kirjas Moodle'i ID formaat:
```ts
// Moodle'i küsimuse kasti id formaat: "question-<quiz id>-<question number>"
const MANUAL_GRADED_BOX_ID_SEPARATOR = '-'
const MANUAL_GRADED_BOX_ID_QUIZ_ID_INDEX = 1
const MANUAL_GRADED_BOX_ID_QUESTION_NUMBER_INDEX = 2
```
### V5. VS Code'i käsu ID `[2.11]` ✅
**Leid:** `'moodle-helper.runPythonInTerminal'` on nii [PythonRunnerController.ts:9](../visual-studio-code-extension/src/controller/PythonRunnerController.ts#L9) kui kolm korda [package.json](../visual-studio-code-extension/package.json)-is. JSON-is ei saa kordamist vältida, TS-i poolel peaks see olema konstant.
**Autori otsus:**
> tee constantiks siis

**Tegevus:** konstant `RUN_PYTHON_IN_TERMINAL_COMMAND` failis [config.ts](../visual-studio-code-extension/src/config.ts) (või samas kontrolleri failis). Kommentaaris märge, et väärtus peab ühtima `package.json`-iga.

### V6. Pythoni interpretaator ja terminali nimi `[2.12]` ✅
**Leid:** [PythonRunnerService.ts:9, 13](../visual-studio-code-extension/src/service/PythonRunnerService.ts#L9) kasutab hardcoded väärtusi `python` ja `'Python Runner'`. Windowsis on käsk sageli `py`.
**Autori otsus:**
> interpretatori nimede hardcoded olemine mtea, see on seni töötanud, aga ig võib ju seda kuidagi parandada et teha constant list vms

**Lisaanalüüs:** kõige lihtsam on üks konstant `PYTHON_COMMAND = 'python'` ja `PYTHON_TERMINAL_NAME = 'Python Runner'` failis [config.ts](../visual-studio-code-extension/src/config.ts). *Nimekiri* (`['python', 'py', 'python3']`) tähendaks, et kood proovib neid järjest. See on käitumise muutus ja vajab lisaloogikat, mistõttu seda siin ei tehta.
**Tegevus:** kaks konstanti failis config.ts.

### V7. Editori veergude arv `[2.13]` ✅
**Leid:** [PageInfoService.ts:43](../visual-studio-code-extension/src/service/PageInfoService.ts#L43) sisaldab `(fileCount % 2) + 1`.
**Autori otsus:**
> % 2 no pane siis jah et 2 on veergudearv mitte ns 2, tee constant. lisaks see 2 ilmub ju mitmes kohas, nii et käi siis kõik üle, mtite niisama ära tuimalt replace 2 vaid ikka seal kus see tähendab veergude arvu

**Lisaanalüüs:** kogu koodibaas on läbi vaadatud. Tähenduses „editori veergude arv“ esineb `2` **ainult** selles kohas. Teised esinemised tähendavad muud:
- [assign-grader.css](../google-chrome-extension/src/content-script/assign-grader.css) (`grid-column: 1 / 2`, `column-count: 2` jms) on Chrome'i paneeli CSS paigutus.
- [quiz-moodle-helper.ts:25](../google-chrome-extension/src/content-script/pagemanager/quiz-moodle-helper.ts#L25) `parts[2]` on ID indeks (V4).
- [QuizReviewListener.ts:19](../google-chrome-extension/src/content-script/pagelistener/QuizReviewListener.ts#L19) on TODO kommentaari loendi number.

`+ 1` tuleb sellest, et VS Code'i `ViewColumn` algab 1-st.
**Tegevus:** `EDITOR_COLUMN_COUNT = 2` failis config.ts ja kujul `vscode.ViewColumn.One + (fileCount % EDITOR_COLUMN_COUNT)`.

### V8. `AsyncInitialisable` ühekordse init'i viga ja selgus `[3.1]` ✅
**Leid:** [AsyncInitialisable.ts](../shared/AsyncInitialisable.ts)
- „Ühekordsus“ on seotud **meetodi implementatsiooniga**, mitte klassiga. Alamklassid, mis `onOneTimeInit`-i üle ei kirjuta, jagavad sama kirjet. Seda kasutatakse selleks, et baasklass (näiteks `ChromeExtensionMessageController`) oleks ühtlasi singleton-dispetšer.
- **Latentne viga:** meetod märgitakse WeakSet'is tehtuks *enne*, kui `onOneTimeInit` lõpeb. Teine instants jätab ühekordse sammu vahele **ega oota** esimese lõpuni. Praegu töötab see ainult seetõttu, et `onOneTimeInit` sisu on sünkroonne. Kui sinna lisatakse `await`, kutsuvad järgmised kontrollerid `addMessageHandler`-it olematu mapi peal ja kood kukub.
- Algne ettepanek oli `onOneTimeInit` eemaldada ja jagatud infrastruktuur eraldi singletoniks teha. **Autor lükkas selle tagasi.**

**Autori otsus:**
> baasklass ongi meelega singleton-dispetser, see on meelega. ma ei viitsiks seda praegu eraldada singleton dispetseriks ja baasklassiks eraldi asjadena, kas saab selle lihtsalt nime muutes ja funktsiooninimesid vms muutes või juurde tehes selgeks teha? või arvad on ikka väga vajalik? okei su concern et see ei tööta mõnedel juhtudel tulevikus on valid, aga ma ei arva, et ononetimeinit eemaldamine on okei lahendus. seda peaks kuidagi muudmoodi siis lahendama. see kontseptsioon kui selline peab alles jääam, et on võimalik ainult üks kord mingeid asju initiatida. see eksisteerib et lahendada enne olemasolnud ulatuslikku duubeldamise probleemi.

**Lisaanalüüs ja vastus:** eraldamine **ei ole vajalik**. Viga saab parandada kontseptsiooni säilitades:
1. **Vea parandus:** `WeakSet<Function>` asendatakse `WeakMap<Function, Promise<void>>`-iga. Esimene kutse salvestab `onOneTimeInit()` promise'i ja iga järgmine instants **ootab sama promise'i**. Nii on samm endiselt ühekordne, aga keegi ei jätka enne selle lõppu.
   ```ts
   static readonly #oneTimeInits = new WeakMap<Function, Promise<void>>()
   async #tryOneTimeInit(): Promise<void> {
     const method = this.onOneTimeInit
     let promise = AsyncInitialisable.#oneTimeInits.get(method)
     if (!promise) {
       promise = this.onOneTimeInit()
       AsyncInitialisable.#oneTimeInits.set(method, promise)
     }
     await promise
   }
   ```
2. **Selgus nimede ja dokumentatsiooni kaudu:**
   - `onOneTimeInit` juurde lisatakse JSDoc: *„Käivitub üks kord selle meetodi implementatsiooni kohta, mitte instantsi kohta. Kõik alamklassid, mis seda üle ei kirjuta, jagavad sama käivitust. Mõeldud klassihierarhia ühise infrastruktuuri (näiteks singleton-dispetšeri) loomiseks.“*
   - Võimalik ümbernimetus `onOneTimeInit` → `onSharedInit` (vabatahtlik).
   - [ChromeExtensionMessageController](../google-chrome-extension/src/service-worker/controller/ChromeExtensionMessageController.ts) ja [VsCodeWebSocketController](../visual-studio-code-extension/src/controller/VsCodeWebSocketController.ts) klassi juurde lisatakse kommentaar, et klass on korraga baasklass ja staatilise olekuga singleton-dispetšer. Staatilised väljad võib nimetada nii, et see on näha (näiteks `static #sharedHandlerMap`).

**Tegevus:** AsyncInitialisable'i parandus ja dokumentatsioon ning kahe kontrolleri klassikommentaarid. Rollide eraldamine on eraldi teema E5.

### V9. VS Code'i `handlePageInfo` jagamine orkestreerijaks ja funktsioonideks `[3.7]` ✅
**Leid:** [PageInfoService.handlePageInfo](../visual-studio-code-extension/src/service/PageInfoService.ts) teeb viit asja: sulgeb kõik terminalid, kollapseerib exploreri, sulgeb editorid, otsib kausta, kogub failid ja avab need veergudesse.
**Autori otsus:**
> meetod teeb neid kõiki koos, kuna need iseenesest on kõik ühe sama tegevuse osad. need peavadki koos toimuma. aga ma olen nõus, et peaks eraldama funktsioonide kaupa nii, et see põhiline on orkestreerija.

**Tegevus:** samas failis jääb põhimeetod ainult orkestreerijaks:
```ts
async handlePageInfo(studentName: string) {
  if (!studentName) return
  await this.#resetWorkspace()
  const folder = await this.#findStudentFolder(studentName)
  if (!folder) return
  const files = await this.#collectSubmissionFiles(folder)
  await this.#openFiles(files)
}
```
Käitumine jääb samaks, ka `startsWith` sobitamine (vaata E7).

### V10. Nimede ebakõlad `[3.8.2]` ✅
**Leid:**
- `FileCacheController` eksporditakse nimega `fileRefreshController` ([FileCacheController.ts:18](../google-chrome-extension/src/service-worker/controller/FileCacheController.ts#L18), kasutus [init-controllers.ts](../google-chrome-extension/src/service-worker/controller/init-controllers.ts)).
- Fail `QuizClient.ts` ekspordib klassi `QuizDataClient` ([QuizClient.ts](../google-chrome-extension/src/content-script/client/QuizClient.ts), kasutus kahes listeneris).
- Chrome'i kontrolleri veateade ütleb `[ChromeWebSocketController]` ([ChromeExtensionMessageController.ts:41](../google-chrome-extension/src/service-worker/controller/ChromeExtensionMessageController.ts#L41)), kuigi klassi nimi on teine. See on copy-paste jälg.

**Autori otsus:**
> ok paranda nime ebakõlad ära

**Tegevus:** `fileRefreshController` → `fileCacheController`, `QuizDataClient` → `QuizClient`, logi prefiks → `[ChromeExtensionMessageController]`. Kui K6 (singletonid) muudab klientide eksporti, arvestatakse sellega seal.

### V11. Surnud koodi eemaldamine `[3.8.10]` ✅
**Leid:** kasutamata on
- `setPointsMax` ja `setCommentEmpty` ([FeedbackSectionRenderer.ts:53-59](../google-chrome-extension/src/content-script/renderer/FeedbackSectionRenderer.ts#L53-L59));
- `getBottomDiv`, `getSaveCommentButton` ja `getSaveGradeAndShowNextButton` ([assignment-moodle-helper.ts:23-33](../google-chrome-extension/src/content-script/pagemanager/assignment-moodle-helper.ts#L23-L33));
- `.quick-submit-subpanel` CSS ([assign-grader.css](../google-chrome-extension/src/content-script/assign-grader.css)).

Need viitavad eemaldatud „quick submit“ paneelile.
**Autori otsus:**
> okei surnud koodi pmst võiks küll eemaldada, nõus

**Märkus:** `getSaveGradeAndShowNextButton` ja sarnased võivad hiljem kasuks tulla submit-keelu (E4) või Moodle'i lehe halduse (E1) juures. Need on git'i ajaloost taastatavad.
**Ei eemaldata:** `QuizReviewListener`-i `void getQuizId()` ja TODO jäävad alles, sest quizi loogika on tahtlikult pooleli. VS Code'i tühja `deactivate()` nõuab VS Code API. `OPEN_SUB_DIRECTORIES` `else` haru jääb alles (V14).

### V12. `MessageHandlerMap` duplikaadi korral viga `[3.8.11]` ✅
**Leid:** [MessageHandlerMap.add](../shared/object/MessageHandlerMap.ts#L7) ignoreerib duplikaati vaikselt. Esimene jääb kehtima ja keegi ei saa teada.
**Autori otsus:**
> duplikaadi ignoreerimise asemel võiks tõesti vea visata. vea võiks lihtsalt konsooli visata nagu kõik vead.

**Tegevus:** kui `messageType` on juba registreeritud, kirjutatakse `console.error(...)`. Käitumine jääb samaks: esimene jääb kehtima ja erandit ei visata.

### V13. Vigane definitsioonifail `console.error`-isse `[4.3.4]` ✅
**Leid:** [AssignmentRepository.getAllDefinitions](../google-chrome-extension/src/service-worker/repository/AssignmentRepository.ts#L29) jätab vigase JSON-i teatamata vahele. Paneel on siis tühi ja põhjus ei selgu.
**Autori otsus:**
> pane siis console error log

**Tegevus:** `catch` plokki `console.error` koos vea ja faili sisu algusega.

### V14. README „Future concerns“: WebSocketi päritolukontroll ja `OPEN_SUB_DIRECTORIES` `[4.3.1]`, `[2.16]` ✅
**Leid:** [VsCodeWebSocketController](../visual-studio-code-extension/src/controller/VsCodeWebSocketController.ts#L32) võtab ühendusi vastu igalt poolt. Brauseris saab **iga veebileht** ühenduda aadressile `ws://127.0.0.1:54321` ja saata `page-info` sõnumi. See sulgeb kõik editorid ja terminalid ning avab faile. Lahendus oleks kontrollida, et `Origin` on `chrome-extension://<id>`.
**Autori otsus:**
> päritolukontroll on natuke keerulisem teema, mida ma hetkel prototüübi raames ei lahenda. aga selle võiks readmesse eraldi sektsiooni "future concerns" alla kirja panna, see on oluline.

**Tegevus:** juure [README.md](../README.md)-sse sektsioon „Future concerns“ koos selle probleemiga. Lahendus ise on eraldi teema E8.

**Samasse sektsiooni: `OPEN_SUB_DIRECTORIES` `[2.16]`.**
**Leid:** [config.ts:9](../visual-studio-code-extension/src/config.ts#L9) `OPEN_SUB_DIRECTORIES = true` on kompileerimisaegne konstant. [PageInfoService.ts:31-38](../visual-studio-code-extension/src/service/PageInfoService.ts#L31-L38) hargneb selle järgi:
- `true` korral kogutakse failid rekursiivselt alamkaustadest (välja arvatud `.idea` ja `.venv`);
- `false` korral võetakse ainult õpilase kausta pealmise taseme failid.

Kuna väärtus on koodis `true`, **ei käivitu `else` haru kunagi**. Käitumise muutmiseks tuleb laiendus uuesti ehitada ja kasutaja ei saa seda ise muuta. Tulevikus võiks sellest teha VS Code'i seade (`contributes.configuration` ja `vscode.workspace.getConfiguration()`). Sama kehtib `MAX_AUTO_OPENED_FILES` ja `BLACKLISTED_FOLDER_NAMES` kohta.
**Autori otsus:**
> ma otseselt seda ka praegu ei puudutaks, või okei selgita mulle lahti mis teema on ja ma siis otsustan

Pärast selgitust: jääb nii, nagu on. README „Future concerns“ alla lisatakse samasugune märge nagu päritolukontrolli kohta.

### V15. `executeOnPageLoad` → `executeOnPageReady` `[3.8.6]` ✅
**Leid:** nimest ei selgunud, et funktsioon ei käivitu tehnilisel `load` hetkel, vaid ootab, kuni DOM on pärast laadimist või URL-i muutust rahunenud.
**Autori selgitus:**
> nimi vastab küll sellele. onpageload all pean silmas hetke, mil leht on laadinud täiesti sellisesse faasi, kus seda saab inimene kasutada. pärast tehnilist pageload hetke tulebki veel oodata, et moodle skriptid omi asju teeksid. seepärast ongi see eraldi funktsioon olemas. ära nüüd nii ka päris nitpicki, aga vb suudad soovitada paremat nime.

**Autori otsus:** `executeOnPageReady`.
**Tegevus:** nimeta ümber nii fail [executeOnPageLoad.ts](../google-chrome-extension/src/content-script/pagemanager/executeOnPageLoad.ts) kui funktsioon ja uuenda import [BaseMoodlePageListener.ts](../google-chrome-extension/src/content-script/pagelistener/BaseMoodlePageListener.ts)-is. Hea oleks teha see koos V1-ga, sest see puudutab sama faili.

---

# 2. Keskmised muudatused (K): ükshaaval, soovitatud järjekorras

Järjekorra põhjendus. See on samuti **esialgne soovitus üldise plaani põhjal**: K8–K10 järjekord tuleneb esialgsetest lahendussoovitustest ja võib muutuda, kui lahendus muutub.
- K1 ja K2 loovad `shared/` aluse (tüübid ja konfiguratsioon), millele hilisemad sammud toetuvad.
- K3–K4 korrastavad repository kihi.
- K5–K6 paika panevad elutsükli ja singletonide reeglid, enne kui sõnumisüsteemi klassid neid kasutama hakkavad.
- K7 on popupi väike korrastus.
- K8–K10 on sõnumisüsteem sõltuvuste järjekorras: payload/sõnum → generaator → handler.
- K11 on viimane, sest see puudutab eraldiseisvate feedback-teemadega kattuvat ala.

### K1. `shared/` tüübisõltuvused ja tsconfig `[4.2]`, `[1.12 sõltuvused]` ✅

> **Tehtud:**
> - Täpsem põhjus selgus alles töö käigus. VS Code'i tsconfig'is ei olnud `types` välja, nii et TypeScript lisas automaatselt kõik `@types` paketid ka **ülemkaustade** `node_modules`-ist. Juure `@types/chrome` ja `@types/node 25` oleksid sattunud VS Code'i typecheck'i. Chrome'i laiendust see ei mõjutanud, sest seal on `"types": ["chrome"]`.
> - VS Code'i tsconfig'i lisati `"types": ["node"]`.
> - Juure `package.json` ja `package-lock.json` kustutas autor, sest nende tüüpe ei kasutanud keegi.
> - Lisati `shared/tsconfig.json`, mis on ainult editori jaoks: laiendustega samad seaded ja `"types": []`. `lib` sisaldab `DOM`-i ainult `console` pärast. Kommentaar hoiatab, et `target` peab ühtima laiendustega, sest esbuild loeb bundle'imisel lähimat tsconfig'i.
> - Typecheck'i ei jooksutatud, sest shell'i ei kasutata. Kontrollitud on IDE diagnostika põhjal.
**Leid:**
- Juure [package.json](../package.json) sisaldab `@types/chrome ^0.1.40` ja `@types/node ^25`. Chrome'i laiendus kasutab `@types/chrome ^0.0.320` ja VS Code `@types/node 22.x`.
- Juure `shared/` failid võtavad tüübid juure `node_modules`-ist. Seega kontrollitakse jagatud koodi **teiste tüübiversioonidega** kui seda kasutavat koodi.
- `shared/`-il pole oma `tsconfig`-i.

**Kui ignoreerida:** jagatud kood võib ühe laienduse typecheck'is läbi minna ja teises mitte, või käituda erinevate tüübieelduste järgi.
**Autori otsus (4.2 kohta):**
> shared puuduvad asjad võiks lahendada, nõus

**Tegevus:** otsusta, kas juure package.json-i `@types/*` on üldse vajalikud. `shared/` kood ei tohiks sõltuda Chrome'i ega Node'i tüüpidest. Kui on vaja, lisa `shared/tsconfig.json`, mis kasutab ainult platvormineutraalset `lib`-i. Versioonid peavad olema ühtlustatud või selgelt eraldatud.

### K2. Ühenduse ja Moodle'i hosti konfiguratsioon `[1.4]`, `[2.14]` ✅

> **Tehtud:** tehti plaani järgi ja midagi ei otsustatud ümber.
> - `shared/config/connection.ts` sisaldab `WEBSOCKET_HOST`, `WEBSOCKET_PORT` ja `WEBSOCKET_URL`. Neid kasutavad Chrome'i WebSocketProvider ja VS Code'i VsCodeWebSocketController.
> - VS Code'i config.ts-ist eemaldati vanad konstandid ja TODO.
> - Uus fail `google-chrome-extension/src/config.ts` sisaldab `MOODLE_ORIGIN`.
> - `manifest.json` asendati failiga `manifest.config.ts` (`defineManifest`) ja autor kustutas vana faili. Uus fail on lisatud tsconfig'i `include`-i.
> - `host_permissions` on endiselt ilma pordita (`ws://<host>/*`), sest Chrome'i match pattern'id pordi järgi ei filtreeri.
> - Manifest impordib `shared`-i relatiivse teega, sest Vite laeb oma konfiguratsiooni enne aliaste rakendamist.
**Leid:**
- Host ja port on kolmes kohas: [WebSocketProvider.ts:2](../google-chrome-extension/src/service-worker/provider/WebSocketProvider.ts#L2) (`'ws://127.0.0.1:54321'`), [config.ts:6-7](../visual-studio-code-extension/src/config.ts#L6-L7) ja [manifest.json:45](../google-chrome-extension/manifest.json#L45) (`host_permissions`). Selle kohta on olemas autori TODO config.ts-is.
- Moodle'i host `https://moodle.taltech.ee` on [manifest.json:20-31](../google-chrome-extension/manifest.json#L20) sees kolm korda.

**Kui ignoreerida:** pordi muutmisel ühendus lihtsalt ei teki ja veateadet ei tule.
**Autori otsused:**
> tee jah see connection.ts ja blabla nagu pakkusid.

> jep host, tee constant

**Tegevus:**
1. `shared/config/connection.ts`: `WEBSOCKET_HOST`, `WEBSOCKET_PORT` ja nendest tuletatud `WEBSOCKET_URL`. Seda kasutavad WebSocketProvider ja VS Code'i config.ts. VS Code'i config.ts TODO eemaldatakse.
2. `manifest.json` → `manifest.config.ts` crxjs-i `defineManifest` abil. `host_permissions` tuletatakse connection.ts-ist ja content-scriptide `matches` Moodle'i hosti konstandist (näiteks `MOODLE_ORIGIN` Chrome'i konfis). [vite.config.ts](../google-chrome-extension/vite.config.ts) impordib uue faili.

### K3. Repository kiht: baasklass, võtmed, andmebaas, FileHandleRepository asukoht `[1.6]`, `[2.5]`, `[2.6]`, `[3.8.1]` ✅

> **Tehtud:**
> - **Erinevus plaanist:** Chrome'i `src/shared/repository/` alla liigutati kõik üldised salvestuse baasklassid (`BaseRepository`, `IndexedDBRepository`, `LocalStorageRepository`), mitte ainult `IndexedDBRepository`. Muidu oleks `shared` jätkuvalt `service-worker`-ist importinud. Konkreetsed repositoryd jäid `service-worker`-isse. Vanad failid kustutas autor.
> - `BaseRepository` on abstraktne ja deklareerib `getValue`, `setValue` ja `removeValue`. `KeyValueStore` liidest ei tehtud.
> - IndexedDB sai `removeValue` meetodi, ühise privaatse `#write` kirjutamistransaktsiooni jaoks ja konstandi `DB_VERSION`.
> - `LocalStorageRepository` on abstraktne ja selle `setValue` on geneeriline.
> - Salvestusvõtmed on failitasemel konstandid AssignmentRepository's ja QuizRepository's. Väärtused on muutmata, seega olemasolevad andmed jäävad kehtima.
**Leid:**
- *(1.6)* Key-value salvestus on kaks korda, ilma ühise lepinguta: [IndexedDBRepository](../google-chrome-extension/src/service-worker/repository/IndexedDBRepository.ts) (`getValue`/`setValue`) ja [LocalStorageRepository](../google-chrome-extension/src/service-worker/repository/LocalStorageRepository.ts) (`getValue`/`setValue`/`removeValue`). [BaseRepository](../google-chrome-extension/src/service-worker/repository/BaseRepository.ts) on tühi. [FileHandleRepository](../google-chrome-extension/src/shared/repository/FileHandleRepository.ts) teeb kolmanda, avaliku get/set ümbrise. IndexedDB-l pole `remove`-i ja storage'id ei ole vahetatavad.
- *(2.5)* Salvestusvõtmed on inline: `'config.assignmentDirectory'` ja `'file-cache.assignments'` ([AssignmentRepository.ts:10-12](../google-chrome-extension/src/service-worker/repository/AssignmentRepository.ts#L10-L12)) ning `` `autograde:${...}` `` võtme formaat ([QuizRepository.ts:6](../google-chrome-extension/src/service-worker/repository/QuizRepository.ts#L6)).
- *(2.6)* Andmebaasi skeem: `'moodle-helper'`, `'kv'` ja inline versioon `1` ([IndexedDBRepository.ts:3-8](../google-chrome-extension/src/service-worker/repository/IndexedDBRepository.ts#L3)).
- *(3.8.1)* [FileHandleRepository](../google-chrome-extension/src/shared/repository/FileHandleRepository.ts) asub Chrome'i `src/shared/` all, aga impordib `service-worker/repository/IndexedDBRepository`-st, nii et sõltuvuse suund on vale. Seda kasutab ainult popup.

**Autori otsused:**
> tegelt getvalue ja setvalue on repositorydel kõigil vajalik osa, siis ma teeks selle repository baasklassi osaks. eraldi keyvaluestore liidest vist ei oleks otseselt vaja, sest mu arust ei ole repositorisid kus ei käi asi getvalue ja setvalue kaudu. aga kui on selliseid repositorisid - pead otsima ja üle vaatama, veenduma - siis ikka teeks selle keyvaluestore liidese. aga ma väga tahan vältida keyvaluestore liidest, kui see pole just sellel eesmärgil vajalik, kuna ma ei taha üleliigset complexity-t mängu tuua.

> salvestusvõtmed peaks kuhugi minema, esialgu teeks repository tasemel constantid, või kui kasutatakse nii repos kui kuskil mujal siis mõlemal peaks olema ligipääs sama constantide faili kaudu

> andmebaasi skeem, noh siin ma otseselt ei tahaks migratsioonide üle praegu muretseda, see pole otseselt andmebaasi fookusega projekt ja andmebaasi ilusti tegemine on asi, mida ma tahaks praegu edasi lükata kuna praegu pole selge, kui head andmebaasi on vaja. kui sama klassi sees saab midagi selgemaks teha siis võib, aga muidu jätaks täpselt nii. noh klassi tasemel constant nt on vist piisav? vb mingi lihtsam build funktsioon.

> ok siis liigutaks shared alla

**Lisaanalüüs:**
- **Kõik repositoryd kasutavad get/set-i:** FileCacheRepository (ja selle kaudu AssignmentRepository), FileHandleRepository (IndexedDB) ja QuizRepository (chrome.storage, lisaks `removeValue`). Ühtegi teistsugust repository't pole, seega **`KeyValueStore` liidest pole vaja**.
- Võtmeid kasutatakse ainult repositorydes. `directoryConfigKey` ja `cacheKey` jõuavad popupi `FileSourceInfo` andmetena sõnumi kaudu, mitte konstandina. Seega piisab repository-taseme konstantidest.
- Andmebaasi „build-funktsioon“ `openDB()` on juba olemas. Nimeta puudub ainult versioon.

**Tegevus:**
1. `BaseRepository` muutub abstraktseks ja deklareerib `protected abstract getValue<T>(key)`, `setValue<T>(key, value)` ja `removeValue(key)`. `IndexedDBRepository`-le lisatakse puuduv `removeValue` (umbes 5 rida).
2. Võtmed muutuvad repository klassi või faili tasemel konstantideks (`ASSIGNMENT_DIRECTORY_CONFIG_KEY`, `ASSIGNMENT_FILE_CACHE_KEY`, `AUTO_GRADE_KEY_PREFIX`).
3. IndexedDBRepository-sse `DB_VERSION = 1` samade konstantide juurde. Migratsioone ei tehta (E11).
4. `IndexedDBRepository` liigub `google-chrome-extension/src/shared/repository/` alla, FileHandleRepository kõrvale. Nii on sõltuvuse suund õige: service-worker → shared.

### K4. AssignmentRepository ja FileCacheRepository projekti init-süsteemi järgi `[1.5]`, `[3.4]` ✅

> **Tehtud:**
> - **Analüüs kinnitus:** AssignmentRepository `init()` ülekirjutus oli refaktoreerimisest maha jäänud. See registreeris repository `FileCacheRepository` staatilisse registrisse ja muud põhjust sellel ei olnud. Git'i ajalugu ei vaadatud, sest shell'i ei kasutata.
> - **Lahendus järgib projekti olemasolevat mustrit** (sama nagu kontrollerites: baasklass omab staatilist registrit, registreerimine toimub `onInit`-is). Staatiline register jäi `FileCacheRepository` baasklassi. Iga instants registreerib end baasklassi `onInit`-is, nii et alamklass ei pea midagi tegema. Kommentaar ütleb, et `onInit`-i üle kirjutav alamklass peab kutsuma `super.onInit()`-i.
> - AssignmentRepository'st eemaldati `init()` ülekirjutus ja `#registered` lipp. Lippu pole vaja, sest `onInit` käivitub iga instantsi kohta üks kord.
> - `FileCacheService` jäi endiseks: kasutab `FileCacheRepository.getRegistry()`-d ega tunne konkreetseid repositorysid.
> - **Tagasi lükatud lähenemised:**
>   - Otsene nimekiri `FileCacheService`-is. See pani teenuse määrama, millised repositoryd on failiallikad, ei lubanud teistel repositorydel registrit kasutada ja oli projekti mustriga vastuolus custom lahendus.
>   - Registreerimine konstruktoris. See oleks läinud mööda projekti elutsüklist ja teinud initsialiseerimata objekti teistele nähtavaks.
> - **Skoobist välja jäi** init-süsteemi enda parandamine (näiteks see, et init'e ei oodata ära). Autori otsus:
>   > initi parandamine on kompleksne ja põhjalikku läbimõtlemist vajav probleem, mis vajab täiesti eraldi käsitlust. praegu on skoobis ainult see, et assignmentrepository ja filecacherepository järgiksid projektis kehtivat init süsteemi.
>
>   See on eraldi teema E12.

**Leid:**
- *(1.5)* On kaks ühekordse init'i mehhanismi: [AsyncInitialisable](../shared/AsyncInitialisable.ts) (`onOneTimeInit`) ja AssignmentRepository `init()` ülekirjutus. Viimane kirjutab `init()` üle ja teeb sama asja staatilise `#registered` lipuga, minnes mööda `onInit` mallist.
- *(3.4)* [FileCacheRepository](../google-chrome-extension/src/service-worker/repository/FileCacheRepository.ts) teeb korraga salvestust ja haldab staatilist globaalset registrit. Register täitub kõrvalmõjuna `init()`-i sees, mida teeb alamklass käsitsi.

**Autori otsused:**
> minu arust võib see et assignmentrepository kirjutab üle võib olla mingi viga. asyncinitialisable loodi kunagi varem refaktorina ja vb assignmentrepository jäi meelest ära. aga see vajaks eraldi lähenemist ja analüüsi, et see tõepoolest nii on ja seal ei ole mingi muu põhjus asjal.

> okei pmst nõus

**Tegevus:** AssignmentRepository ja FileCacheRepository viiakse projektis kehtiva init-süsteemi järgi. Täpne lahendus on kirjas ülal plokis „Tehtud“.

### K5. Elutsükli nimekirjad ja `Disposable` `[1.9]`, `[4.2]` ✅

> **Tehtud:**
> - Kõik kuus init-faili (Chrome'i repositoryd, teenused ja kontrollerid; VS Code'i teenused ja kontrollerid) ekspordivad nüüd massiivi (`controllers`, `services`, `repositories`), mille üle `init*()` itereerib. Massiivi tüüp on olemasolev baasklass.
> - VS Code'i `closeControllers()` itereerib sama `controllers` massiivi üle, nii et paralleelne loetelu kadus.
> - Käitumine ei muutunud: järjekord on sama ja init'e ei oodata (E12).
> - **`Closeable` liidest ei lisatud,** sest olemasolev `CloseableBaseController` katab vajaduse.
> - **Tagasi lükatud:** registri muster (`CloseableBaseController` registreerib end `onInit`-is). Kontrollerid kirjutavad `onInit`-i üle ilma `super.onInit()`-ita, mistõttu registreerimine jääks vahele. Lisaks peab init-loetelu niikuinii olemas olema.
> - Kliendid ja providerid on kontrollitud: neil pole elutsüklit ja nimekirja pole vaja.
**Leid:** [init-controllers.ts](../visual-studio-code-extension/src/controller/init-controllers.ts) ja [close-controllers.ts](../visual-studio-code-extension/src/controller/close-controllers.ts) loetlevad samu kontrollereid kahes paralleelses nimekirjas. Kui uus WebSocket-kontroller lisatakse ainult init-nimekirja, jääb port pärast deaktiveerimist kinni ja järgmisel aktiveerimisel tuleb `EADDRINUSE`. Kontrolleri elutsükli liides (`close`) on ainult VS Code'i [CloseableBaseController](../visual-studio-code-extension/src/controller/CloseableBaseController.ts)-is.
**Autori otsus:**
> see on tegelikult väga väike probleem iseenesest, aga okei teeme selle. see teeks mõnes mõttes küll asja lihtsamaks, et kontrolleri lisamisel peab siis selle lihtsalt listi panema ja ei pea mõtlema kuidas see sulgetakse õi avatakse. pane tähele - sama asi võib vist rakenduda ka service-tele, client-itele ja muudele asjadele, vaata igat tüüpi sellised asjad üle. minu teada on selliseid sarnaseid asju mujal ka.

**Lisaanalüüs:** läbi vaadatud on kõik elutsükli nimekirjad.

| Laiendus | Fail | Sisu | Close-nimekiri |
|---|---|---|---|
| Chrome | [init-repositories.ts](../google-chrome-extension/src/service-worker/repository/init-repositories.ts) | assignmentRepository, quizRepository | puudub (pole vaja) |
| Chrome | [init-services.ts](../google-chrome-extension/src/service-worker/service/init-services.ts) | 4 teenust | puudub |
| Chrome | [init-controllers.ts](../google-chrome-extension/src/service-worker/controller/init-controllers.ts) | 4 kontrollerit | puudub |
| VS Code | [init-services.ts](../visual-studio-code-extension/src/service/init-services.ts) | 2 teenust | puudub |
| VS Code | init-controllers.ts + close-controllers.ts | 2 kontrollerit | **paralleelne** |

- Kliendid (`BaseClient`) ja providerid (`vsCodeConnectionProvider`) ei ole `AsyncInitialisable` ja neid ei initsialiseerita nimekirjaga.
- Content-scriptide sisendfailid initsialiseerivad igaüks ühe listeneri, mis ei ole nimekiri.
- Popupi `new PopupRenderer().init()` on üksik sisendpunkt.

Seega on **tegelik paralleelsus ainult VS Code'i kontrolleritel**. Ühtlustada tasub siiski kõik kuus `init-*` faili sama mustri järgi.

**Eesmärk:** kontrolleri (ja teiste elutsükliga objektide) lisamiseks piisab, kui see lisatakse ühte kohta, ning selle avamine ja sulgemine tuleneb sellest automaatselt. Init- ja close-loetelud ei tohi olla paralleelsed. Arvesta autori märkusega, et sama võib puudutada ka teenuseid, kliente jm.
**Piirangud:**
- Init-süsteemi enda parandamine (näiteks init'ide ootamine) on skoobist väljas, vaata E12.
- Projektis on juba `CloseableBaseController`. Uus paralleelne mehhanism ei tohi tekkida.

**Esialgne soovitus (üldise plaani põhjal):**
1. Igas `init-*` failis on üks eksporditud massiiv (`export const controllers = [...]`) ja `init*()` itereerib selle üle.
2. VS Code'is itereerib `closeControllers()` **sama** massiivi üle ja eraldi `close-controllers.ts` loetelu kaob.
3. `shared/`-i lisatakse väike `Closeable` (`close(): void`) liides, mida `CloseableBaseController` implementeerib. See pärineb algse analüüsi punktist 4.2 („kontrolleri elutsükli liides puudub shared-ist“). Vaata enne üle, kas see on vajalik või piisab olemasolevast `CloseableBaseController`-ist.

### K6. Singletonide ühtlustamine ja määratlemine `[3.8.3]`, `[3.8.8]` ✅

> **Tehtud:**
> - Koodis oli selge valdav muster (umbes 25 juhtu): klassi ei ekspordita, eksporditakse ainult instants `export const camelCase = new Klass()`. Konventsioon tuletati sellest.
> - Konventsioon on kirjas juure README sektsioonis „Code conventions → Singletons“. Autor palus kirjutada lühidalt ja tema stiilis, eeskujuks README avalõigud. Klass eksporditakse ainult siis, kui see on baasklass, sellel on mitu instantsi (renderer'id) või selle instants kuulub teisele objektile (`WebSocketProvider`). `static` väljad on ainult kogu klassihierarhia jagatud oleku jaoks.
> - `FeedbackClient` ja `QuizClient` → singletonid `feedbackClient` ja `quizClient`. Kasutuskohad on uuendatud.
> - `AssignmentService` ja `AssignmentRepository` klassi eksport eemaldati.
> - `AssignmentGraderListener` staatiline `#renderer` muutus instantsi väljaks.
> - Pärast muudatusi on kõik kontrollerid, teenused, repositoryd, kliendid, providerid ja listenerid ühtse mustri järgi.
> - **Autori soovil lisaks** (et sama kategooria klassid käituksid ühtemoodi):
>   - `FolderAccessService` pärib nüüd `BaseService`-t.
>   - `PopupRenderer` pärib `BaseRenderer`-it: `init()` → `render()` ja uus `clear()`. `BaseRenderer` liigutati Chrome'i `src/shared/renderer/` alla, et popup ei impordiks content-scriptist. Vana faili kustutas autor.
**Leid:**
- *(3.8.3)* Instantsieerimine on ebaühtlane: `pageInfoClient` on singleton, aga `FeedbackClient` ja `QuizDataClient` luuakse igal kasutusel uuesti.
- *(3.8.8)* [AssignmentGraderListener](../google-chrome-extension/src/content-script/pagelistener/AssignmentGraderListener.ts#L8) hoiab renderer'it `static` väljas, kuigi objekt on niikuinii singleton.

**Autori otsused:**
> sellel võib olla põhjus, aga see võib olla ka kogemata. kontrolli põhjalikumalt, kas see on meelega et on singleton üks ja teised mitte, või peaksid teised ka singletonid olema.

> okei see seostub varasemate singleton segadustega ja näitab, et singleton käitumisega objekte peaks kuidagi eraldiseisvalt ära määratlema et on aru saada mis nad on. aga static väljal ta võib ju ikka olla? või mitte?

**Lisaanalüüs (3.8.3), algse lahendaja oma:** kogu koodibaasi `new X()` kasutus on läbi vaadatud. Märkus: V10-s nimetati `QuizDataClient` ümber `QuizClient`-iks.
- **Singletonid** (`export const x = new X()`) on kõik controllerid, service'id, repositoryd, listenerid, `vsCodeConnectionProvider`, `chromeVsCodeClient`, `pageInfoClient`, `fileCacheClient`, `fileHandleRepository` ja `folderAccessService`.
- **Iga kasutuse jaoks luuakse uuesti** ainult `FeedbackClient` ([CheckingHelperPanelRenderer.ts:45](../google-chrome-extension/src/content-script/renderer/CheckingHelperPanelRenderer.ts#L45)) ja `QuizDataClient` ([QuizReviewListener.ts:35](../google-chrome-extension/src/content-script/pagelistener/QuizReviewListener.ts#L35), [QuizCommentListener.ts:12](../google-chrome-extension/src/content-script/pagelistener/QuizCommentListener.ts#L12)).
- **Renderer'id** luuakse samuti iga kasutuse jaoks. See on õige, sest neil on oma DOM-olek.

Mõlemad erandlikud kliendid on olekuta, seega **põhjust mitte-singleton olla ei ole**. Tõenäoliselt on tegu juhusega, sest need on tehtud teistest klientidest erinevas stiilis (`export default class`).

**Lahendaja vastus (3.8.8):** tehniliselt võib renderer static väljas olla. Singletoni puhul pole käitumises vahet, sest instantse on üks. Aga `static` ütleb lugejale *„jagatud kõigi selle klassi instantside vahel“*, mis vihjab, et instantse on mitu. See on sama segadus, mida autor kirjeldab. Instantsi väli (`#renderer = new CheckingHelperPanelRenderer()`) on ausam ja kaotab ühtlasi null-kontrolli. Oluline vahe: kontrollerite dispetšeri staatilised väljad (V8) **on** õigustatud, sest seal jagavad tõesti mitu alamklassi instantsi ühte olekut.

**Eesmärk:** singleton-käitumisega objektid on selgelt ära määratletud, nii et koodist on aru saada, mis nad on (autori sõnastus: *„singleton käitumisega objekte peaks kuidagi eraldiseisvalt ära määratlema et on aru saada mis nad on“*). Instantsieerimine on ühtlane ja kogemata erandid on parandatud.
**Piirang:** autor ei ole kinnitanud ühtegi konkreetset konventsiooni. Lähtu sellest, kuidas projektis enamik singletone juba tehtud on.

**Esialgne soovitus (üldise plaani põhjal):**
1. Pane konventsioon kirja (README või koodikommentaar). Algne ettepanek: *singleton = klass, mida ei ekspordita, ja ainult `export const camelCaseNimi = new Klass()`. Klass eksporditakse ainult siis, kui see on mõeldud pärimiseks või mitmeks instantsiks.* See ettepanek on algse lahendaja oma ja autor pole seda kinnitanud.
2. `FeedbackClient` → `feedbackClient` singleton ja `QuizClient` → `quizClient` singleton. Kasutuskohad uuendatakse.
3. `AssignmentGraderListener` staatiline `#renderer` muutub instantsi väljaks.
4. `AssignmentService` ja `AssignmentRepository` ekspordivad nii klassi kui instantsi. Kas klassi eksport eemaldada, sõltub kokkulepitud konventsioonist.

### K7. Popupi elemendiloome ja element-creation-helperi liigutamine `[1.12 popup]` ✅

> **Tehtud:** tehti esialgse soovituse järgi.
> - `element-creation-helper.ts` liigutati Chrome'i `src/shared/util/` alla, `deepCopy.ts` kõrvale, sest seal on jagatud utiliidid. Sisu on muutmata. Kuue kasutaja importid uuendati ja vana faili kustutas autor.
> - PopupRenderer kasutab `createAndAddChildElement`-i. Meetodi nimi muutus: `#createSourceElement` → `#addSourceElement`, sest helper lisab elemendi kohe vanema alla. Kausta nimi loetakse enne elementide loomist, nii et plokk ilmub korraga, nagu varem.
> - `getDirectTextContent` liikus failiga kaasa (E1). Otse `sendMessage` jäi K9 alla.
**Leid:** [PopupRenderer](../google-chrome-extension/src/popup/renderer/PopupRenderer.ts) loob elemente käsitsi (`document.createElement` ja `className`), kuigi [element-creation-helper](../google-chrome-extension/src/content-script/pagemanager/element-creation-helper.ts) on selleks olemas, aga content-script kaustas.
**Autori otsus:**
> nupu teksti osa ignoreeriks praegu, kuna see on väga väikese impactiga kõigega muuga võrreldes. moodlei sektorite osa ignoreerime seoses 1.7-ga. popuprenderi käsitsi elementide loomine, siinkohal võid vaadata kas täpselt õige funktsioon on element-creation-helperis olemas, kui jah siis võiks seda vb täitsa kasutada ja content-script kaustast shared kausta liigutada.

**Lisaanalüüs (algse lahendaja oma):** sobiv funktsioon on olemas. `createAndAddChildElement(parent, tag, classes, textContent)` teeb täpselt seda, mida PopupRenderer käsitsi teeb: `div.source`, `div.source-folder-name` koos tekstiga ja nupp koos tekstiga. Ainus erinevus on see, et popup loob `div.source` enne ja lisab selle konteinerisse hiljem. Helperiga lisatakse see kohe konteinerisse ja tulemus on sama. `createAndAddChildImage` kasutab `chrome.runtime.getURL`-i, mis töötab ka popupis. Failis on ka `getDirectTextContent` (lugemisfunktsioon), mis liigub kaasa. Helperit impordib praegu kuus faili (4 renderer'it, QuizReviewListener ja assignment-moodle-helper).
**Eesmärk:** PopupRenderer ei loo elemente käsitsi, vaid kasutab olemasolevat helperit, ja helper on kohas, kust nii content-script kui popup seda kasutada saavad (autori sõnul „shared kausta“).
**Piirangud:**
- Nupu teksti dubleerimine jääb E9 alla.
- Popupi otse `sendMessage` kutse kuulub K9 alla.
- Helperi failis on ka `getDirectTextContent`, mis on lugemisfunktsioon, mitte elemendi loomine. Selle ümberkorraldamine ei kuulu sellesse sammu (Moodle'i lehe halduse osa, E1).

**Esialgne soovitus (üldise plaani põhjal):** liiguta `element-creation-helper.ts` → `google-chrome-extension/src/shared/util/`, uuenda kõik importid ja kasuta helperit PopupRendereris.

### K8. Payload ja sõnumid: Chrome↔VS Code protokoll `[1.3]`, `[2.4]`, `[4.2]` ✅

> **Tehtud:**
> - **Uurimise tulemus:** Chrome↔VS Code lingil saavad mõlemad pooled kasutada sama tüüpi, sest mõlemas otsas on sama WebSocket ja JSON. `WebSocketMessage` ja `WebSocketResponse` olid juba olemas, aga kumbki pool kasutas neist ainult poolt. Õpilase nimi liikus Chrome'i sisemisel hüppel kujul `{ studentName }`, aga WebSocketi hüppel toore stringina. See kinnitas autori payload-mudelit.
> - `shared/constants/websocket.ts`: `PAGE_INFO_CHANNEL` ja `RESPONSE_STATUS_OK/ERROR/UNHANDLED`.
> - `shared/types/WebSocketProtocol.ts`:
>   - uus `WebSocketResponseStatus`, mis on tuletatud konstantidest;
>   - `WebSocketMessage<TPayload extends BasePayload = BasePayload>`;
>   - `WebSocketResponse.content` on nüüd staatus.
> - `shared/types/payload/`: tühi `BasePayload` (autori soovil; olemasolu ise kommunikeerib mustrit) ja `StudentNamePayload extends BasePayload`. `BasePayload` on ka tüübipiirang: Chrome'i `ChromeVsCodeClient.postMessage` ja `VsCodeConnectionProvider.post` võtavad `BasePayload`-i.
> - Mõlemad pooled panevad sõnumid ja vastused kokku ühiste tüüpidega ja kasutavad konstante. VS Code'i `as unknown as string` hack kadus.
> - **Protokolli muutus:** WebSocketi `content` on nüüd `{ studentName }`, mitte toores string. Mõlemad laiendused tuleb uuesti ehitada korraga.
> - Chrome ei tõlgenda `'error'` vastust endiselt, sest see oleks käitumise muutus.
> - Chrome'i sisemine hüpe (`PageInfoClient` → `{ studentName }`) võiks kasutada `StudentNamePayload`-i. See jäi K9 alla.
> - Selle sammu käigus lisas autor tööreeglitesse kommentaaride reegli.
**Leid:**
- *(1.3)* Chrome↔VS Code WebSocket-leping on kahel pool eraldi. Kanal `'page-info'` on defineeritud nii [Chrome PageInfoService.ts:5](../google-chrome-extension/src/service-worker/service/PageInfoService.ts#L5) kui [VS Code PageInfoController.ts:6](../visual-studio-code-extension/src/controller/PageInfoController.ts#L6). Payload on Chrome'i poolel toores string, VS Code'is tüübiga `Record<string, unknown>` ja teisendatakse `as unknown as string` abil.
- *(2.4)* Vastuse väärtused `'ok'`, `'error'` ja `'unhandled'` ([VsCodeWebSocketController.ts:54-62](../visual-studio-code-extension/src/controller/VsCodeWebSocketController.ts#L54-L62)) on olemas ainult VS Code'i poolel.

See on ainus koht, kus kaks eraldi buildi peavad kokku sobima, ja praegu kontrollib seda ainult mälu. Kanali ümbernimetamisel lakkab integratsioon vaikselt töötamast.
**Autori otsused:**
> võiks tõesti laiendada umbes nii nagu ütlesid. siinkohal peab arvestama, et mingil määral on erinevused messageite tüübi vahel tingitud erinevusest kuidas chrome ja vscode tõlgendavad asju, seega ei pruugi olla võimalik päris sama tüüpi kasutusele võtta. seda tuleb veidi uurida. kui pole võimalik sama tüüpi teha, siis peab tegema nii, et payload on see ühine osa, siis kahe mooduli vahel universalsed messaged, see osa mis liigutab infot, peab muutuma mingiks PayloadType-ks vms ning message on siis see kontsept, mis puudutab vscode või chrome spetsiifikat + liidab sinna payloadi. tegelt kui ma nüüd nii mõtlen, siis see ongi kõige õigem viis seda teha ilmselt. vscodemessage-l ja chromemessagel võib mingit ühist loogikat ilmselt ikka olla, analoogsel moel nagu 1.1 messagehandleris on eksole, samamoodi võib ilmselt mingeid olulisi asju refaktorida baasklassi.

> miks chrome neid protokolli väärtusi ei tea su arust? ja arvesta ka, et meil on mängus kolme tüüpi sõnumeid: 1) sõnum chrome ja vscode vahel 2) sõnum chrome ja chrome vahel 3) sõnum vscode ja vscode vahel (vist). need ongi erinevad. seda arvestades hinda see punkt üle.

**Lahendaja ümberhinnang (2.4):**
1. **Chrome ↔ VS Code (WebSocket):** VS Code vastab `{ id, content: 'ok' | 'error' | 'unhandled' }`. Chrome'i [VsCodeConnectionProvider](../google-chrome-extension/src/service-worker/provider/VsCodeConnectionProvider.ts#L46) annab `content`-i tõlgendamata edasi. See jõuab content-scripti ja [AssignmentGraderListener](../google-chrome-extension/src/content-script/pagelistener/AssignmentGraderListener.ts#L24) lihtsalt logib selle. Chrome'is pole neid väärtusi ei konstandi ega tüübina ning keegi neid ei kontrolli. **`'error'` näeb Chrome'i jaoks välja nagu edu.** Seda mõtlesin väitega „Chrome ei tea neid“. Need väärtused kuuluvad ainult sõnumitüübile 1, seega on nende õige koht juure `shared/`, sest mõlemad laiendused peavad neid samamoodi mõistma.
2. **Chrome ↔ Chrome (`chrome.runtime.sendMessage`):** siin staatuse kontseptsiooni pole. Vastus on handleri tagastusväärtus ja puuduva handleri korral `undefined`. Vea korral ei vasta Chrome'i kontroller üldse (vaata K10). See on eraldi sõnumitüüp ja staatuse väärtusi talle praegu külge ei panda.
3. **VS Code ↔ VS Code:** laienduse sees sõnumeid ei edastata. Ainus sarnane asi on `vscode.commands.registerCommand` ([PythonRunnerController](../visual-studio-code-extension/src/controller/PythonRunnerController.ts)), mis on VS Code'i käsusüsteem, mitte sõnumiprotokoll. Protokolli konstante siin vaja ei ole.

**Lahendaja järeldus:** punkt jääb kehtima, aga kitsamalt. Staatuse väärtused on **ainult tüübi 1** osa ja nende koht oleks juure `shared/`. Tüübi 2 veakäitumine on K10 teema.

**Eesmärk:** Chrome↔VS Code sõnumi kuju (kanal, payload, vastus) on defineeritud ühes kohas, nii et kaks buildi ei saa vaikselt lahkneda.
**Autori suunis (autori enda mudel):** **payload** on laienduste vahel ühine infot kandev osa (`PayloadType` vms). **Message** on Chrome'i- või VS Code'i-spetsiifiline kontseptsioon, mis lisab payloadile oma spetsiifika. VS Code'i ja Chrome'i sõnumitel võib olla ühist loogikat, mille saab tõsta baasklassi, analoogselt K10 handleriga.
**Piirangud:**
- Autor palus kõigepealt uurida, kas Chrome ja VS Code saavad sõnumite tõlgendamise erinevuste tõttu üldse sama tüüpi kasutada. Payload/message jaotus on lahendus juhuks, kui ei saa.
- Käitumist ei muudeta ilma autori nõusolekuta, näiteks see, et Chrome hakkab `'error'` vastust tõlgendama.

**Esialgne soovitus (üldise plaani põhjal):**
1. Uuri, kuidas Chrome ja VS Code sõnumeid tõlgendavad: WebSocketi JSON-string vs `chrome.runtime` struktureeritud kloonimine.
2. Laienda [shared/types/WebSocketProtocol.ts](../shared/types/WebSocketProtocol.ts)-i: kanalite konstandid (`'page-info'` ühes kohas), payloadide tüübid (näiteks `StudentNamePayload`) ja vastuse staatuse tüüp/konstandid (`'ok' | 'error' | 'unhandled'`).
3. Chrome'i pool kasutab samu staatuse konstante. Kas `'error'` peaks Chrome'is midagi muutma, on käitumise otsus ja see küsitakse autorilt.

### K9. Sõnumigeneraatorid ja kliendi `send` `[1.2]`, `[1.8]` ✅

> **Tehtud** (sammu käigus arutati ja laiendati koos autoriga):
> - **Kaks sõnumitüüpi, ühine ainult payload.** `ExtensionMessage` jagati kaheks: `ChromeMessage` = `{ type, content }` (chrome.runtime) ja `VsCodeMessage` = `{ channel, content }` (WebSocket). Endine `WebSocketMessage` asendus `VsCodeRequest`-iga = `VsCodeMessage + id` ja `WebSocketResponse` asendus `VsCodeResponse`-iga. `id` lisab `VsCodeConnectionProvider` saatmise hetkel, sest see seob päringu ja vastuse ega kuulu sõnumi sisu hulka. Konstandid on nüüd failis `shared/constants/vscode-message.ts`.
> - **Ühtne nimetamine „\<sõnumitüüp\>\<roll\>“,** sest autori reegel on, et samal asjal on alati sama nimi. Sõna „extension“ jäeti nimedest välja, sest kood asubki laiendustes. Tulemus: `ChromeMessage`/`VsCodeMessage`, `ChromeMessageGenerator`/`VsCodeMessageGenerator`, `ChromeMessageClient`/`VsCodeMessageClient` ja `ChromeMessageController`/`VsCodeMessageController`. Endised nimed olid `ChromeExtensionMessageClient`, `ChromeVsCodeClient`, `ChromeExtensionMessageController` ja `VsCodeWebSocketController`. Transpordiklassid (`WebSocketProvider`, `VsCodeConnectionProvider`) jäid eraldi, sest need pole sõnumi mõisted.
> - **Generaatorid:** juure `shared/generator/BaseMessageGenerator` on tühi baas, sama mustriga nagu `BaseClient`. Chrome'i generaatorid (`Feedback-`, `PageInfo-`, `Quiz-`, `FileCacheChromeMessageGenerator`) on Chrome'i `src/shared/generator/` all. VS Code'i generaator (`PageInfoVsCodeMessageGenerator`) on `service-worker/generator/` all. Generaatorid on singletonid ja meetodid on kujul `get<X>Message`.
> - **Kliendid:** baasklassides `ChromeMessageClient` ja `VsCodeMessageClient` on `protected send`. Funktsionaalsuse kliendid pärivad neist, kaasa arvatud uus service worker'i `PageInfoClient` (VS Code'i sõnumid). Autori otsus: lühikesed nimed ja sama nimi on lubatud eri kaustades (`content-script/client/PageInfoClient` vs `service-worker/client/PageInfoClient`), sest kaust ütleb vahe. Generaatorite pikad nimed jäid alles.
> - Chrome'i sisemiste sõnumite payloadid (`AssignmentIdPayload`, `AutoGradeIdPayload`, `FileCacheUpdatePayload`) on Chrome'i `src/shared/types/payload/` all. Õpilase nimi kasutab mõlemal hüppel juure `StudentNamePayload`-i.
> - PopupRenderer kasutab `fileCacheClient.getFileSources()`-i. Otsest `chrome.runtime.sendMessage` kutset on nüüd ainult `ChromeMessageClient`-is.
> - Sõnumite formaat ei muutunud. Vanad failid kustutas autor.
> - **K10 jaoks:** kontrollerid loevad endiselt `content.x as T`. Chrome'i kontrolleri kuulaja tüübib sõnumi inline, mitte `ChromeMessage`-ina.
**Leid:**
- *(1.2)* Chrome'i sisemiste sõnumite kuju on kolmes kohas kaudselt defineeritud: klient ([FeedbackClient.ts](../google-chrome-extension/src/content-script/client/FeedbackClient.ts): `{ assignmentId }`), kontroller ([AssignmentController.ts:8](../google-chrome-extension/src/service-worker/controller/AssignmentController.ts#L8): `content.assignmentId as string`) ja konstant ([messages.ts](../google-chrome-extension/src/shared/constants/messages.ts)). Sama kordub Quiz-, PageInfo- ja FileCache-sõnumitel. Kui välja nimi muutub ühel pool, ei anna TypeScript viga ja andmed on lihtsalt `undefined`.
- *(1.8)* Iga klient kirjutab ise `chrome.runtime.sendMessage(this.makeMessage(...))`. Baasklassis on olemas `makeMessage`, aga mitte `send`. [PopupRenderer.ts:57](../google-chrome-extension/src/popup/renderer/PopupRenderer.ts#L57) kirjutab toore `{ type: FILES_GET_SOURCES, content: {} }` ja dubleerib sellega [FileCacheClient.getFileSources](../google-chrome-extension/src/popup/client/FileCacheClient.ts#L6)-i. Kui sõnumiformaati muudetakse, jääb popup maha.

**Autori otsused:**
> ma ei tahaks seda asja kutsuda lepinguks, aga muidu saan aru mis sa mõtled. ma pakuks teha seda natukene lollimal moel: mingi message generator baasklass ning siis messagegenerator alamklassid igat tüüpi messagite jaoks. alamklass paljastab enamvähem funktsiooni et getmessage ja antakse parameetrid ning alamklass ise räägib baasklassiga selle kohta et kuidas see sõnum kokku panna. baasklass handlib kõik sõnumite kokkupanemise loogika mis on universaalne, alamklass handlib ainult seda osa et mis on seda tüüpi sõnumil oluline. getmessage sõnumi funktsiooniparameetrid sõltuvad siis muidugi sellest, et mis on selle sõnumi oluline osa. getmessage asemel on alamklassi funktsiooni ilmselt vaja mitu spetsiifilisema nimega get<???>message funktsiooni, kuna mõne funktsionaalsusega seoses on mitut sõnumit vaja genereerida.

> okei tundub et baasklassi peab siis tegema ka send funktsiooni. popuprenderer ei tohiks ka dubleerida, tundub et sa tead kuidas seda lahendada

**Eesmärk:** sõnumite kokkupanek ja saatmine on ühes kohas ega ole iga kliendi sees dubleeritud. PopupRenderer ei koosta sõnumeid ise.
**Autori suunis (autori enda disain):** `MessageGenerator` baasklass, mis teeb kogu universaalse kokkupanemise, ja alamklassid sõnumitüüpide või funktsionaalsuste kaupa. Alamklass annab ainult selle tüübi olulise osa. Ühe `getMessage` asemel on alamklassis mitu spetsiifilise nimega `get<???>Message` meetodit, sest mõne funktsionaalsuse jaoks on vaja mitut sõnumit. Kliendi baasklassile tuleb `send` funktsioon.

**Esialgne soovitus (üldise plaani põhjal):**
1. Alamklassid funktsionaalsuse kaupa, näiteks `QuizMessageGenerator` meetoditega `getBeginAutoGradeMessage(id)`, `getEndAutoGradeMessage(id)` ja `getIsAutoGradeActiveMessage(id)`. Nimed on ainult näited.
2. `ChromeExtensionMessageClient`-i tuleb `protected send(message)`. Kas `makeMessage` jääb avalikku API-sse, otsustatakse sammu käigus.
3. PopupRenderer kasutab `fileCacheClient.getFileSources()`-i.
4. **Avatud küsimus:** generaator katab saatmise poole. Vastuvõtja (kontroller) loeb praegu `content.assignmentId as string`. Et see ei lahkneks, peaksid kontrollerid kasutama samu payload-tüüpe (K8), mida generaator täidab. Täpne lahendus selgub K8 ja K10 käigus.

### K10. Sõnumite handleri baasklass `[1.1]`, `[1.10]`
**Leid:** [ChromeExtensionMessageController](../google-chrome-extension/src/service-worker/controller/ChromeExtensionMessageController.ts) ja [VsCodeWebSocketController](../visual-studio-code-extension/src/controller/VsCodeWebSocketController.ts) on peaaegu identsed: staatiline handler-map, `onOneTimeInit` loob mapi ja kuulaja, `addMessageHandler`, handleri otsing ja „handlerit pole“ haru. Erinev on ainult transport. Lahknemine on juba alanud:
- VS Code püüab handleri vea kinni (`try/catch` → `'error'`). Chrome seda ei tee, nii et vea korral `sendResponse` ei käivitu ja klient saab `undefined` või ootab.
- Chrome'i logi prefiks oli vale (parandati V10-s).

Kui seda ignoreerida, tuleb iga veakäsitluse või logimise parandus teha kaks korda ja üks jääb tegemata.
*(1.10)* Algses analüüsis soovitati tühjad alias-tüübid (`ChromeMessageHandler`, `VsCodeMessageHandler`, `ChromeMessageHandlerMap`, `VsCodeMessageHandlerMap`) eemaldada. **Autor ei nõustunud.**
**Autori otsused:**
> saan aru, et kahe messagehandleri vahel peaks struktuuri viima baas messagehandler classi sisse ning erineva osa peaks eraldama alamklassi külge, et baasklass defineerib mingi abstraktse meetodi just selle konkreetse osa handlimiseks nt ja alamklass defineerib oma spetsiaalkäitumise sellele abstraktsele meetodile? kui sa arvad, et see on liiga lihtsustatud ja oleks vaja eraldi messagerouterit, siis võiks ka sellele mõelda. aga ma tahaks selle koha peal siin mõelda selle kõige lihtsama viisi, et saavutada korralik robustne ilma duplikatsioonita süsteem, aga süsteemi ei tehta ka keerulisemaks kui ta peab olema. üldises plaanis olen su pakkumisega ja eriti vajaduse põhjendusega nõus, kuid seda kohta tuleb kaalutleda.

> kusjuures siin ei saa ma sinuga nõustuda. kuigi need failid sisu poolest ei lisa midagi, on need ikkagi väga olulised abstraktsuse poolest. need näitavad, et chrome ja vscode message-d on juba olemuslikult väga erinevad üksteisest. 1.1 ja 1.3 kombineeritud lahenemise käigus võib juhtuda, et need muutuvad teiseks, aga sellien põhimõtteline abstraktsioon mingil kujul peab jääma. võibolla see liitub mingi uue või olemasolema struktuuriga, aga peab alles jääma mingil kujul. see on meelega lisatud.

**Eesmärk:** kahe dispetšeri ühine struktuur on ühes baasklassis ja transpordispetsiifiline osa alamklassides. Sihiks on autori sõnadega *„kõige lihtsam viis, et saavutada korralik robustne ilma duplikatsioonita süsteem, aga süsteemi ei tehta ka keerulisemaks kui ta peab olema“*. Autori sõnul *„seda kohta tuleb kaalutleda“*.
**Autori suunis:** baasklass defineerib abstraktse meetodi transpordispetsiifilise osa jaoks ja alamklass implementeerib selle. Eraldi message routeri võib kaaluda, kui see osutub vajalikuks.
**Piirangud:**
- *(1.10)* `ChromeMessageHandler` ja `VsCodeMessageHandler` (ning mapid) peavad **mingil kujul alles jääma** kui olemuslikult erinevate sõnumite abstraktsioon.
- Baasklass on tahtlikult ka singleton-dispetšer (V8). Rollide eraldamine on E5.
- Kasuta olemasolevat mustrit: staatilised väljad ja `onOneTimeInit`.
- Käitumise muudatused, näiteks veakäsitluse lisamine Chrome'i, küsitakse autorilt.

**Esialgne soovitus (üldise plaani põhjal):**
- Autori lähenemine on tõenäoliselt piisav. Eraldi router kuuluks E5 alla.
- Baasklass (näiteks `shared/controller/`-is) sisaldab handleri registreerimist, otsingut, „handlerit pole“ käitumist ja veakäsitlust. Alamklass implementeerib transpordi (`startListening()`, `sendResponse(...)`). Veakäsitluse ühtlustamine tähendaks Chrome'ile **käitumise muutust**, sest praegu vea korral ei vastata üldse.
- **Tähelepanek 1: jagatud staatiline map.** Kui map on staatiline väli *baasklassis*, jagaksid kõik transpordid samas bundle'is ühte mapi. Praegu on igas bundle'is üks transport. Võimalik lahendus: map on transpordi alamklassis, nagu praegu.
- **Tähelepanek 2: `onOneTimeInit` semantika.** Ühekordsus on seotud meetodi implementatsiooniga (V8). Kui ühekordne init oleks *ainult* baasklassis, käivituks see samas bundle'is kõigi transportide peale kokku üks kord.

### K11. Püsiandmete ja vaate oleku eraldamine andmetüüpides `[3.6]`
**Leid:**
- [Feedback._id](../google-chrome-extension/src/shared/types/Feedback.ts#L8) on runtime-väli püsiandmete tüübis.
- `FeedbackPart.enabled` on korraga definitsiooni vaikeväärtus ja muudetav UI olek, mistõttu on vaja [deepCopy](../google-chrome-extension/src/shared/util/deepCopy.ts)'d.
- [FileSourceInfo](../google-chrome-extension/src/shared/types/FileSourceInfo.ts) segab UI teksti (`displayName`) ja salvestusvõtmed.

**Autori otsus:**
> okei jah võiks teha küll eralduse siia.

**Eesmärk:** püsiandmete tüübid (definitsioonid, konfiguratsioon) ja vaate või runtime'i olek on andmetüüpides eraldatud.
**Piirang:** `Feedback`-i osa kattub tugevalt eraldiseisvate teemadega E2 (äriloogika vs renderdus) ja E3 (feedbacki tähendus). Kui E3 muudab seda, mida feedback üldse tähendab, võib see töö muutuda uuesti. Enne `Feedback`-i puudutamist küsi autorilt, kas see osa tehakse K11-s või jääb E2/E3 juurde.

**Esialgne soovitus (üldise plaani põhjal):**
1. `FileSourceInfo`: eralda salvestusvõtmed (`directoryConfigKey`, `cacheKey`) ja kuvatav info (`displayName`), näiteks kahe tüübina, millest üks sisaldab teist.
2. `Feedback`/`FeedbackPart`: eraldi vaate olek, näiteks `FeedbackSelectionState` (valitud osad), ja `_id` eemaldatakse definitsioonitüübist.

---

# 3. Eraldiseisvad teemad (E): praegu ei tehta

Need tehakse eraldi ülesannetena pärast V- ja K-gruppi. Kui autor on punktid sidunud, on need koos.

Kõik E-punktides kirjeldatud lahendused („Algne ettepanek“, koodinäited, „Suund“, „Võimalik suund“) on **esialgsed soovitused üldise plaani põhjal**, v.a kui need on autori tsitaadid. Just nendes teemades tuleb lahendus autoriga põhjalikult läbi mõelda.

### E1. Brauseri- ja Moodle'i lehe haldus: page objectid ja workflow `[1.7]`, `[1.12 selektorid]`, `[4.1]`
**Leid:**
- *(1.7)* Moodle'i DOM-abifunktsioonid on dubleeritud ja nimed põrkuvad. `getMainDiv()` on identsena nii [assignment-moodle-helper.ts:3](../google-chrome-extension/src/content-script/pagemanager/assignment-moodle-helper.ts#L3) kui [quiz-moodle-helper.ts:40](../google-chrome-extension/src/content-script/pagemanager/quiz-moodle-helper.ts#L40). `getGradeInput()` on mõlemas failis sama nimega, aga **eri selektoriga**, nii et auto-import võib valida vale faili. URL-parameetri lugemine on mitmes kohas (`getAssignmentId`, `getAttemptId`, `getQuizId`). Selektor `'div.manualgraded.complete'` on kahes funktsioonis. Moodle'i uuenduse järel võidakse selektor parandada ühes kohas ja teine jääb vanaks.
- *(1.12)* Moodle'i selektorid on nii CSS-is kui TS-is (`div[data-region="grade-panel"]`, `div.comment-area div.db textarea`, [assign-grader.css:29, 145](../google-chrome-extension/src/content-script/assign-grader.css#L29)).
- *(4.1)* Util-megamoodulid [assignment-moodle-helper](../google-chrome-extension/src/content-script/pagemanager/assignment-moodle-helper.ts) ja [quiz-moodle-helper](../google-chrome-extension/src/content-script/pagemanager/quiz-moodle-helper.ts) on lamedad funktsioonikogud, mida kutsutakse igalt poolt, ka renderer'ite seest. Kuskilt ei näe, mida skript lehega tegelikult teeb. Algne ettepanek sisaldas kolme kihti:
  - **a) Page objectid** (ainult nemad tunnevad Moodle'i DOM-i): `moodle/MoodlePage.ts` (baas: `getMainRegion()`, `getUrlParam()`, selektorid), `GradeForm.ts` (liides: `setGrade()`, `submit()`), `AssignmentGraderPage` ja `QuizCommentPage` (mõlemad `extends MoodlePage implements GradeForm`, oma selektoritega), `QuizReviewPage` ning `QuizQuestionBox` (element object `'div.manualgraded.complete'` jaoks). Polümorfism lahendab `getGradeInput` nimede kokkupõrke.
  - **b) `PageScript` baasklass** (praeguse BaseMoodlePageListener'i asemel) omab elutsüklit: valmisolek, navigeerimisel `teardown` ja uuesti `run`. Alamklassi `run()` loeb nagu main-funktsioon:
    ```ts
    class AssignmentGraderScript extends PageScript<AssignmentGraderPage> {
      protected async run(page: AssignmentGraderPage) {
        const feedback = await feedbackClient.getFeedback(page.getAssignmentId())
        const composer = new FeedbackComposer(feedback)
        page.expandCommentSection()
        this.panel = new CheckingHelperPanel(feedback, {
          onChange: selection => {
            const { points, comment } = composer.compose(selection)
            page.setGrade(points)
            page.setComment(comment)
          },
        })
        this.panel.mount(page.getPanelAnchor())
        await vsCodeClient.openStudentSubmission(page.getStudentName())
      }
    }

    class QuizCommentScript extends PageScript<QuizCommentPage> {
      protected async run(page: QuizCommentPage) {
        const id = page.getQuestion().getAutoGradeId()
        if (!(await quizClient.isAutoGradeActive(id))) return
        page.setGrade(page.getMaxMark())
        await quizClient.endAutoGrade(id)
        page.submit()
      }
    }
    ```
  - **c) Renderer'id ei tea Moodle'ist midagi** (vaata E2).

  Tulemusena on workflow (millised andmed tuuakse, mida kuvatakse, mida Moodle'isse kirjutatakse) ühes kohas nähtav ja selektorid on ühes kohas.

**Autori otsused:**
> moodlei dom abifunktsioonid mis on dubleeritud võiks praegu ignoreerida. ma kardan, et konkreetselt brauseri handlimine on täiesti eraldi teema mingil muul hetkel, mida saabki hakata tegema alles siis, kui praegu kõik muu eeltöö on tehtud. praegu seda refaktorida üritades võib kogemata hoopis asju keerulisemaks teha, seega jätaks hetkel kõrvale.

> ma olen su üldise loogikaga nõus, aga me peame kindlasti seda täiesti eraldiseisvalt lahendama. seda seepärast, et see on nii ulatuslik ja võib paljut mõjutada.

(1.12 selektorite kohta: *„moodlei sektorite osa ignoreerime seoses 1.7-ga.“*)
**Seosed:** E2 (renderer'id ei tohi Moodle'i DOM-i puudutada), E3 (`FeedbackComposer`), ja E6 (`executeOnPageReady` on PageScripti elutsükli osa).

### E2. Äriloogika ja renderdamise lahutamine `[3.3]`, `[3.5]`
**Leid:**
- *(3.3)* Service-kiht on tühi ja äriloogika on mujal. [AssignmentService](../google-chrome-extension/src/service-worker/service/AssignmentService.ts) ja [QuizService](../google-chrome-extension/src/service-worker/service/QuizService.ts) ainult edastavad kutse edasi. `beginAutoGrade` on neljas kohas samas kujus: klient, kontroller, teenus ja repository. Äriloogika on hoopis:
  - repository's: [AssignmentRepository](../google-chrome-extension/src/service-worker/repository/AssignmentRepository.ts) parsib JSON-it, otsib `moodleId` järgi ja tagastab `getFeedback`-i;
  - renderer'is: hinde arvutus ja kommentaari koostamine.

  Chrome'i [PageInfoService](../google-chrome-extension/src/service-worker/service/PageInfoService.ts) on tegelikult VS Code'i gateway. Nimi „PageInfo“/„page-info“ peidab kavatsuse; tegelik tegevus on „ava õpilase esitus“. Algne ettepanek: repository teeb ainult salvestamist, service teeb parsimise, valideerimise ja päringud, hinnangu arvutus läheb domeenimoodulisse ning PageInfo nimetatakse sisu järgi ümber. See vastab ka [init-services.ts TODO](../google-chrome-extension/src/service-worker/service/init-services.ts#L13)-le.
- *(3.5)* Renderer'id teevad kõike korraga:
  - [FeedbackSectionRenderer](../google-chrome-extension/src/content-script/renderer/FeedbackSectionRenderer.ts) renderdab, loeb ja kirjutab Moodle'i DOM-i (`getGradeInput`, `getCommentTextarea`, `getCommentLink().click()`), arvutab hinde, koostab kommentaari ja hoiab olekut (`_id` counter, deepCopy).
  - [CheckingHelperPanelRenderer](../google-chrome-extension/src/content-script/renderer/CheckingHelperPanelRenderer.ts) renderdab, **toob andmeid** (`new FeedbackClient().getData`) ja otsib Moodle'ist ankrut. Väli `#feedbackElement` on tegelikult `h2` pealkiri. Alam-renderer'i `render()` jääb ootamata ([rida 48](../google-chrome-extension/src/content-script/renderer/CheckingHelperPanelRenderer.ts#L48)).
  - [ClickableListRenderer](../google-chrome-extension/src/content-script/renderer/ClickableListRenderer.ts) ja [ClickableListItemRenderer](../google-chrome-extension/src/content-script/renderer/ClickableListItemRenderer.ts) kannavad üldist nime, aga on seotud `FeedbackPart`-iga ja pöidlapildiga. `listItemClass` on tegelikult `ul`-i klass.
  - [BaseRenderer](../google-chrome-extension/src/content-script/renderer/BaseRenderer.ts) on tühi ja mitte-abstraktne, lepingut sellel pole.
  - [ClickableListItemRenderer.clear()](../google-chrome-extension/src/content-script/renderer/ClickableListItemRenderer.ts#L41) kasutab `this.#addButton!`, mis kukub, kui `render()` pole käinud.
  - *(1.12, autor pole kommenteerinud)* Iga renderer'i `clear()` eemaldab kõik alamelemendid ükshaaval, kuigi juure eemaldamisest piisaks. See loogika on iga renderer'i sees eraldi kirjutatud.

  Algne ettepanek: renderer saab andmed ja callback'id, haldab ainult oma DOM-i ja emiteerib olekut. BaseRenderer omab juurelementi ning meetodeid `mount(parent)` ja `unmount()`. Moodle'i DOM-i puudutab ainult page object (E1).

**Autori otsused:**
> on halb, et äriloogika asub repository-s ja rendereris, iseenesest oleks tore kui see elaks mingis eraldi definitsioonifailis. aga see tähendaks mingi eraldi süsteemi loomist, mida rendereris tõlgendatakse. see vajab eraldi mõtlemist ja käsitlemist.

> selles suhtes nõus, et renderdaja teeb praegu liiga palju. aga rendereride ümbertegemine tundub nii suur ja mõjukas, et see on ka üks täiesti eraldi üksinda käsitletav teema. siis peaks tõesti tegema, et rendererimine on eristatud äriloogikast. vb tulebki punktiga 3.3 see liita, kuna need on ju hetkel läbipõimunud. ma oleks rahul lahendusega, kus äriloogika elab klassides, mis haldavad rendereri ja teisi alamklasse, kuna äriloogika ei eksisteeri ju vaakumis nii et ta võib olla eraldi klass mis teiste klassidega ikkagi interakteerub. eraldi klassid. aga need võiksid asuda nt mingis ühes arusaadavas kaustas koos ja mingi standardi järgi nimetatud vms.

**Suund autori järgi:** äriloogika elab eraldi klassides, mis haldavad renderer'eid ja teisi alamklasse. Need on ühes arusaadavas kaustas ja nimetatud ühtse standardi järgi.
**Seosed:** E1, E3, K11 (andmetüüpide eraldus).

### E3. Feedbacki domeenimoodul ja feedbacki tähendus `[1.11]`
**Leid:** see, mida `FeedbackPart`-i `enabled`, `enabledText`, `disabledText` ja `points` tähendavad, on laiali kolmes kohas: [ClickableListItemRenderer#getDisplayText](../google-chrome-extension/src/content-script/renderer/ClickableListItemRenderer.ts#L54), [FeedbackSectionRenderer#buildCommentText](../google-chrome-extension/src/content-script/renderer/FeedbackSectionRenderer.ts#L103) ja `#calculateAndSetTotalPoints`. Ettepanek oli puhas domeenimoodul `FeedbackComposer` (osad → punktid + kommentaar), mida saab testida. Kui see tegemata jätta, tuleb uue välja lisamisel (näiteks `hidden` või „osaline“) kolm kohta käsitsi üles leida.
**Autori otsus:**
> okei domeenimoodul pole otseselt halb mõte. küll aga tahaks ma seda kõigest muust eraldiseisvalt käsitleda, kuna see pole enam nii lihtne refaktor, vaid selle käigus kardan et ma pean ümber mõtlema ka seda, et mida feedback endast üldse tähendab. sama keiss nagu 1.7-ga, et enne kõige muu lahenemist tuleb ignoreerida.

**Seosed:** E2, E4 (punktireeglid) ja K11 punkt 2.

### E4. Punktide käitumine ja submit-keeld `[2.1]`, `[4.3.5]`
**Leid:** [FeedbackSectionRenderer.ts:100](../google-chrome-extension/src/content-script/renderer/FeedbackSectionRenderer.ts#L100): `totalPoints > 0 ? totalPoints : 100`. Kui summa on 0 **või negatiivne**, pannakse hindeks 100. See on peidetud ärireegel. Ülesandes, kus kõik on miinuspunktid (vaata `definitions/python/python-cafe-assignment.json`), annavad piisavalt suured mahaarvamised täispunktid.
**Autori otsused:**
> peidetud ärireegel totalpointsiga: ma pean selle üle mõtlema, ära seda praegu ise käsitle. siin ma pean aru saama kuidas üldse tahan punktide osas käituda ja see pole praegu veel seega lahendatav probleem.

> see on meelega fallback, sest kui professor teeb viga siis parem oleks tudengile anda 100 kui 0 punkti. tühi kast fallbackib ka 0 punkti. parem viis lahendada oleks teha mingisugune submit prevention, mis on hetkel täiesti puudu. analoogne formide submit keelu-lubamisega. vb olekski õige ehitada kogu lisafunktsionaalsuste paneel formina üles. AGA; see on future concern, mida peab täiesti eraldi haldama.

**Suund:** fallback on tahtlik. Parem lahendus oleks submit-keeld (vormide submit'i keelamise ja lubamise analoog), võimalik, et kogu paneel vormina. Seda võib soovi korral mainida ka README „Future concerns“ sektsioonis (V14).

### E5. Sõnumisüsteemi rollide eraldamine `[3.2]`
**Leid:** ChromeExtensionMessageController ja VsCodeWebSocketController on korraga (a) baasklass, (b) globaalne kuulaja, (c) dispetšer ja (d) VS Code'i puhul ka serveri elutsükli ja vastuseprotokolli omanik. Instantsi `close()` sulgeb staatilise serveri. Teise WebSocket-kontrolleri lisamisel on segane, kes serveri omanik on, ja staatilise oleku tõttu on testimine keeruline.
**Autori otsus:**
> no põhimõtteliselt olen nõus, et võiks rollid eraldada, aga see tundub päris väga keeruline osa ja seda peaks eraldiseisvalt haldama kui sõnumite süsteemi korda tegemise asjana.

**Seosed:** see jätkab K8–K10 tööd. Eraldi message router (mida K10-s ei tehtud) kuulub siia. Vaata ka V8 (singleton-dispetšer on praegu tahtlik).

### E6. `executeOnPageReady` (endine `executeOnPageLoad`) robustsus `[4.3.2]`
**Leid:** callback käivitub alles pärast *vähemalt üht* DOM-mutatsiooni ja sellele järgnevat 1,2 s vaikust.
- Kui leht on content scripti süstimise ajaks juba vaikne, ei käivitu callback kunagi.
- Kui lehel on pidevalt uuenev element (näiteks taimer), ei käivitu callback samuti kunagi.
- `setInterval` käib igavesti ja iga navigeerimine loob uue MutationObserveri.

**Autori otsus:**
> executeonpageload ei pruugi käivituda vb, aga seni on ta koguaeg käivutunud. seda peab eraldi käsitlema mingi hetk kus saab põhjalikumalt mõelda et mida ja kuidas teha saab teistmoodi seal. ma olen meelega pageload funktsionaalsuse nii eraldi hoidnud kõigest muust, et see oleks võimalik eraldiseisvalt käsitleda nii.

**Seosed:** E1 (PageScripti elutsükkel), V1 (konstandid) ja V15 (ümbernimetus `executeOnPageReady`-ks).

### E7. Õpilaste ja tööde kokkuviimine `[4.3.3]`
**Leid:** [PageInfoService.ts:65](../visual-studio-code-extension/src/service/PageInfoService.ts#L65) kasutab `name.startsWith(wantedName)`, mis sobitab „Mari Maa“ ka kaustaga „Mari Maasikas_…“. Siis avanevad teise õpilase failid.
**Autori otsus:**
> huvitav tähelepanek, aga ka pigem eraldiseisvalt lahendamist vajav. mingi hetk on plaanis teha robustsemaks see, kuidas toimib õpilaste ja tööde kokkuviimine, koos vb ka allalaadimise funktsionaalsustega, seega on need asjad vaja koos lahendada ja kõigest muust eraldi ülesandena.

**Ulatus:** õpilase ja kausta sobitamine ning allalaadimise funktsionaalsus koos.

### E8. WebSocketi päritolukontroll `[4.3.1]`
Leid ja autori otsus on punktis V14. Seal tehakse ainult README märge ja lahendus ise on siin. Autori sõnul on see *„natuke keerulisem teema, mida ma hetkel prototüübi raames ei lahenda“*.

### E9. UI tekstid ja tõlked `[2.10]`, `[1.12 nupu tekst]`
**Leid:** UI tekstid on laiali ja eesti- ning ingliskeelsed segamini: `'Tagasiside'`, `'Kommentaari algus'`, `'Kaust valimata'`, `'Assign max points with no comment'`, `'Moodle Helper: No folder found…'` jne. Nupu tekst `'Uuenda definitsioonid'` on nii [popup.html:34](../google-chrome-extension/src/popup/popup.html#L34) kui [PopupRenderer.ts:31](../google-chrome-extension/src/popup/renderer/PopupRenderer.ts#L31).
**Autori otsused:**
> ui tekstide laiali olek ignoreerime praegu, ma ei taha praegu tõlkefaile teha, see peab eraldi asi olema.

(Nupu teksti kohta: *„nupu teksti osa ignoreeriks praegu, kuna see on väga väikese impactiga kõigega muuga võrreldes.“*)

### E10. UI ja CSS ühtlustamine `[2.15]`, `[2.9]`
**Leid:**
- *(2.15)* [assign-grader.css](../google-chrome-extension/src/content-script/assign-grader.css): värvid `#FF7E2E`, `#2BFFFF` ja `#FEEA9A` korduvad (ka [quiz-review.css](../google-chrome-extension/src/content-script/quiz-review.css)-is). `left: 40%` = `20% + 20%`, nii et paneelide laiused sõltuvad üksteisest, aga see pole kuskil kirjas. Ettepanek oli kasutada CSS custom properties'eid.
- *(2.9)* CSS klassid (`'checking-helper-panel'`, `'common-answer-section'`, `'active'`, `'inactive'`, `'auto-max-button'` jne) on TS-is inline ja pole konstandina kirjas.

**Autori otsused:**
> assign grader värvide kordumise osas mtea, ma praegu ignoreeriks seda css probleemi ka. minu arust ui ühtlustamine on eraldi teema, kuna mingi aeg nkn tahan ui-d muuta.

> rendereride selle "lepingu" osas on probleem see, et tegelt css ei määra ju käitumist, vaid välimust. seega otseselt pole siin lepingut, vaid css on otsa liituv asi. et mingit lepingut loota teha, peaksin ma minema juba scss peale ja kasutama mingeid ekstra faile, mtea tundub natuke nuss ja lõpuks ikka peab ju css käsitsi kirjutama iga case jaoks. nii et tundub nagu asi mida ignoreerime, v.a kui sa ei suuda mulle väga hästi ära põhjendada või arvad et see on ikka oluline, minu arust pole.

**Lahendaja vastus (2.9):** tugevat vastuargumenti pole ja autoriga võib nõustuda. Klassinime kirjaviga TS-is kaotab ainult välimuse, mitte käitumise. Ainus pisiasi: `'active'` ja `'inactive'` on samas failis kahes kohas ([ClickableListItemRenderer.ts:48 ja 73-74](../google-chrome-extension/src/content-script/renderer/ClickableListItemRenderer.ts#L48)). Seda saab korrastada E2 käigus. Eraldi tegevust pole.

### E11. Andmebaasi skeem ja migratsioonid `[2.6 edasilükatud osa]`
Autori sõnul (vaata K3): *„andmebaasi ilusti tegemine on asi, mida ma tahaks praegu edasi lükata kuna praegu pole selge, kui head andmebaasi on vaja.“* K3 teeb ainult klassitaseme konstandid. Migratsioonid ja skeemi disain tulevad siia.

### E12. Init-süsteemi korrastamine `[K4 käigus leitud]`
**Taust:** tekkis K4 käigus. K4 viis AssignmentRepository ja FileCacheRepository projekti init-süsteemi järgi, aga init-süsteemi enda nõrkused jäid skoobist välja.
**Autori otsus:**
> initi parandamine on kompleksne ja põhjalikku läbimõtlemist vajav probleem, mis vajab täiesti eraldi käsitlust.

**Esialgne hinnang.** See on K4 lahendaja **esialgne hinnang**. Tegelik põhjus ja vajalik tegevus tuleb kindlasti põhjalikumalt läbi uurida.
- [service-worker.ts](../google-chrome-extension/src/service-worker/service-worker.ts) kutsub `initRepositories()`, `initServices()` ja `initControllers()` järjest, aga **ei oota** neid ära. Ka init-funktsioonid ise kutsuvad `.init()`-e ootamata. Kontrollerid võivad seega sõnumeid vastu võtta enne, kui repositoryde ja teenuste init on lõppenud.
- Praegu see probleemi ei tekita, sest repositoryde `onInit` teeb ainult sünkroonset tööd (näiteks FileCacheRepository registreerimine) ja lõpeb mõne microtask'i jooksul. Kui mõni `onInit` teeks päris asünkroonset tööd (näiteks IndexedDB päringu), oleks näiteks failiallikate register esimese sõnumi ajal veel tühi.
- **Piirang lahendusele:** Manifest V3 service worker peab `chrome.runtime.onMessage` kuulaja registreerima kohe skripti käivitumisel. Kui kuulaja registreerimist oodatakse asünkroonse init'i järel, võib sõnum, mis service workeri üles äratas, kaduma minna. Seega ei saa lahendus olla lihtsalt „oota kõik init'id ära ja siis registreeri kontrollerid“.
- **Võimalik suund (vajab uurimist):** kuulaja registreeritakse kohe, nagu praegu, aga kontroller ootab enne sõnumi töötlemist, kuni repositoryde ja teenuste init on lõppenud.
- Sama küsimus võib puudutada ka VS Code'i laiendust (`activate()` kutsub `initServices()` ja `initControllers()` ootamata) ning content-scripte.

**Seosed:** K5 (elutsükli nimekirjad), V8 (`onOneTimeInit` parandus).
