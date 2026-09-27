export const translations = {
  extension: {
    name: 'Moodle Assignment Checking Helper',
    description: 'Speeds up checking assignments on Moodle by reducing clicks and typing.',
  },

  feedback: {
    title: 'Tagasiside',
    commentPrefix: 'Kommentaari algus',
    points: (points: number) => `${points}p`,
  },

  quizAutoGrade: {
    assignMaxPoints: 'Assign max points with no comment',
  },

  definitions: {
    folderName: 'Definitsioonide kaust',
    refresh: 'Uuenda definitsioonid',
    refreshing: 'Uuendamine...',
  },

  fileSource: {
    selectFolder: (sourceName: string) => `Vali ${sourceName.toLowerCase()}`,
    folderNotSelected: 'Kaust valimata',
  },

  studentSubmission: {
    noWorkspaceFolder: 'Moodle Helper: No workspace folder open.',
    noStudentFolder: (studentName: string) => `Moodle Helper: No folder found for "${studentName}".`,
  },

  pythonRunner: {
    terminalName: 'Python Runner',
  },
}
