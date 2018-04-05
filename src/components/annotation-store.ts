import { Annotation } from "../annotations";

export class AnnotationAlreadyExists extends Error {}

export interface AnnotationStore {
  storeAnnotation({annotation} : {annotation : Annotation}) : Promise<{id : string}>
  getAnnotationByID(id) : Promise<Annotation>
}

export class MemoryAnnotationStore implements AnnotationStore {
  private _annotations = {}

  async storeAnnotation({annotation} : {annotation : Annotation}) {
    const id = annotation.id || Object.keys(this._annotations).length.toString()

    if (this._annotations[id]) {
      throw new AnnotationAlreadyExists(id)
    }
    this._annotations[id] = annotation
    return {id}
  }

  async getAnnotationByID(id) {
    return this._annotations[id]
  }
}
