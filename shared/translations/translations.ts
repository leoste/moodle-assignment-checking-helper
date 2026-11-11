export const translations = {
  extension: {
    name: 'Moodle Assignment Checking Helper',
    description: 'Speeds up checking assignments on Moodle by reducing clicks and typing.',
  },

  feedback: {
    title: 'Tagasiside',
    commentPrefix: 'Kommentaari algus',
    notFound: 'Hindamismaatriksit ei leitud või on selles 0 hindamisjuhist',
    points: (points: number) => `${points}p`,
    partLabelText: (text: string) => `label: ${text}`,
    partSelectedText: (text: string) => `enabled: ${text}`,
    partUnselectedText: (text: string) => `disabled: ${text}`,
  },

  apply: {
    button: 'Rakenda',
    grade: (grade: number) => `Hinne: ${grade}`,
    unapplied: 'Rakendamata muudatused',
    applied: 'Rakendatud',
  },

  quizAutoGrade: {
    assignMaxPoints: 'Assign max points with no comment',
  },

  definitions: {
    folderName: 'Definitsioonide kaust',
    noneFound: 'Definitsioone ei leitud',
    noCourseCode: '?',
    searching: 'Definitsiooni otsimine...',
    found: (name: string) => `Definitsioon: ${name}`,
    notFound: (assignmentId: string) => `Ülesandele ${assignmentId} definitsiooni ei leitud`,
    folderNotChosen: 'Definitsioonide kaust valimata',
    notLoaded: 'Definitsioonid laadimata',
    lookupFailed: 'Definitsiooni otsimine ebaõnnestus',
    loaded: (count: number) => `Laetud definitsioone: ${count}`,
    noPermission: 'Kausta lugemiseks puudub luba',
    brokenFiles: (fileNames: string) => `Vigased failid: ${fileNames}`,
  },

  fileSource: {
    selectFolder: (sourceName: string) => `Vali ${sourceName.toLowerCase()}`,
    folderNotSelected: 'Kaust valimata',
    refresh: 'Lae failidest uuesti',
    refreshing: 'Laadimine...',
    notRefreshed: 'Pole laetud',
  },

  studentSubmission: {
    noWorkspaceFolder: 'Moodle Helper: No workspace folder open.',
    noStudentFolder: (studentName: string) => `Moodle Helper: No folder found for "${studentName}".`,
    opening: (studentName: string) => `${studentName}: failide avamine...`,
    opened: (studentName: string) => `${studentName}: failid avatud`,
    nothingOpened: (studentName: string) => `${studentName}: ühtegi faili ei avatud`,
    notFound: (studentName: string) => `${studentName}: kausta ei leitud`,
    noWorkspace: "VS Code'is pole kausta avatud",
    error: (studentName: string) => `${studentName}: viga failide avamisel`,
    unhandled: 'VS Code ei tundnud päringut ära',
    unreachable: 'VS Code ei ole kättesaadav',
    noAnswer: 'VS Code ei vastanud',
  },

  connection: {
    disconnected: 'VS Code: ühendus puudub',
    reconnecting: 'VS Code: ühendumine...',
    connected: 'VS Code: ühendatud',
    portInUse: (port: number) => `VS Code: port ${port} on hõivatud, õpilasi võtab vastu teine VS Code'i aken`,
    serverError: 'VS Code: õpilaste vastuvõtmine ei käivitunud',
  },

  moodlePage: {
    elementNotFound: (selector: string) => `Moodle'i lehelt ei leitud: ${selector}`,
  },

  statusBar: {
    label: 'Moodle Helper',
  },

  pythonRunner: {
    terminalName: 'Python Runner',
  },
}
