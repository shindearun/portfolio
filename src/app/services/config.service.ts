export class ConfigService {
    /* tslint:disable:no-inferrable-types variable-name prefer-const arrow-return-shorthand */
    private _api: string;

    static set(property, value) {
        this['_' + property] = value;
    }

    static get(property) {
        return this['_' + property];
    }
}
