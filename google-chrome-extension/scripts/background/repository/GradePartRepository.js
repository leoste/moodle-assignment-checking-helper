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
            "enabled": false
          },
          {
            "points": 10,
            "text": "ära märgitud probleemide tüüp ja olemus",
            "enabled": false
          },
          {
            "points": 10,
            "text": "pakutud probleemidele lahendused",
            "enabled": false
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
            "enabled": false
          },
          {
            "points": 10,
            "text": "andmebaas normaliseeritud",
            "enabled": false
          },
          {
            "points": 15,
            "text": "tabelite ja constraint-ide kirjeldus olemas",
            "enabled": false
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
            "text": "SCHEMA queryd olemas ja korrektsed",
            "enabled": false
          },
          {
            "points": 8,
            "text": "MIGRATION queryd olemas ja toimivad",
            "enabled": false
          },
          {
            "points": 4,
            "text": "VÕRDLUS queryd olemas. SELECT puhul on peaasi, et loogiliselt midagigi testib",
            "enabled": false
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
            "enabled": false
          },
          {
            "points": 5,
            "text": "otsused on põhjendatud",
            "enabled": false
          },
          {
            "points": 5,
            "text": "vähemalt mingidki põhjendused ja tekstid on kuskilgi olemas",
            "enabled": false
          }
        ]
      }
    ]
  }

  async getAll(assignmentId) {
    return GradePartRepository.#data[assignmentId]
  }
}