export interface RetrievedDocument {
  content : string
  mime : string
  url : string
}

export interface DocumentRetriever {
  retrieveDocument({url : string}) : Promise<RetrievedDocument>
}

export class SingleDocumentRetriever implements DocumentRetriever {
  constructor(private content : string, private mime = 'text/html') {

  }

  async retrieveDocument({url} : {url : string}) {
    return {
      url,
      mime: this.mime,
      content: this.content
    }
  }
}
