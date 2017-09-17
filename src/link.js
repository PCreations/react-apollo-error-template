import { ApolloLink, Observable } from 'apollo-link-core';

export class PromiseWorkerLink extends ApolloLink {
  request(operation, forward) {
    return forward(operation);
  }
}

export const createWorkerInterface = ({ worker }) => {
  class WorkerInterface {
    url;
    protocol;
    readyState;
    constructor(url, protocol) {
      this.url = url;
      this.protocol = protocol;
      this.readyState = WorkerInterface.OPEN; // webworker is always opened
    }
    close() {
      console.log('closing noop');
    }
    send(serializedMessage) {
      console.log('sending', serializedMessage);
      worker.postMessage(serializedMessage);
    }
    set onopen(fn) {
      console.info('onopen noop');
    }
    set onclose(fn) {
      console.log('onclose noop');
    }
    set onerror(fn) {
      worker.onerror = fn;
    }
    set onmessage(fn) {
      worker.onmessage = ({ data }) => {
        const d = JSON.parse(data);
        if (d.type === 'data') {
          fn({ data });
        }
      };
    }
  }

  WorkerInterface.CLOSED = 'CLOSED';
  WorkerInterface.OPEN = 'OPEN';
  WorkerInterface.CONNECTING = 'CONNECTING';
  
  return WorkerInterface;
}

export class SubscriptionWorkerLink extends ApolloLink {
  request(operation, forward) {
    return forward(operation);
  }
}

// TODO: quick hack
export const isSubscription = operation => operation.query.definitions[0].operation === 'subscription';

export default ({ worker, promiseWorker }) => ApolloLink.split(
  isSubscription,
  new SubscriptionWorkerLink({ worker }),
  new PromiseWorkerLink({ promiseWorker })
);