import { Annotation } from "../annotations";

export type AnnotationValidator = (unvalidatedAnnotation : object) => Promise<Annotation | null>

export const defaultAnnotationValidator : AnnotationValidator = async (unvalidatedAnnotation : object) => {
  return null
}
