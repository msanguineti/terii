/**
 * Store status
 */
export type StoreStatus = 'RESTING' | 'ACTION' | 'MUTATION'

/**
 * Tiny library to help you manage state across your application.
 *
 * @export
 * @class Store
 */
export class Store {
  private _actions: Record<string, (...args: unknown[]) => unknown>
  // public get actions(): Record<string, (...args: unknown[]) => unknown> {
  //   return { ...this._actions }
  // }
  private _mutations: Record<string, (...args: unknown[]) => unknown>
  // public get mutations(): Record<string, (...args: unknown[]) => unknown> {
  //   return { ...this._mutations }
  // }
  private _state: Record<string, unknown>

  /**
   * Get a shallow copy of this Store's state.
   *
   * @readonly
   * @type {Record<string, unknown>}
   * @memberof Store
   */
  public get state(): Record<string, unknown> {
    return { ...this._state }
  }

  private _status: StoreStatus
  /**
   * The status of this store.
   *
   * @readonly
   * @type 'RESTING' | 'ACTION' | 'MUTATION'
   * @memberof Store
   */
  public get status(): StoreStatus {
    return this._status
  }
  private _callbacks: ((args: unknown[]) => unknown)[]
  // public get callbacks(): ((args: unknown[]) => unknown)[] {
  //   return [...this._callbacks]
  // }

  /**
   * Creates an instance of Store.
   * @param {{
   *     actions?: Record<string, (...args: unknown[]) => unknown>
   *     mutations?: Record<string, (...args: unknown[]) => unknown>
   *     initialState?: Record<string, unknown>
   *   }} {
   *     actions,
   *     mutations,
   *     initialState,
   *   }
   * @memberof Store
   */
  constructor({
    actions,
    mutations,
    initialState,
  }: {
    actions?: Record<string, (...args: unknown[]) => unknown>
    mutations?: Record<string, (...args: unknown[]) => unknown>
    initialState?: Record<string, unknown>
  }) {
    this._actions = actions ?? {}
    this._mutations = mutations ?? {}

    // A status enum to set during actions and mutations
    this._status = 'RESTING'

    // We store callbacks for when the state changes in here
    this._callbacks = []

    // Set our state to be a Proxy. We are setting the default state by
    // checking the params and defaulting to an empty object if no default
    // state is passed in
    this._state = new Proxy(initialState || {}, {
      set: (state: Record<string, unknown>, key: string, value: unknown) => {
        state[key] = value
        this.processCallbacks(state)
        this._status = 'RESTING'
        return true
      },
    })
  }

  /**
   * A dispatcher for actions that looks in the actions
   * collection and runs the action if it can find it
   *
   * @param {string} actionKey
   * @param {unknown} payload
   * @returns {boolean}
   * @memberof Store
   */
  dispatch(actionKey: string, payload: unknown): boolean {
    // Run a quick check to see if the action actually exists
    // before we try to run it
    if (typeof this._actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey}" doesn't exist.`)
      return false
    }

    // Let anything that's watching the status know that we're dispatching an action
    this._status = 'ACTION'

    // Actually call the action and pass it the Store context and whatever payload was passed
    return this._actions[actionKey](this, payload) as boolean
  }

  /**
   * Look for a mutation and modify the state object
   * if that mutation exists by calling it
   *
   * @param {string} mutationKey
   * @param {unknown} payload
   * @returns {boolean}
   * @memberof Store
   */
  commit(mutationKey: string, payload: unknown): boolean {
    // Run a quick check to see if this mutation actually exists
    // before trying to run it
    if (typeof this._mutations[mutationKey] !== 'function') {
      console.error(`Mutation "${mutationKey}" doesn't exist`)
      return false
    }

    // Let anything that's watching the status know that we're mutating state
    this._status = 'MUTATION'

    // Get a new version of the state by running the mutation and storing the result of it
    const newState = this._mutations[mutationKey](this._state, payload)

    // Update the old state with the new state returned from our mutation
    this._state = Object.assign(this._state, newState)

    return true
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   *
   * @param {function} callback
   * @returns {boolean}
   */
  subscribe(callback: (args: unknown[]) => unknown): boolean {
    if (typeof callback !== 'function') {
      console.error(
        'You can only subscribe to Store changes with a valid function'
      )
      return false
    }

    // A valid function, so it belongs in our collection
    this._callbacks.push(callback)

    return true
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   *
   * @param {object} data
   * @returns {boolean}
   */
  private processCallbacks(...data: unknown[]): boolean {
    if (!this._callbacks.length) {
      return false
    }

    // We've got callbacks, so loop each one and fire it off
    this._callbacks.forEach((callback) => callback(data))

    return true
  }
}
