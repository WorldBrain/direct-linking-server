import { RetrievedDocument } from './document-retriever';

export interface LinkReplacer {
  getContentWithReplacedLinks({document} : {document : RetrievedDocument}) : Promise<string>
}

export class RegexLinkReplacer implements LinkReplacer {
  async getContentWithReplacedLinks({document} : {document : RetrievedDocument}) {
    return document.content
  }
}
