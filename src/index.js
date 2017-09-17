import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { ApolloLink, SetContextLink } from 'apollo-link';
import LoggingLink from 'apollo-link-logging';
import InMemoryCache from 'apollo-cache-inmemory';
import App from './App';

class TestLink extends ApolloLink {
  request(operation, forward) {
    forward(operation);
  }
}

const cache = new InMemoryCache({});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([new SetContextLink(), new LoggingLink()]),
});

console.log('client', client);

ReactDOM.render(
  <ApolloProvider client={client}><App /></ApolloProvider>,
  document.getElementById('root'),
);
