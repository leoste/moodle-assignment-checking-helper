import type { GradePart, CommonAnswer } from '../../shared/types';
import deepCopy from '../../shared/util/deepCopy';
import { getGradeInput } from '../pagemanager/assignment-moodle-helper';
import { ClickableListRenderer } from './ClickableListRenderer';


export class GradeSectionRenderer {
  readonly #parentElement: HTMLElement
  readonly #gradeParts: GradePart[]
  #gradeInput!: HTMLInputElement

  constructor(parentElement: HTMLElement, gradeParts: GradePart[] | undefined) {
    this.#parentElement = parentElement
    this.#gradeParts = deepCopy(gradeParts ?? [])

    let idCounter = 0
    this.#gradeParts.forEach(part => {
      part._id = ++idCounter
      part.parts.forEach(partPart => {
        partPart.text = `${partPart.text} (${partPart.points}p)`
      })
    })
  }

  create(): void {
    this.#gradeInput = getGradeInput();
    this.#gradeParts.forEach(gradePart => {
      this.#createSubsectionList(gradePart);
    });
  }

  destroy(): void {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
  }

  setPointsMax(): void {
    this.#calculateAndSetTotalPoints(true);
  }

  #createSubsectionList(gradePart: GradePart): void {
    const onClickCallback = (states: CommonAnswer[] | GradePart['parts']) =>
      this.#onClickCallback(states as GradePart['parts'], gradePart._id!)

    const listRenderer = new ClickableListRenderer(
      this.#parentElement,
      onClickCallback,
      gradePart.parts,
      {
        sectionDivClass: 'common-answer-section',
        sectionTitle: `${gradePart.title} (${gradePart.max.points}p)`,
        listItemClass: 'common-answer-list',
      }
    )
    listRenderer.create()
  }

  #onClickCallback = (states: GradePart['parts'], id: number): void => {
    const gradePart = this.#gradeParts.find(p => p._id === id);
    if (gradePart) gradePart.parts = states;

    this.#calculateAndSetTotalPoints();
  };

  #calculateAndSetTotalPoints(overrideEnabledTrue?: boolean): void {
    const totalPoints = this.#gradeParts.reduce((sum, major) => {
      const partSum = (major.parts ?? []).reduce((ps, p) => ps + ((p.enabled || overrideEnabledTrue) ? (p.points ?? 0) : 0), 0);
      return sum + partSum;
    }, 0);
    this.#gradeInput.value = String(totalPoints > 0 ? totalPoints : 100);
  }
}
