export const translations = {
  extension: {
    name: 'Moodle Assignment Checking Helper',
    description: "Kiirendab Moodle'i ülesannete hindamist, vähendades klõpsamist ja trükkimist.",
  },

  feedback: {
    title: 'Tagasiside',
    resizeHint: 'Paneeli laiust saab muuta, lohistades selle vasakut serva.',
    commentPrefix: 'Kommentaari algus',
    commentPrefixPlaceholder: 'Siia kirjutatud tekst läheb kommentaari algusesse',
    notFound: 'Selle ülesande hindamismaatriksit ei leitud. Vali laienduse aknas (laienduse ikoon brauseri tööriistaribal) definitsioonide kaust ja lae failid. Kui kaust on valitud, lisa selle ülesande ID definitsiooni välja „moodleIds“ alla – ID on näha all olekureal.',
    points: (points: number) => `${points}p`,
    partSelectedText: (text: string) => `Kommentaar valituna: ${text}`,
    partUnselectedText: (text: string) => `Kommentaar valimata: ${text}`,
  },

  apply: {
    button: "Rakenda Moodle'isse",
    grade: (grade: number) => `Hinne: ${grade}`,
    unapplied: "Rakenda muudatused Moodle'isse",
    applied: "Rakendatud. Salvesta Moodle'i nupuga.",
    hint: "Rakendamine asendab Moodle'i hinde ja kommentaari. Kirjuta soovi korral oma tekst „Kommentaari algus“ lahtrisse.",
  },

  quizAutoGrade: {
    assignMaxPoints: 'Anna maksimumpunktid ilma kommentaarita (salvestab kohe)',
  },

  popup: {
    intro: "Abipaneel ilmub Moodle'is ülesande hindamislehele. Selleks vali siin kõigepealt definitsioonide kaust.",
  },

  definitions: {
    folderName: 'Definitsioonide kaust',
    noneFound: 'Definitsioone ei leitud. Vali kaust või vajuta värskenda nuppu.',
    noCourseCode: '?',
    searching: 'Definitsiooni otsimine...',
    found: (name: string) => `Definitsioon: ${name}`,
    notFound: 'Sellele ülesandele definitsiooni ei leitud',
    moodleId: (assignmentId: string) => `Ülesande MoodleID on: ${assignmentId}`,
    folderNotChosen: 'Definitsioonide kaust valimata',
    notLoaded: 'Definitsioonid laadimata',
    lookupFailed: 'Definitsiooni otsimine ebaõnnestus',
    loaded: (count: number) => `Laetud definitsioone: ${count}`,
    noPermission: 'Kausta lugemiseks puudub luba. Luba küsitakse uuesti järgmisel laadimisel.',
    brokenFiles: (files: string) => `Vigased definitsioonifailid: ${files}`,
    brokenFile: (fileName: string, problem: string) => `${fileName} (${problem})`,
  },

  definitionProblems: {
    invalidJson: 'pole korrektne JSON',
    wholeFile: 'fail',
    missing: (path: string) => `${path} puudub`,
    notAllowed: (path: string) => `${path} pole lubatud`,
    wrongType: (path: string, valueType: string) => `${path} peab olema ${valueType}`,
    valueTypes: {
      text: 'tekst',
      number: 'arv',
      boolean: 'true või false',
      list: 'loend',
      object: 'objekt',
      null: 'null',
    },
  },

  fileSource: {
    selectFolder: (sourceName: string) => `Vali ${sourceName.toLowerCase()}`,
    folderNotSelected: 'Kaust valimata',
    refresh: 'Lae failidest uuesti',
    refreshing: 'Laadimine...',
    notRefreshed: 'Definitsioonid puuduvad',
    refreshHint: 'Pärast definitsioonifailide muutmist on vaja käsitsi vajutada värskendamise nuppu. Avatud hindamislehtedel võetakse muudatused kohe kasutusele.',
  },

  studentSubmission: {
    noWorkspaceFolder: "Moodle Helper: VS Code'is pole kausta avatud. Ava kaust, kuhu laadisid Moodle'ist õpilaste esitused.",
    noStudentFolder: (studentName: string) => `Moodle Helper: õpilase „${studentName}“ kausta ei leitud. Avatud kaustas peab iga õpilase esitus olema eraldi kaustas, mille nimi algab õpilase nimega.`,
    opening: (studentName: string) => `${studentName}: failide avamine...`,
    opened: (studentName: string) => `${studentName}: failid avatud`,
    nothingOpened: (studentName: string) => `${studentName}: ühtegi faili ei avatud`,
    notFound: (studentName: string) => `${studentName}: kausta ei leitud`,
    noWorkspace: "VS Code'is pole kausta avatud",
    error: (studentName: string) => `${studentName}: viga failide avamisel`,
    unhandled: 'VS Code ei tundnud päringut ära (laienduste versioonid erinevad?)',
    unreachable: 'VS Code pole avatud või laiendus pole paigaldatud',
    noAnswer: 'VS Code ei vastanud',
  },

  connection: {
    waiting: 'VS Code: ühendus ootel',
    disconnected: 'VS Code: ühendus puudub',
    reconnecting: 'VS Code: ühendumine...',
    connected: 'VS Code: ühendatud',
    portInUse: (port: number) => `VS Code: port ${port} on hõivatud, õpilasi võtab vastu teine VS Code'i aken`,
    serverError: 'VS Code: õpilaste vastuvõtmine ei käivitunud',
  },

  moodlePage: {
    elementNotFound: (selector: string) => `Laiendus ei leidnud Moodle'i lehelt: ${selector} (Moodle'i leht võib olla ümber arendatud või pole tööd, mida kontrollida)`,
  },

  statusBar: {
    label: 'Moodle Helper',
  },

  sidebar: {
    settingsTitle: 'Seaded',
    openSubDirectories: 'Ava failid ka alamkaustadest',
  },

  pythonRunner: {
    terminalName: 'Pythoni käivitaja',
  },
}
