import { Annotation } from '../../annotations';
import { AnnotationStore } from '../../components/annotation-store'
import { AnnotationValidator } from '../../components/annotation-validator'
import { AnnotationLinkBuilder } from '../../components/annotation-link-builder'
import { DocumentRetriever } from '../../components/document-retriever'
import { LinkReplacer } from '../../components/link-replacer'
import { ScriptInjector } from '../../components/script-injector'
import { compareUrlsQuickAndDirty } from '../../utils/urls'
import { ExpressReqRes } from '../'

export function retrieveAnnotation(
  {annotationStore, documentRetriever, linkReplacer, scriptInjector} :
  {annotationStore : AnnotationStore, documentRetriever : DocumentRetriever,
   linkReplacer : LinkReplacer, scriptInjector : ScriptInjector}
) {
  return async function handleAnnotationGetRequest({req, res} : ExpressReqRes) {
    const id = _extractAnnotationIdFromRequest(req)
    const annotation = await annotationStore.getAnnotationByID(id)

    const urlWithoutProtocolFromRequest = _extractAnnotationIdFromRequest(req)
    const urlFromAnnotation = annotation.url
    const urlGivenAndStoredMatch = compareUrlsQuickAndDirty(urlWithoutProtocolFromRequest, urlFromAnnotation)
    if (!urlGivenAndStoredMatch) {
      // TODO: What do we do here?
    }

    const document = await documentRetriever.retrieveDocument({url: urlFromAnnotation})
    // TODO: Create 'expected error' type, for errors that can easily be displayed to the user
    document.content = await linkReplacer.getContentWithReplacedLinks({document})
    document.content = await scriptInjector.getContentWithInjectedScript({document})
    // TODO: Is it faster and more reliable to do this with the following lib?
    // https://github.com/No9/harmon
    res.send(document.content)
  }
}

// export type ExpressPutAnnotationExtractor = (req : Express.Request) => {annotation : Annotation, valid : boolean}
export function putAnnotation(
  {annotationValidator, annotationStore, annotationLinkBuilder} :
  {annotationValidator : AnnotationValidator, annotationStore : AnnotationStore,
   annotationLinkBuilder : AnnotationLinkBuilder}
) {
  return async function handleAnnotationPutRequest({req, res} : ExpressReqRes) {
    const unvalidatedAnnotation = _extractAnnotationFromPutRequest(req)
    const annotation = await annotationValidator({req})
    if (!annotation) {
      // TODO: What to do here?
    }
    const {id} = await annotationStore.storeAnnotation({annotation})
    const link = await annotationLinkBuilder.buildAnnotationLink({id, url: annotation.url})
    res.json({link})
  }
}

export function _extractAnnotationIdFromRequest(req) : string {
  return req.params.id
}

export function _extractAnnotationUrlFromRequest(req) : string {
  return req.params.url
}

export function _extractAnnotationFromPutRequest(req) : object {
  return req.body.annotation
}
