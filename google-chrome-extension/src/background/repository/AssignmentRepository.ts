import type { AssignmentDefinition } from '../../types'
import LocalFileRepository from './LocalFileRepository'

/*
TODO:
definitions
- sünkroniseerin. see võtab liiga kaua ja ei juhtu õigel hetkel
- read kood kirjutatud popup.ts sisse. see tuleks eraldada eraldi moodulisse ikka
- localfilerepo extendib localstoragerepo. sel juhul pole localfilerepo-l kui sellist enam tähendust ja tuleks sellest lahti saada, ja definitions extendib localstorage hoopis.

- kuidagi teha, et iga kord ikkagi uuendaks. võibolla sõnumite süsteem popupi ja backendi vahele.
*/

export default class AssignmentRepository extends LocalFileRepository {
  async getAllDefinitions(): Promise<AssignmentDefinition[]> {
    const fileContents = await this.getAllFileContent()
    const definitions: AssignmentDefinition[] = []
    for (const content of fileContents) {
      try {
        definitions.push(JSON.parse(content) as AssignmentDefinition)
      } catch {
        // skip files that are not valid JSON or don't match the expected shape
      }
    }
    return definitions
  }

  async findByMoodleId(moodleId: string): Promise<AssignmentDefinition | undefined> {
    const definitions = await this.getAllDefinitions()
    return definitions.find(d => d.moodleIds.some(id => String(id) === moodleId))
  }
}

export const assignmentRepository = new AssignmentRepository()
