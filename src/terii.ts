/**
 * Store status.
 *
 * @export
 * @type StoreStatus
 */
export type StoreStatus = 'RESTING' | 'ACTION' | 'MUTATION'

/**
 * Tiny library to help you manage state across your application.
 *
 * @export
 * @class Store
 */
export class Store {
  private _actions: Record<string, (store: Store, payload: unknown) => unknown>
  private _mutations: Record<
    string,
    (
      state: Record<string, unknown>,
      payload: unknown
    ) => Record<string, unknown>
  >
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

  private _callbacks: Record<
    string,
    (state: Record<string, unknown>) => unknown
  >

  /**
   * Creates an instance of Store.
   * @param {{
   *     actions?: Record<string, (store:Store, payload:unknown) => unknown>
   *     mutations?: Record<string, (state:Record<string,unknown>, payload:unknown) => Record<string,unknown>>
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
    actions?: Record<string, (store: Store, payload: unknown) => unknown>
    mutations?: Record<
      string,
      (
        state: Record<string, unknown>,
        payload: unknown
      ) => Record<string, unknown>
    >
    initialState?: Record<string, unknown>
  }) {
    this._actions = actions ?? {}
    this._mutations = mutations ?? {}

    // A status enum to set during actions and mutations
    this._status = 'RESTING'

    // We store callbacks for when the state changes in here
    this._callbacks = {}

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
    this._state = { ...this._state, ...newState }

    return true
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   *
   * @param {string} callbackKey a user's defined identifier for the callback.
   * @param {(state: Record<string, unknown>) => unknown} callback the user's defined action to perform
   * @returns {boolean} `true` if subscription has succeeded `false` otherwise
   * @memberof Store
   */
  subscribe(
    callbackKey: string,
    callback: (state: Record<string, unknown>) => unknown
  ): boolean {
    if (typeof callback !== 'function') {
      console.error(
        'You can only subscribe to Store changes with a valid function'
      )
      return false
    }

    if (this._callbacks[callbackKey] !== undefined) {
      console.error(`There's already a callback registered for: ${callbackKey}`)
      return false
    }

    // A valid function, so it belongs in our collection
    this._callbacks[callbackKey] = callback

    return true
  }

  /**
   * Unsubscribe from state changes.
   *
   * @param {string} callbackKey a user's defined identifier for a registered callback
   * @returns {boolean} `true` if unsubscription succeeded `false` otherwise
   * @memberof Store
   */
  unsubscribe(callbackKey: string): boolean {
    if (this._callbacks[callbackKey] === undefined) {
      console.error(`There's no callback registered for: ${callbackKey}`)
      return false
    }

    delete this._callbacks[callbackKey]

    return true
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   *
   * @private
   * @param {Record<string, unknown>} state
   * @memberof Store
   */
  private processCallbacks(state: Record<string, unknown>): void {
    for (const key in this._callbacks) {
      if (Object.prototype.hasOwnProperty.call(this._callbacks, key)) {
        this._callbacks[key](state)
      }
    }
  }
}
