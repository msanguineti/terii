import { Store, StoreStatus } from '../src/terii'

// Create shared state objects. One that is initial, and one that is an updated version of the initial state
const initialState = {
  topLevel: 'Hi, I am at the top',
  nested: {
    secondLevel: 'Hello, I am nested at the second level',
  },
}

const updatedState = {
  topLevel: 'Hi, I am at the top, m8',
  nested: {
    secondLevel: 'Hello, I am nested at the 2nd level',
  },
}

// Create a shared store instance that all tests can use
const storeInstance = new Store({
  initialState,
  actions: {
    runUpdate(context, payload) {
      return (context as Store).commit('updateState', payload)
    },
  },
  mutations: {
    updateState(state, payload) {
      Object.assign(state, payload)
      return state
    },
  },
})

const emptyStore = new Store({})

describe('src/terii.js', () => {
  it('Subscribe returns true if valid function passed in', () => {
    expect(
      storeInstance.subscribe('key', () => {
        //.
      })
    ).toBeTruthy()
  })

  it('Subscribe returns false if trying to subscribe with same key', () => {
    expect(
      storeInstance.subscribe('key', () => {
        //.
      })
    ).toBeFalsy()
  })

  it('Subscribe returns false if non-valid function passed in', () => {
    expect(
      storeInstance.subscribe(
        'non-valid',
        (null as unknown) as () => {
          //.
        }
      )
    ).toBeFalsy()
  })

  it('Dispatch returns true if action was found', () => {
    expect(storeInstance.dispatch('runUpdate', updatedState)).toBeTruthy()
  })

  it("Dispatch returns false if action wasn't found", () => {
    expect(
      storeInstance.dispatch('nonExistentAction', { state: 'uh, oh' })
    ).toBeFalsy()
  })

  it('Commit returns true if mutation was found', () => {
    expect(storeInstance.commit('updateState', updatedState)).toBeTruthy()
  })

  it("Commit returns false if mutation wasn't found", () => {
    expect(
      storeInstance.commit('nonExistentMutation', updatedState)
    ).toBeFalsy()
  })

  it('Mutation overrides state', () => {
    storeInstance.commit('updateState', updatedState)

    expect(storeInstance.state).toStrictEqual(updatedState)
  })

  it("Returns the store's state", () => {
    const status: StoreStatus = emptyStore.status

    expect(status).toMatch('RESTING')
  })

  it('Dispatch returns false when there are no actions', () => {
    expect(emptyStore.dispatch('nothing', {})).toBeFalsy()
  })

  it('Commit returns false when there are no mutations', () => {
    expect(emptyStore.commit('nothing', {})).toBeFalsy()
  })

  it('Unsubscribe returns false if trying to unsubscribe non-existing key', () => {
    expect(storeInstance.unsubscribe('no-key')).toBeFalsy()
  })

  it('Unsubscribe returns true if trying to unsubscribe existing key', () => {
    expect(storeInstance.unsubscribe('key')).toBeTruthy()
  })
})
