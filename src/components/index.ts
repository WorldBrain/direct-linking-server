import { AnnotationLinkBuilder } from './annotation-link-builder'
import { AnnotationStore, MemoryAnnotationStore } from './annotation-store'
import { AnnotationValidator, defaultAnnotationValidator } from './annotation-validator'
import { DocumentRetriever, SingleDocumentRetriever } from './document-retriever'
import { LinkReplacer, RegexLinkReplacer } from './link-replacer'
import { ScriptInjector } from './script-injector'

export interface AppComponents {
  annotationLinkBuilder : AnnotationLinkBuilder
  annotationStore : AnnotationStore
  annotationValidator : AnnotationValidator
  documentRetriever : DocumentRetriever
  linkReplacer : LinkReplacer
  scriptInjector : ScriptInjector
}

export interface AppComponentsConfig {
  baseUrl : string
}

export function createAppComponents({baseUrl} : AppComponentsConfig) : AppComponents {
  return {
    annotationLinkBuilder: new AnnotationLinkBuilder({baseUrl}),
    annotationStore: new MemoryAnnotationStore(),
    annotationValidator: defaultAnnotationValidator,
    documentRetriever: new SingleDocumentRetriever('test'),
    linkReplacer: new RegexLinkReplacer(),
    scriptInjector: new ScriptInjector()
  }
}
