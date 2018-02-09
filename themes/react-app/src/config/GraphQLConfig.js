'use strict';

// GraphQLConfig: simple class to get the grapghql endpoint
// ===============================================================
class GraphQLConfig {

  constructor(url) {
    this.name = 'Graphql Url';
    this.url = url;
  }

  // Simple class instance methods using short-hand method
  // declaration
  getGraphqlEndPoint() {
    let endpoint = this.url;
    if(endpoint.length === 0)
    {
      let getUrl = window.location;
      endpoint = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
      return endpoint + 'graphql';
    }
    return endpoint + '/graphql';
  }

}

export default (GraphQLConfig);