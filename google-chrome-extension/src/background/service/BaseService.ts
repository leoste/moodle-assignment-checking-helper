export default class BaseService {

    #initialized = false
    #initPromise: Promise<void> | null = null

    async init() {
        if (this.#initialized) return
        if (this.#initPromise) return this.#initPromise

        this.#initPromise = (async() => {
            await this.onInit()
            this.#initialized = true
        })()
    }

    async onInit() {}
}