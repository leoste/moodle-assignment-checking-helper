import type { GradePart } from '../../types'
import BaseRepository from './BaseRepository'

class GradePartRepository extends BaseRepository {
  // TODO: store and fetch from localStorage, add UI page for chrome user to edit this data by themselves, add data file import export options
  static #data: Record<string, GradePart[]> = {
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
            "enabled": true
          }
        ]
      }
    ],
    '940421': [
        {
            "title": "Max punktid",
            "max": {
                "points": 15,
                "text": "tubli"
            },
            "parts": [
                {
                    "points": 15,
                    "text": "Kõik korras",
                    "enabled": true
                }
            ]
        },
        {
            "title": "Hilinemine",
            "max": {
                "points": -6,
                "text": "üle aja submittimine"
            },
            "parts": [
                {
                    "points": -1,
                    "text": "12h",
                    "enabled": false
                },
                {
                    "points": -1,
                    "text": "1p",
                    "enabled": false
                },
                {
                    "points": -1,
                    "text": "1p 12h",
                    "enabled": false
                },
                {
                    "points": -1,
                    "text": "2p",
                    "enabled": false
                },
                {
                    "points": -1,
                    "text": "2p 12h",
                    "enabled": false
                },
                {
                    "points": -1,
                    "text": "3p",
                    "enabled": false
                }
            ]
        
        }
    ]
  }

  async getAll(assignmentId: string): Promise<GradePart[] | undefined> {
    return GradePartRepository.#data[assignmentId]
  }
}

export const gradePartRepository = new GradePartRepository()