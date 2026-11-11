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
    notFound: 'Hindamismaatriksit ei leitud. Vali laienduse aknas (laienduse ikoon brauseri tööriistaribal) definitsioonide kaust ja veendu, et selles sisaldub praeguse ülesande ID-ga definitsioonifail. Selle ülesande MoodleID on kuvatud all olekureal.',
    gradingElsewhere: "Teises Moodle aknas juba hinnatakse. Jätka seal või võta hindamine üle siia aknasse.",
    takeOverGrading: 'Võta hindamine üle',
    points: (points: number) => `${points}p`,
    partSelectedText: (text: string) => `Kommentaar valituna: ${text}`,
    partUnselectedText: (text: string) => `Kommentaar valimata: ${text}`,
  },

  apply: {
    button: "Täida väljad Moodle's",
    grade: (grade: number) => `Hinne: ${grade}`,
    applied: "Väljad muudetud",
    hint: "Täitmine asendab Moodle'is olemasoleva hinde ja kommentaarikasti kirjutatud teksti.",
  },

  quizAutoGrade: {
    assignMaxPoints: 'Anna maksimumpunktid ilma kommentaarita (salvestab kohe)',
  },

  popup: {
    intro: "Vali definitsioonide kaust. Nende põhjal koostatakse sisupaneeli klõpsatavad hindamismaatriksid.",
    reloadPanel: 'Lae sisupaneel uuesti',
    reloadPanelHint: "Kui sisupaneel miskipärast ei lae või muu põhjus, saad selle nupuga selle uuesti laadida.",
    panelNotActivated: "Laiendus pole veel aktiveerunud, selleks värskenda Moodle'i lehte.",
  },

  definitions: {
    folderName: 'Definitsioonide kaust',
    noneFound: 'Definitsioone ei leitud. Vali kaust, veendu definitsioonifailide olemasolus või vajuta värskenda nuppu.',
    noCourseCode: '?',
    searching: 'Definitsiooni otsimine...',
    found: (name: string) => `Definitsioon: ${name}`,
    notFound: 'Sellele ülesandele vastavat definitsioonifaili ei leitud',
    moodleId: (assignmentId: string) => `Ülesande MoodleID on: ${assignmentId}`,
    folderNotChosen: 'Definitsioonide kaust on valimata',
    notLoaded: 'Definitsioonid on laadimata',
    lookupFailed: 'Definitsiooni otsimine ebaõnnestus',
    loaded: (count: number) => `Laetud definitsioone: ${count}`,
    noPermission: 'Kausta lugemiseks puudub luba. Luba küsitakse järgmisel definitsioonide laadimisel uuesti.',
    brokenFiles: (files: string) => `Vigased definitsioonifailid: ${files}`,
    brokenFile: (fileName: string, problem: string) => `${fileName} (${problem})`,
  },

  definitionProblems: {
    invalidJson: 'Faili sisu pole korrektses JSON-vormingus.',
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
    refreshHint: 'Pärast definitsioonifailide muutmist on vaja need käsitsi uuesti laadida, vajutades värskenda nuppu.',
  },

  studentSubmission: {
    noWorkspaceFolder: "Moodle Helper: VS Code'is pole kausta avatud. Ava kaust, kuhu laadisid Moodle'ist alla õpilaste esitused.",
    noStudentFolder: (studentName: string) => `Moodle Helper: tudengi „${studentName}“ esitatud tööga kausta ei leitud. Iga tudengi esitatud töö peab olema eraldi kaustas, mille nimi algab tudengi nimega.`,
    opening: (studentName: string) => `${studentName}: failide avamine...`,
    opened: (studentName: string) => `${studentName}: failid avatud`,
    nothingOpened: (studentName: string) => `${studentName}: ühtegi faili ei avatud`,
    notFound: (studentName: string) => `${studentName}: kausta ei leitud`,
    noWorkspace: "VS Code'is pole kausta avatud",
    error: (studentName: string) => `${studentName}: viga failide avamisel`,
    unhandled: 'VS Code ei tundnud päringut ära (kas äkki laienduste versioonid erinevad?).',
    unreachable: 'VS Code pole avatud või sealpoolne laiendus pole paigaldatud',
    noAnswer: 'VS Code ei vastanud',
  },

  connection: {
    waiting: 'VS Code: ühendus ootel',
    disconnected: 'VS Code: ühendus puudub',
    reconnecting: 'VS Code: ühendumine...',
    connected: 'VS Code: ühendatud',
    portInUse: (port: number) => `VS Code: port ${port} on hõivatud teise VS Code'i akna poolt.`,
    serverError: 'VS Code: ühendus ebaõnnestus',
    takeOver: 'Võta vastuvõtmine üle',
    takeOverFailed: 'VS Code: ülevõtmine ebaõnnestus, teine aken ei vastanud',
  },

  moodlePage: {
    elementNotFound: (selector: string) => `Laiendus ei leidnud Moodle'i lehelt: ${selector} (Moodle'i leht võib olla ümber arendatud või pole tööd, mida kontrollida)`,
  },

  statusBar: {
    label: 'Moodle Helper',
  },

  sidebar: {
    settingsTitle: 'Seaded',
    connectionTitle: 'Ühendus',
    openSubDirectories: 'Ava failid ka alamkaustadest',
  },

  pythonRunner: {
    terminalName: 'Pythoni käivitaja',
  },
}
