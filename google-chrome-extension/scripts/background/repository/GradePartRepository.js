export default class GradePartRepository {
  // TODO: store and fetch from localStorage, add UI page for chrome user to edit this data by themselves, add data file import export options
  static #data = {
    '757712': [
      {
        "title": "Probleemituvastus",
        "max": {
          "points": 30,
          "text": "Terve hulk probleeme, mõistlikult kategoriseeritud, lahendusi pakutud"
        },
        "parts": [
          {
            "points": 10,
            "text": "välja toodud vähemalt 5 probleemi",
            "enabled": true
          },
          {
            "points": 10,
            "text": "ära märgitud probleemide tüüp ja olemus",
            "enabled": true
          },
          {
            "points": 10,
            "text": "pakutud probleemidele lahendused",
            "enabled": true
          }
        ]
      },
      {
        "title": "Schema design",
        "max": {
          "points": 35,
          "text": "ER diagramm, normaliseeritud, tabelite ja constraintide kirjeldus (võib ka sql queryna olla)"
        },
        "parts": [
          {
            "points": 10,
            "text": "ER diagramm olemas",
            "enabled": true
          },
          {
            "points": 10,
            "text": "andmebaas normaliseeritud",
            "enabled": true
          },
          {
            "points": 15,
            "text": "tabelite ja constraint-ide kirjeldus olemas",
            "enabled": true
          }
        ]
      },
      {
        "title": "Implementation",
        "max": {
          "points": 20,
          "text": "normaalselt tehtud CREATE TABLE, INSERT INTO, SELECT queryd"
        },
        "parts": [
          {
            "points": 8,
            "text": "CREATE TABLE queryd olemas ja korrektsed",
            "enabled": true
          },
          {
            "points": 8,
            "text": "INSERT INTO queryd olemas ja toimivad",
            "enabled": true
          },
          {
            "points": 4,
            "text": "SELECT queryd olemas. SELECT puhul on peaasi, et loogiliselt midagigi testib",
            "enabled": true
          }
        ]
      },
      {
        "title": "Documentation",
        "max": {
          "points": 15,
          "text": "hästi põhjendatud ja selgitatud"
        },
        "parts": [
          {
            "points": 5,
            "text": "töösse on kirjutatud selgitusi",
            "enabled": true
          },
          {
            "points": 5,
            "text": "otsused on põhjendatud",
            "enabled": true
          },
          {
            "points": 5,
            "text": "vähemalt mingidki põhjendused ja tekstid on kuskilgi olemas",
            "enabled": true
          }
        ]
      }
    ]
  }

  async getAll(assignmentId) {
    return GradePartRepository.#data[assignmentId]
  }
}