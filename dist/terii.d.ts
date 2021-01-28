/**
 * Store status
 */
export declare type StoreStatus = 'RESTING' | 'ACTION' | 'MUTATION';
/**
 * Tiny library to help you manage state across your application.
 *
 * @export
 * @class Store
 */
export declare class Store {
    private _actions;
    private _mutations;
    private _state;
    /**
     * Get a shallow copy of this Store's state.
     *
     * @readonly
     * @type {Record<string, unknown>}
     * @memberof Store
     */
    get state(): Record<string, unknown>;
    private _status;
    /**
     * The status of this store.
     *
     * @readonly
     * @type 'RESTING' | 'ACTION' | 'MUTATION'
     * @memberof Store
     */
    get status(): StoreStatus;
    private _callbacks;
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
    constructor({ actions, mutations, initialState, }: {
        actions?: Record<string, (...args: unknown[]) => unknown>;
        mutations?: Record<string, (...args: unknown[]) => unknown>;
        initialState?: Record<string, unknown>;
    });
    /**
     * A dispatcher for actions that looks in the actions
     * collection and runs the action if it can find it
     *
     * @param {string} actionKey
     * @param {unknown} payload
     * @returns {boolean}
     * @memberof Store
     */
    dispatch(actionKey: string, payload: unknown): boolean;
    /**
     * Look for a mutation and modify the state object
     * if that mutation exists by calling it
     *
     * @param {string} mutationKey
     * @param {unknown} payload
     * @returns {boolean}
     * @memberof Store
     */
    commit(mutationKey: string, payload: unknown): boolean;
    /**
     * Allow an outside entity to subscribe to state changes with a valid callback.
     * Returns boolean based on wether or not the callback was added to the collection
     *
     * @param {function} callback
     * @returns {boolean}
     */
    subscribe(callback: (args: unknown[]) => unknown): boolean;
    /**
     * Fire off each callback that's run whenever the state changes
     * We pass in some data as the one and only parameter.
     * Returns a boolean depending if callbacks were found or not
     *
     * @param {object} data
     * @returns {boolean}
     */
    private processCallbacks;
}
